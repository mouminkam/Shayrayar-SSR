"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ShippingAddressSection({ formData, handleInputChange }) {
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
          Shipping Address
        </h3>
      </div>

      <div className="mb-4">
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          Street Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="mt-4">
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
    </div>
  );
}

