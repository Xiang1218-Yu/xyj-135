import { useEffect, useRef } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { ColleagueState, Position } from '@/types/office';
import { meetingRoomTarget, kitchenTarget, printerTarget, entranceTarget } from '@/data/colleagues';

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

function getActivityLevel(hour: number): number {
  if (hour >= 8 && hour < 10) return 0.4;
  if (hour >= 10 && hour < 12) return 1.0;
  if (hour >= 12 && hour < 13) return 0.3;
  if (hour >= 13 && hour < 15) return 0.9;
  if (hour >= 15 && hour < 17) return 1.0;
  if (hour >= 17 && hour < 18) return 0.8;
  if (hour >= 18 && hour < 19) return 0.5;
  return 0.1;
}

function isWalkingAnimation(
  current: Position,
  target: Position,
  progress: number
): Position {
  const t = Math.min(1, Math.max(0, progress));
  return {
    x: current.x + (target.x - current.x) * t,
    y: current.y + (target.y - current.y) * t,
  };
}

interface ColleagueContext {
  id: string;
  walkStartPos?: Position;
  walkTargetPos?: Position;
  walkStartTime?: number;
  walkDuration?: number;
  lastState: ColleagueState;
  lastActionTime: number;
}

export function useColleagueAI() {
  const { colleagues, time, updateColleaguePosition, updateColleagueState } = useOfficeStore();
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const colleagueContexts = useRef<Map<string, ColleagueContext>>(new Map());

  useEffect(() => {
    const now = Date.now();
    
    colleagues.forEach((c) => {
      if (!colleagueContexts.current.has(c.id)) {
        colleagueContexts.current.set(c.id, {
          id: c.id,
          lastState: c.state,
          lastActionTime: now,
        });
      }
    });
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const deltaMs = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      const deltaSeconds = deltaMs / 1000;

      colleagues.forEach((colleague) => {
        const currentHour = time.hour + time.minute / 60;
        const activityLevel = getActivityLevel(time.hour);
        let targetState: ColleagueState = colleague.state;
        let targetPos: Position | null = null;

        const ctx = colleagueContexts.current.get(colleague.id);
        if (!ctx) return;

        if (currentHour < colleague.schedule.arriveTime) {
          targetState = 'away';
          targetPos = entranceTarget;
        } else if (
          currentHour >= colleague.schedule.lunchStart &&
          currentHour < colleague.schedule.lunchEnd
        ) {
          if (Math.random() < 0.7) {
            targetState = 'resting';
            targetPos = kitchenTarget;
          } else {
            targetState = 'away';
            targetPos = entranceTarget;
          }
        } else if (currentHour >= colleague.schedule.leaveTime) {
          if (colleague.state !== 'away') {
            targetState = 'walking';
            targetPos = entranceTarget;
            if (getDistance(colleague.position, entranceTarget) < 2) {
              targetState = 'away';
            }
          }
        } else {
          const timeSinceLastAction = now - ctx.lastActionTime;
          const actionInterval = 3000 + Math.random() * (7000 / activityLevel);
          
          if (timeSinceLastAction > actionInterval && activityLevel > 0.2) {
            const actionRoll = Math.random();
            const walkProb = 0.15 * activityLevel;
            const talkProb = 0.1 * activityLevel;
            const restProb = 0.05 * activityLevel;

            if (actionRoll < walkProb) {
              targetState = 'walking';
              
              const destinationRoll = Math.random();
              if (destinationRoll < 0.3) {
                targetPos = kitchenTarget;
              } else if (destinationRoll < 0.5) {
                targetPos = printerTarget;
              } else if (destinationRoll < 0.7) {
                targetPos = meetingRoomTarget;
              } else {
                targetPos = {
                  x: 15 + Math.random() * 70,
                  y: 20 + Math.random() * 55,
                };
              }
            } else if (actionRoll < walkProb + talkProb) {
              targetState = 'talking';
              const nearbyColleague = colleagues.find(
                (c) => c.id !== colleague.id && 
                getDistance(c.position, colleague.position) < 25 &&
                c.state !== 'away'
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
            } else if (actionRoll < walkProb + talkProb + restProb) {
              targetState = 'resting';
              targetPos = kitchenTarget;
            } else {
              targetState = 'working';
              targetPos = colleague.deskPosition;
            }
            
            ctx.lastActionTime = now;
          } else {
            if (ctx.lastState === 'walking' && ctx.walkTargetPos) {
              targetState = 'walking';
              targetPos = ctx.walkTargetPos;
            }
          }
        }

        if (colleague.state !== targetState) {
          updateColleagueState(colleague.id, targetState);
          ctx.lastState = targetState;
        }

        if (targetState === 'walking' || targetState === 'resting' || targetState === 'talking') {
          const target = targetPos || colleague.deskPosition;
          const speed = colleague.speed * deltaSeconds * 8;
          const newPos = moveToward(colleague.position, target, speed);
          updateColleaguePosition(colleague.id, newPos);
          
          if (targetPos && targetState === 'walking') {
            ctx.walkStartPos = colleague.position;
            ctx.walkTargetPos = targetPos;
            ctx.walkStartTime = now;
            ctx.walkDuration = getDistance(colleague.position, targetPos) / speed;
          }
          
          if (targetPos && getDistance(colleague.position, targetPos) < 2) {
            ctx.walkTargetPos = undefined;
            if (targetState === 'walking') {
              if (Math.random() < 0.4) {
                updateColleagueState(colleague.id, 'working');
                ctx.lastState = 'working';
              } else if (Math.random() < 0.3) {
                updateColleagueState(colleague.id, 'resting');
                ctx.lastState = 'resting';
              }
              ctx.lastActionTime = now;
            }
          }
        } else if (targetState === 'working') {
          const dist = getDistance(colleague.position, colleague.deskPosition);
          if (dist > 1) {
            const speed = colleague.speed * deltaSeconds * 12;
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
