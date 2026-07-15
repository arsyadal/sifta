import React from "react";

export default function SiftaLogo({ className = "h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* SIFTA Wordmark - Batik Blue (#0056D2) */}
      <text
        x="10"
        y="60"
        fill="#0056D2"
        fontStyle="normal"
        fontWeight="800"
        fontSize="54"
        fontFamily='system-ui, -apple-system, "Plus Jakarta Sans", sans-serif'
        letterSpacing="-0.03em"
      >
        SIFTA
      </text>

      {/* Starting point: Green Dot (dot of the letter 'I') at x=78, y=18 */}
      <circle cx="78" cy="18" r="6.5" fill="#2ECC71" />

      {/* Green loop arrow starting from the dot of 'I', arching over F, T, and pointing down to 'A' at x=202 */}
      <path
        d="M 78,18 C 105,-8 175,-5 204,26"
        stroke="#2ECC71"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arrowhead chevron pointing down-right on the outer slope of the 'A' */}
      <path
        d="M 191,27 L 206,27 L 205,12"
        stroke="#2ECC71"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
