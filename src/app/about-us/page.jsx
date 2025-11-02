"use client";
import Image from "next/image";
import HeroBanner from "../../components/HeroBanner";
import TeamSlider from "./_components/TeamSlider";
import TestimonialSlider from "./_components/TestimonialSlider";
import { ArrowRight, Users, Instagram, ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Button from "../../components/Button";

export default function AboutUsPage() {
  const [counters, setCounters] = useState({
    subscribers: 0,
    followers: 0,
    pieces: 0,
  });
  const countersRef = useRef(null);

  // Team members data
  const teamMembers = [
    {
      name: "Christine Jensen",
      role: "Art Director",
      image: "/images/img08.jpg",
    },
    {
      name: "Sarah Williams",
      role: "Creative Director",
      image: "/images/img08.jpg",
    },
    {
      name: "Michael Chen",
      role: "Design Lead",
      image: "/images/img08.jpg",
    },
    {
      name: "Emma Rodriguez",
      role: "Brand Manager",
      image: "/images/img08.jpg",
    },
    {
      name: "David Thompson",
      role: "Marketing Director",
      image: "/images/img08.jpg",
    },
    {
      name: "Lisa Anderson",
      role: "Product Manager",
      image: "/images/img08.jpg",
    },
    {
      name: "James Wilson",
      role: "Sales Director",
      image: "/images/img08.jpg",
    },
    {
      name: "Maria Garcia",
      role: "Customer Success",
      image: "/images/img08.jpg",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Press Spaceba",
      image: "/images/img09.jpg",
      text: "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliqua m massa nisl quis neque. Suspendisse in orci enim pharetra, erat sed fermentum feugiat, velit mauris egestas quam ut aliquam massa uspendisse.",
    },
    {
      name: "Maria Garcia",
      image: "/images/img11.jpg",
      text: "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliqua m massa nisl quis neque. Suspendisse in orci enim pharetra, erat sed fermentum feugiat, velit mauris egestas quam ut aliquam massa uspendisse.",
    },
    {
      name: "David Johnson",
      image: "/images/img12.jpg",
      text: "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliqua m massa nisl quis neque. Suspendisse in orci enim pharetra, erat sed fermentum feugiat, velit mauris egestas quam ut aliquam massa uspendisse.",
    },
  ];

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetValues = {
              subscribers: 198.9,
              followers: 201.5,
              pieces: 23.741,
            };

            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;

            Object.keys(targetValues).forEach((key) => {
              let current = 0;
              const target = targetValues[key];
              const increment = target / steps;

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setCounters((prev) => ({
                  ...prev,
                  [key]: parseFloat(current.toFixed(1)),
                }));
              }, stepDuration);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner
        title="ABOUT US"
        backgroundImage="/images/img04.jpg"
        leftBadge="SALE OF 50%"
        rightBadge="TRENDS FOR 2024"
      />

      {/* About Description */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Image with border effect */}
            <div className="relative lg:w-1/2">
              <div className="relative z-10">
              
               <Image
                  src="/images/img20.jpg"
                  alt="About us jewelry collection"
                  width={520}
                  height={450}
                  className="w-full h-screen object-cover"
                />
            
              </div>
              <div className="absolute border-4 border-gray-600 z-0 w-full h-full lg:left-10 lg:-right-10 lg:top-10 lg:-bottom-10 max-lg:left-10 max-lg:right-0 max-lg:top-10 max-lg:bottom-0"></div>
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 lg:ml-20 max-lg:mt-10 max-lg:flex max-lg:flex-col max-lg:items-center">
              <h2 className="text-3xl font-normal text-gray-700 uppercase tracking-widest mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-2 after:w-36 after:h-1 after:bg-gray-600">
                ABOUT US
              </h2>

              <h3 className="text-6xl font-light text-gray-700 uppercase mb-10">
                LOVE JEWELRY
              </h3>

              <p className="text-gray-600 text-lg leading-8 mb-8">
                Pharetra, erat sed fermentum feugiat, velit mauris egestas quam,
                ut aliquam massa nisl quis neque. Suspendisse in orci enim
                pharetra, erat sed fermentum feugiat. Pharetra, erat sed
                fermentum feugiat, velit mauris egestas quam, ut aliquam massa
                nisl quis neque. Suspendisse in orci enim pharetra, erat sed
                fermentum feugiat. Pharetra, erat sed fermentum feugiat, velit
                mauris egestas quam, ut aliquam massa nisl quis neque.
                Suspendisse in orci enim pharetra, erat sed fermentum feugiat.
              </p>

              <ul className="space-y-3 mb-10 pl-6 max-lg:self-start max-lg:ml-5">
                {[
                  "Pharetra, erat sed fermentum feugiat.",
                  "Spendisse in orci enim pharetra, erat sed fermentum.",
                  "Pharetra, erat sed fermentum feugiat.",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-600 text-lg relative before:content-['•'] before:absolute before:-left-6 before:text-gray-600 before:font-bold"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                variant="secondary"
                size="md"
                className="flex items-center gap-2 group"
              >
                Read more
                <ArrowRight className="w-5 h-5 ml-2  transition-transform duration-300 group-hover:animate-[moveRight_0.6s_ease-in-out_infinite]" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Rating */}
      <section ref={countersRef} className="py-20 bg-gray-100 mt-5 relative ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Subscribers */}
            <div className="group hover:transform hover:scale-105 transition-transform duration-300">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-normal text-gray-700 uppercase tracking-widest mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gray-700">
                SUBSCRIBERS
              </h3>
              <span className="text-6xl font-bold text-gray-700 block">
                {counters.subscribers}k
              </span>
            </div>

            {/* Instagram Followers */}
            <div className="group hover:transform hover:scale-105 transition-transform duration-300">
              <Instagram className="w-12 h-12 text-gray-700 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-normal text-gray-700 uppercase tracking-widest mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gray-700">
                INSTAGRAM FOLLOWERS
              </h3>
              <span className="text-6xl font-bold text-gray-700 block">
                {counters.followers}k
              </span>
            </div>

            {/* Pieces Sold */}
            <div className="group hover:transform hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-normal text-gray-700 uppercase tracking-widest mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gray-700">
                PIECES SOLD
              </h3>
              <span className="text-6xl font-bold text-gray-700 block">
                {counters.pieces}k
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSlider teamMembers={teamMembers} />

      {/* Testimonials Section */}
      <TestimonialSlider testimonials={testimonials} />
    </>
  );
}
