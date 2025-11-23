"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Check, Loader2 } from "lucide-react";
import useToastStore from "../../../store/toastStore";
import api from "../../../api";

export default function AddressSelector({ selectedAddressId, onSelectAddress, onNewAddress }) {
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await api.customer.getAddresses();
      
      if (response.success && response.data) {
        const addressList = Array.isArray(response.data) 
          ? response.data 
          : response.data.addresses || [];
        setAddresses(addressList);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toastError("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    onSelectAddress(address);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 bg-bgimg rounded-2xl">
        <Loader2 className="w-6 h-6 text-theme3 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-text  text-sm font-medium">
          Saved Addresses
        </label>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewAddress}
          className="flex items-center gap-2 px-4 py-2 bg-theme3/20 text-theme3 rounded-lg text-sm font-semibold hover:bg-theme3/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Address
        </motion.button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <MapPin className="w-8 h-8 text-text mx-auto mb-2 opacity-50" />
          <p className="text-text text-sm">No saved addresses</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {addresses.map((address) => (
            <motion.button
              key={address.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectAddress(address)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedAddressId === address.id
                  ? "border-theme3 bg-theme3/20"
                  : "border-white/20 bg-white/5 hover:border-theme3/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {address.label && (
                    <p className="text-theme3 font-semibold text-sm mb-1">{address.label}</p>
                  )}
                  <p className="text-white text-sm">{address.address}</p>
                  {(address.latitude && address.longitude) && (
                    <p className="text-text text-xs mt-1">
                      📍 {Number(address.latitude).toFixed(4)}, {Number(address.longitude).toFixed(4)}
                    </p>
                  )}
                </div>
                {selectedAddressId === address.id && (
                  <Check className="w-5 h-5 text-theme3 shrink-0" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

