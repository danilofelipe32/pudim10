import React, { useState } from 'react';
import { ChefHat, ShoppingCart, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm h-16 md:h-20 flex items-center">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <ChefHat className="text-amber-500 w-6 h-6 md:w-8 md:h-8" />
            <span className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-wide">
              Pudim<span className="text-amber-500">Perfeito</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#leite" className="text-gray-600 hover:text-amber-500 font-medium transition">Clássico</a>
            <a href="#morango" className="text-gray-600 hover:text-red-500 font-medium transition">Morango</a>
            <a href="#chocolate" className="text-gray-600 hover:text-amber-900 font-medium transition">Chocolate</a>

            <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-amber-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full transition-opacity ${cartCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {cartCount}
              </span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={onOpenCart} className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              <span className={`absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full transition-opacity ${cartCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {cartCount}
              </span>
            </button>
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none p-1">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t p-4 shadow-lg flex flex-col gap-2 md:hidden animate-in slide-in-from-top-2">
          <a href="#leite" onClick={toggleMenu} className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Clássico</a>
          <a href="#morango" onClick={toggleMenu} className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Morango</a>
          <a href="#chocolate" onClick={toggleMenu} className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Chocolate</a>
        </div>
      )}
    </nav>
  );
};