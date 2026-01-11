import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { RevealOnScroll } from './RevealOnScroll';

interface ProductSectionProps {
  product: Product;
  index: number;
  onOpenDetails: (product: Product) => void;
}

const Drip: React.FC<{ color: string }> = ({ color }) => (
  <div className="drip-divider">
    <svg className="w-full h-16 md:h-28 lg:h-32" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    </svg>
  </div>
);

export const ProductSection: React.FC<ProductSectionProps> = ({ product, index, onOpenDetails }) => {
  const isEven = index % 2 === 0;

  // Ajuste específico para imagens que precisam ser abaixadas (morango e chocolate)
  const shouldLowerImage = product.id === 'morango' || product.id === 'chocolate';

  return (
    <section 
      id={product.id} 
      className={`py-16 md:py-24 ${product.theme.background} ${product.theme.textColor} relative overflow-hidden`}
      style={{ zIndex: 40 - index }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 lg:gap-20`}>
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 cursor-pointer group perspective-1000" onClick={() => onOpenDetails(product)}>
            <RevealOnScroll>
              <div className="relative px-4 md:px-0">
                {/* Blur Background */}
                <div className={`absolute -inset-4 rounded-full blur-2xl opacity-70 transition duration-500 group-hover:opacity-100 ${product.theme.blurColor}`}></div>
                
                {/* Neon Container */}
                <div className={`relative rounded-3xl overflow-hidden p-[4px] animate-float shadow-2xl bg-white/5 transition-transform duration-500 ${shouldLowerImage ? 'mt-8' : ''}`}>
                  {/* Spinning Border */}
                  <div 
                    className="absolute inset-[-150%] animate-spin-slow opacity-80"
                    style={{ background: product.theme.neonGradient }}
                  ></div>
                  
                  {/* Image Container with Zoom */}
                  <div className="relative rounded-[20px] overflow-hidden w-full h-full aspect-square bg-gray-100">
                    <img 
                      src={product.img} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Details Button Overlay */}
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-lg group-hover:scale-105 transition-all duration-300 z-10 flex items-center gap-2 group-hover:bg-white">
                    <Plus className="text-amber-500 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-90" />
                    <span className="font-bold text-xs md:text-base text-gray-800">Detalhes</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <RevealOnScroll>
              <span className={`${product.theme.accentColor} font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block animate-fade-in-up`}>
                {product.category}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                {product.title}
              </h2>
              <p className={`text-base md:text-lg mb-6 leading-relaxed ${product.theme.textColor === 'text-white' ? 'text-gray-100' : 'text-gray-600'}`}>
                {product.desc}
              </p>
              
              <button 
                onClick={() => onOpenDetails(product)}
                className={`group flex items-center justify-center md:justify-start gap-2 font-bold text-lg transition-all duration-300 w-full md:w-auto hover:opacity-90 transform active:scale-95 ${product.theme.accentColor}`}
              >
                 Peça o seu <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </RevealOnScroll>
          </div>

        </div>
      </div>
      
      {/* Optional Drip Divider */}
      {product.theme.dripOverNext && product.theme.dripColor && (
        <Drip color={product.theme.dripColor} />
      )}
    </section>
  );
};