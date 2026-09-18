import React from "react";

const Input = ({ className = "", label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
