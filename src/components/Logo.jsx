import React from 'react';

export const Logo = ({ size = 40 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blue Diamond */}
    <path d="M5 10L18 5L31 15L18 35L5 10Z" fill="#2563EB" />
    {/* Red Diamond */}
    <path d="M36 10L49 5L62 15L49 35L36 10Z" fill="#E11D48" />
    {/* Grey Diamond */}
    <path d="M67 10L80 5L93 15L80 35L67 10Z" fill="#64748B" />
  </svg>
);

export default Logo;
