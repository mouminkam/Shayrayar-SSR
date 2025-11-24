"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TimerSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set the end date and time for the countdown (31 December 2025)
    const countdownDate = new Date("2025-12-31T23:59:59").getTime();

    const countdownFunction = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(countdownFunction);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(countdownFunction);
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  return (
    <div className="timer-section fix relative overflow-hidden bg-cover bg-center bg-[url('/img/bg/ctaBG1_1.jpg')]">
      <div className="timer-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="timer-wrap style1 relative">
            {/* Shapes */}
            <div className="shape1 hidden xxl:block absolute top-10 left-10 z-10 animate-spin-slow">
              <Image
                src="/img/shape/timerShape1_1.svg"
                alt="shape"
                width={100}
                height={100}
                unoptimized={true}
              />
            </div>
            <div className="shape2 hidden xxl:block absolute top-20 right-10 z-10">
              <Image
                src="/img/shape/timerShape1_2.svg"
                alt="shape"
                width={120}
                height={120}
                unoptimized={true}
              />
            </div>
            <div className="shape3 hidden xxl:block absolute bottom-10 left-1/4 z-10">
              <Image
                src="/img/shape/timerShape1_3.svg"
                alt="shape"
                width={90}
                height={90}
                unoptimized={true}
              />
            </div>

            <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ">
                {/* Image */}
                <div className="timer-thumb flex justify-center lg:justify-start">
                  <Image
                    src="/img/timer/timerThumb1_1.png"
                    alt="timer"
                    width={500}
                    height={500}
                    quality={85}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="w-full h-auto object-contain "
                  />
                </div>

                {/* Content */}
                <div className="timer-card style1">
                  <div className="title-area text-center lg:text-left mb-8">
                    <div className="sub-title text-theme2  text-2xl font-bold uppercase mb-4 flex items-center justify-center lg:justify-start gap-2">
                      {/* <Image
                        className="me-1"
                        src="/img/icon/titleIcon.svg"
                        alt="icon"
                        width={20}
                        height={20}
                        unoptimized={true}
                      /> */}
                      Special Offer
                      {/* <Image
                        className="ms-1"
                        src="/img/icon/titleIcon.svg"
                        alt="icon"
                        width={20}
                        height={20}
                        unoptimized={true}
                      /> */}
                    </div>
                    <h2 className="title text-white  text-3xl sm:text-4xl lg:text-5xl font-black">
                      Get 30% Discount Every Item
                    </h2>
                  </div>

                  {/* Clock */}
                  <div className="clock-wrapper flex gap-4 sm:gap-6 mb-8 justify-center lg:justify-start">
                    <div className="clock text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                      <div className="number text-white  text-3xl sm:text-4xl font-black mb-2">
                        {formatTime(timeLeft.days)}
                      </div>
                      <div className="text text-white/80  text-sm sm:text-base">days</div>
                    </div>
                    <div className="clock text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                      <div className="number text-white  text-3xl sm:text-4xl font-black mb-2">
                        {formatTime(timeLeft.hours)}
                      </div>
                      <div className="text text-white/80  text-sm sm:text-base">hrs</div>
                    </div>
                    <div className="clock text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                      <div className="number text-white  text-3xl sm:text-4xl font-black mb-2">
                        {formatTime(timeLeft.minutes)}
                      </div>
                      <div className="text text-white/80  text-sm sm:text-base">mins</div>
                    </div>
                    <div className="clock text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                      <div className="number text-white  text-3xl sm:text-4xl font-black mb-2">
                        {formatTime(timeLeft.seconds)}
                      </div>
                      <div className="text text-white/80  text-sm sm:text-base">secs</div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="btn-wrap flex justify-center lg:justify-start">
                    <Link
                      className="theme-btn px-8 py-3 mb-8 bg-theme2 text-white  text-base font-medium hover:bg-theme transition-all duration-300 rounded-xl shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                      href="/shop"
                    >
                      ORDER NOW
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

