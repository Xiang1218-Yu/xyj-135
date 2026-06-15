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
    setZoom,
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
    
    const newX = Math.max(15, Math.min(85, startPos.x - dx));
    const newY = Math.max(20, Math.min(80, startPos.y - dy));
    
    setListenerPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.6, Math.min(2.5, zoom + delta));
    setZoom(newZoom);
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

  const offsetX = (50 - listenerPosition.x) * 2;
  const offsetY = (50 - listenerPosition.y) * 1.5;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onWheel={handleWheel}
      style={{ perspective: '1500px' }}
    >
      <div
        className="absolute left-1/2 top-1/2 w-[200%] h-[200%]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            translate(-50%, -50%)
            translate3d(${offsetX}%, ${offsetY}%, 0)
            scale(${zoom})
            rotateX(60deg)
            rotateZ(-45deg)
          `,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 w-[70%] h-[70%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Lighting />
          <OfficeLayout />
          
          {colleagues.map((colleague) => (
            <ColleagueAvatar key={colleague.id} colleague={colleague} />
          ))}
          
          <div
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotateZ(45deg)',
            }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-30" />
            <div className="absolute inset-1 rounded-full border-2 border-orange-500" />
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-gray-600 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
        <span>🖱️ 拖动探索</span>
        <span className="text-gray-300">|</span>
        <span>🔍 滚轮缩放</span>
        <span className="text-gray-300">|</span>
        <span className="text-orange-500 font-medium">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
