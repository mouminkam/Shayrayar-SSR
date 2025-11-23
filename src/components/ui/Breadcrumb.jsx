"use client";
import Link from "next/link";

/**
 * Reusable Breadcrumb component
 * @param {string} title - The page title
 * @param {boolean} showLinks - Whether to show navigation links (default: true)
 */
export default function Breadcrumb({ title, showLinks = true }) {
  return (
    <section className="relative">
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg/breadcumb.jpg')",
        }}
      >
        {/* Overlay for gradient effect */}
        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `
              linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 30%),
              linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 30%),
              linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 40%)
            `,
            backgroundBlendMode: 'normal'
          }}
        />

        {/* Breadcrumb content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="py-40 text-center">
            <h1 className="text-white  text-4xl sm:text-5xl lg:text-6xl font-black leading-tight uppercase mb-4">
              {title}
            </h1>
            {showLinks && (
              <ul className="flex justify-center items-center gap-3">
                <li>
                  <Link
                    href="/"
                    className="text-white/90  text-xl font-medium hover:text-theme hover:scale-105 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-white/70 text-xl">›</li>
                <li className="text-white/90  text-xl font-medium hover:text-theme hover:scale-105 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10 backdrop-blur-sm">
                  {title}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

