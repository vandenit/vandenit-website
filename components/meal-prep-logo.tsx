import React from 'react';

export const MealPrepLogo = ({ width = 100, height = 100, color = 'currentColor', style = {} }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={style}
    >
      {/* Background circle, similar to Vanden IT */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" />
  
      {/* Stylized fork path */}
      <path
        d="M 35 30 L 35 60 L 37 60 L 37 30"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Fork prongs */}
      <path
        d="M 35 30 L 33 26 M 36 30 L 34 26 M 37 30 L 35 26"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
  
      {/* Stylized spoon path */}
      <path
        d="M 65 30 Q 65 40, 60 45 Q 55 50, 65 60"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
  
      {/* Small circle accent, similar to Vanden IT logo */}
      <circle cx="50" cy="50" r="3" fill={color} />
    </svg>
  );
  