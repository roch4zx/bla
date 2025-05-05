'use client';

import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Pequeno Samuel"
        width={300}
        height={60}
        className="h-auto"
      />
    </div>
  );
} 