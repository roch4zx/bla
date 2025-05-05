'use client';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const donationAmounts = [
    30, 40, 50, 70, 100, 150, 200, 300, 500, 750, 1000
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay com fundo preto e baixa opacidade */}
      <div 
        className="absolute inset-0 bg-black opacity-40" 
        onClick={onClose}
      />

      {/* Modal centralizado */}
      <div className="relative bg-white rounded-[32px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] w-full max-w-[400px]">
        <h3 className="text-xl font-bold text-center mb-8">
          QUAL VALOR VOCÊ DESEJA DOAR?
        </h3>

        <div className="grid grid-cols-2 gap-5">
          {donationAmounts.slice(0, -1).map((amount) => (
            <button
              key={amount}
              onClick={onClose}
              className="bg-[#00A651] text-white font-bold py-4 px-4 rounded-2xl hover:bg-[#008f45] transition-colors cursor-pointer"
            >
              R$ {amount}
            </button>
          ))}
          <button
            onClick={onClose}
            className="bg-[#00A651] text-white font-bold py-4 px-4 rounded-2xl col-span-2 hover:bg-[#008f45] transition-colors cursor-pointer"
          >
            R$ {donationAmounts[donationAmounts.length - 1]}
          </button>
        </div>
      </div>
    </div>
  );
} 