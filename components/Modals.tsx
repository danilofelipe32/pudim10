import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, ShoppingBasket, ShoppingCart, MessageCircle, Trash2, Copy, CheckCircle, Loader2, QrCode, Truck, Store } from 'lucide-react';
import { Product, CartItem, PaymentMethod, CheckoutData, PixResponse } from '../types';

/* --- UTILS --- */
const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* --- PRODUCT MODAL --- */
interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  React.useEffect(() => {
    if (isOpen) setQty(1);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAdjustQty = (delta: number) => {
    if (qty + delta >= 1) setQty(qty + delta);
  };

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row h-auto max-h-[90vh] z-10 animate-scale-up duration-300">
        
        <button onClick={onClose} className="absolute top-3 right-3 z-20 bg-black/20 hover:bg-black/30 p-2 rounded-full transition text-white backdrop-blur-sm transform hover:rotate-90 duration-300">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="w-full md:w-1/2 bg-gray-100 relative h-48 md:h-auto flex-shrink-0">
          <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white overflow-y-auto">
          <span className="text-amber-600 font-bold uppercase text-xs tracking-wider mb-2">{product.category}</span>
          <h3 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{product.title}</h3>
          <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">{product.desc}</p>

          <div className="flex items-center justify-between md:justify-start gap-4 mb-6 md:mb-8 mt-auto md:mt-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
              <button onClick={() => handleAdjustQty(-1)} className="p-2 text-gray-500 hover:text-amber-600 transition-colors active:scale-75 transform">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 font-bold text-gray-900 min-w-[1.5rem] text-center">{qty}</span>
              <button onClick={() => handleAdjustQty(1)} className="p-2 text-gray-500 hover:text-amber-600 transition-colors active:scale-75 transform">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg transform transition-all duration-200 active:scale-95 hover:shadow-xl flex justify-center gap-2 items-center text-base">
              <ShoppingBag className="w-5 h-5" /> Adicionar ao Carrinho
            </button>
            <button onClick={onClose} className="w-full text-gray-500 hover:text-gray-900 py-2 font-medium text-sm transition-colors">
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- PIX MODAL --- */
interface PixModalProps {
  isOpen: boolean;
  pixData: PixResponse | null;
  onClose: () => void;
  onSuccess: () => void;
  onCheckStatus: (id: number) => Promise<string>;
}

export const PixModal: React.FC<PixModalProps> = ({ isOpen, pixData, onClose, onSuccess, onCheckStatus }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved'>('pending');

  // Polling de status do pagamento real ou mock
  useEffect(() => {
    if (isOpen && pixData) {
      // Reset status se reabrir
      if (status !== 'approved') setStatus('pending');

      const intervalId = setInterval(async () => {
        try {
           const currentStatus = await onCheckStatus(pixData.id);
           if (currentStatus === 'approved') {
               setStatus('approved');
               clearInterval(intervalId);
               setTimeout(() => {
                   onSuccess();
               }, 3000); // Fecha o modal 3s após aprovado
           }
        } catch (error) {
           console.error("Erro ao verificar status", error);
        }
      }, 2000); // Verifica a cada 2 segundos

      return () => clearInterval(intervalId);
    }
  }, [isOpen, pixData, onCheckStatus, onSuccess]);

  if (!isOpen || !pixData) return null;

  const handleCopy = () => {
    const code = pixData.point_of_interaction.transaction_data.qr_code;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-scale-up">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 text-center relative">
           <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
             <X className="w-5 h-5" />
           </button>
           <h3 className="text-white font-bold text-lg flex items-center justify-center gap-2">
             <QrCode className="text-amber-400" /> Pagamento via PIX
           </h3>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          
          {status === 'pending' ? (
            <>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Escaneie o QR Code abaixo ou copie o código para pagar.
                </p>

                {/* QR Code Image */}
                <div className="w-48 h-48 bg-gray-100 border-2 border-amber-500 rounded-lg mb-6 p-2 flex items-center justify-center shadow-inner">
                    <img 
                      src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`} 
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain"
                    />
                </div>

                {/* Copy Paste */}
                <div className="w-full mb-8 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pix Copia e Cola</label>
                    <div className="flex gap-2 relative z-10">
                        <input 
                            readOnly 
                            value={pixData.point_of_interaction.transaction_data.qr_code}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none truncate"
                        />
                        <button 
                            onClick={handleCopy}
                            className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white shadow-green-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            title="Copiar código"
                        >
                            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>

                     {/* Feedback Message */}
                    <div className={`absolute left-0 right-0 -bottom-6 text-center transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <span className="text-green-600 text-xs font-bold inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Código copiado!
                        </span>
                    </div>
                </div>

                {/* Status Pending */}
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-bold">Aguardando confirmação...</span>
                </div>
            </>
          ) : (
            <div className="py-10 flex flex-col items-center text-center animate-scale-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h2>
                <p className="text-gray-600">Seu pedido está sendo preparado com carinho.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
            Segurança Mercado Pago
        </div>
      </div>
    </div>
  );
};

/* --- CART MODAL --- */
interface CartModalProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: (data: CheckoutData) => void;
  isProcessing: boolean;
}

const DELIVERY_COST = 10.00;

export const CartModal: React.FC<CartModalProps> = ({ isOpen, cart, onClose, onRemove, onCheckout, isProcessing }) => {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    email: '',
    cpf: '',
    address: '',
    payment: '' as PaymentMethod,
    deliveryMethod: 'delivery'
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryPrice = formData.deliveryMethod === 'delivery' ? DELIVERY_COST : 0;
  const total = subtotal + deliveryPrice;

  const handleCheckout = () => {
    if (!formData.name || (!formData.address && formData.deliveryMethod === 'delivery') || !formData.payment || !formData.email || !formData.cpf) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const finalData = { ...formData };
    if (finalData.deliveryMethod === 'pickup') {
      finalData.address = 'Retirada no Local';
    }
    onCheckout(finalData);
  };

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose}></div>
      
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        <div className="p-4 md:p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-amber-500 w-5 h-5" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-gray-900">Seu Pedido</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2 transition-transform hover:rotate-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 animate-fade-in-up">
              <ShoppingBasket className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item.id} 
                className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img src={item.img} alt={item.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-amber-600 font-bold text-sm">{formatCurrency(item.price)} x {item.qty}</span>
                    <span className="text-gray-500 text-xs font-bold">Sub: {formatCurrency(item.price * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 p-2 transition-transform hover:scale-110">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 md:p-6 border-t bg-gray-50 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-shadow" 
                  placeholder="Seu nome" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">E-mail *</label>
                    <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-shadow" 
                    placeholder="email@exemplo.com" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CPF *</label>
                    <input 
                    type="text" 
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-shadow" 
                    placeholder="000.000.000-00" 
                    />
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Método de Entrega *</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleChange('deliveryMethod', 'delivery')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 active:scale-95 ${formData.deliveryMethod === 'delivery' ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Truck className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Entrega</span>
                        <span className="text-[10px] text-gray-500">{formatCurrency(DELIVERY_COST)}</span>
                    </button>
                    <button 
                        onClick={() => handleChange('deliveryMethod', 'pickup')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 active:scale-95 ${formData.deliveryMethod === 'pickup' ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Store className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Retirada</span>
                        <span className="text-[10px] text-green-600 font-bold">Grátis</span>
                    </button>
                </div>
              </div>

              {formData.deliveryMethod === 'delivery' && (
                <div className="animate-fade-in-up">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Endereço de Entrega *</label>
                    <textarea 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm transition-shadow" 
                    placeholder="Rua, Número, Bairro..." 
                    />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pagamento *</label>
                <select 
                  value={formData.payment}
                  onChange={(e) => handleChange('payment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white transition-shadow"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="PIX">PIX (Aprovação Imediata)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 mb-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Entrega</span>
                    <span className={deliveryPrice === 0 ? 'text-green-600 font-bold' : ''}>{deliveryPrice === 0 ? 'Grátis' : formatCurrency(deliveryPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-xl md:text-2xl text-amber-600">{formatCurrency(total)}</span>
                </div>
            </div>
            
            <button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg transform transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 text-base hover:shadow-xl"
            >
              {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : formData.payment === 'PIX' ? (
                  <><QrCode className="w-5 h-5" /> Gerar PIX e Finalizar</>
              ) : (
                  <><MessageCircle className="w-5 h-5" /> Enviar Pedido no WhatsApp</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};