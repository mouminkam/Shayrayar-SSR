"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import AddressSelector from "./AddressSelector";
import OrderTypeSelector from "./OrderTypeSelector";

export default function ShippingAddressSection({ formData, handleInputChange, setFormData }) {
  const { orderType } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowNewAddressForm(false);
    // Populate form with address data
    setFormData((prev) => ({
      ...prev,
      address: address.address || prev.address,
      latitude: address.latitude || prev.latitude,
      longitude: address.longitude || prev.longitude,
      address_id: address.id,
    }));
  };

  const handleNewAddress = () => {
    setSelectedAddress(null);
    setShowNewAddressForm(true);
    setFormData((prev) => ({
      ...prev,
      address_id: null,
    }));
  };

  const isDelivery = orderType === 'delivery';

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
        >
          <MapPin className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black uppercase">
          {isDelivery ? "Delivery Address" : "Pickup Information"}
        </h3>
      </div>

      {/* Order Type Selector */}
      <OrderTypeSelector />

      {/* Address Selector - Only for delivery */}
      {isDelivery && (
        <AddressSelector
          selectedAddressId={selectedAddress?.id}
          onSelectAddress={handleSelectAddress}
          onNewAddress={handleNewAddress}
        />
      )}

      {/* Address Form - Show if delivery and (no address selected or new address) */}
      {isDelivery && (!selectedAddress || showNewAddressForm) && (
        <>
          <div className="mb-4">
            <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
              {isDelivery ? "Delivery Address *" : "Pickup Location"}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required={isDelivery}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
              placeholder={isDelivery ? "123 Main Street" : "Pickup from branch"}
            />
          </div>

          {isDelivery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
                  placeholder="10001"
                />
              </div>
            </div>
          )}

          {isDelivery && (
            <div className="mb-4">
              <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
                placeholder="USA"
              />
            </div>
          )}

          {/* Latitude/Longitude - Hidden inputs for delivery */}
          {isDelivery && (
            <>
              <input
                type="hidden"
                name="latitude"
                value={formData.latitude || ""}
              />
              <input
                type="hidden"
                name="longitude"
                value={formData.longitude || ""}
              />
            </>
          )}
        </>
      )}

      {/* Pickup Message */}
      {!isDelivery && (
        <div className="p-4 bg-theme3/20 border border-theme3/50 rounded-xl">
          <p className="text-white text-sm">
            You will pick up your order from the selected branch.
          </p>
        </div>
      )}

      {/* Scheduled Order - Optional */}
      {/* <div className="mt-4">
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Schedule Order (Optional)
        </label>
        <input
          type="datetime-local"
          name="scheduled_at"
          value={formData.scheduled_at || ""}
          onChange={handleInputChange}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
        />
        <p className="text-text text-xs mt-1">
          Leave empty for immediate order
        </p>
      </div> */}
    </div>
  );
}

