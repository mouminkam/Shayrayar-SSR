// Removed "use client" - This component only uses static JSX and Link components which are SSR-compatible
import Link from "next/link";
import { ChevronsRight } from "lucide-react";

export default function OurMenu() {
  const menuItems = [
    { href: "/menu", label: "Burger King" },
    { href: "/menu", label: "Pizza king" },
    { href: "/menu", label: "Fresh Food" },
    { href: "/menu", label: "Vegetable" },
    { href: "/menu", label: "Desserts" },
  ];

  return (
    <div className="mt-6 sm:mt-8 md:mt-0 lg:pl-6 xl:pl-12">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-white text-xl sm:text-2xl font-bold inline-block relative pb-4 sm:pb-5">
          Our Menu
          {/* Orange Line */}
          <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-theme3"></span>
          {/* White Line */}
          <span className="absolute bottom-0 left-10 w-12 sm:w-14 h-0.5 bg-white"></span>
        </h3>
      </div>
      <ul className="space-y-3 sm:space-y-4 md:space-y-5">
        {menuItems.map((item, index) => (
          <li key={index} className="transition-all duration-300 hover:translate-x-1">
            <Link
              href={item.href}
              className="flex items-center gap-2 text-white hover:text-theme3 transition-colors duration-300"
            >
              <ChevronsRight className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

