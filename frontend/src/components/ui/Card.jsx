import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-5 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-sm font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

export { Card, CardHeader, CardContent, CardTitle };
