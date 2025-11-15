"use client";
import { useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="comment-form mt-12 p-8 sm:p-12 lg:p-16 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>

      <div className="form-title mb-8 relative z-10">
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inner-title text-white font-['Epilogue',sans-serif] text-3xl font-black mb-4 capitalize"
        >
          Add a Review
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-text text-sm sm:text-base mb-6"
        >
          Your email address will not be published. Required fields are marked *
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rating flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-4 mb-9"
        >
          <p className="text-white font-['Epilogue',sans-serif] text-base sm:text-lg font-semibold m-0">Rate this product? *</p>
          <ul className="star flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <li key={star}>
                <motion.button
                  type="button"
                  onClick={() => setRating(star)}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="transition-all duration-300"
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${rating >= star ? "text-theme3 fill-theme3" : "text-white/30 fill-white/10 hover:text-theme3 transition-all duration-300"
                      }`}
                  />
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="form-group style-white2 relative"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30"
              required
            />
            <User className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="form-group style-white2 relative"
          >
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30"
              required
            />
            <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="form-group style-white2 relative mb-5"
        >
          <textarea
            placeholder="Write a Message"
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 font-['Roboto',sans-serif] text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30 resize-none"
            required
          />
          <MessageSquare className="absolute right-5 top-5 w-5 h-5 text-white/60" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="form-group mb-6"
        >
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
            className="relative pl-10 cursor-pointer block leading-7 text-white/80 font-['Roboto',sans-serif] text-sm sm:text-base font-normal hover:text-white transition-colors duration-300"
          >
            Save my name, email, and website in this browser for the next time I comment.
            <span
              className={`absolute left-0 top-0.5 w-6 h-6 border-2 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${formData.saveInfo
                ? "bg-theme3 border-theme3"
                : "border-white/30 hover:border-theme3/50"
                }`}
            >
              {formData.saveInfo && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 bg-white rounded-sm"
                />
              )}
            </span>
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="form-group mb-0"
        >
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3 font-['Epilogue',sans-serif] text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30"
          >
            Post A Comment
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}

