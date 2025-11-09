"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, MessageCircle, Tag } from "lucide-react";

export default function BlogDetailsContent() {
  return (
    <div className="blog-post-details">
      <div className="single-blog-post">
        {/* Featured Image */}
        <div
          className="post-featured-thumb w-full h-[300px] sm:h-[400px] rounded-lg bg-cover bg-center bg-no-repeat mb-8"
          style={{
            backgroundImage: "url('/img/blog/blogThumb3_1.jpg')",
          }}
        />

        {/* Post Content */}
        <div className="post-content">
          {/* Post Meta */}
          <ul className="post-list flex items-center gap-4 sm:gap-6 lg:gap-8 mb-5 pb-5 border-b border-gray-200 flex-wrap">
            <li className="flex items-center gap-2 text-text font-['Roboto',sans-serif] text-sm sm:text-base font-medium">
              <User className="w-4 h-4 text-theme" />
              By Admin
            </li>
            <li className="flex items-center gap-2 text-text font-['Roboto',sans-serif] text-sm sm:text-base font-medium">
              <MessageCircle className="w-4 h-4 text-theme" />
              2 Comments
            </li>
            <li className="flex items-center gap-2 text-text font-['Roboto',sans-serif] text-sm sm:text-base font-medium">
              <Tag className="w-4 h-4 text-theme" />
              Fast Food Services
            </li>
          </ul>

          {/* Title */}
          <h3 className="text-title font-['Epilogue',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold mb-5">
            Tackling the Changes of Food Industry
          </h3>

          {/* Content Paragraphs */}
          <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-4">
            Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore of magna aliqua. Ut enim
            ad minim veniam, made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor
            commodo consequat. Duis aute irure and dolor in reprehenderit.
          </p>

          <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-4">
            The is ipsum dolor sit amet consectetur adipiscing elit. Fusce eleifend porta arcu In hac habitasse the is
            platea augue thelorem turpoi dictumst. In lacus libero faucibus at malesuada sagittis placerat eros sed
            istincidunt augue ac ante rutrum sed the is sodales augue consequat.
          </p>

          <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-4">
            Nulla facilisi. Vestibulum tristique sem in eros eleifend imperdiet. Donec quis convallis neque. In id
            lacus pulvinar lacus, eget vulputate lectus. Ut viverra bibendum lorem, at tempus nibh mattis in. Sed a
            massa eget lacus consequat auctor.
          </p>

          {/* Highlighted Text */}
          <div className="hilight-text border-l-4 border-theme p-6 sm:p-8 lg:p-10 bg-white rounded-lg my-5 relative">
            <p className="text-text font-['Roboto',sans-serif] text-base sm:text-lg font-medium italic leading-7 max-w-2xl">
              Pellentesque sollicitudin congue dolor non aliquam. Morbi volutpat, nisi vel ultricies urnacondimentum,
              sapien neque lobortis tortor, quis efficitur mi ipsum eu metus. Praesent eleifend orci sit amet est
              vehicula.
            </p>
            <svg
              className="absolute top-0 right-0 -mt-8 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <path
                d="M7.71428 20.0711H0.5V5.64258H14.9286V20.4531L9.97665 30.3568H3.38041L8.16149 20.7947L8.5233 20.0711H7.71428Z"
                stroke="#EB0029"
              />
              <path
                d="M28.2846 20.0711H21.0703V5.64258H35.4989V20.4531L30.547 30.3568H23.9507L28.7318 20.7947L29.0936 20.0711H28.2846Z"
                stroke="#EB0029"
              />
            </svg>
          </div>

          <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-5 mt-4">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.
            Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
            tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur
            pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.
            Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros.
          </p>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5">
            <div className="details-image">
              <Image
                src="/img/blog/blogThumb3_2.jpg"
                alt="Blog detail image"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
                unoptimized={true}
              />
            </div>
            <div className="details-image">
              <Image
                src="/img/blog/blogThumb3_3.jpg"
                alt="Blog detail image"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
                unoptimized={true}
              />
            </div>
          </div>

          <p className="text-text font-['Roboto',sans-serif] text-base leading-7 pt-5">
            Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore of magna aliqua. Ut enim
            ad minim veniam, made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor
            commodo consequat. Duis aute irure and dolor in reprehenderit.Consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore of magna aliqua. Ut enim ad minim veniam, made of owl the quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor commodo consequat. Duis aute irure and
            dolor in reprehenderit.
          </p>
        </div>

        {/* Tags and Share */}
        <div className="tag-share-wrap border-t border-b border-gray-200 py-5 mt-10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="tagcloud flex items-center flex-wrap gap-2">
              <h6 className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl font-semibold mr-2 inline">
                Tags:{" "}
              </h6>
              <Link
                href="/blog-details"
                className="inline-flex px-4 py-2 text-title font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-white border border-gray-200 rounded transition-all duration-300 hover:bg-theme hover:text-white hover:border-theme"
              >
                News
              </Link>
              <Link
                href="/blog-details"
                className="inline-flex px-4 py-2 text-white font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-theme border border-theme rounded transition-all duration-300"
              >
                business
              </Link>
              <Link
                href="/blog-details"
                className="inline-flex px-4 py-2 text-title font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-white border border-gray-200 rounded transition-all duration-300 hover:bg-theme hover:text-white hover:border-theme"
              >
                marketing
              </Link>
            </div>
            <div className="social-share flex items-center gap-3">
              <span className="text-title font-['Epilogue',sans-serif] text-lg font-semibold">Share:</span>
              <Link href="#" className="text-text text-lg hover:text-theme transition-colors duration-300">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" className="text-text text-lg hover:text-theme transition-colors duration-300">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" className="text-text text-lg hover:text-theme transition-colors duration-300">
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link href="#" className="text-text text-lg hover:text-theme transition-colors duration-300">
                <i className="fab fa-youtube"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

