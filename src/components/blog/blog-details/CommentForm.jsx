"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CommentForm({ slug }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Comment submitted:", formData);
  };

  return (
    <div className="comment-form-wrap my-10 pt-5">
      <h3 className="text-white font-['Epilogue',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
        Leave a comments
      </h3>
      <form onSubmit={handleSubmit} id="contact-form" method="POST">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="form-clt">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-lg bg-transparent text-white font-['Roboto',sans-serif] text-base focus:outline-none focus:border-theme3 transition-colors duration-300"
              required
            />
          </div>
          <div className="form-clt">
            <input
              type="email"
              name="email"
              id="email2"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-lg bg-transparent text-white font-['Roboto',sans-serif] text-base focus:outline-none focus:border-theme3 transition-colors duration-300"
              required
            />
          </div>
        </div>
        <div className="form-clt mb-4 sm:mb-6">
          <textarea
            name="message"
            id="message"
            placeholder="Write Message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-5 py-4 pb-24 border border-gray-200 rounded-lg bg-transparent text-white font-['Roboto',sans-serif] text-base resize-y focus:outline-none focus:border-theme3 transition-colors duration-300"
            required
          ></textarea>
        </div>
        <div className="form-clt">
          <button
            type="submit"
            className="theme-btn inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-theme3 text-white font-['Roboto',sans-serif] text-sm sm:text-base font-normal rounded-sm hover:bg-theme transition-colors duration-300"
          >
            Post a Comment
            <ArrowRight className="w-4 h-4 bg-transparent text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}

