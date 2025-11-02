"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialSlider({ testimonials = [] }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Duplicate testimonials for infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Auto slide for testimonials - infinite
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => prev + 1);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => prev - 1);
  };

  // Calculate the actual index for display (for dots and current testimonial)
  const actualIndex = currentTestimonial % testimonials.length;

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-2xl font-normal text-gray-600 uppercase tracking-widest block mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-gray-600">
            Customer Reviews
          </span>
          <h3 className="text-6xl font-light text-gray-700 uppercase tracking-widest">
            WHAT THEY SAY
          </h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentTestimonial * 100}%)`,
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div key={index} className="w-full shrink-0 px-4">
                  <div className="text-center group">
                    {/* Customer Image */}
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gray-400 group-hover:border-gray-600 transition-colors duration-300">
                      <Image
                        src={testimonial.image || "/images/img09.jpg"}
                        alt={testimonial.name || "Customer"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Customer Name */}
                    <h3 className="text-2xl font-bold text-gray-700 uppercase tracking-widest mb-6">
                      {testimonial.name || "Customer Name"}
                    </h3>

                    {/* Testimonial Text */}
                    <div className="relative">
                      <p className="text-gray-600 text-lg leading-8 italic max-w-2xl mx-auto relative">
                        <span className="text-6xl text-gray-300 absolute -top-4 -left-4">&ldquo;</span>
                        {testimonial.text || "No testimonial available"}
                        <span className="text-6xl text-gray-300 absolute -bottom-8 -right-4">&rdquo;</span>
                      </p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center mt-6">
                      {[...Array(5)].map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className="text-yellow-400 text-2xl mx-1"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === actualIndex
                    ? "bg-gray-700 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}