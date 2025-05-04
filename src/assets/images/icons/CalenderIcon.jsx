import React from "react";

export default function CalendarIcon({ size = 24, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        fill="currentColor"
        d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V9h14Zm0-11H5V6h1v2h2V6h8v2h2V6h1Z"
      />
      <rect
        x="7.5"
        y="11.5"
        width="3"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}
