import React from 'react';

const AtmosphericBackground: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Main radial gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(60, 60, 60, 0.4) 0%, rgba(0, 0, 0, 1) 60%)'
        }}
      />
      
      {/* Secondary gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 10%, rgba(80, 80, 80, 0.3) 0%, transparent 50%)'
        }}
      />
      
      {/* Top vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8) 100%)'
        }}
      />
      
      {/* Sparkle accent in corner */}
      <div className="absolute bottom-8 right-8">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 0L21.5 18.5L40 20L21.5 21.5L20 40L18.5 21.5L0 20L18.5 18.5L20 0Z"
            fill="white"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Content area - you can place your content here */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-center">
          {/* Your content goes here */}
        </div>
      </div>
    </div>
  );
};

export default AtmosphericBackground;