import Image from "next/image";
import { Twitter, Facebook, Youtube } from "lucide-react";
import { FaPinterest } from "react-icons/fa";

export default function HeroSection() {
  const socialLinks = [
    {
      name: "pinterest",
      label: "Pinterest",
      icon: <FaPinterest className="text-white" size={20} />,
      href: "#",
    },
    {
      name: "twitter",
      label: "Twitter",
      icon: <Twitter className="text-white" size={20} />,
      href: "#",
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: <Facebook className="text-white" size={20} />,
      href: "#",
    },
    {
      name: "google-plus",
      label: "Google Plus",
      icon: <Youtube className="text-white" size={20} />,
      href: "#",
    },
  ];

  return (
    <section className="relative bg-white h-screen text-center mb-50 md:mb-20 mt-40">
      <div className="relative">
        <h1
          className="
            relative text-[70px] font-bold mb-4 sm:tracking-[0.3em] inline-block p-15 z-2 
            before:content-[''] before:absolute before:z-1
            before:left-22 before:-top-5 before:right-22
            before:border-t-[9px] before:border-x-[9px] before:border-black before:border-solid
            before:h-[50px]
            after:content-[''] after:absolute after:z-0
            after:left-22 sm:after:bottom-[-270px] after:right-22 after:bottom-[-200px]
            after:border-b-[9px] after:border-x-[9px] after:border-black after:border-solid
            after:h-[50px]"
        >
          BACK TO DREAM
        </h1>
        <Image
          src="/images/img27.png"
          alt="image description"
          width={438}
          height={624}
          className="absolute w-[250px]  object-cover sm:w-[438px] left-1/2 -translate-x-1/2"
        />
      </div>
      <ul className="text-black text-4xl font-bold flex -bottom-10 left-1/2 -translate-x-1/2 sm:flex sm:bottom-auto sm:left-auto sm:translate-x-0 sm:flex-col sm:items-center sm:justify-center absolute sm:right-15 sm:top-1/2 sm:-translate-y-40 gap-10">
        <li className=" cursor-pointer sm:rotate-90">01</li>
        <li className=" cursor-pointer sm:rotate-90">02</li>
        <li className=" cursor-pointer sm:rotate-90">03</li>
      </ul>

      {/* Social Media Icons - Left Side */}
      <ul className="social-network -bottom-30 left-1/2 -translate-x-1/2 flex sm:flex-col gap-5 space-x-4 absolute sm:top-1/2 sm:left-15 sm:-translate-y-40">
        {socialLinks.map((social) => (
          <li key={social.name}>
            <a
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-250"
            >
              {social.icon}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
