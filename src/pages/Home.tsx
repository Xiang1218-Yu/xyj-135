import { useState, useEffect } from 'react';
import { OfficeScene } from '@/components/office/OfficeScene';
import { StatusBar } from '@/components/ui/StatusBar';
import { ControlPanel } from '@/components/controls/ControlPanel';
import { WelcomeScreen } from '@/components/ui/WelcomeScreen';
import { useOfficeStore } from '@/store/useOfficeStore';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { togglePlay } = useOfficeStore();
  const { initAudioContext } = useAudioEngine();

  const handleStart = () => {
    setShowWelcome(false);
    initAudioContext();
    togglePlay();
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typing {
        0% { transform: translateY(0); }
        100% { transform: translateY(-2px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      {showWelcome && <WelcomeScreen onStart={handleStart} />}
      
      <div className="relative w-full h-full">
        <OfficeScene />
        <StatusBar />
        <ControlPanel />
      </div>
    </div>
  );
}
