"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BlogBanner from "./BlogBanner";

/**
 * BlogDetail Component
 * Displays detailed view of a single blog post
 * 
 * @param {Object} props
 * @param {string|number} props.postId - ID of the blog post to display
 */
export default function BlogDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPost = async () => {
      setIsLoading(true);
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data - Replace with actual API call
      setPost({
        id: postId,
        title: "Simply Tips for Beauty",
        content: `
          <p>Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque.</p>
          <p>Suspendisse ultricies tellus eget nisl lacinia, vitae tempor risus aliquam. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
        `,
        image: "/images/img20.jpg",
        date: "FEBRUARY 3, 2016",
      });
      
      setIsLoading(false);
    };

    fetchPost();
  }, [postId]);

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      {/* Banner */}
      <BlogBanner />

      <section className="blog-content py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blog Heading */}
            <h1 className="blog-heading text-3xl lg:text-4xl text-gray-600 uppercase mb-8 lg:mb-12 relative inline-block">
              {post.title}
              <span className="absolute bottom-0 left-0 w-48 h-1 bg-gray-600"></span>
            </h1>

            {/* Featured Image */}
            <div className="img-holder mb-8 lg:mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>

            {/* Content */}
            <div className="txt-wrap text-gray-500 text-lg leading-relaxed">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose prose-lg max-w-none"
              />

              {/* Blockquote */}
              <blockquote className="blockquote border-l-4 border-gray-600 pl-6 lg:pl-8 my-8 lg:my-12 italic text-gray-600 text-xl leading-relaxed">
                <q>
                  This is an inspiring quote about beauty and fashion that adds
                  value to the blog post content.
                </q>
              </blockquote>

              <p>
                Additional content and insights about the blog topic continue
                here...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
