// Removed "use client" - This component only uses static JSX, Link, and an uncontrolled form without state management, which are SSR-compatible
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="mt-6 sm:mt-8 md:mt-0 lg:pl-6 xl:pl-12 sm:col-span-2 lg:col-span-1">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-white text-xl sm:text-2xl font-bold inline-block relative pb-4 sm:pb-5">
          Contact Us
          {/* Orange Line */}
          <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-theme3"></span>
          {/* White Line */}
          <span className="absolute bottom-0 left-10 w-12 sm:w-14 h-0.5 bg-white"></span>
        </h3>
      </div>

      {/* Working Hours */}
      <ul className="mb-6 sm:mb-8 space-y-2">
        <li className="mb-2">
          <span className="text-white text-sm sm:text-base">
            Monday – Friday:{" "}
            <span className="text-theme3 font-semibold">8am – 4pm</span>
          </span>
        </li>
        <li>
          <span className="text-white text-sm sm:text-base">
            Saturday:{" "}
            <span className="text-theme3 font-semibold">8am – 12am</span>
          </span>
        </li>
      </ul>

      {/* Email Subscription */}
      <form className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg overflow-hidden px-3 sm:px-4 py-2 w-full sm:min-w-[260px] max-w-md lg:max-w-none">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 border-none outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base min-w-0"
          />
          <button
            type="submit"
            className="bg-theme3 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-theme transition-colors shrink-0"
            aria-label="Subscribe"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="mt-3 sm:mt-4 flex items-start gap-2 sm:gap-3">
          <input
            type="checkbox"
            id="privacy-checkbox"
            className="mt-1 w-4 h-4 rounded border-gray-400 text-theme3 focus:ring-theme3 cursor-pointer shrink-0"
          />
          <label
            htmlFor="privacy-checkbox"
            className="text-white text-xs sm:text-sm leading-6 sm:leading-7 cursor-pointer"
          >
            I agree to the terms and conditions.
          </label>
        </div>
      </form>
    </div>
  );
}

