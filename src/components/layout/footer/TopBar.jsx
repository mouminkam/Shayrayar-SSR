// Removed "use client" - This component only uses static JSX which is SSR-compatible
import { MapPin, Mail, Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-theme3 rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 mb-8 md:mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Address */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <h6 className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              address
            </h6>
            <p className="text-white text-base sm:text-lg md:text-xl font-medium break-words">
              4648 Rocky Road Philadelphia
            </p>
          </div>
        </div>

        {/* Send Email */}
        <div className="flex items-center gap-3 sm:gap-4 sm:justify-start lg:justify-end">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <h6 className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              send email
            </h6>
            <p className="text-white text-base sm:text-lg md:text-xl font-medium break-all">
              info@exmple.com
            </p>
          </div>
        </div>

        {/* Call Emergency */}
        <div className="flex items-center gap-3 sm:gap-4 sm:justify-start lg:justify-end sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-theme3" />
          </div>
          <div className="min-w-0 flex-1">
            <h6 className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2 capitalize">
              call emergency
            </h6>
            <p className="text-white text-base sm:text-lg md:text-xl font-medium">
              +88 0123 654 99
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

