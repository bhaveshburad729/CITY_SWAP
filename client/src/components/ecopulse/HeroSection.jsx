import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 px-4 md:px-10 border-b border-gray-100 min-h-[620px]">
      
      {/* Seamless Horizontal Background (background_1.png) */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/background_1.png')` }}
      ></div>

      {/* Soft Gradient Mask for Left-to-Right Seamless Contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>

      <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Headline & CTAs */}
        <div className="lg:col-span-6 space-y-6 pt-2">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e2f4e8]/90 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-[#005C2B] tracking-wide border border-[#c4ebcf]">
            <span>AI-Powered</span>
            <span className="text-[#005C2B] font-bold">•</span>
            <span>Smart</span>
            <span className="text-[#005C2B] font-bold">•</span>
            <span>Sustainable</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-black text-[#101828] leading-[1.12] tracking-tight">
            Building Cleaner, <br />
            Greener & Smarter Cities <br />
            with AI
          </h1>

          {/* Subtitle */}
          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed max-w-lg font-semibold">
            EcoPulse AI connects Citizens, Drivers, Collectors and Municipalities on one intelligent platform to make waste management efficient, transparent and sustainable.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* WhatsApp CTA */}
            <button className="flex items-center gap-2.5 bg-[#005C2B] hover:bg-[#004821] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2z"/>
              </svg>
              Chat with AI on WhatsApp
            </button>

            {/* Request Demo */}
            <button className="flex items-center gap-2 bg-white/95 backdrop-blur-xs hover:bg-gray-50 text-gray-800 border border-gray-300 px-5 py-3 rounded-xl font-semibold text-sm shadow-2xs transition-all cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-[#005C2B] flex items-center justify-center text-white text-[9px] font-bold">
                ▶
              </div>
              Request Demo
            </button>

            {/* Watch Video */}
            <button className="flex items-center gap-2 bg-white/95 backdrop-blur-xs hover:bg-gray-50 text-gray-800 border border-gray-300 px-5 py-3 rounded-xl font-semibold text-sm shadow-2xs transition-all cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-[#005C2B] flex items-center justify-center text-white text-[9px] font-bold">
                ▶
              </div>
              Watch Video
            </button>
          </div>

          {/* 4 Feature Points Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e2f4e8] flex items-center justify-center text-[#005C2B]">
                📱
              </div>
              <span>No App Required</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e2f4e8] flex items-center justify-center text-[#005C2B]">
                🛡️
              </div>
              <span>AI Verified</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e2f4e8] flex items-center justify-center text-[#005C2B]">
                📍
              </div>
              <span>Real-time Tracking</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e2f4e8] flex items-center justify-center text-[#005C2B]">
                🌐
              </div>
              <span>Multi-language Support</span>
            </div>
          </div>

        </div>

        {/* Right Column: Seamlessly Blended Hero Visual (No Box Lines or Image Edges) */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          
          {/* Floating Circle Badge */}
          <div className="absolute -top-3 right-0 z-30 bg-white/95 backdrop-blur-xs border border-gray-200 shadow-md rounded-full w-32 h-32 p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-gray-500 font-medium">Together for</span>
            <span className="text-[12px] font-extrabold text-[#005C2B] leading-tight">
              a Cleaner <br /> Tomorrow
            </span>
          </div>

          {/* Seamless Illustration Image - No Outer Border/Card Box */}
          <div className="relative w-full max-w-[640px] flex items-center justify-center">
            <img
              src="/complete-right.png"
              alt="EcoPulse AI Smart Waste Truck and Smart City"
              className="w-full h-auto object-contain rounded-2xl drop-shadow-xl transition-all duration-300"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0.85) 95%, rgba(0,0,0,0) 100%)',
                maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0.85) 95%, rgba(0,0,0,0) 100%)'
              }}
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
