import React from 'react';

export const VandenITLogo = ({ width = 100, height = 100, color = 'currentColor', style = {} }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    style={style}
  >
    {/* Background circle for a modern touch */}
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" />

    {/* Stylized 'V' path with a unique cut-out in the middle */}
    <path
      d="M 30 30 L 48 70 L 50 63 L 52 70 L 70 30"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Small circle element to add a unique touch */}
    <circle cx="50" cy="40" r="3" fill={color} />

   
  </svg>
);
