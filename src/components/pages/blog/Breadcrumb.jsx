"use client";
import Link from "next/link";

export default function Breadcrumb({ title = "Blog" }) {
  return (
    <section className="relative">
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg/breadcumb.jpg')",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-40 text-center">
            <h1 className="text-white font-['Epilogue',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-black leading-tight uppercase mb-4">
              {title}
            </h1>
            <ul className="flex justify-center items-center gap-4">
              <li>
                <Link
                  href="/"
                  className="text-white font-['Roboto',sans-serif] text-base font-medium hover:text-theme transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="text-white">/</li>
              <li className="text-theme">{title}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

