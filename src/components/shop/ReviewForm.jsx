"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useToastStore from "../../store/toastStore";

export default function ReviewForm({ productId }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
    saveInfo: false,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toastError("Please login to submit a review");
      router.push("/login");
      return;
    }

    if (!formData.message.trim()) {
      toastError("Please write a review message");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toastSuccess("Review submitted successfully!");
      
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
        saveInfo: formData.saveInfo,
      });
    } catch (error) {
      toastError(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form mt-12 p-8 sm:p-12 lg:p-16 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>

      <div className="form-title mb-8 relative z-10">
        <h3 className="inner-title text-white  text-3xl font-black mb-4 capitalize">
          Add a Review
        </h3>
        <p className="text-text text-sm sm:text-base mb-6">
          Your email address will not be published. Required fields are marked *
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="form-group style-white2 relative">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50  text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30"
              required
            />
            <User className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
          <div className="form-group style-white2 relative">
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50  text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30"
              required
            />
            <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>
        <div className="form-group style-white2 relative mb-5">
          <textarea
            placeholder="Write a Message"
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-5 py-4 pr-12 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50  text-base font-normal outline-none transition-all duration-300 focus:border-theme3 focus:bg-white/20 focus:ring-2 focus:ring-theme3/30 resize-none"
            required
          />
          <MessageSquare className="absolute right-5 top-5 w-5 h-5 text-white/60" />
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
            className="relative pl-10 cursor-pointer block leading-7 text-white/80  text-sm sm:text-base font-normal hover:text-white transition-colors duration-300"
          >
            Save my name, email, and website in this browser for the next time I comment.
            <span
              className={`absolute left-0 top-0.5 w-6 h-6 border-2 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${formData.saveInfo
                ? "bg-theme3 border-theme3"
                : "border-white/30 hover:border-theme3/50"
                }`}
            >
              {formData.saveInfo && (
                <span className="w-3 h-3 bg-white rounded-sm"></span>
              )}
            </span>
          </label>
        </div>

        <div className="form-group mb-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3  text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Post A Comment
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
