import Image from 'next/image';

export default function OrganizerProfile() {
  return (
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
        <Image src="/heart-green.svg" alt="Coração verde" width={28} height={28} />
      </div>
      <div>
        <div className="font-bold text-gray-800 leading-tight">Pequeno Samuel</div>
        <div className="text-xs text-gray-500">Ativo(a) no Vakinha desde março/2024</div>
        <div className="text-sm text-gray-700 mt-1">
          <span className="text-green-700 font-semibold">1</span> vaquinha criada <span className="mx-1">•</span> <span className="text-green-700 font-semibold">13</span> vaquinha apoiadas
        </div>
      </div>
    </div>
  );
} 