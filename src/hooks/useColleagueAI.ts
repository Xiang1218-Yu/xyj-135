import { useEffect, useRef } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { ColleagueState, Position } from '@/types/office';

function getRandomPosition(): Position {
  return {
    x: 15 + Math.random() * 70,
    y: 20 + Math.random() * 60,
  };
}

function getDistance(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function moveToward(current: Position, target: Position, speed: number): Position {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < speed) {
    return { ...target };
  }
  
  return {
    x: current.x + (dx / distance) * speed,
    y: current.y + (dy / distance) * speed,
  };
}

export function useColleagueAI() {
  const { colleagues, time, updateColleaguePosition, updateColleagueState } = useOfficeStore();
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const nextActionTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const deltaMs = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      const deltaSeconds = deltaMs / 1000;

      colleagues.forEach((colleague) => {
        const currentHour = time.hour + time.minute / 60;
        let targetState: ColleagueState = colleague.state;
        let targetPos: Position | null = null;

        if (currentHour < colleague.schedule.arriveTime) {
          targetState = 'away';
        } else if (
          currentHour >= colleague.schedule.lunchStart &&
          currentHour < colleague.schedule.lunchEnd
        ) {
          targetState = 'resting';
          targetPos = { x: 85, y: 25 };
        } else if (currentHour >= colleague.schedule.leaveTime) {
          targetState = 'away';
        } else {
          const actionTimer = nextActionTimers.current.get(colleague.id);
          if (!actionTimer || now > actionTimer) {
            const actions: ColleagueState[] = ['working', 'walking', 'talking'];
            targetState = actions[Math.floor(Math.random() * actions.length)];
            
            const nextActionDelay = 3000 + Math.random() * 7000;
            nextActionTimers.current.set(colleague.id, now + nextActionDelay);
            
            if (targetState === 'walking') {
              targetPos = getRandomPosition();
            } else if (targetState === 'working') {
              targetPos = colleague.deskPosition;
            } else if (targetState === 'talking') {
              const nearbyColleague = colleagues.find(
                (c) => c.id !== colleague.id && 
                getDistance(c.position, colleague.position) < 20
              );
              if (nearbyColleague) {
                targetPos = {
                  x: (colleague.position.x + nearbyColleague.position.x) / 2,
                  y: (colleague.position.y + nearbyColleague.position.y) / 2,
                };
              } else {
                targetState = 'working';
                targetPos = colleague.deskPosition;
              }
            }
          }
        }

        if (colleague.state !== targetState) {
          updateColleagueState(colleague.id, targetState);
        }

        if (targetState === 'walking' || targetState === 'resting') {
          const target = targetPos || colleague.deskPosition;
          const speed = colleague.speed * deltaSeconds * 10;
          const newPos = moveToward(colleague.position, target, speed);
          updateColleaguePosition(colleague.id, newPos);
        } else if (targetState === 'working') {
          const dist = getDistance(colleague.position, colleague.deskPosition);
          if (dist > 1) {
            const speed = colleague.speed * deltaSeconds * 10;
            const newPos = moveToward(colleague.position, colleague.deskPosition, speed);
            updateColleaguePosition(colleague.id, newPos);
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [colleagues, time, updateColleaguePosition, updateColleagueState]);

  return null;
}
