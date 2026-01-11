import React, { useEffect, useRef, useState } from 'react';

export const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fade-in effect on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative w-full bg-gray-900 overflow-hidden z-0 mt-16 md:mt-20">
      <video autoPlay muted loop playsInline className="w-full h-auto block align-middle">
        <source src="https://i.imgur.com/Bybz7aH.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

      <div 
        ref={contentRef}
        className={`absolute inset-0 flex items-end justify-center pb-6 md:pb-16 z-10 px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <a href="#leite" className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-white transition shadow-xl transform hover:-translate-y-1 text-center w-3/4 mx-auto sm:w-auto">
            Ver Sabores
          </a>
        </div>
      </div>
    </header>
  );
};