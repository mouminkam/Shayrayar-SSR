"use client";
import { useEffect, useRef } from "react";

export default function MobileFilterDrawer({ children, onClose }) {
  const drawerRef = useRef(null);

  // Prevent scroll on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close drawer when click outside the drawer content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        typeof onClose === "function"
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [onClose]);

  return (
    <div>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30 bg-black/40 transition-opacity"
        aria-label="Close filter drawer"
      ></div>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed max-h-[100dh] z-40 inset-y-0 left-0 right-0 w-full max-w-full sm:max-w-xs bg-white rounded-r-none sm:rounded-r-xl shadow-lg transition-all p-6 overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}






