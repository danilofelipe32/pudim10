import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { ProductModal, CartModal, PixModal } from './components/Modals';
import { PRODUCTS } from './data';
import { Product, CartItem, PaymentMethod, CheckoutData, PixResponse } from './types';

// ==========================================
// CONFIGURAÇÃO
// Mude para true quando rodar o servidor Java
const USE_REAL_BACKEND = false; 
const BACKEND_URL = "http://localhost:8080/api/pix";
const DELIVERY_COST = 10.00;
// ==========================================

// Armazena timestamp dos pagamentos mockados para simular delay na aprovação
const mockPayments = new Map<number, number>();

// Função auxiliar para criar o PIX (Real ou Mock)
const createPixPayment = async (amount: number, user: CheckoutData): Promise<PixResponse> => {
  
  // Sanitização de dados para o padrão Mercado Pago
  const cleanCpf = user.cpf.replace(/\D/g, '');
  const [firstName, ...lastNameParts] = user.name.trim().split(' ');
  const lastName = lastNameParts.join(' ') || 'Cliente';

  // 1. Integração Real com o Backend Java
  if (USE_REAL_BACKEND) {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          cpf: cleanCpf,
          address: user.address,
          amount: amount
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor de pagamento');
      }

      const data = await response.json();
      return data as PixResponse;
    } catch (error) {
      console.error("Erro na integração real:", error);
      throw error;
    }
  }

  // 2. Mock para Demonstração (Caso o servidor não esteja rodando)
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = Math.floor(Math.random() * 1000000000);
      mockPayments.set(id, Date.now()); // Registra hora de criação para o mock

      resolve({
        id: id,
        status: "pending",
        status_detail: "pending_waiting_transfer",
        point_of_interaction: {
          transaction_data: {
            // QR Code Base64 válido extraído da documentação do Mercado Pago
            qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAEl0lEQVR4Xu2d0XLEIAxD2///6O5cp50WElAl2cl96Mx4ZCE5lg35+fk5/Hh9/n4D/15fX4/38/n8+P79+4/w6/v+Ry9/r7/d7/f4fD6P1+v1eD+fz+P7+/sI6/f9j17+Xn+73+/x+Xw++/1++P79/Y/w6/v+Ry9/r7/d7/f4fD6f/X4/fP/+/kf49X3/o5e/19/u93t8Pp/Pfr8fvn///iP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n8/nv/r9/r+Uf/78+fH19fUR1u/7H738vf52v9/j8/l89vv98P37+x/h1/f9j17+Xn+73+/x+Xw++/1++P79/Y/w6/v+Ry9/r7/d7/f4fD6f/X4/fP/+/kf49X3/o5e/19/u93t8Pp/Pfr8fvn///iP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n8/nZ/r9/r/I/f/9/T3C+n3/o5e/19/u93t8Pp/Pfr8fvn///iP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n89nv98P379//yP8+r7/0cvf62/3+z0+n8/nZ/r9fr/H5/P5/Ae///wD/wX/s/yL444AAAAASUVORK5CYII=",
            qr_code: `00020126600014br.gov.bcb.pix0117pudim@pudimperfeito.com0217Pudim Perfeito5204000053039865405${amount.toFixed(2)}5802BR5913${user.name.substring(0, 20)}6008Brasilia62070503***6304E2CA`,
            ticket_url: "https://www.mercadopago.com.br"
          }
        }
      });
    }, 1500); 
  });
};

// Nova função para verificar status do PIX
const checkPixStatus = async (id: number): Promise<string> => {
  if (USE_REAL_BACKEND) {
    try {
      // Faz requisição ao backend para verificar status
      const response = await fetch(`${BACKEND_URL}/${id}`);
      
      if (!response.ok) {
        return "pending"; 
      }
      
      const data = await response.json();
      return data.status || "pending"; 
    } catch (e) {
      console.error("Erro ao verificar status:", e);
      return "pending";
    }
  }

  // Mock: Aprova após 5 segundos da criação
  return new Promise((resolve) => {
    const startTime = mockPayments.get(id);
    if (!startTime) {
       resolve("pending");
       return;
    }
    
    // Simula tempo de processamento do pagamento
    if (Date.now() - startTime > 5000) {
        resolve("approved");
    } else {
        resolve("pending");
    }
  });
};

export function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // PIX States
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  /* --- Logic --- */
  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
    setTimeout(() => setIsCartOpen(true), 300);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePixSuccess = () => {
    setIsPixModalOpen(false);
    setCart([]); // Limpa o carrinho
    setIsCartOpen(false);
    alert("Obrigado! Seu pagamento foi confirmado e estamos preparando seu pedido.");
  };

  const handleCheckout = async (data: CheckoutData) => {
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const deliveryPrice = data.deliveryMethod === 'delivery' ? DELIVERY_COST : 0;
    const total = subtotal + deliveryPrice;

    if (data.payment === 'PIX') {
        setIsProcessingCheckout(true);
        
        try {
            const response = await createPixPayment(total, data);
            setPixData(response);
            setIsPixModalOpen(true);
            setIsCartOpen(false); // Fecha o carrinho para focar no Pix
        } catch (error) {
            alert("Erro ao gerar PIX. Verifique se o servidor backend está rodando ou tente novamente.");
        } finally {
            setIsProcessingCheckout(false);
        }

    } else {
        // Fluxo original via WhatsApp
        const phone = "5584999780963";
        
        let message = "*NOVO PEDIDO - PUDIM PERFEITO*\n";
        message += "--------------------------------\n";
        message += `👤 *Cliente:* ${data.name}\n`;
        message += `📧 *Email:* ${data.email}\n`;
        message += `🆔 *CPF:* ${data.cpf}\n`;
        message += `📦 *Entrega:* ${data.deliveryMethod === 'delivery' ? 'Entrega (R$ ' + DELIVERY_COST.toFixed(2).replace('.', ',') + ')' : 'Retirada (Grátis)'}\n`;
        if (data.deliveryMethod === 'delivery') {
            message += `📍 *Endereço:* ${data.address}\n`;
        } else {
            message += `📍 *Local:* Retirada na Loja\n`;
        }
        message += `💳 *Pagamento:* ${data.payment}\n`;
        message += "--------------------------------\n\n";
        message += "*ITENS DO PEDIDO:*\n";
        
        cart.forEach(item => {
        message += `▪ ${item.qty}x ${item.title} - ${(item.price * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
        });

        message += `\nSubtotal: ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        message += `\nTaxa de Entrega: ${deliveryPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        message += `\n💰 *Valor Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`;
        message += `\n\nAguardo confirmação do pedido!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="w-full relative">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <Hero />
      
      <main>
        {PRODUCTS.map((product, index) => (
          <ProductSection 
            key={product.id} 
            product={product} 
            index={index} 
            onOpenDetails={handleOpenDetails} 
          />
        ))}
      </main>

      <Footer />

      <ProductModal 
        isOpen={isProductModalOpen} 
        product={selectedProduct} 
        onClose={() => setIsProductModalOpen(false)} 
        onAddToCart={handleAddToCart}
      />

      <CartModal 
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        isProcessing={isProcessingCheckout}
      />

      <PixModal 
        isOpen={isPixModalOpen}
        pixData={pixData}
        onClose={() => setIsPixModalOpen(false)}
        onSuccess={handlePixSuccess}
        onCheckStatus={checkPixStatus}
      />
    </div>
  );
}