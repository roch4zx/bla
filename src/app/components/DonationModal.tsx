interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAmountSelect: (amount: number) => void;
}

export default function DonationModal({ isOpen, onClose, onAmountSelect }: DonationModalProps) {
  const donationOptions = [30, 40, 50, 70, 100, 150, 200, 300, 500, 750, 1000];
  
  if (!isOpen) return null;
  
  const handleAmountSelect = (amount: number) => {
    onAmountSelect(amount);
    onClose();
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/20" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-w-[95vw] sm:max-w-md shadow-lg z-50 mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">QUAL VALOR VOCÊ DESEJA DOAR?</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {donationOptions.slice(0, 10).map((amount, index) => (
                <button
                  key={index}
                  onClick={() => handleAmountSelect(amount)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  R$ {amount}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handleAmountSelect(1000)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              R$ 1000
            </button>
          </div>
        </div>
      </div>
    </>
  );
}