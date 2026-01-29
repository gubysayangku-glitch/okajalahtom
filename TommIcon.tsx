
import React from 'react';

interface TommIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'idle' | 'loading' | 'voice' | 'thinking';
  isPremium?: boolean;
  className?: string;
  onClick?: () => void;
}

const TommIcon: React.FC<TommIconProps> = ({ 
  size = 'md', 
  mode = 'idle', 
  isPremium = false,
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const ringSizeClasses = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-2'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-center transition-all duration-500 cursor-pointer group ${sizeClasses[size]} ${className}`}
    >
      {/* Outer Glow / Pulse Effect */}
      <div className={`absolute inset-0 rounded-[30%] blur-xl transition-all duration-700 opacity-40 group-hover:opacity-80 ${
        isPremium ? 'bg-amber-400' : 'bg-indigo-500'
      } ${mode === 'idle' ? 'animate-pulse' : ''} ${mode === 'loading' ? 'animate-ping' : ''}`} />

      {/* Main Container */}
      <div className={`relative w-full h-full rounded-[30%] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-active:scale-90 ${
        isPremium 
          ? 'bg-gradient-to-br from-amber-200 via-amber-500 to-yellow-700' 
          : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
      } ${ringSizeClasses[size]}`}>
        
        {/* Inner Glass Layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Shimmer / Sweep Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />

        {/* The Symbol (T / Orb) */}
        <div className="relative w-full h-full flex items-center justify-center text-white">
          {mode === 'voice' ? (
            <div className="flex items-center gap-1">
              <div className="w-1 h-4 bg-white rounded-full animate-voice-bar-1" />
              <div className="w-1 h-6 bg-white rounded-full animate-voice-bar-2" />
              <div className="w-1 h-3 bg-white rounded-full animate-voice-bar-3" />
            </div>
          ) : (
            <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 drop-shadow-lg">
              {/* Futuristic T Logo */}
              <path 
                d="M25 25 H75 V40 H58 V80 H42 V40 H25 V25Z" 
                fill="currentColor" 
                className={`${mode === 'loading' ? 'animate-pulse' : ''}`}
              />
              {/* AI Dot / Focus Point */}
              <circle cx="50" cy="18" r="6" fill={isPremium ? '#fff' : '#22d3ee'} className="animate-bounce" style={{ animationDuration: '2s' }} />
            </svg>
          )}
        </div>

        {/* Premium Border Sparkle */}
        {isPremium && (
          <div className="absolute inset-0 border-2 border-white/40 rounded-[30%] pointer-events-none" />
        )}
      </div>

      {/* Loading Ring */}
      {mode === 'loading' && (
        <div className="absolute inset-[-15%] border-2 border-t-indigo-400 border-r-transparent border-b-purple-400 border-l-transparent rounded-full animate-spin" />
      )}

      {/* Thinking Particles (Visual Only) */}
      {mode === 'thinking' && (
        <>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-particle-1" />
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-particle-2" />
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-blue-300 rounded-full animate-float-particle-3" />
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes voice-bar-1 { 0%, 100% { height: 8px; } 50% { height: 20px; } }
        @keyframes voice-bar-2 { 0%, 100% { height: 16px; } 50% { height: 32px; } }
        @keyframes voice-bar-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        .animate-voice-bar-1 { animation: voice-bar-1 0.6s infinite ease-in-out; }
        .animate-voice-bar-2 { animation: voice-bar-2 0.8s infinite ease-in-out; }
        .animate-voice-bar-3 { animation: voice-bar-3 0.7s infinite ease-in-out; }
        
        @keyframes float-particle-1 { 0% { transform: translate(0,0) scale(1); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(20px, -30px) scale(0); opacity: 0; } }
        @keyframes float-particle-2 { 0% { transform: translate(0,0) scale(1); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(-25px, 20px) scale(0); opacity: 0; } }
        @keyframes float-particle-3 { 0% { transform: translate(0,0) scale(1); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(30px, 10px) scale(0); opacity: 0; } }
        .animate-float-particle-1 { animation: float-particle-1 2s infinite ease-out; }
        .animate-float-particle-2 { animation: float-particle-2 2.5s infinite ease-out; animation-delay: 0.5s; }
        .animate-float-particle-3 { animation: float-particle-3 1.8s infinite ease-out; animation-delay: 1s; }
        
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default TommIcon;
