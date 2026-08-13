import React from 'react';

const ImpactSection = () => {
  const metrics = [
    {
      icon: '🎯',
      gradient: 'from-emerald-500/15 to-teal-500/25 border-emerald-300/50',
      stat: '95%',
      label: 'AI Detection Accuracy',
    },
    {
      icon: '⚡',
      gradient: 'from-amber-500/15 to-orange-500/25 border-amber-300/50',
      stat: '60%',
      label: 'Faster Resolution Speed',
    },
    {
      icon: '🤖',
      gradient: 'from-blue-500/15 to-indigo-500/25 border-blue-300/50',
      stat: '40%',
      label: 'Reduction in Manual Work',
    },
    {
      icon: '💬',
      gradient: 'from-emerald-500/15 to-green-500/25 border-emerald-300/50',
      stat: '24/7',
      label: 'Instant AI Support',
    },
    {
      icon: '👥',
      gradient: 'from-purple-500/15 to-violet-500/25 border-purple-300/50',
      stat: '3+',
      label: 'Connected User Roles',
    },
    {
      icon: '🔐',
      gradient: 'from-cyan-500/15 to-blue-500/25 border-cyan-300/50',
      stat: '100%',
      label: 'Data Secure & Encrypted',
    },
  ];

  return (
    <section id="impact" className="py-16 px-4 md:px-10 relative overflow-hidden">
      {/* Background Image (background_3.png) */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-90 pointer-events-none"
        style={{ backgroundImage: `url('/background_3.png')` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-white/80 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="max-w-[1340px] mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12 flex items-center justify-center gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#101828] tracking-tight">
            Making an Impact Every Day
          </h2>
        </div>

        {/* 6 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-xs border border-secondary-container rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-xs hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Larger Icon Container */}
              <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${item.gradient} border flex items-center justify-center text-3xl sm:text-4xl mb-4 shadow-2xs group-hover:scale-110 transition-transform duration-300 select-none`}>
                <span className="drop-shadow-xs">{item.icon}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-none mb-1.5">
                {item.stat}
              </div>
              <div className="text-xs font-bold text-gray-600 leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactSection;
