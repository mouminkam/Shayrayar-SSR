"use client";
import { useState } from "react";
import { User, Mail, MessageSquare, Star, ArrowRight } from "lucide-react";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    saveInfo: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", { rating, ...formData });
  };

  return (
    <div className="comment-form mt-12 p-12 sm:p-16 bg-bgimg rounded-xl">
      <div className="form-title mb-6">
        <h3 className="inner-title text-white font-['Epilogue',sans-serif] text-3xl font-black mb-6 capitalize">
          Add a Review
        </h3>
        <p className="text-text text-sm mb-5">
          Your email address will not be published. Required fields are marked *
        </p>
        <div className="rating flex items-center gap-6 mt-4 mb-9">
          <p className="text-white font-semibold m-0">Rate this product? *</p>
          <ul className="star flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <li key={star}>
                <button
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-all duration-300 ${star <= rating ? "text-theme2" : "text-gray-300"
                    } hover:text-theme`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="form-group style-white2 relative">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 pr-12 border border-gray-200 rounded-lg bg-white text-text font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme"
              required
            />
            <User className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-title" />
          </div>
          <div className="form-group style-white2 relative">
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 pr-12 border border-gray-200 rounded-lg bg-white text-text font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme"
              required
            />
            <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-title" />
          </div>
        </div>
        <div className="form-group style-white2 relative mb-5">
          <textarea
            placeholder="Write a Message"
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-5 py-4 pr-12 border border-gray-200 rounded-lg bg-white text-text font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme resize-none"
            required
          />
          <MessageSquare className="absolute right-5 top-5 w-4 h-4 text-title" />
        </div>

        <div className="form-group mb-6">
          <input
            type="checkbox"
            id="reviewcheck"
            name="reviewcheck"
            checked={formData.saveInfo}
            onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
            className="hidden"
          />
          <label
            htmlFor="reviewcheck"
            className="relative pl-8 cursor-pointer block leading-8 text-text font-['Roboto',sans-serif] text-base font-normal"
          >
            Save my name, email, and website in this browser for the next time I comment.
            <span
              className={`absolute left-0 top-1.5 w-5 h-5 border border-gray-200 rounded bg-white ${formData.saveInfo ? "bg-theme border-theme" : ""
                } transition-all duration-300`}
            >
              {formData.saveInfo && (
                <span className="absolute left-1.5 top-0.5 w-2 h-2 bg-white rounded-sm"></span>
              )}
            </span>
          </label>
        </div>

        <div className="form-group mb-0">
          <button
            type="submit"
            className="theme-btn inline-block px-6 py-3 bg-theme text-white font-['Roboto',sans-serif] text-sm font-normal hover:bg-theme2 transition-all duration-300 rounded-md"
          >
            Post A Comment
            <ArrowRight className="w-4 h-4 inline-block ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}

