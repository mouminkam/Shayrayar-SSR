"use client";
import { useState, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useAuthStore from "../../../store/authStore";
import useCartStore from "../../../store/cartStore";
import useToastStore from "../../../store/toastStore";
import BillingInfoSection from "./BillingInfoSection";
import ShippingAddressSection from "./ShippingAddressSection";
import PaymentMethodSection from "./PaymentMethodSection";
import PlaceOrderButton from "./PlaceOrderButton";

const BillingForm = memo(() => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, clearCart, getSubtotal, getTax } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardExpiry: formatted,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toastError("Please enter your full name");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toastError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone) {
      toastError("Please enter your phone number");
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toastError("Please complete your shipping address");
      return false;
    }
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16) {
        toastError("Please enter a valid card number");
        return false;
      }
      if (!formData.cardName) {
        toastError("Please enter the cardholder name");
        return false;
      }
      if (!formData.cardExpiry || formData.cardExpiry.length < 5) {
        toastError("Please enter a valid expiry date");
        return false;
      }
      if (!formData.cardCVC || formData.cardCVC.length < 3) {
        toastError("Please enter a valid CVC");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        shipping: getSubtotal() > 100 ? 0 : 10,
        total: getSubtotal() + getTax() + (getSubtotal() > 100 ? 0 : 10),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        status: "processing",
      };

      if (isAuthenticated) {
        const { addOrder } = useAuthStore.getState();
        addOrder(order);
      }

      clearCart();
      toastSuccess("Order placed successfully! 🎉");

      setTimeout(() => {
        if (isAuthenticated) {
          router.push("/profile");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error) {
      toastError("Failed to place order. Please try again.");
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
      <BillingInfoSection formData={formData} handleInputChange={handleInputChange} />
      <ShippingAddressSection formData={formData} handleInputChange={handleInputChange} />
      <PaymentMethodSection
        formData={formData}
        handleInputChange={handleInputChange}
        handleCardNumberChange={handleCardNumberChange}
        handleExpiryChange={handleExpiryChange}
        setFormData={setFormData}
      />
      <PlaceOrderButton isProcessing={isProcessing} onClick={handlePlaceOrder} />
    </motion.form>
  );
});

BillingForm.displayName = "BillingForm";

export default BillingForm;
