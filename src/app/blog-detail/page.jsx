"use client";
import { useState } from "react";
import Image from "next/image";
import HeroBanner from "../../components/HeroBanner";
import Button from "../../components/Button";
import SocialMediaIcons from "../../components/SocialMediaIcons";

export default function BlogDetailPage() {
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
      alert("Comment posted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };


  const comments = [
    {
      id: 1,
      author: "Admin",
      date: "April 10, 2016 | 11.25 am",
      content:
        "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque...",
    },
    {
      id: 2,
      author: "Admin",
      date: "April 10, 2016 | 11.25 am",
      content:
        "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque...",
    },
    {
      id: 3,
      author: "Admin",
      date: "April 10, 2016 | 11.25 am",
      content:
        "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque...",
    },
  ];

  return (
    <div className="blog-detail-page">
      {/* Banner Section */}
      <BlogDetailBanner />

      {/* Blog Content Section */}
      <BlogContent />

      {/* Comments Section */}
      <CommentsSection
        comments={comments}
        formData={formData}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// Banner Component
function BlogDetailBanner() {
  return (
    <HeroBanner
      title="Blog Detail"
      backgroundImage="/images/img04.jpg"
      leftBadge="SALE OF 50%"
      rightBadge="TRENDS FOR 2024"
    />
  );
}

// Blog Content Component
function BlogContent() {
  return (
    <section className="blog-detail mt-16 lg:px-10 lg:mt-20">
      <div className="container mx-auto px-4">
        <div className="w-full mx-auto">
          {/* Blog Heading */}
          <h1 className="blog-heading text-3xl lg:text-4xl text-gray-600 uppercase mb-8 lg:mb-12 relative inline-block tracking-widest">
            SIMPLY TIPS FOR BEAUTY
          </h1>

          {/* First Paragraph */}
          <div className="txt-wrap mb-8 lg:mb-12">
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Pharetra, erat sed fermentum feugiat, velit mauris egestas quam,
              ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum
              feugiat, velit mauris egestas quam, ut aliquam massa nisl quis
              neque.Pharetra, erat sed fermentum feugiat, velit mauris egestas
              quam, ut aliquam massa nisl quis neque. Pharetra, erat sed
              fermentum feugiat, velit mauris egestas quam, ut aliquam massa
              nisl quis neque.Pharetra, erat sed fermentum feugiat, velit mauris
              egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed
              fermentum feugiat, velit mauris egestas quam, ut aliquam massa
              nisl quis neque.
            </p>
          </div>

          {/* Featured Image */}
          <div className="img-holder mb-8 lg:mb-12 rounded-lg overflow-hidden">
            <Image
              src="/images/img24.jpg"
              alt="Blog post image"
              width={1154}
              height={671}
              className="w-full h-auto max-h-screen object-cover"
            />
          </div>

          {/* Blockquote */}
          <blockquote className="blockquote border-l-4 border-gray-600 rounded-lg  pl-6 lg:pl-8 py-4 lg:py-6 my-8 lg:my-12 italic text-gray-600 text-lg leading-relaxed">
            <q className="block leading-8 pl-4 lg:pl-8">
              Pharetra, erat sed fermentum feugiat, velit mauris egestas quam,
              ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum
              feugiat, velit mauris egestas quam, ut aliquam massa nisl quis
              neque. Pharetra, erat sed fermentum feugiat, velit mauris egestas
              quam, ut aliquam massa nisl quis neque. Pharetra, erat sed
              fermentum feugiat, velit mauris egestas quam, ut aliquam massa
              nisl quis nequerat sed fermentum feugiat.
            </q>
          </blockquote>

          {/* Second Paragraph */}
          <div className="txt-wrap">
            <p className="text-gray-500 text-lg leading-9">
              Pharetra, erat sed fermentum feugiat, velit mauris egestas quam,
              ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum
              feugiat, velit mauris egestas quam, ut aliquam massa nisl quis
              neque.Pharetra, erat sed fermentum feugiat, velit mauris egestas
              quam, ut aliquam massa nisl quis neque. Pharetra, erat sed
              fermentum feugiat, velit mauris egestas quam, ut aliquam massa
              nisl quis neque.Pharetra, erat sed fermentum feugiat, velit mauris
              egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed
              fermentum feugiat, velit mauris egestas quam, ut aliquam massa
              nisl quis neque.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Comments Section Component
function CommentsSection({
  comments,
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
}) {
  return (
    <section className="comment-sec lg:px-10 mt-16 lg:mt-12 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="w-full mx-auto">
          {/* Comment Header */}
          <div className="comment-header py-8 mb-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center ">
              {/* Social Share */}
              <div className="share-social flex  max-lg:flex max-lg:justify-between">
                <span className="text-2xl  text-gray-600 uppercase mr-4">
                  Share
                </span>
                <SocialMediaIcons variant="default" size="md" className="ml-2" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl text-center lg:text-3xl text-gray-600 uppercase mb-4 lg:mb-5 max-lg:mb-10">
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </h1>
          {/* Comments List */}
          <ul className="comments-list space-y-12 mb-16">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>

          {/* Leave Comment Form */}
          <LeaveCommentForm
            formData={formData}
            isSubmitting={isSubmitting}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}

// Comment Item Component
function CommentItem({ comment }) {
  return (
    <li className="comment-item border-b lg:px-20 border-gray-300 pb-12 last:border-b-0">
      <div className="comment-info">
        <div className="header flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 max-lg:items-center max-lg:justify-center max-lg:text-center max-lg:gap-10">
          <div className="heading mb-4 lg:mb-0">
            <h2 className="text-xl text-gray-700 uppercase mb-2">
              {comment.author}
            </h2>
            <time className="time text-gray-500 text-sm uppercase tracking-wider">
              {comment.date}
            </time>
          </div>
        </div>
        <div className="flex justify-between items-center max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:text-center max-lg:gap-10">
          <p className="text-gray-500 text-lg leading-9 w-3/4 mb-4 max-lg:w-full">
            {comment.content}
          </p>
          <div className="">
            <Button
              variant="secondary"
              size="md"
              className="lg:px-18"
            >
              Reply 
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

// Leave Comment Form Component
function LeaveCommentForm({ formData, isSubmitting, onInputChange, onSubmit }) {
  return (
    <div className="leave-comment border-t lg:px-10 border-gray-300 pt-16 mt-16">
      <h2 className="text-2xl text-gray-700 uppercase tracking-widest mb-12 flex items-center gap-2">
        {/* Comment icon (lucide) before text for better visual */}
        post a comment
      </h2>

      <form onSubmit={onSubmit} className="comment-form">
        <div className="space-y-8">
          {/* Name Fields */}
          <div className="form-group grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="col">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onInputChange}
                className="form-control w-full border-b border-gray-400 py-2 focus:border-gray-600 outline-none transition-colors duration-250"
                placeholder="First name"
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onInputChange}
                className="form-control w-full border-b border-gray-400 py-2 focus:border-gray-600 outline-none transition-colors duration-250"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="form-control w-full border-b border-gray-400 py-2 focus:border-gray-600 outline-none transition-colors duration-250"
              placeholder="Email"
              required
            />
          </div>

          {/* Subject Field */}
          <div className="form-group">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={onInputChange}
              className="form-control w-full border-b border-gray-400 py-2 focus:border-gray-600 outline-none transition-colors duration-250"
              placeholder="Subject"
              required
            />
          </div>

          {/* Message Field */}
          <div className="form-group">
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={onInputChange}
              className="form-control w-full border-b border-gray-400 py-2 focus:border-gray-600 outline-none transition-colors duration-250 resize-none"
              placeholder="Your message"
            />
          </div>

          {/* Submit Button */}
          <div className="form-group flex justify-center my-10  ">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="secondary"
              size="md"
              className="uppercase "
            >
              {isSubmitting ? "Posting" : "post comment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

