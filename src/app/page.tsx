'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import DonationModal from "./components/DonationModal";
import Logo from "./components/Logo";
import DonationPopUp from "./components/DonationPopUp";
import Confetti from "./components/Confetti";
import OrganizerProfile from "./components/OrganizerProfile";

export default function Home() {
  const goal = 71750;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donated, setDonated] = useState(29864);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState({ name: '', image: '', amount: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayedDonated, setDisplayedDonated] = useState(donated);
  const [displayedProgress, setDisplayedProgress] = useState(Math.min(100, Math.round((donated / goal) * 100)));

  // Profiles for pop-up
  const profiles = [
    { name: 'Juliana Andrade', image: '/perfil1.png' },
    { name: 'Sônia Silva', image: '/perfil2.png' },
    { name: 'Luana Oliviar', image: '/perfil3.png' },
    { name: 'Rafael Nunes', image: '/perfil4.png' },
  ];

  // Load donated amount from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('donated');
    if (saved) setDonated(Number(saved));
  }, []);

  // Save donated amount to localStorage
  useEffect(() => {
    localStorage.setItem('donated', String(donated));
  }, [donated]);

  // Show pop-up every 15-30 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const showRandomPopUp = () => {
      const profile = profiles[Math.floor(Math.random() * profiles.length)];
      const amount = [30, 40, 50, 60, 70][Math.floor(Math.random() * 5)];
      setPopUpData({ ...profile, amount });
      setShowPopUp(true);
      setDonated((prev) => prev + amount);
      timeout = setTimeout(() => {
        setShowPopUp(false);
        timeout = setTimeout(showRandomPopUp, 15000 + Math.random() * 15000);
      }, 4000);
    };
    timeout = setTimeout(showRandomPopUp, 8000);
    return () => clearTimeout(timeout);
  }, [profiles]);

  // Animate donated amount and progress
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setDisplayedDonated(prev => {
        if (Math.abs(prev - donated) < 1) return donated;
        return prev + (donated - prev) * 0.07;
      });
      setDisplayedProgress(prev => {
        const target = Math.min(100, Math.round((donated / goal) * 100));
        if (Math.abs(prev - target) < 0.5) return target;
        return prev + (target - prev) * 0.07;
      });
      if (Math.abs(displayedDonated - donated) >= 1 || Math.abs(displayedProgress - Math.min(100, Math.round((donated / goal) * 100))) >= 0.5) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [donated, goal]);

  // Show confetti when pop-up appears
  useEffect(() => {
    if (showPopUp) setShowConfetti(true);
  }, [showPopUp]);

  // Hide confetti after animation
  const handleConfettiDone = () => setShowConfetti(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {showConfetti && <Confetti onDone={handleConfettiDone} />}
      <DonationPopUp
        visible={showPopUp}
        profile={{ name: popUpData.name, image: popUpData.image }}
        amount={popUpData.amount}
        onClose={() => setShowPopUp(false)}
      />
      {/* Logo/Título */}
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      {/* Cabeçalho com imagem e texto */}
      <div className="mb-12">
        <h2 className="text-[28px] font-bold text-center mb-8 leading-tight">
          Ajude o pequeno Samuel a não interromper<br />
          a única chance que tem de seguir lutando
        </h2>
        
        <div className="flex justify-center mb-12">
          <Image 
            src="/image1.png" 
            alt="Fotos do Samuel no hospital" 
            width={600} 
            height={300}
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Perfil do organizador */}
      <OrganizerProfile />

      {/* Progresso da arrecadação */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div>
            <span className="text-sm text-gray-600">Arrecadado</span>
            <p className="text-green-600 font-bold text-xl">R$ {displayedDonated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">Meta: R$ 71.750,00</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-green-600 h-4 rounded-full transition-all duration-500" style={{ width: `${displayedProgress}%` }}></div>
        </div>
      </div>

      {/* Botão principal de contribuição */}
      <div className="mb-12 flex justify-center">
        <button 
          onClick={openModal}
          className="bg-green-600 text-white font-bold py-4 px-6 rounded-xl w-full max-w-md hover:bg-green-700 transition-colors cursor-pointer text-lg"
        >
          CONTRIBUIR PARA SAMUEL
        </button>
      </div>

      {/* Modal de doação */}
      <DonationModal isOpen={isModalOpen} onClose={closeModal} />

      {/* História do Samuel */}
      <div className="mb-12 text-gray-700 leading-relaxed space-y-6">
        <p>Tem fases na vida em que tudo parece desabar de uma vez.</p>
        <p>Com a família do Samuel, foi assim.</p>
        <p>Ele enfrenta uma doença severa que afeta o corpo de forma rápida e intensa.</p>
        <p>O tipo de situação que muda a rotina, os planos, e até o silêncio dentro de casa.</p>
        <p>A mãe do Samuel vem segurando tudo com coragem.</p>
        <p>Mas essa semana, as últimas doses do medicamento acabaram.</p>
        
        <div className="flex justify-center my-12">
          <Image 
            src="/image2.jpg" 
            alt="Samuel no hospital" 
            width={600} 
            height={400}
            className="rounded-2xl"
          />
        </div>
        
        <p>E que, ontem à noite, precisou mentir pro filho dizendo que os remédios estavam a caminho.</p>
        <p>Mas a verdade é que não estão.</p>
        <p>E a única chance de continuar... agora depende de ajuda.</p>
        
        <div className="flex justify-center my-12">
          <Image 
            src="/image3.jpg" 
            alt="Samuel com brinquedo" 
            width={600} 
            height={400}
            className="rounded-2xl"
          />
        </div>
        
        <p>O medicamento que não pode atrasar.</p>
        <p>O exame que precisa ser feito.</p>
        <p>E o suporte que o Samuel precisa pra seguir de pé.</p>
        <p>Se você pode contribuir, clique no botão abaixo.</p>
        <p>Qualquer valor já faz diferença real na vida do Samuel.</p>
      </div>

      {/* Botão de contribuição final */}
      <div className="mb-12 flex justify-center">
        <button 
          onClick={openModal}
          className="bg-green-600 text-white font-bold py-4 px-6 rounded-xl w-full max-w-md hover:bg-green-700 transition-colors cursor-pointer text-lg"
        >
          CONTRIBUIR PARA SAMUEL
        </button>
      </div>

      {/* Mensagem final */}
      <div className="mb-12 text-center text-gray-700 space-y-4">
        <p>É isso que mantém a esperança acesa.</p>
        <p>Porque pra algumas famílias, o amanhã... depende do que a gente faz hoje.</p>
      </div>

      {/* Comentários */}
      <div className="mb-12">
        <h3 className="text-right mb-6 text-gray-600">5 Comentários</h3>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center mb-3">
              <Image 
                src="/perfil1.png" 
                alt="Foto de Juliana Andrade" 
                width={48} 
                height={48} 
                className="rounded-full mr-3"
              />
              <strong className="text-gray-700">Juliana Andrade:</strong>
            </div>
            <p className="text-gray-600 leading-relaxed">Sou mãe e me coloquei no lugar dessa mulher. Não tem dor maior do que ver um filho precisar de algo e não poder dar. Fiz minha parte e peço a Deus que o Samuel tenha forças pra continuar.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center mb-3">
              <Image 
                src="/perfil2.png" 
                alt="Foto de Sônia Silva" 
                width={48} 
                height={48} 
                className="rounded-full mr-3"
              />
              <strong className="text-gray-700">Sônia Silva:</strong>
            </div>
            <p className="text-gray-600 leading-relaxed">Essa história me pegou de verdade. Não conheço o Samuel, mas senti no coração que precisava ajudar. Que ele receba tudo que for necessário pra seguir com saúde.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center mb-3">
              <Image 
                src="/perfil3.png" 
                alt="Foto de Luana Oliviar" 
                width={48} 
                height={48} 
                className="rounded-full mr-3"
              />
              <strong className="text-gray-700">Luana Oliviar:</strong>
            </div>
            <p className="text-gray-600 leading-relaxed">Fiz minha contribuição com fé. Ver uma criança tão pequena passar por isso parte o coração. Que essa campanha alcance tudo o que ele precisa.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center mb-3">
              <Image 
                src="/perfil4.png" 
                alt="Foto de Rafael Nunes" 
                width={48} 
                height={48} 
                className="rounded-full mr-3"
              />
              <strong className="text-gray-700">Rafael Nunes:</strong>
            </div>
            <p className="text-gray-600 leading-relaxed">Conheci a história e compartilhei com minha família. Meu filho também já precisou de tratamento e sei como é difícil. Estamos com vocês, de coração.</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="text-center mt-16">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <p className="text-sm text-gray-500">historiassolitar.com</p>
        <p className="text-sm text-gray-500">Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
