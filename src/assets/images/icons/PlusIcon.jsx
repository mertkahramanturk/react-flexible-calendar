import React from "react";
export default function PlusIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        fill="currentColor"
        d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"
      />
    </svg>
  );
}
