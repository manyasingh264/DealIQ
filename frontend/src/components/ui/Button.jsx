import React from "react";

const Button = ({ children, variant = "primary", size = "md", className = "", disabled = false, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-md",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
