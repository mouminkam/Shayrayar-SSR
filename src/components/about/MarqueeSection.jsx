"use client";

export default function MarqueeSection() {
  const items = [
    "chicken pizza ",
    "GRILLED CHICKEN ",
    "BURGER ",
    "CHICKEN PIZZA ",
    "FRESH PASTA ",
    "ITALIANO FRENCH FRY ",
    "CHICKEN FRY ",
  ];

  // Duplicate items for seamless loop
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="marquee-wrapper">
        <div className="marquee-inner to-left">
          <ul className="flex whitespace-nowrap">
            {marqueeItems.map((item, index) => (
              <li key={index} className="inline-flex items-center gap-8">
                <span className="relative text-4xl sm:text-5xl lg:text-7xl font-black text-gray-800 uppercase mx-5 transition-colors duration-200 hover:text-theme group cursor-pointer pb-2 sm:pb-3 lg:pb-4">
                  <span className="relative z-10">{item}</span>
                  <span className="absolute left-0 bottom-0 sm:bottom-1 lg:bottom-2 h-1 w-0 bg-theme transition-all duration-300 group-hover:w-full"></span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
