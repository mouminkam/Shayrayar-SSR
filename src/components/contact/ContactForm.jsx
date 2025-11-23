"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import api from "../../api";
import useToastStore from "../../store/toastStore";
import useBranchStore from "../../store/branchStore";

export default function ContactForm() {
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { selectedBranch, initialize } = useBranchStore();
  const [branchEmail, setBranchEmail] = useState("info@example.com");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "subject",
    message: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Fetch branch email
  useEffect(() => {
    const fetchBranchEmail = async () => {
      if (!selectedBranch) return;

      try {
        const response = await api.branches.getBranchById(selectedBranch.id || selectedBranch.branch_id);
        
        if (response && response.success && response.data) {
          const branchData = response.data.branch || response.data;
          const email = branchData.email || branchData.contact_email || "info@example.com";
          setBranchEmail(email);
        }
      } catch (error) {
        console.error("Error fetching branch email:", error);
        // Keep default email
      }
    };

    fetchBranchEmail();
  }, [selectedBranch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      toastError("Please fill in all required fields");
      return;
    }

    if (!formData.agree) {
      toastError("Please agree to the terms");
      return;
    }

    if (formData.subject === "subject") {
      toastError("Please select a subject");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format subject for email
      const subjectLabels = {
        complain: "Complain",
        greetings: "Greetings",
        date: "Expire Date",
        price: "About Price",
        order: "About Order",
      };
      const emailSubject = subjectLabels[formData.subject] || formData.subject;

      // Create email body with all form data
      const emailBody = `Hello,

I would like to contact you regarding: ${emailSubject}

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${emailSubject}

Message:
${formData.message}

---
This message was sent from the contact form on the website.`;

      // Create mailto link
      const mailtoLink = `mailto:${branchEmail}?subject=${encodeURIComponent(`Contact Form: ${emailSubject}`)}&body=${encodeURIComponent(emailBody)}`;

      // Open email client
      window.location.href = mailtoLink;

      toastSuccess("Opening your email client... Please send the message to complete your request.");
      
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "subject",
          message: "",
          agree: false,
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Contact form error:", error);
      toastError("Failed to open email client. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-form-section py-12 sm:py-16 md:py-20 lg:py-24 pt-0 relative">
      <div className="contact-form-wrapper style2">
        <div className="container mx-auto ">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12 xl:gap-16">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 xl:w-[55%] lg:-ml-[30px]">
              <div className="contact-form-thumb  relative border-r-2 border-y-2 border-theme3 rounded-r-full">
                <Image
                  src="/img/contact/contactThumb2_1.png"
                  alt="Contact form illustration"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain object-left rounded-lg"
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex border-2">
              <div className="contact-form style2 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg w-full">
                <h2 className="text-title  text-2xl sm:text-3xl lg:text-4xl font-black mb-6 capitalize">
                  Get in Touch
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Full Name - col-md-6 */}
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-gray-200 text-text  text-sm sm:text-base focus:outline-none focus:border-theme3 transition-colors duration-300"
                        required
                      />
                    </div>

                    {/* Email - col-md-6 */}
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-gray-200 text-text  text-sm sm:text-base focus:outline-none focus:border-theme3 transition-colors duration-300"
                        required
                      />
                    </div>

                    {/* Phone - col-md-6 */}
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-gray-200 text-text  text-sm sm:text-base focus:outline-none focus:border-theme3 transition-colors duration-300"
                        required
                      />
                    </div>

                    {/* Subject - col-md-6 */}
                    <div className="col-md-6">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-gray-200 text-text  text-sm sm:text-base bg-white focus:outline-none focus:border-theme3 transition-colors duration-300 cursor-pointer"
                      >
                        <option value="subject">Subject</option>
                        <option value="complain">Complain</option>
                        <option value="greetings">Greetings</option>
                        <option value="date">Expire Date</option>
                        <option value="price">About Price</option>
                        <option value="order">About order</option>
                      </select>
                    </div>
                  </div>

                  {/* Message - col-12 */}
                  <div className="col-12">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Write your message here..."
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-gray-200 text-text  text-sm sm:text-base resize-y focus:outline-none focus:border-theme3 transition-colors duration-300"
                      required
                    ></textarea>
                  </div>

                  {/* Checkbox - col-12 form-group */}
                  <div className="col-12 form-group flex items-start gap-3">
                    <input
                      id="reviewcheck"
                      name="agree"
                      type="checkbox"
                      checked={formData.agree}
                      onChange={handleChange}
                      className="mt-1.5 w-5 h-5 rounded border-gray-300 text-theme3 focus:ring-theme3 cursor-pointer"
                      required
                    />
                    <label
                      htmlFor="reviewcheck"
                      className="text-text  text-sm sm:text-base leading-relaxed cursor-pointer"
                    >
                      Collaboratively formulate principle capital. Progressively
                      evolve user
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  {/* Submit Button - col-12 form-group mb-0 */}
                  <div className="col-12 form-group mb-0">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="theme-btn w-full bg-theme3 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-sm  text-sm sm:text-base font-medium hover:bg-theme transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          SENDING...
                        </>
                      ) : (
                        <>
                          SUBMIT NOW
                          <ArrowRight className="w-4 h-4 bg-transparent text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
