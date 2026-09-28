import React from 'react'

/**
 * Official Roads & Buildings Department Emblem
 * Features highway perspective lines reaching towards the horizon,
 * an arch representing civil bridges/structures, and a golden apex emblem.
 */
export function RnbLogo({ className = "w-6 h-6", color = "#cc785c" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="R&B Gujarat Logo"
    >
      {/* Outer sovereign hexagon / shield rim */}
      <polygon
        points="24,2 45,14 45,34 24,46 3,34 3,14"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="#efe9de"
        fillOpacity="0.4"
      />

      {/* Structural Bridge Arch */}
      <path
        d="M9 32 C 14 18, 34 18, 39 32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Suspension / Pier vertical lines */}
      <line x1="18" y1="21.5" x2="18" y2="30" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="24" y1="19.5" x2="24" y2="29" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="30" y1="21.5" x2="30" y2="30" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />

      {/* Highway Expressway Perspective Lines */}
      <polygon
        points="24,22 13,42 35,42"
        fill={color}
        fillOpacity="0.15"
      />
      <line x1="24" y1="22" x2="13" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="22" x2="35" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Highway Broken Center Line */}
      <line x1="24" y1="25" x2="24" y2="28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="31" x2="24" y2="35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="38" x2="24" y2="41" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

      {/* Sovereign Rising Apex / Compass Star */}
      <circle cx="24" cy="11" r="3.2" fill={color} />
      <line x1="24" y1="5.5" x2="24" y2="16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="11" x2="29.5" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Official Brand Header Component with Logo and Department Identity
 */
export function RnbBrand({ className = "", subtitle = "Govt. of Gujarat" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-[#efe9de] border border-[#e6dfd8] flex items-center justify-center p-1.5 shadow-sm">
        <RnbLogo className="w-full h-full" color="#cc785c" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-lg tracking-tight font-bold text-[#141413] leading-none">
            R&B InfraManage
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#cc785c]/10 text-[#cc785c] font-semibold border border-[#cc785c]/20">
            PRAVI
          </span>
        </div>
        <p className="text-[11px] text-[#6c6a64] leading-tight font-medium mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default RnbLogo
