import React from 'react';
import { ChefHat } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-8 md:py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
        <div className="flex items-center gap-2">
          <ChefHat className="text-amber-500 w-6 h-6" />
          <span className="font-serif text-xl font-bold text-white">PudimPerfeito</span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Pudim Perfeito.<br className="md:hidden" /> WhatsApp: (84) 99978-0963
        </div>
      </div>
    </footer>
  );
};