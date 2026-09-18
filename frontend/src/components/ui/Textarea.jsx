import React from "react";

const Textarea = ({ className = "", label, error, helperText, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Textarea;
