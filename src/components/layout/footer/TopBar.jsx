"use client";
import { useState, useEffect } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { useInView } from "react-intersection-observer";
import api from "../../../api";
import useBranchStore from "../../../store/branchStore";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function TopBar() {
  const { selectedBranch, initialize } = useBranchStore();
  const { lang } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    address: "4648 Rocky Road Philadelphia",
    email: "info@exmple.com",
    phone: "+88 0123 654 99",
  });
  
  // Intersection Observer - defer API call until footer is visible
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Only trigger once when it becomes visible
  });

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Fetch branch contact information - only when footer is visible
  useEffect(() => {
    if (!inView) {
      return; // Don't fetch until footer is visible
    }

    const fetchContactInfo = async () => {
      if (!selectedBranch) {
        return;
      }

      try {
        const response = await api.branches.getBranchById(selectedBranch.id || selectedBranch.branch_id);

        if (response && response.success && response.data) {
          const branchData = response.data.branch || response.data;

          // Default values
          const defaultInfo = {
            address: "4648 Rocky Road Philadelphia",
            email: "info@exmple.com",
            phone: "+88 0123 654 99",
          };

          setContactInfo({
            address: branchData.address || branchData.location || defaultInfo.address,
            email: branchData.email || branchData.contact_email || defaultInfo.email,
            phone: branchData.phone || branchData.contact_phone || branchData.telephone || defaultInfo.phone,
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        // Keep default values on error
      }
    };

    fetchContactInfo();
  }, [inView, selectedBranch]);
  return (
    <div ref={ref} className="bg-theme3 rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 mb-8 md:mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Address */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-900 text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              {t(lang, "address")}
            </p>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl font-medium break-words">
              {contactInfo.address}
            </p>
          </div>
        </div>

        {/* Send Email */}
        <div className="flex items-center gap-3 sm:gap-4 sm:justify-start lg:justify-end">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-900 text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              {t(lang, "send_email")}
            </p>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl font-medium break-all">
              {contactInfo.email}
            </p>
          </div>
        </div>

        {/* Call Emergency */}
        <div className="flex items-center gap-3 sm:gap-4 sm:justify-start lg:justify-end sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-900 text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              {t(lang, "call_emergency")}
            </p>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl font-medium">
              +88 0123 654 99
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

