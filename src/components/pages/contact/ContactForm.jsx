"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "subject",
    message: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Image */}
          <div className="hidden lg:block order-2 lg:order-1">
            <div className="relative -ml-[265px] lg:ml-0">
              <Image
                src="/img/contact/contactThumb2_1.png"
                alt="Contact"
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
              <h2 className="text-[#010F1C] font-['Epilogue',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-black mb-6 capitalize">
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-[#D4DCFF] text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base focus:outline-none focus:border-[#EB0029] transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-[#D4DCFF] text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base focus:outline-none focus:border-[#EB0029] transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-[#D4DCFF] text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base focus:outline-none focus:border-[#EB0029] transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-[#D4DCFF] text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base bg-white focus:outline-none focus:border-[#EB0029] transition-colors duration-300 cursor-pointer"
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
                <div>
                  <textarea
                    name="message"
                    placeholder="Write your message here..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border border-[#D4DCFF] text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base resize-y focus:outline-none focus:border-[#EB0029] transition-colors duration-300"
                    required
                  ></textarea>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="reviewcheck"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1.5 w-5 h-5 rounded border-[#D2D2D1] text-[#EB0029] focus:ring-[#EB0029] cursor-pointer"
                    required
                  />
                  <label
                    htmlFor="reviewcheck"
                    className="text-[#5C6574] font-['Roboto',sans-serif] text-sm sm:text-base leading-relaxed cursor-pointer"
                  >
                    Collaboratively formulate principle capital. Progressively
                    evolve user
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#EB0029] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-none font-['Roboto',sans-serif] text-sm sm:text-base font-medium hover:bg-[#FC791A] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    SUBMIT NOW
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

