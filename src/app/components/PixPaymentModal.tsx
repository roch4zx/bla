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
    <>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/20" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-w-[95vw] sm:max-w-md shadow-lg overflow-y-auto max-h-[95vh] z-50 mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Efetue o pagamento para<br />confirmar a contribuição</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold ml-2">&times;</button>
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
              <>
                <div className="flex flex-col items-center mb-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 mb-4">
                    <QRCodeSVG 
                      value={pixQrCode} 
                      size={180}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={pixQrCode}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 bg-gray-100 text-gray-700 text-center font-mono"
                    style={{ fontSize: '13px' }}
                  />
                  <button
                    onClick={copyPixCode}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 2.25V6.75A2.25 2.25 0 0018.75 4.5h-13.5A2.25 2.25 0 003 6.75v12.5A2.25 2.25 0 005.25 21h7.5" />
                    </svg>
                    {copySuccess ? 'Código Copiado' : 'Copiar Código'}
                  </button>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Pagar seu pedido com PIX</h3>
                  <ul className="space-y-3 text-green-900 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#16a34a" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#16a34a" strokeWidth="2" fill="none"/></svg>
                      </span>
                      <span>Copie o código acima.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#16a34a" viewBox="0 0 24 24" strokeWidth={2} stroke="#16a34a" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#16a34a" strokeWidth="2" fill="#16a34a"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span>Selecione a opção PIX Copia e Cola no aplicativo do seu banco.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#16a34a" viewBox="0 0 24 24" strokeWidth={2} stroke="#16a34a" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#16a34a" strokeWidth="2" fill="#16a34a"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span>Alguns segundos após o pagamento, a confirmação chega pra gente.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#16a34a" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#16a34a" strokeWidth="2" fill="none"/></svg>
                      </span>
                      <span>Recebedor: PAGPIX SOLUCAO EM PAGAMENTOS DIGITAIS LTDA - Nossos parceiros nessa jornada.</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 