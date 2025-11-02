"use client";
import { useState } from "react";
import { MapPin, Mail, Phone, Printer } from "lucide-react";
import HeroBanner from "../../components/HeroBanner";
import Button from "../../components/Button";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner
        title="CONTACT US"
        backgroundImage="/images/img04.jpg"
        leftBadge="SALE OF 50%"
        rightBadge="TRENDS FOR 2024"
      />

      {/* Contact Section */}
      <section className="flex flex-col lg:flex-row bg-white my-10 overflow-hidden">
        {/* Map Section */}
        <div className="lg:w-1/2 w-full ">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d13597.136035303396!2d74.35585675451732!3d31.571258754489254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m5!1s0x39191ab43100bd61%3A0x6fca2c2899c49c9d!2sMughalpura%2C+Lahore%2C+Pakistan!3m2!1d31.5711904!2d74.3646122!4m0!5e0!3m2!1sen!2s!4v1459623932322"
            width="100%"
            height="800"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Form Section */}
         <div className="lg:w-1/2 w-full lg:py-0 lg:px-10 lg:ml-10 max-lg:my-10 max-lg:mx-5 overflow-hidden">
          <div className="max-w-4xl">
            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-normal text-gray-600 uppercase tracking-widest mb-8">
                  CONTACT DETAIL
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-600 mr-4 mt-1 shrink-0" />
                    <address className="text-gray-600 not-italic">
                      222-UTC , Americans
                    </address>
                  </li>
                  <li className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-600 mr-4 mt-1 shrink-0" />
                    <a
                      href="mailto:Support@emtheme.com"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Support@emtheme.com
                    </a>
                  </li>
                  <li className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-600 mr-4 mt-1 shrink-0" />
                    <a
                      href="tel:0002131234567"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      (00)-213 1234567
                    </a>
                  </li>
                  <li className="flex items-start">
                    <Printer className="w-5 h-5 text-gray-600 mr-4 mt-1 shrink-0" />
                    <a
                      href="tel:0002131879017"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      (00)-213 1879017
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-normal text-gray-600 uppercase tracking-widest mb-8">
                  ABOUT US
                </h3>
                <p className="text-gray-600 leading-7">
                  Pharetra, erat sed fermentum <br />
                  feugiat, velit mauris egestas <br />
                  quam mauris egestas quam.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-normal text-gray-600 uppercase tracking-widest mb-8">
                LEAVE A MESSAGE
              </h3>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="w-full px-0 py-3 border-0 border-b border-gray-400 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="w-full px-0 py-3 border-0 border-b border-gray-400 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-0 py-3 border-0 border-b border-gray-400 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-300"
                    required
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full px-0 py-3 border-0 border-b border-gray-400 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-300"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message"
                    className="w-full px-0 py-3 border-0 border-b border-gray-400 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-300 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    variant="secondary"
                    size="md"
                  >
                    {isSubmitting ? "Sending..." : "send message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
