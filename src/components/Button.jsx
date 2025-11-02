"use client";

export default function Button({ 
  children, 
  type = "button", 
  disabled = false, 
  onClick, 
  className = "",
  variant = "primary",
  size = "md",
  ...props 
}) {
  const baseClasses = "relative outline-none border-none bg-transparent z-10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `
      before:absolute before:content-[''] before:z-0 before:left-0 before:top-0 before:bottom-0 before:right-auto 
      before:border-l-2 before:border-t-2 before:border-b-2 before:border-gray-600 before:p-3
      before:transition-all before:duration-300
      after:absolute after:content-[''] after:z-0 after:left-auto after:top-0 after:bottom-0 after:right-0
      after:border-r-2 after:border-t-2 after:border-b-2 after:border-gray-600 after:p-3
      after:transition-all after:duration-300
      hover:before:px-35 hover:after:px-35
    `,
    secondary: `
      before:absolute before:content-[''] before:z-0 before:left-0 before:top-0 before:bottom-0 before:right-auto 
      before:border-l-2 before:border-t-2 before:border-b-2 before:border-gray-600 before:p-3
      before:transition-all before:duration-300
      after:absolute after:content-[''] after:z-0 after:left-auto after:top-0 after:bottom-0 after:right-0
      after:border-r-2 after:border-t-2 after:border-b-2 after:border-gray-600 after:p-3
      after:transition-all after:duration-300
      hover:before:px-12 hover:after:px-12
    `,
    outline: `
      border-2 border-gray-400 text-gray-700 uppercase tracking-widest bg-transparent 
      hover:bg-gray-400 hover:text-white transition-all duration-300
    `,
    solid: `
      bg-gray-600 text-white uppercase tracking-widest 
      hover:bg-gray-700 transition-all duration-300
    `
  };

  const sizes = {
    sm: "text-sm py-2 px-4",
    md: "text-lg py-3 px-6",
    lg: "text-xl py-4 px-8"
  };

  const widthClasses = {
    sm: "w-32",
    md: "w-48", 
    lg: "w-64"
  };

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${variant === 'primary' ? widthClasses[size] : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
