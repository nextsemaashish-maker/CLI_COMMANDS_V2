import React from 'react';

export default function NSLogo({ size = 32, showWordmark = false }) {
  if (showWordmark) {
    return (
      <svg
        viewBox="0 0 540 130"
        style={{
          height: `${size}px`,
          width: 'auto',
          overflow: 'visible',
          filter: 'drop-shadow(0 0 16px rgba(4, 170, 109, 0.45))'
        }}
      >
        {/* N */}
        <g>
          <path
            d="M 20 115 V 15 L 75 115 V 15"
            fill="none"
            stroke="#04AA6D"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* E */}
        <g transform="translate(100, 0)">
          <path
            d="M 15 78 H 60 C 60 48, 15 48, 15 78 C 15 115, 60 115, 65 98"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>
        {/* X */}
        <g transform="translate(175, 0)">
          <path
            d="M 15 50 L 60 115 M 60 50 L 15 115"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>
        {/* T */}
        <g transform="translate(250, 0)">
          <path
            d="M 15 62 H 60 M 37 35 V 102 C 37 115, 55 115, 62 110"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>
        {/* S */}
        <g transform="translate(325, 0)">
          <path
            d="M 55 62 C 55 50, 15 50, 15 66 C 15 84, 55 84, 55 100 C 55 115, 15 115, 15 102"
            fill="none"
            stroke="#04AA6D"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>
        {/* E */}
        <g transform="translate(400, 0)">
          <path
            d="M 15 78 H 60 C 60 48, 15 48, 15 78 C 15 115, 60 115, 65 98"
            fill="none"
            stroke="#04AA6D"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>
        {/* M */}
        <g transform="translate(475, 0)">
          <path
            d="M 10 115 V 50 M 10 70 C 10 50, 42 50, 42 70 V 115 M 42 70 C 42 50, 74 50, 74 70 V 115"
            fill="none"
            stroke="#04AA6D"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  // Compact Iconic 'N' Shield Icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 10px rgba(4, 170, 109, 0.5))' }}
    >
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#17181c"
        stroke="#04AA6D"
        strokeWidth="3.5"
      />
      <path
        d="M24 74 V26 L52 64 V26"
        stroke="#04AA6D"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 36 C74 30 68 26 60 26 C50 26 48 34 54 40 L68 48 C74 54 74 64 62 64 C52 64 46 58 46 52"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
