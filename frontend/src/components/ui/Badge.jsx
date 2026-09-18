import React from "react";

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-50 text-green-700 border border-green-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
