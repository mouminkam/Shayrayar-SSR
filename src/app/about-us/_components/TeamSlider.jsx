"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function TeamSlider({ teamMembers = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Duplicate team members for infinite loop
  const duplicatedTeamMembers = [...teamMembers, ...teamMembers, ...teamMembers];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Calculate the actual index for display (for dots)
  const actualIndex = currentSlide % teamMembers.length;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-2xl font-normal text-gray-600 uppercase tracking-widest block mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-gray-600">
            Our Awesome Team
          </span>
          <h3 className="text-6xl font-light text-gray-700 uppercase tracking-widest">
            MEET OUR TEAM
          </h3>
        </div>

        {/* Team Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {/* Duplicate items for infinite loop */}
              {duplicatedTeamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="w-1/3 shrink-0 px-4"
                >
                  <div className="text-center group">
                    <div className="relative overflow-hidden mb-6 rounded-lg">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={360}
                        height={470}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      <a
                        href="#"
                        className="hover:text-gray-900 transition-colors duration-300"
                      >
                        {member.name}
                      </a>
                    </h4>
                    <span className="text-gray-600 uppercase tracking-widest text-sm font-bold">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === actualIndex
                    ? 'bg-gray-700 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}