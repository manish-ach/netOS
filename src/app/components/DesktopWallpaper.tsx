"use client";

import { memo } from "react";

export const DesktopWallpaper = memo(() => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 50%, transparent 50%, transparent 75%, rgba(255, 255, 255, 0.02) 75%),
              linear-gradient(-45deg, transparent 25%, rgba(255, 255, 255, 0.01) 25%, rgba(255, 255, 255, 0.01) 50%, transparent 50%, transparent 75%, rgba(255, 255, 255, 0.01) 75%)
            `,
            backgroundSize: '400px 400px, 400px 400px, 20px 20px, 20px 20px',
            backgroundPosition: '0 0, 0 0, 0 0, 10px 10px'
          }}
        />
      </div>
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
});

DesktopWallpaper.displayName = 'DesktopWallpaper';
