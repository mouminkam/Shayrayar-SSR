// Removed "use client" - This component only uses static JSX and Link components which are SSR-compatible
import Link from "next/link";

export default function BottomBar() {
  return (
    <div className="relative z-10 bg-theme py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-white text-xs sm:text-sm md:text-base text-center sm:text-left">
            © All Copyright 2024 by
          </p>
          <ul className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-end ">
            <li className="border border-white/50 px-2 sm:px-3 py-1 rounded-md">
              <Link
                href="/terms"
                className="text-white  transition-colors text-xs sm:text-sm"
              >
                Terms & Condition
              </Link>
            </li>
            <li className="border border-white/50 px-2 sm:px-3 py-1 rounded-md">
              <Link
                href="/privacy-policy"
                className="text-white  transition-colors text-xs sm:text-sm"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

