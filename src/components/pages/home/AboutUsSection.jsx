"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutUsSection() {
  return (
    <section className="about-us-section  section-padding pb-0 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="about-wrapper style1 relative h-[450px]">
        {/* Shapes */}
        <div className="shape1 hidden xl:block absolute top-0 left-0 z-10">
          <Image
            src="/img/shape/aboutShape1_1.png"
            alt="shape"
            width={100}
            height={100}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="shape5 hidden xl:block absolute -bottom-25 right-100 z-0">
          <Image
            src="/img/shape/aboutShape1_2.png"
            alt="shape"
            width={120}
            height={120}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="shape3 hidden xl:block absolute -bottom-1 left-19 z-10 animate-spin-slow">
          <Image
            src="/img/shape/aboutShape1_3.png"
            alt="shape"
            width={80}
            height={80}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="shape4 hidden xl:block absolute top-0 right-0 z-0">
          <Image
            src="/img/shape/aboutShape1_4.png"
            alt="shape"
            width={90}
            height={90}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="shape5 hidden xl:block absolute bottom-25 left-100 z-0">
          <Image
            src="/img/shape/aboutShape1_5.png"
            alt="shape"
            width={70}
            height={70}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="shape6 hidden xl:block absolute -bottom-1 right-20 z-10 animate-spin-slow">
          <Image
            src="/img/shape/aboutShape1_6.png"
            alt="shape"
            width={100}
            height={100}
            unoptimized={true}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="about-us section-padding">
            <div className="row">
              <div className="col-12">
                <div className="title-area text-center">
                  <div className="sub-title text-theme2 font-epilogue text-base font-bold uppercase mb-4 flex items-center justify-center gap-2">
                    <Image
                      className="me-1"
                      src="/img/icon/titleIcon.svg"
                      alt="icon"
                      width={20}
                      height={20}
                      unoptimized={true}

                    />
                    About US
                    <Image
                      className="ms-1"
                      src="/img/icon/titleIcon.svg"
                      alt="icon"
                      width={20}
                      height={20}
                      unoptimized={true}
                    />
                  </div>
                  <h2 className="title text-white font-epilogue text-3xl sm:text-4xl lg:text-5xl font-black mb-10 sm:w-1/2 text-center mx-auto">
                    Variety of flavours from american cuisine
                  </h2>
                  <div className="text text-text font-roboto text-base leading-relaxed mb-8 max-w-3xl mx-auto sm:w-1/3 text-center ">
                    It is a long established fact that a reader will be
                    distracted the readable content of a page when looking at
                    layout the point established fact that
                  </div>
                  <div className="btn-wrapper flex justify-center">
                    <Link
                      className="theme-btn px-8 py-3 bg-theme text-white font-roboto text-base font-medium hover:bg-theme2 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                      href="/menu"
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
    </section>
  );
}

