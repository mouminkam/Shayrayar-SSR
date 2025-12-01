"use client";
import { useState, memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCheckoutSchema } from "../../../lib/validations/checkoutSchemas";
import useAuthStore from "../../../store/authStore";
import useCartStore from "../../../store/cartStore";
import useToastStore from "../../../store/toastStore";
import useBranchStore from "../../../store/branchStore";
import api from "../../../api";
import ShippingAddressSection from "./ShippingAddressSection";
import PaymentMethodSection from "./PaymentMethodSection";
import CouponSection from "./CouponSection";
import PlaceOrderButton from "./PlaceOrderButton";
import { createStripePaymentIntent } from "../../../lib/utils/paymentProcessor";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

const BillingForm = memo(() => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { lang } = useLanguage();
  const {
    items,
    clearCart,
    getSubtotal,
    getTax,
    getDiscount,
    getDeliveryCharge,
    getTotal,
    orderType,
  } = useCartStore();
  const { getSelectedBranchId } = useBranchStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [isProcessing, setIsProcessing] = useState(false);

  // Create schema based on order type
  const checkoutSchema = useMemo(() => createCheckoutSchema(orderType), [orderType]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      latitude: null,
      longitude: null,
      quote_id: null,
      paymentMethod: "cash",
      scheduled_at: "",
      notes: "",
    },
  });

  const formData = watch();

  // Validate user data exists (from authStore)
  const validateUser = () => {
    if (!user) {
      toastError(t(lang, "please_login_place_order"));
      return false;
    }
    if (!user.name) {
      toastError(t(lang, "user_name_missing"));
      return false;
    }
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      toastError(t(lang, "user_email_invalid"));
      return false;
    }
    if (!user.phone) {
      toastError(t(lang, "user_phone_missing"));
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateUser()) {
      return;
    }

    if (!isAuthenticated) {
      toastError(t(lang, "please_login_place_order"));
      router.push("/login");
      return;
    }

    const branchId = getSelectedBranchId();
    if (!branchId) {
      toastError(t(lang, "please_select_branch"));
      return;
    }

    setIsProcessing(true);

    try {
      // Validate cart items: Check if any item needs size but doesn't have one
      // This validation prevents backend errors for products that require size selection
      const itemsNeedingSize = items.filter((item) => {
        // If item has size_id, it's valid
        if (item.size_id) return false;
        
        // If item doesn't have size_id, we need to check if the product requires size
        // Since we don't have has_sizes in cart items, we'll validate by checking
        // if the item was added with a size_name (which indicates it should have size_id)
        // OR if the item has sizes array (from original product data)
        // For now, we'll check if size_name exists but size_id is null (inconsistent state)
        if (item.size_name && !item.size_id) {
          return true; // Inconsistent: has size_name but no size_id
        }
        
        // If item has sizes array, it means the product has sizes and one should be selected
        if (item.sizes && Array.isArray(item.sizes) && item.sizes.length > 0 && !item.size_id) {
          return true; // Product has sizes but none selected
        }
        
        return false;
      });

      if (itemsNeedingSize.length > 0) {
        const itemNames = itemsNeedingSize.map(item => item.title || item.name).join(", ");
        toastError(`${t(lang, "please_select_size_for")} ${itemNames}`);
        setIsProcessing(false);
        return;
      }

      // Calculate totals
      const subtotal = getSubtotal();
      const discount = getDiscount();
      const deliveryCharge = getDeliveryCharge();
      const taxAmount = getTax();
      const totalAmount = getTotal();

      // Prepare order items with size_id and ingredients
      const orderItems = items.map((item) => ({
        menu_item_id: item.id,
        size_id: item.size_id || null,
        quantity: item.quantity,
        ingredients: item.ingredients || [],
        special_instructions: item.special_instructions || "",
      }));

      // Build delivery address string
      const deliveryAddress =
        orderType === "delivery"
          ? `${data.address}, ${data.city}, ${data.state} ${data.zipCode}, ${data.country}`
          : `Pickup from Main Branch - Branch Location`;

      // Prepare order data for API (matching API structure)
      // Customer info comes from user object in authStore (saved at login)
      const orderData = {
        branch_id: branchId,
        order_type: orderType, // 'pickup' or 'delivery'
        items: orderItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        delivery_charge: parseFloat(deliveryCharge.toFixed(2)),
        tax_amount: parseFloat(taxAmount.toFixed(2)),
        discount_amount: parseFloat(discount.toFixed(2)),
        total_amount: parseFloat(totalAmount.toFixed(2)),
        // Customer info from user object (saved in authStore at login)
        customer_name: user.name || "",
        customer_phone: user.phone || "",
        customer_email: user.email || "",
        payment_method: data.paymentMethod, // 'cash' or 'stripe'
        delivery_address: deliveryAddress,
        latitude: data.latitude || (orderType === "delivery" ? 0.0 : null),
        longitude: data.longitude || (orderType === "delivery" ? 0.0 : null),
        notes: data.notes || "",
      };

      // Add quote_id if delivery order
      if (orderType === "delivery" && data.quote_id) {
        orderData.quote_id = data.quote_id;
      }

      // Add scheduled_at if provided
      if (data.scheduled_at) {
        // Convert datetime-local to API format (YYYY-MM-DD HH:mm:ss)
        const scheduledDate = new Date(data.scheduled_at);
        orderData.scheduled_at = scheduledDate.toISOString().slice(0, 19).replace("T", " ");
      }

      // Step 1: Create order first
      const orderResponse = await api.orders.createOrder(orderData);

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const createdOrder = orderResponse.data.order || orderResponse.data;
      const orderId = createdOrder.id;

      // Step 2: Handle payment based on payment method
      if (data.paymentMethod === "stripe") {
        // Create payment intent
        const intentResult = await createStripePaymentIntent(orderId, totalAmount);

        if (!intentResult.success) {
          // Payment intent creation failed
          toastError(intentResult.error || "Failed to initialize payment. Please try again.");
          setIsProcessing(false);
          return;
        }

        // Redirect to payment page in same window
        // Note: publishable_key will be loaded from NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env variable
        let paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(intentResult.client_secret)}`;
        // Add quote_id to URL if available (for delivery orders)
        if (orderType === "delivery" && data.quote_id) {
          paymentUrl += `&quote_id=${encodeURIComponent(data.quote_id)}`;
        }
        router.push(paymentUrl);
        // Don't set isProcessing to false - page will change
        // Don't clear cart yet - wait for successful payment confirmation
        // Cart will be cleared in success page after payment confirmation
        return;
      } else {
        // Cash payment - existing flow
        clearCart();
        toastSuccess(t(lang, "order_placed_successfully"));

        // Redirect to order success page
        setTimeout(() => {
          router.push(`/orders/${orderId}/success`);
        }, 1500);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t(lang, "failed_to_place_order");
      toastError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="checkout-form bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
    >
      <ShippingAddressSection
        formData={formData}
        handleInputChange={(e) => {
          const { name, value } = e.target;
          setValue(name, value);
        }}
        setFormData={(updater) => {
          if (typeof updater === "function") {
            const newData = updater(formData);
            Object.keys(newData).forEach((key) => {
              setValue(key, newData[key]);
            });
          } else {
            Object.keys(updater).forEach((key) => {
              setValue(key, updater[key]);
            });
          }
        }}
      />
      <CouponSection />
      <PaymentMethodSection
        formData={formData}
        setFormData={(updater) => {
          if (typeof updater === "function") {
            const newData = updater(formData);
            Object.keys(newData).forEach((key) => {
              setValue(key, newData[key]);
            });
          } else {
            Object.keys(updater).forEach((key) => {
              setValue(key, updater[key]);
            });
          }
        }}
      />
      
      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-text  text-sm font-medium mb-2">
          {t(lang, "order_notes_optional")}
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.notes ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300 resize-none`}
          placeholder={t(lang, "special_instructions_placeholder")}
        />
        {errors.notes && (
          <p className="mt-1 text-red-400 text-sm">{errors.notes.message}</p>
        )}
      </div>

      {errors.address && orderType === "delivery" && (
        <p className="mb-4 text-red-400 text-sm">{errors.address.message}</p>
      )}

      <PlaceOrderButton isProcessing={isProcessing} onClick={handleSubmit(onSubmit)} />
    </motion.form>
  );
});

BillingForm.displayName = "BillingForm";

export default BillingForm;
