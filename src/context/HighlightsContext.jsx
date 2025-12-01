"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { transformMenuItemsToProducts } from "../lib/utils/productTransform";
import { useApiCache } from "../hooks/useApiCache";

export const HighlightsContext = createContext(null);

export function HighlightsProvider({ children }) {
  const { selectedBranch, getSelectedBranchId } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("HIGHLIGHTS");
  const [popular, setPopular] = useState([]);
  const [latest, setLatest] = useState([]);
  const [chefSpecial, setChefSpecial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      const branchId = getSelectedBranchId();
      if (!branchId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getCachedOrFetch(
          "/menu-items/highlights",
          {},
          () => api.menu.getHighlights()
        );
        
        if (!response?.success || !response.data) {
          setPopular([]);
          setLatest([]);
          setChefSpecial([]);
          return;
        }

        // Transform each section separately
        const popularItems = transformMenuItemsToProducts(response.data.popular || []);
        const latestItems = transformMenuItemsToProducts(response.data.latest || []);
        const chefSpecialItems = transformMenuItemsToProducts(response.data.chef_special || []);

        setPopular(popularItems);
        setLatest(latestItems);
        setChefSpecial(chefSpecialItems);
      } catch (err) {
        console.error("Error fetching highlights:", err);
        setError(err.message || "Failed to fetch highlights");
        setPopular([]);
        setLatest([]);
        setChefSpecial([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, [selectedBranch, getSelectedBranchId, getCachedOrFetch]);

  const value = {
    popular,
    latest,
    chefSpecial,
    isLoading,
    error,
  };

  return (
    <HighlightsContext.Provider value={value}>
      {children}
    </HighlightsContext.Provider>
  );
}

export function useHighlights() {
  const context = useContext(HighlightsContext);
  if (!context) {
    throw new Error("useHighlights must be used within HighlightsProvider");
  }
  return context;
}

