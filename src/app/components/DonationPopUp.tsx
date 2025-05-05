import Image from 'next/image';
import { useEffect } from 'react';

interface DonationPopUpProps {
  visible: boolean;
  profile: { name: string; image: string };
  amount: number;
  onClose: () => void;
}

export default function DonationPopUp({ visible, profile, amount, onClose }: DonationPopUpProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed left-4 bottom-4 z-50 flex items-center bg-white shadow-lg rounded-2xl px-4 py-3 animate-fade-in-up border border-green-200 min-w-[260px]">
      <Image
        src={profile.image}
        alt={`Foto de ${profile.name}`}
        width={40}
        height={40}
        className="rounded-full mr-3 border border-green-400"
      />
      <div>
        <span className="font-bold text-green-700 block">{profile.name}</span>
        <span className="text-gray-700 text-sm">Acabou de doar <span className="font-bold text-green-600">R$ {amount.toFixed(2)}</span></span>
      </div>
    </div>
  );
}

// Add a simple fade-in-up animation
// In your global CSS (e.g., globals.css), add:
// @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fade-in-up { animation: fade-in-up 0.5s; } 