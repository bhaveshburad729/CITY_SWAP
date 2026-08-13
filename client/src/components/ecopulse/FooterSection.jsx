import React from 'react';

const FooterSection = () => {
  return (
    <footer id="contact" className="bg-[#003816] text-white pt-14 pb-8 px-4 md:px-10 relative overflow-hidden">
      
      {/* Background Image (background_3.png) Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-35 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('/background_3.png')` }}
      ></div>
      
      <div className="max-w-[1340px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-emerald-800/60 items-center">
          
          {/* Left Column: Earth Graphic + Slogan + Socials */}
          <div className="md:col-span-4 flex flex-col sm:flex-row items-center gap-4">
            
            {/* Moderately Larger Earth Image Asset */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 shrink-0 relative -my-2">
              <img
                src="/earth.png"
                alt="EcoPulse AI Green Earth"
                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(46,125,50,0.55)] hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Slogan & Social Media Icons */}
            <div className="space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  Small Actions Today,
                </h3>
                <h3 className="text-base sm:text-lg font-black text-emerald-300 leading-snug">
                  Cleaner Tomorrow
                </h3>
              </div>

              {/* 5 Social Media Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <a href="#facebook" className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity">
                  f
                </a>
                <a href="#twitter" className="w-8 h-8 rounded-xl bg-[#1DA1F2] flex items-center justify-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity">
                  t
                </a>
                <a href="#linkedin" className="w-8 h-8 rounded-xl bg-[#0A66C2] flex items-center justify-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity">
                  in
                </a>
                <a href="#instagram" className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity">
                  ig
                </a>
                <a href="#youtube" className="w-8 h-8 rounded-xl bg-[#FF0000] flex items-center justify-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity">
                  ▶
                </a>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold tracking-wider text-white uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-emerald-100/80">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#ai-agents" className="hover:text-white transition-colors">AI Agents</a></li>
              <li><a href="#dashboards" className="hover:text-white transition-colors">Dashboards</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold tracking-wider text-white uppercase">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold text-emerald-100/80">
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#support" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold tracking-wider text-white uppercase">Contact Us</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-emerald-100/80">
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>hello@ecopulse.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp QR Box */}
          <div className="md:col-span-2 flex justify-start md:justify-end">
            <div className="bg-white text-gray-900 rounded-2xl p-4 shadow-lg w-full max-w-[200px] relative">
              <div className="text-xs font-black text-gray-900 mb-2 leading-tight">
                Scan to Chat <br /> on WhatsApp
              </div>
              
              {/* QR Code */}
              <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200 aspect-square flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-white rounded-md">
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-primary rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-white"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-primary rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-white"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-primary rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                  <div className="bg-gray-900 rounded-2xs"></div>
                </div>
              </div>

              {/* Recycle Icon Badge */}
              <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-md text-base">
                ♻️
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 text-center text-xs font-semibold text-emerald-200/70">
          © 2026 EcoPulse AI. All rights reserved.
        </div>
      </div>

      {/* Floating WhatsApp AI Chatbot Widget */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all cursor-pointer">
        <div className="relative">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-extrabold leading-tight">WhatsApp AI Chatbot</div>
          <div className="text-[9px] font-medium opacity-90">Click to start chatting</div>
        </div>
      </div>

    </footer>
  );
};

export default FooterSection;
