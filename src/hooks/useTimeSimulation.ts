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
      
      const deltaMinutes = (deltaMs / 1000 / 60) * 60 * time.speed / 60;
      updateTime(deltaMinutes);
      
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [time.speed, updateTime]);

  return null;
}
