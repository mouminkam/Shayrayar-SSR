"use client";
import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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

const BillingForm = memo(() => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
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

  const [formData, setFormData] = useState({
    // Shipping address fields (only for delivery)
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "",
    latitude: null,
    longitude: null,
    address_id: null,
    // Payment and order fields
    paymentMethod: "cash", // Default to cash
    scheduled_at: "",
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Update shipping address from user when user changes
  useEffect(() => {
    if (user?.address) {
      setFormData((prev) => ({
        ...prev,
        address: user.address?.street || prev.address,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        zipCode: user.address?.zipCode || prev.zipCode,
        country: user.address?.country || prev.country,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateForm = () => {
    // Validate user data exists (from authStore)
    if (!user) {
      toastError("Please login to place an order");
      return false;
    }
    if (!user.name) {
      toastError("User name is missing. Please update your profile.");
      return false;
    }
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      toastError("User email is invalid. Please update your profile.");
      return false;
    }
    if (!user.phone) {
      toastError("User phone is missing. Please update your profile.");
      return false;
    }

    // Validate address based on order type
    if (orderType === "delivery") {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toastError("Please complete your delivery address");
        return false;
      }
    }

    // Validate payment method
    if (formData.paymentMethod !== "stripe" && formData.paymentMethod !== "cash") {
      toastError("Please select a valid payment method");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      toastError("Please login to place an order");
      router.push("/login");
      return;
    }

    const branchId = getSelectedBranchId();
    if (!branchId) {
      toastError("Please select a branch");
      return;
    }

    setIsProcessing(true);

    try {
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
          ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`
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
        payment_method: formData.paymentMethod, // 'cash' or 'stripe'
        delivery_address: deliveryAddress,
        latitude: formData.latitude || (orderType === "delivery" ? 0.0 : null),
        longitude: formData.longitude || (orderType === "delivery" ? 0.0 : null),
        notes: formData.notes || "",
      };

      // Add address_id if available
      if (formData.address_id) {
        orderData.address_id = formData.address_id;
      }

      // Add scheduled_at if provided
      if (formData.scheduled_at) {
        // Convert datetime-local to API format (YYYY-MM-DD HH:mm:ss)
        const scheduledDate = new Date(formData.scheduled_at);
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
      if (formData.paymentMethod === "stripe") {
        // Create payment intent
        const intentResult = await createStripePaymentIntent(orderId, totalAmount);

        if (!intentResult.success) {
          // Payment intent creation failed
          toastError(intentResult.error || "Failed to initialize payment. Please try again.");
          setIsProcessing(false);
          return;
        }

        // Redirect to payment page in same window
        const paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(intentResult.client_secret)}`;
        router.push(paymentUrl);
        // Don't set isProcessing to false - page will change
        // Don't clear cart yet - wait for successful payment confirmation
        // Cart will be cleared in success page after payment confirmation
        return;
      } else {
        // Cash payment - existing flow
        clearCart();
        toastSuccess("Order placed successfully! 🎉");

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
        "Failed to place order. Please try again.";
      toastError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handlePlaceOrder}
      className="checkout-form bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
    >
      <ShippingAddressSection
        formData={formData}
        handleInputChange={handleInputChange}
        setFormData={setFormData}
      />
      <CouponSection />
      <PaymentMethodSection
        formData={formData}
        setFormData={setFormData}
      />
      
      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300 resize-none"
          placeholder="Any special instructions for your order..."
        />
      </div>

      <PlaceOrderButton isProcessing={isProcessing} onClick={handlePlaceOrder} />
    </motion.form>
  );
});

BillingForm.displayName = "BillingForm";

export default BillingForm;
