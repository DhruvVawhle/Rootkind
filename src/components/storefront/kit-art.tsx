import React from "react";
import Image from "next/image";

interface KitArtProps {
  slug: string;
  image?: string;
  imageAlt?: string;
  className?: string;
}

export function KitArt({ slug, image, imageAlt, className = "" }: KitArtProps) {
  if (image) {
    return (
      <div className={`relative w-full aspect-[3/2] overflow-hidden rounded-t-[20px] bg-[#1E4D37] ${className}`}>
        <Image
          src={image}
          alt={imageAlt || "Rootkind Starter Kit"}
          fill
          sizes="(max-width: 900px) 100vw, 480px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (slug === "first-harvest-balcony-vegetable-kit") {
    return (
      <div className={`relative w-full h-[210px] overflow-hidden rounded-t-[20px] bg-[#1E4D37] flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 400 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="bg-balcony" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E4D37" />
              <stop offset="100%" stopColor="#153F2D" />
            </linearGradient>
            <linearGradient id="terracotta-pot" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B86542" />
              <stop offset="50%" stopColor="#CF7B55" />
              <stop offset="100%" stopColor="#9C4F30" />
            </linearGradient>
            <linearGradient id="tomato-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E85D45" />
              <stop offset="100%" stopColor="#C43822" />
            </linearGradient>
            <linearGradient id="chili-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E03C26" />
              <stop offset="100%" stopColor="#A82010" />
            </linearGradient>
          </defs>

          {/* Background Ambient Garden Sky & Balcony Railing */}
          <rect width="400" height="210" fill="url(#bg-balcony)" />

          {/* Soft background glow */}
          <circle cx="200" cy="70" r="90" fill="#F0C4A0" fillOpacity="0.08" />

          {/* Balcony Railing Lines */}
          <path d="M20 160 H380" stroke="#8FAE7E" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="6 4" />
          <path d="M20 185 H380" stroke="#8FAE7E" strokeWidth="3" strokeOpacity="0.35" />
          <line x1="80" y1="160" x2="80" y2="200" stroke="#8FAE7E" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="160" y1="160" x2="160" y2="200" stroke="#8FAE7E" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="240" y1="160" x2="240" y2="200" stroke="#8FAE7E" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="320" y1="160" x2="320" y2="200" stroke="#8FAE7E" strokeWidth="2" strokeOpacity="0.25" />

          {/* Fabric Planter (Center) */}
          <path
            d="M130 140 L142 195 C143 198 147 200 152 200 H248 C253 200 257 198 258 195 L270 140 Z"
            fill="url(#terracotta-pot)"
          />
          <ellipse cx="200" cy="140" rx="70" ry="10" fill="#3A281E" />
          <path d="M140 145 H260" stroke="#8C4A2F" strokeWidth="2" strokeLinecap="round" />

          {/* Vine & Stems */}
          <path
            d="M200 138 Q202 95 185 65 Q175 48 165 40"
            stroke="#6B9658"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M195 105 Q220 85 235 60 Q242 45 240 35"
            stroke="#6B9658"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Tomato Foliage Leaves */}
          <path d="M185 65 C170 60 160 70 172 80 C182 82 188 74 185 65 Z" fill="#7D9565" />
          <path d="M220 85 C235 80 245 90 232 98 C222 100 216 93 220 85 Z" fill="#8FAE7E" />
          <path d="M198 120 C180 115 174 128 186 134 C195 135 200 128 198 120 Z" fill="#6B9658" />

          {/* Ripe Heirloom Cherry Tomatoes */}
          <circle cx="160" cy="85" r="16" fill="url(#tomato-grad)" />
          <path d="M160 69 L158 64 M160 69 L164 65 M160 69 L156 70" stroke="#466A35" strokeWidth="2" strokeLinecap="round" />
          <circle cx="155" cy="81" r="3.5" fill="#FFA590" fillOpacity="0.6" />

          <circle cx="235" cy="105" r="13" fill="url(#tomato-grad)" />
          <circle cx="231" cy="102" r="2.5" fill="#FFA590" fillOpacity="0.6" />

          {/* Pusa Chili Pod */}
          <path
            d="M238 45 Q260 55 262 78 Q263 88 255 92 Q250 92 248 84 Q244 65 238 45 Z"
            fill="url(#chili-grad)"
          />
          <path d="M238 45 L236 40" stroke="#466A35" strokeWidth="2.5" strokeLinecap="round" />

          {/* Plant Marker Stake */}
          <path d="M145 130 L145 165" stroke="#E4EEDD" strokeWidth="3" strokeLinecap="round" />
          <rect x="135" y="112" width="22" height="18" rx="3" fill="#E4EEDD" />
          <path d="M138 120 H153 M138 124 H148" stroke="#1B4A35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Placeholder Art Label */}
        <span className="absolute bottom-3 right-3 text-[10px] tracking-wide font-medium bg-[#153F2D]/85 text-[#F0C4A0] px-2.5 py-1 rounded-full border border-[#8FAE7E]/30 backdrop-blur-xs select-none">
          Placeholder art
        </span>
      </div>
    );
  }

  // Windowsill Culinary Herb Kit
  return (
    <div className={`relative w-full h-[210px] overflow-hidden rounded-t-[20px] bg-[#1A4533] flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="bg-window" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B4734" />
            <stop offset="100%" stopColor="#123525" />
          </linearGradient>
          <linearGradient id="pot-herb-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C47E5B" />
            <stop offset="100%" stopColor="#9C5232" />
          </linearGradient>
          <linearGradient id="pot-herb-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBBFA8" />
            <stop offset="100%" stopColor="#9E927C" />
          </linearGradient>
        </defs>

        {/* Ambient Kitchen Window Glow */}
        <rect width="400" height="210" fill="url(#bg-window)" />
        <circle cx="200" cy="80" r="100" fill="#F0C4A0" fillOpacity="0.07" />

        {/* Windowsill Sill Plinth */}
        <rect x="30" y="165" width="340" height="12" rx="3" fill="#314B3B" />
        <rect x="20" y="177" width="360" height="8" rx="2" fill="#203428" />

        {/* Left Pot: Genovese Basil */}
        <path d="M85 130 L93 165 H147 L155 130 Z" fill="url(#pot-herb-1)" />
        <ellipse cx="120" cy="130" rx="35" ry="6" fill="#2A1E17" />
        {/* Basil Leaves */}
        <path d="M120 128 Q120 95 110 75" stroke="#5E8A4A" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="102" cy="80" rx="14" ry="10" transform="rotate(-25 102 80)" fill="#7DA965" />
        <ellipse cx="132" cy="92" rx="15" ry="11" transform="rotate(20 132 92)" fill="#8FB975" />
        <ellipse cx="114" cy="62" rx="12" ry="9" transform="rotate(-5 114 62)" fill="#9ECB83" />

        {/* Center Pot: Italian Oregano */}
        <path d="M175 125 L182 165 H228 L235 125 Z" fill="url(#pot-herb-2)" />
        <ellipse cx="205" cy="125" rx="30" ry="5.5" fill="#222B24" />
        {/* Oregano Mounded Small Leaves */}
        <path d="M205 123 Q200 95 195 72" stroke="#5E8A4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="192" cy="74" r="7" fill="#8FAE7E" />
        <circle cx="210" cy="82" r="8" fill="#7D9565" />
        <circle cx="185" cy="95" r="7.5" fill="#6B8855" />
        <circle cx="218" cy="100" r="8.5" fill="#8FAE7E" />
        <circle cx="202" cy="62" r="6" fill="#A4C294" />

        {/* Right Pot: Fresh Coriander */}
        <path d="M255 130 L263 165 H317 L325 130 Z" fill="url(#pot-herb-1)" />
        <ellipse cx="290" cy="130" rx="35" ry="6" fill="#2A1E17" />
        {/* Coriander Delicate Fronds */}
        <path d="M290 128 Q295 90 282 68" stroke="#5E8A4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M290 110 Q315 88 322 72" stroke="#5E8A4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M280 66 C272 60 270 72 278 76 C285 78 288 72 280 66 Z" fill="#8FAE7E" />
        <path d="M320 70 C330 65 332 78 324 82 C317 84 314 76 320 70 Z" fill="#7D9565" />
        <path d="M296 52 C290 46 284 56 292 60 C298 62 302 56 296 52 Z" fill="#9ECB83" />

        {/* Plant Marker */}
        <path d="M230 115 L230 145" stroke="#E4EEDD" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="222" y="100" width="18" height="15" rx="2.5" fill="#E4EEDD" />
        <path d="M225 107 H237" stroke="#1B4A35" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Placeholder Art Label */}
      <span className="absolute bottom-3 right-3 text-[10px] tracking-wide font-medium bg-[#153F2D]/85 text-[#F0C4A0] px-2.5 py-1 rounded-full border border-[#8FAE7E]/30 backdrop-blur-xs select-none">
        Placeholder art
      </span>
    </div>
  );
}
