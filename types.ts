export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  desc: string;
  img: string;
  theme: {
    background: string;
    textColor: string;
    accentColor: string; // For badges/buttons
    neonGradient: string; // The conic gradient for the border
    blurColor: string; // Behind the image
    dripColor?: string; // Color of the SVG drip below
    dripOverNext?: boolean; // If true, this section drips over the next section
  };
}

export interface CartItem extends Product {
  qty: number;
}

export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';

export interface CheckoutData {
  name: string;
  address: string;
  payment: PaymentMethod;
  email: string;
  cpf: string;
  deliveryMethod: 'delivery' | 'pickup';
}

// Interface baseada na resposta da API do Mercado Pago
export interface PixResponse {
  id: number;
  status: string;
  status_detail: string;
  point_of_interaction: {
    transaction_data: {
      qr_code_base64: string;
      qr_code: string;
      ticket_url: string;
    }
  }
}