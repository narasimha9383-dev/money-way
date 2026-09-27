// src/components/MoneyWayLogo.jsx
import React from 'react';

/**
 * Money Way Official Brand Logo Component
 * Combines the stylized 'M' pathway with the rising career 'Way' upward arrow.
 */
export default function MoneyWayLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  showSubtitle = true,
  className = ''
}) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-tr from-emerald-500 via-[#39E98A] to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-950/60 shrink-0 group-hover:scale-105 transition-transform`}>
        <div className="w-full h-full bg-[#0b1320] rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden relative">
          {/* Ambient inner neon glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 pointer-events-none" />

          {/* Scalable Vector Icon: 'M' + Rising Arrow Pathway */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full text-[#39E98A] relative z-10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="mwGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#39E98A" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Stylized M arches */}
            <path 
              d="M18 78 V38 C18 28 26 22 36 22 C45 22 50 28 53 35 C56 28 61 22 70 22 C80 22 88 28 88 38 V78" 
              stroke="url(#mwGrad)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              opacity="0.38" 
            />

            {/* Dynamic Rising Arrow Pathway */}
            <path 
              d="M16 72 L42 46 L58 60 L86 24" 
              stroke="url(#mwGrad)" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Arrowhead pointing up-right */}
            <polygon 
              points="88,14 66,22 78,34" 
              fill="url(#mwGrad)" 
              stroke="url(#mwGrad)" 
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Base anchor accents */}
            <line x1="14" y1="80" x2="28" y2="80" stroke="url(#mwGrad)" strokeWidth="4" strokeLinecap="round" />
            <line x1="78" y1="80" x2="92" y2="80" stroke="url(#mwGrad)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className={`${textSizes[size] || textSizes.md} font-bold text-white tracking-tight font-heading`}>
              Money <span className="text-[#39E98A]">Way</span>
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wide font-medium hidden xs:inline-block">
              Find work that fits your life
            </span>
          )}
        </div>
      )}
    </div>
  );
}
