import { useEffect, useRef } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';

export function useTimeSimulation() {
  const { updateTime, time } = useOfficeStore();
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      
      const deltaSeconds = deltaMs / 1000;
      const deltaMinutes = deltaSeconds * time.speed;
      
      updateTime(deltaMinutes);
      
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [time.speed, updateTime]);

  return null;
}
