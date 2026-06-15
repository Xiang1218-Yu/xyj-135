import { useRef, useEffect, useState } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import { OfficeLayout } from './OfficeLayout';
import { ColleagueAvatar } from './ColleagueAvatar';
import { Lighting } from './Lighting';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTimeSimulation } from '@/hooks/useTimeSimulation';
import { useColleagueAI } from '@/hooks/useColleagueAI';

export function OfficeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    listenerPosition, 
    zoom, 
    colleagues, 
    setListenerPosition,
    isPlaying,
  } = useOfficeStore();
  
  const { initAudioContext, isAudioReady } = useAudioEngine();
  useTimeSimulation();
  useColleagueAI();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    if (!isAudioReady && isPlaying) {
      initAudioContext();
    }
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setStartPos({ ...listenerPosition });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const dx = ((clientX - dragStart.x) / rect.width) * 100 / zoom;
    const dy = ((clientY - dragStart.y) / rect.height) * 100 / zoom;
    
    const newX = Math.max(10, Math.min(90, startPos.x - dx));
    const newY = Math.max(10, Math.min(90, startPos.y - dy));
    
    setListenerPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, startPos, zoom]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onWheel={handleWheel}
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute w-[200%] h-[200%] transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${-listenerPosition.x + 25}%, ${-listenerPosition.y + 25}%) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="absolute inset-0 w-1/2 h-1/2 left-1/4 top-1/4">
          <Lighting />
          <OfficeLayout />
          
          {colleagues.map((colleague) => (
            <ColleagueAvatar key={colleague.id} colleague={colleague} />
          ))}
          
          <div
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-30" />
            <div className="absolute inset-1 rounded-full border-2 border-orange-500" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
        拖动鼠标探索办公室
      </div>
    </div>
  );
}
