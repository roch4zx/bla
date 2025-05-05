import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createPixPayment } from '../services/paymentService';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAmount: number | null;
}

export default function PixPaymentModal({ isOpen, onClose, selectedAmount }: PixPaymentModalProps) {
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Verificar se estamos no navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (isOpen && selectedAmount && !pixQrCode && !isLoading) {
      generatePix();
    }
  }, [isOpen, selectedAmount, pixQrCode, isLoading]);

  if (!isOpen) return null;

  const generatePix = async () => {
    if (!selectedAmount) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createPixPayment(selectedAmount);
      console.log("API Response:", response); // Para debug
      
      // Verificar se a resposta contém o QR code
      if (response && response.pix && response.pix.qrcode) {
        setPixQrCode(response.pix.qrcode);
      } else {
        throw new Error('QR Code não encontrado na resposta');
      }
    } catch (err) {
      setError('Erro ao gerar o PIX. Por favor, tente novamente.');
      console.error('Erro detalhado:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixQrCode && isBrowser && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pixQrCode)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        })
        .catch(err => {
          console.error('Erro ao copiar código:', err);
        });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Finalize sua doação:</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-8">
            <p>Gerando PIX...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={generatePix}
              className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {pixQrCode && !isLoading && !error && (
          <div className="text-center">
            <p className="mb-4">Escaneie o QR Code abaixo com o app do seu banco:</p>
            <div className="flex justify-center mb-4">
              <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                <QRCodeSVG 
                  value={pixQrCode} 
                  size={250}
                  level="H"
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="border border-gray-300 rounded p-2 text-sm mb-2 bg-gray-50 overflow-auto max-h-20">
                {pixQrCode}
              </div>
              
              <button 
                onClick={copyPixCode}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                {copySuccess ? 'Código Copiado!' : 'Copiar Código Pix'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Copie o código acima.</li>
                <li>Abra o app do seu banco e escolha a opção "PIX – Copiar e Colar".</li>
                <li>Cole o código no campo solicitado e confirme a transferência.</li>
                <li>A doação é confirmada automaticamente em poucos segundos.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 