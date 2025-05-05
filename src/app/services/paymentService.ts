interface Customer {
  id: string;
  name: string;
  email: string;
  document: {
    number: string;
    type: string;
  };
  phone: string;
  externalRef: string;
}

interface PaymentRequest {
  amount: number;
  paymentMethod: string;
  customer: Customer;
  shipping: {
    fee: number;
    address: {
      street: string;
      streetNumber: string;
      complement: string;
      zipCode: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    }
  };
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
    tangible: boolean;
    externalRef: string;
  }>;
  pix: {
    expiresInDays: number;
  };
  postbackUrl: string;
  metadata: string;
  traceable: boolean;
  ip: string;
}

interface PaymentResponse {
  id: string;
  status: string;
  pix: {
    qrcode: string;
    brcode: string | null;
    expirationDate: string | null;
    end2EndId: string;
    receiptUrl: string | null;
  };
  // outros campos conforme necessário
}

export async function createPixPayment(amount: number): Promise<PaymentResponse> {
  const paymentData: PaymentRequest = {
    amount: amount * 100, // Convertendo para centavos
    paymentMethod: "pix",
    customer: {
      id: "user" + Date.now(),
      name: "Doador Samuel",
      email: "doador@exemplo.com",
      document: {
        number: "54369078814", // CPF fixo conforme solicitado
        type: "cpf"
      },
      phone: "00000000000",
      externalRef: "userId"
    },
    shipping: {
      fee: 0,
      address: {
        street: "Rua Exemplo",
        streetNumber: "123",
        complement: "N/A",
        zipCode: "00000000",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "UF",
        country: "BR"
      }
    },
    items: [
      {
        title: "Doação para Samuel",
        unitPrice: amount * 100, // Convertendo para centavos
        quantity: 1,
        tangible: false,
        externalRef: "doacaosamuel"
      }
    ],
    pix: {
      expiresInDays: 1
    },
    postbackUrl: "https://webhook.site/bc96e869-f127-46a8-ba8a-d452e73abfbd",
    metadata: "doacao_samuel",
    traceable: false,
    ip: "127.0.0.1"
  };

  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Falha ao processar pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
} 