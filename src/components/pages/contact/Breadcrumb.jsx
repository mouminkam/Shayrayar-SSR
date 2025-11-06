"use client";
import Link from "next/link";

export default function Breadcrumb({ title = "Contact us" }) {
  return (
    <div className="relative">
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg/breadcumb.jpg')",
          minHeight: "400px",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] py-20 sm:py-32">
            <h1 className="text-white font-['Epilogue',sans-serif] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-center mb-6 uppercase">
              {title}
            </h1>
            <ul className="flex items-center justify-center gap-4">
              <li>
                <Link
                  href="/"
                  className="text-white font-['Roboto',sans-serif] text-base font-medium hover:text-[#EB0029] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="text-white">/</li>
              <li className="text-[#EB0029]">{title}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

