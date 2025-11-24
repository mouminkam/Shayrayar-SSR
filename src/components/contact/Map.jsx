"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "../../api";
import useBranchStore from "../../store/branchStore";

export default function Map() {
  const { selectedBranch, initialize } = useBranchStore();
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28821.965472924858!2d89.07524545!3d25.4467646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fcb92fb4d9696d%3A0x74b18fed6b93e5e5!2sNobabgonj%20National%20garden!5e0!3m2!1sen!2sbd!4v1724820772279!5m2!1sen!2sbd"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Fetch branch location and update map
  useEffect(() => {
    const fetchBranchLocation = async () => {
      if (!selectedBranch) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Try to get detailed branch info
        const response = await api.branches.getBranchById(selectedBranch.id || selectedBranch.branch_id);
        
        if (response && response.success && response.data) {
          const branchData = response.data.branch || response.data;
          
          // Extract latitude and longitude from branch data
          const latitude = branchData.latitude || branchData.lat || null;
          const longitude = branchData.longitude || branchData.lng || branchData.lon || null;
          
          if (latitude && longitude) {
            // Build Google Maps embed URL with branch coordinates
            // Using a simpler embed format that works with coordinates
            const newMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${latitude}%2C${longitude}!5e0!3m2!1sen!2sbd!4v${Date.now()}!5m2!1sen!2sbd`;
            setMapUrl(newMapUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching branch location:", error);
        // Keep default map URL on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranchLocation();
  }, [selectedBranch]);

  return (
    <section className="relative w-full h-[550px]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-bgimg">
          <Loader2 className="w-8 h-8 text-theme3 animate-spin" />
        </div>
      ) : (
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 border-0"
        ></iframe>
      )}
    </section>
  );
}
