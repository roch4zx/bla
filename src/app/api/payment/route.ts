import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Enviando requisição para API de pagamento:', data);
    
    const response = await fetch('https://api.uniquepag.com.br/api/v1/Payment/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': 'd8273998-9a91-4163-97e6-49aa1d3df644',
        'X-Secret-Key': '129683ce5226432a97a4c3852690b68a'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('Resposta da API de pagamento:', responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Falha ao processar pagamento', details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    );
  }
} 