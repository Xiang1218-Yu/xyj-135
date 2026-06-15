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

interface ColleagueContext {
  id: string;
  walkTargetPos?: Position;
  lastState: ColleagueState;
  lastActionTime: number;
  lastCheckedHour: number;
  lastCheckedMinute: number;
  lastProcessedHour: number;
}

function getExpectedStateForTime(colleague: any, currentHour: number): { state: ColleagueState; pos: Position } {
  if (currentHour < colleague.schedule.arriveTime) {
    return { state: 'away', pos: entranceTarget };
  } else if (
    currentHour >= colleague.schedule.lunchStart &&
    currentHour < colleague.schedule.lunchEnd
  ) {
    return { state: 'resting', pos: kitchenTarget };
  } else if (currentHour >= colleague.schedule.leaveTime) {
    return { state: 'away', pos: entranceTarget };
  } else {
    return { state: 'working', pos: colleague.deskPosition };
  }
}

export function useColleagueAI() {
  const { colleagues, time, updateColleaguePosition, updateColleagueState } = useOfficeStore();
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const colleagueContexts = useRef<Map<string, ColleagueContext>>(new Map());
  const initializedRef = useRef(false);

  useEffect(() => {
    const now = Date.now();
    const currentHour = time.hour + time.minute / 60;
    
    colleagues.forEach((c) => {
      const expected = getExpectedStateForTime(c, currentHour);
      const ctx: ColleagueContext = {
        id: c.id,
        lastState: expected.state,
        lastActionTime: now,
        lastCheckedHour: time.hour,
        lastCheckedMinute: time.minute,
        lastProcessedHour: time.hour,
      };
      
      if (c.state !== expected.state) {
        updateColleagueState(c.id, expected.state);
      }
      if (getDistance(c.position, expected.pos) > 1) {
        updateColleaguePosition(c.id, expected.pos);
      }
      
      colleagueContexts.current.set(c.id, ctx);
    });
    
    initializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!initializedRef.current) return;
    
    const currentHour = time.hour + time.minute / 60;
    const now = Date.now();
    
    colleagues.forEach((c) => {
      const ctx = colleagueContexts.current.get(c.id);
      if (!ctx) return;
      
      const expected = getExpectedStateForTime(c, currentHour);
      const expectedHour = time.hour;
      const expectedMinute = time.minute;
      
      const timeJumped = Math.abs(expectedHour - ctx.lastCheckedHour) > 1 ||
                        (expectedHour === ctx.lastCheckedHour && Math.abs(expectedMinute - ctx.lastCheckedMinute) > 30);
      
      if (timeJumped || ctx.lastCheckedHour !== expectedHour) {
        ctx.lastCheckedHour = expectedHour;
        ctx.lastCheckedMinute = expectedMinute;
        ctx.lastActionTime = now;
        ctx.walkTargetPos = undefined;
        
        if (expected.state !== c.state && c.state !== 'walking') {
          updateColleaguePosition(c.id, { ...expected.pos });
          updateColleagueState(c.id, expected.state);
          ctx.lastState = expected.state;
        }
      } else if (ctx.lastProcessedHour !== expectedHour) {
        ctx.lastProcessedHour = expectedHour;
        ctx.lastActionTime = now;
        ctx.walkTargetPos = undefined;
        
        if (expected.state === 'away' && c.state !== 'away') {
          updateColleagueState(c.id, 'walking');
          ctx.lastState = 'walking';
          ctx.walkTargetPos = expected.pos;
        } else if (expected.state === 'resting' && (c.state === 'working' || c.state === 'talking')) {
          updateColleagueState(c.id, 'walking');
          ctx.lastState = 'walking';
          ctx.walkTargetPos = expected.pos;
        } else if (expected.state === 'working' && (c.state === 'away' || c.state === 'resting')) {
          updateColleagueState(c.id, 'walking');
          ctx.lastState = 'walking';
          ctx.walkTargetPos = expected.pos;
        }
      }
      
      ctx.lastCheckedHour = expectedHour;
      ctx.lastCheckedMinute = expectedMinute;
    });
  }, [time.hour, time.minute, colleagues, updateColleagueState, updateColleaguePosition]);

  useEffect(() => {
    if (!initializedRef.current) return;
    
    const tick = () => {
      const now = Date.now();
      const deltaMs = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      const deltaSeconds = Math.min(deltaMs / 1000, 0.1);

      if (time.isPaused) {
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const currentHour = time.hour + time.minute / 60;
      const activityLevel = getActivityLevel(time.hour);

      colleagues.forEach((colleague) => {
        const ctx = colleagueContexts.current.get(colleague.id);
        if (!ctx) return;

        let targetState: ColleagueState = colleague.state;
        let targetPos: Position = colleague.deskPosition;
        
        const expected = getExpectedStateForTime(colleague, currentHour);
        
        if (colleague.state === 'away') {
          if (expected.state !== 'away') {
            targetState = 'walking';
            targetPos = colleague.deskPosition;
          } else {
            targetState = 'away';
            targetPos = entranceTarget;
          }
        } else if (colleague.state === 'resting') {
          if (expected.state === 'working') {
            targetState = 'walking';
            targetPos = colleague.deskPosition;
          } else {
            targetState = 'resting';
            targetPos = kitchenTarget;
          }
        } else if (colleague.state === 'walking') {
          targetState = 'walking';
          targetPos = ctx.walkTargetPos || colleague.deskPosition;
          
          if (getDistance(colleague.position, targetPos) < 1.5) {
            ctx.walkTargetPos = undefined;
            
            if (expected.state === 'away' && getDistance(targetPos, entranceTarget) < 3) {
              targetState = 'away';
              targetPos = entranceTarget;
            } else if (expected.state === 'resting' && getDistance(targetPos, kitchenTarget) < 3) {
              targetState = 'resting';
              targetPos = kitchenTarget;
            } else {
              targetState = 'working';
              targetPos = colleague.deskPosition;
            }
            ctx.lastActionTime = now;
          }
        } else {
          const timeSinceLastAction = now - ctx.lastActionTime;
          const actionInterval = 4000 + Math.random() * (6000 / Math.max(0.3, activityLevel));
          
          if (timeSinceLastAction > actionInterval && activityLevel > 0.2 && expected.state === 'working') {
            const actionRoll = Math.random();
            const walkProb = 0.12 * activityLevel;
            const talkProb = 0.08 * activityLevel;
            const restProb = 0.04 * activityLevel;

            if (actionRoll < walkProb) {
              targetState = 'walking';
              const destinationRoll = Math.random();
              if (destinationRoll < 0.25) {
                targetPos = kitchenTarget;
              } else if (destinationRoll < 0.45) {
                targetPos = printerTarget;
              } else if (destinationRoll < 0.65) {
                targetPos = meetingRoomTarget;
              } else {
                targetPos = {
                  x: 20 + Math.random() * 60,
                  y: 25 + Math.random() * 45,
                };
              }
              ctx.walkTargetPos = targetPos;
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
                ctx.walkTargetPos = targetPos;
              } else {
                targetState = 'working';
                targetPos = colleague.deskPosition;
              }
            } else if (actionRoll < walkProb + talkProb + restProb) {
              targetState = 'walking';
              targetPos = kitchenTarget;
              ctx.walkTargetPos = targetPos;
            } else {
              targetState = 'working';
              targetPos = colleague.deskPosition;
            }
            
            ctx.lastActionTime = now;
          } else {
            if (ctx.walkTargetPos && colleague.state === 'walking') {
              targetState = 'walking';
              targetPos = ctx.walkTargetPos;
            } else {
              targetState = colleague.state;
              targetPos = colleague.deskPosition;
            }
          }
        }

        if (colleague.state !== targetState) {
          updateColleagueState(colleague.id, targetState);
          ctx.lastState = targetState;
        }

        if (targetState === 'away') {
        } else if (targetState === 'walking' || targetState === 'talking') {
          const speed = colleague.speed * deltaSeconds * 25;
          const newPos = moveToward(colleague.position, targetPos, speed);
          updateColleaguePosition(colleague.id, newPos);
        } else if (targetState === 'resting') {
          const speed = colleague.speed * deltaSeconds * 20;
          const newPos = moveToward(colleague.position, targetPos, speed);
          updateColleaguePosition(colleague.id, newPos);
        } else if (targetState === 'working') {
          const dist = getDistance(colleague.position, colleague.deskPosition);
          if (dist > 1) {
            const speed = colleague.speed * deltaSeconds * 30;
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
