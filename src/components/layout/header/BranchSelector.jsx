"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, ChevronDown } from "lucide-react";
import useBranchStore from "../../../store/branchStore";
import useCartStore from "../../../store/cartStore";
import useToastStore from "../../../store/toastStore";

const BranchSelector = ({ isMobile = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    selectedBranch, 
    branches, 
    isLoading, 
    fetchBranches, 
    setSelectedBranch,
    initialize 
  } = useBranchStore();
  const { clearCart } = useCartStore();
  const { success: toastSuccess } = useToastStore();
  
  const [isOpen, setIsOpen] = useState(false);

  // Initialize branches on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch branches if empty
  useEffect(() => {
    if (branches.length === 0 && !isLoading) {
      fetchBranches();
    }
  }, [branches.length, isLoading, fetchBranches]);

  const handleBranchChange = async (branchId) => {
    const branch = branches.find(b => (b.id || b.branch_id) === branchId);
    if (!branch) return;

    const currentBranchId = selectedBranch?.id || selectedBranch?.branch_id;
    const newBranchId = branch.id || branch.branch_id;

    // If same branch, do nothing
    if (currentBranchId === newBranchId) {
      setIsOpen(false);
      return;
    }

    // Update selected branch
    setSelectedBranch(branch);
    setIsOpen(false);

    // Clear cart (products may differ between branches)
    clearCart();

    // Show notification
    toastSuccess(`Branch changed to ${branch.name || branch.title || 'Selected Branch'}. Cart cleared.`);

    // Reload current page data
    // Exclude auth pages from reload
    const authPages = ['/login', '/register', '/enter-otp', '/reset-password', '/confirm-information', '/add-information'];
    if (!authPages.includes(pathname)) {
      router.refresh();
    }
  };

  const branchName = selectedBranch?.name || selectedBranch?.title || "Select Branch";
  const displayName = branchName.length > 20 ? `${branchName.substring(0, 20)}...` : branchName;

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading || branches.length === 0}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{displayName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-56 bg-bgimg border border-white/20 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-text text-sm">Loading branches...</div>
              ) : branches.length === 0 ? (
                <div className="p-4 text-center text-text text-sm">No branches available</div>
              ) : (
                <ul className="py-2">
                  {branches.map((branch) => {
                    const branchId = branch.id || branch.branch_id;
                    const isSelected = (selectedBranch?.id || selectedBranch?.branch_id) === branchId;
                    return (
                      <li key={branchId}>
                        <button
                          onClick={() => handleBranchChange(branchId)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            isSelected
                              ? 'bg-theme3/20 text-theme3 font-medium'
                              : 'text-text hover:bg-white/10'
                          }`}
                        >
                          {branch.name || branch.title || `Branch ${branchId}`}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || branches.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MapPin className="w-4 h-4" />
        <span>{displayName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-bgimg border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-text text-sm">Loading branches...</div>
            ) : branches.length === 0 ? (
              <div className="p-4 text-center text-text text-sm">No branches available</div>
            ) : (
              <ul className="py-2">
                {branches.map((branch) => {
                  const branchId = branch.id || branch.branch_id;
                  const isSelected = (selectedBranch?.id || selectedBranch?.branch_id) === branchId;
                  return (
                    <li key={branchId}>
                      <button
                        onClick={() => handleBranchChange(branchId)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isSelected
                            ? 'bg-theme3/20 text-theme3 font-medium'
                            : 'text-text hover:bg-white/10'
                        }`}
                      >
                        {branch.name || branch.title || `Branch ${branchId}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchSelector;

