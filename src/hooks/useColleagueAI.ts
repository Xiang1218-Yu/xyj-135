import { useEffect, useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { ColleagueState, Position, BehaviorActionType, Colleague } from '@/types/office';
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
  if (hour >= 8 && hour < 10) return 0.5;
  if (hour >= 10 && hour < 12) return 1.0;
  if (hour >= 12 && hour < 13) return 0.3;
  if (hour >= 13 && hour < 15) return 0.85;
  if (hour >= 15 && hour < 17) return 1.0;
  if (hour >= 17 && hour < 18) return 0.7;
  if (hour >= 18 && hour < 19) return 0.4;
  return 0.1;
}

function getCoffeeProbability(hour: number, pref: number): number {
  let base = 0;
  if (hour >= 9 && hour < 11) base = 0.25;
  else if (hour >= 13 && hour < 15) base = 0.3;
  else if (hour >= 15 && hour < 17) base = 0.2;
  else if (hour >= 8 && hour < 9) base = 0.15;
  return base * pref;
}

function getPrintProbability(hour: number, pref: number): number {
  let base = 0;
  if (hour >= 9 && hour < 12) base = 0.15;
  else if (hour >= 13 && hour < 17) base = 0.18;
  return base * pref;
}

function getMeetingProbability(hour: number, pref: number): number {
  let base = 0;
  if (hour >= 10 && hour < 12) base = 0.2;
  else if (hour >= 14 && hour < 16) base = 0.25;
  else if (hour >= 9 && hour < 10) base = 0.1;
  return base * pref;
}

interface ColleagueContext {
  id: string;
  walkTargetPos?: Position;
  lastState: ColleagueState;
  lastActionTime: number;
  lastCheckedHour: number;
  lastCheckedMinute: number;
  lastProcessedHour: number;
  currentAction: BehaviorActionType;
  actionStartTime: number;
  actionDuration: number;
  greetingTargetId?: string;
  lastFootstepTime: number;
  lastSipTime: number;
  lastPrintPageTime: number;
  lastGreetSoundTime: number;
}

type SchedulePhase = 'before-arrive' | 'morning' | 'lunch' | 'afternoon' | 'evening' | 'after-leave';

function getSchedulePhase(colleague: Colleague, currentHour: number): SchedulePhase {
  if (currentHour < colleague.schedule.arriveTime) return 'before-arrive';
  if (currentHour < colleague.schedule.lunchStart) return 'morning';
  if (currentHour < colleague.schedule.lunchEnd) return 'lunch';
  if (currentHour < colleague.schedule.leaveTime) return 'afternoon';
  return 'after-leave';
}

function getExpectedStateForPhase(colleague: Colleague, phase: SchedulePhase): { state: ColleagueState; pos: Position } {
  switch (phase) {
    case 'before-arrive':
    case 'after-leave':
      return { state: 'away', pos: entranceTarget };
    case 'lunch':
      return { state: 'resting', pos: kitchenTarget };
    case 'morning':
    case 'afternoon':
    case 'evening':
    default:
      return { state: 'working', pos: colleague.deskPosition };
  }
}

export function useColleagueAI() {
  const {
    colleagues,
    time,
    updateColleaguePosition,
    updateColleagueState,
    updateColleagueAction,
    triggerColleagueSound,
  } = useOfficeStore();
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const colleagueContexts = useRef<Map<string, ColleagueContext>>(new Map());
  const initializedRef = useRef(false);

  const setStateAndAction = useCallback((colleagueId: string, state: ColleagueState, action: BehaviorActionType, duration: number = 0) => {
    updateColleagueState(colleagueId, state);
    updateColleagueAction(colleagueId, action, duration);
    const ctx = colleagueContexts.current.get(colleagueId);
    if (ctx) {
      ctx.lastState = state;
      ctx.currentAction = action;
      ctx.actionStartTime = Date.now();
      ctx.actionDuration = duration;
    }
  }, [updateColleagueState, updateColleagueAction]);

  useEffect(() => {
    const now = Date.now();
    const currentHour = time.hour + time.minute / 60;

    colleagues.forEach((c) => {
      const phase = getSchedulePhase(c, currentHour);
      const expected = getExpectedStateForPhase(c, phase);
      const ctx: ColleagueContext = {
        id: c.id,
        lastState: expected.state,
        lastActionTime: now,
        lastCheckedHour: time.hour,
        lastCheckedMinute: time.minute,
        lastProcessedHour: time.hour,
        currentAction: 'none',
        actionStartTime: now,
        actionDuration: 0,
        lastFootstepTime: 0,
        lastSipTime: 0,
        lastPrintPageTime: 0,
        lastGreetSoundTime: 0,
      };

      if (c.state !== expected.state) {
        updateColleagueState(c.id, expected.state);
      }
      if (getDistance(c.position, expected.pos) > 1) {
        updateColleaguePosition(c.id, expected.pos);
      }
      if (c.currentAction !== 'none') {
        updateColleagueAction(c.id, 'none', 0);
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

      const phase = getSchedulePhase(c, currentHour);
      const expected = getExpectedStateForPhase(c, phase);
      const expectedHour = time.hour;
      const expectedMinute = time.minute;

      const timeJumped = Math.abs(expectedHour - ctx.lastCheckedHour) > 1 ||
        (expectedHour === ctx.lastCheckedHour && Math.abs(expectedMinute - ctx.lastCheckedMinute) > 30);

      if (timeJumped || ctx.lastCheckedHour !== expectedHour) {
        ctx.lastCheckedHour = expectedHour;
        ctx.lastCheckedMinute = expectedMinute;
        ctx.lastActionTime = now;
        ctx.walkTargetPos = undefined;
        ctx.currentAction = 'none';
        ctx.greetingTargetId = undefined;

        if (expected.state !== c.state && c.state !== 'walking' && c.state !== 'drinking-coffee' && c.state !== 'printing' && c.state !== 'in-meeting' && c.state !== 'greeting') {
          updateColleaguePosition(c.id, { ...expected.pos });
          updateColleagueState(c.id, expected.state);
          updateColleagueAction(c.id, 'none', 0);
          ctx.lastState = expected.state;
        }
      } else if (ctx.lastProcessedHour !== expectedHour) {
        ctx.lastProcessedHour = expectedHour;
        ctx.lastActionTime = now;
        ctx.walkTargetPos = undefined;

        if (phase === 'after-leave' && c.state !== 'away') {
          updateColleagueState(c.id, 'walking');
          updateColleagueAction(c.id, 'leave-office', 0);
          ctx.lastState = 'walking';
          ctx.currentAction = 'leave-office';
          ctx.walkTargetPos = expected.pos;
        } else if (phase === 'lunch' && (c.state === 'working' || c.state === 'talking' || c.state === 'drinking-coffee' || c.state === 'printing')) {
          updateColleagueState(c.id, 'walking');
          updateColleagueAction(c.id, 'go-lunch', 0);
          ctx.lastState = 'walking';
          ctx.currentAction = 'go-lunch';
          ctx.walkTargetPos = expected.pos;
        } else if ((phase === 'morning' || phase === 'afternoon') && (c.state === 'away' || c.state === 'resting')) {
          updateColleagueState(c.id, 'walking');
          updateColleagueAction(c.id, phase === 'morning' ? 'arrive-office' : 'go-desk', 0);
          ctx.lastState = 'walking';
          ctx.currentAction = phase === 'morning' ? 'arrive-office' : 'go-desk';
          ctx.walkTargetPos = expected.pos;
        }
      }

      ctx.lastCheckedHour = expectedHour;
      ctx.lastCheckedMinute = expectedMinute;
    });
  }, [time.hour, time.minute, colleagues, updateColleagueState, updateColleaguePosition, updateColleagueAction]);

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
        let targetAction: BehaviorActionType = ctx.currentAction;

        const phase = getSchedulePhase(colleague, currentHour);
        const expected = getExpectedStateForPhase(colleague, phase);

        if (colleague.state === 'away') {
          if (expected.state !== 'away') {
            targetState = 'walking';
            targetAction = 'arrive-office';
            targetPos = colleague.deskPosition;
            ctx.walkTargetPos = targetPos;
          } else {
            targetState = 'away';
            targetPos = entranceTarget;
          }
        } else if (colleague.state === 'resting') {
          if (expected.state === 'working') {
            targetState = 'walking';
            targetAction = 'go-desk';
            targetPos = colleague.deskPosition;
            ctx.walkTargetPos = targetPos;
          } else {
            targetState = 'resting';
            targetPos = kitchenTarget;
          }
        } else if (colleague.state === 'drinking-coffee') {
          const elapsed = now - ctx.actionStartTime;
          if (elapsed > ctx.actionDuration) {
            targetState = 'walking';
            targetAction = 'go-desk';
            targetPos = colleague.deskPosition;
            ctx.walkTargetPos = targetPos;
            ctx.lastActionTime = now;
          } else {
            targetState = 'drinking-coffee';
            targetPos = kitchenTarget;
            if (now - ctx.lastSipTime > 2000 + Math.random() * 2000) {
              ctx.lastSipTime = now;
              triggerColleagueSound(colleague.id, 'sip');
            }
          }
        } else if (colleague.state === 'printing') {
          const elapsed = now - ctx.actionStartTime;
          if (elapsed > ctx.actionDuration) {
            targetState = 'walking';
            targetAction = 'go-desk';
            targetPos = colleague.deskPosition;
            ctx.walkTargetPos = targetPos;
            ctx.lastActionTime = now;
          } else {
            targetState = 'printing';
            targetPos = printerTarget;
            if (now - ctx.lastPrintPageTime > 1500 + Math.random() * 1500) {
              ctx.lastPrintPageTime = now;
              triggerColleagueSound(colleague.id, 'print-page');
            }
          }
        } else if (colleague.state === 'in-meeting') {
          const elapsed = now - ctx.actionStartTime;
          if (elapsed > ctx.actionDuration) {
            targetState = 'walking';
            targetAction = 'go-desk';
            targetPos = colleague.deskPosition;
            ctx.walkTargetPos = targetPos;
            ctx.lastActionTime = now;
          } else {
            targetState = 'in-meeting';
            targetPos = meetingRoomTarget;
          }
        } else if (colleague.state === 'greeting') {
          const elapsed = now - ctx.actionStartTime;
          if (elapsed > ctx.actionDuration) {
            if (ctx.currentAction === 'go-coffee') {
              targetState = 'walking';
              targetAction = 'go-coffee';
              targetPos = kitchenTarget;
              ctx.walkTargetPos = targetPos;
            } else if (ctx.currentAction === 'go-printer') {
              targetState = 'walking';
              targetAction = 'go-printer';
              targetPos = printerTarget;
              ctx.walkTargetPos = targetPos;
            } else if (ctx.currentAction === 'go-meeting') {
              targetState = 'walking';
              targetAction = 'go-meeting';
              targetPos = meetingRoomTarget;
              ctx.walkTargetPos = targetPos;
            } else {
              targetState = 'walking';
              targetAction = 'go-desk';
              targetPos = colleague.deskPosition;
              ctx.walkTargetPos = targetPos;
            }
            ctx.lastActionTime = now;
          }
        } else if (colleague.state === 'walking') {
          targetState = 'walking';
          targetPos = ctx.walkTargetPos || colleague.deskPosition;

          if (now - ctx.lastFootstepTime > 400) {
            ctx.lastFootstepTime = now;
            triggerColleagueSound(colleague.id, 'footstep');
          }

          if (colleague.behaviorPreferences.greetingFrequency > 0.3 && now - ctx.lastGreetSoundTime > 5000) {
            const nearby = colleagues.find(
              (c) => c.id !== colleague.id &&
                getDistance(c.position, colleague.position) < 20 &&
                getDistance(c.position, colleague.position) > 5 &&
                (c.state === 'walking' || c.state === 'working')
            );
            if (nearby && Math.random() < colleague.behaviorPreferences.greetingFrequency * 0.3) {
              ctx.lastGreetSoundTime = now;
              const prevAction = ctx.currentAction;
              const duration = 1500 + Math.random() * 1500;
              setStateAndAction(colleague.id, 'greeting', prevAction, duration);
              triggerColleagueSound(colleague.id, 'greeting');
              ctx.greetingTargetId = nearby.id;
              animationFrameRef.current = requestAnimationFrame(tick);
              return;
            }
          }

          if (getDistance(colleague.position, targetPos) < 1.5) {
            ctx.walkTargetPos = undefined;
            ctx.greetingTargetId = undefined;

            if (expected.state === 'away' && getDistance(targetPos, entranceTarget) < 3) {
              targetState = 'away';
              targetAction = 'none';
              targetPos = entranceTarget;
            } else if (expected.state === 'resting' && getDistance(targetPos, kitchenTarget) < 3) {
              targetState = 'resting';
              targetAction = 'none';
              targetPos = kitchenTarget;
            } else if (getDistance(targetPos, kitchenTarget) < 3 && ctx.currentAction === 'go-coffee') {
              targetState = 'drinking-coffee';
              targetAction = 'drink-coffee';
              targetPos = kitchenTarget;
              ctx.actionStartTime = now;
              ctx.actionDuration = 15000 + Math.random() * 20000;
            } else if (getDistance(targetPos, printerTarget) < 3 && ctx.currentAction === 'go-printer') {
              targetState = 'printing';
              targetAction = 'printing';
              targetPos = printerTarget;
              ctx.actionStartTime = now;
              ctx.actionDuration = 8000 + Math.random() * 12000;
              triggerColleagueSound(colleague.id, 'paper-handle');
            } else if (getDistance(targetPos, meetingRoomTarget) < 3 && ctx.currentAction === 'go-meeting') {
              targetState = 'in-meeting';
              targetAction = 'meeting';
              targetPos = meetingRoomTarget;
              ctx.actionStartTime = now;
              ctx.actionDuration = 30000 + Math.random() * 60000;
              triggerColleagueSound(colleague.id, 'meeting-talk');
            } else {
              targetState = 'working';
              targetAction = 'none';
              targetPos = colleague.deskPosition;
            }
            ctx.lastActionTime = now;
          }
        } else {
          const timeSinceLastAction = now - ctx.lastActionTime;
          const baseInterval = 8000 + Math.random() * (12000 / Math.max(0.3, activityLevel));
          const actionInterval = baseInterval / Math.max(0.3, colleague.behaviorPreferences.activityLevel);

          if (timeSinceLastAction > actionInterval && activityLevel > 0.2 && expected.state === 'working') {
            const actionRoll = Math.random();
            const coffeeProb = getCoffeeProbability(time.hour, colleague.behaviorPreferences.coffeeFrequency) * activityLevel;
            const printProb = getPrintProbability(time.hour, colleague.behaviorPreferences.printFrequency) * activityLevel;
            const meetingProb = getMeetingProbability(time.hour, colleague.behaviorPreferences.meetingFrequency) * activityLevel;
            const talkProb = 0.06 * colleague.behaviorPreferences.talkativeness * activityLevel;

            const cumulativeCoffee = coffeeProb;
            const cumulativePrint = cumulativeCoffee + printProb;
            const cumulativeMeeting = cumulativePrint + meetingProb;
            const cumulativeTalk = cumulativeMeeting + talkProb;

            if (actionRoll < cumulativeCoffee) {
              targetState = 'walking';
              targetAction = 'go-coffee';
              targetPos = kitchenTarget;
              ctx.walkTargetPos = targetPos;
            } else if (actionRoll < cumulativePrint) {
              targetState = 'walking';
              targetAction = 'go-printer';
              targetPos = printerTarget;
              ctx.walkTargetPos = targetPos;
            } else if (actionRoll < cumulativeMeeting) {
              targetState = 'walking';
              targetAction = 'go-meeting';
              targetPos = meetingRoomTarget;
              ctx.walkTargetPos = targetPos;
            } else if (actionRoll < cumulativeTalk) {
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
                targetState = 'walking';
                targetAction = 'greet';
              } else {
                targetState = 'working';
                targetAction = 'none';
                targetPos = colleague.deskPosition;
              }
            } else {
              targetState = 'working';
              targetAction = 'none';
              targetPos = colleague.deskPosition;
            }

            ctx.lastActionTime = now;
          } else {
            if (ctx.walkTargetPos) {
              targetState = 'walking';
              targetPos = ctx.walkTargetPos;
            } else {
              targetState = colleague.state;
              targetAction = ctx.currentAction;
              targetPos = colleague.deskPosition;
            }
          }
        }

        if (colleague.state !== targetState) {
          updateColleagueState(colleague.id, targetState);
          ctx.lastState = targetState;
        }
        if (ctx.currentAction !== targetAction) {
          updateColleagueAction(colleague.id, targetAction, ctx.actionDuration);
          ctx.currentAction = targetAction;
        }

        if (targetState === 'away') {
          // away state: no position update needed
        } else if (targetState === 'walking' || targetState === 'talking' || targetState === 'greeting') {
          const speed = colleague.speed * deltaSeconds * 25;
          const newPos = moveToward(colleague.position, targetPos, speed);
          updateColleaguePosition(colleague.id, newPos);
        } else if (targetState === 'resting' || targetState === 'drinking-coffee') {
          const speed = colleague.speed * deltaSeconds * 20;
          const newPos = moveToward(colleague.position, targetPos, speed);
          updateColleaguePosition(colleague.id, newPos);
        } else if (targetState === 'printing' || targetState === 'in-meeting') {
          const dist = getDistance(colleague.position, targetPos);
          if (dist > 1) {
            const speed = colleague.speed * deltaSeconds * 25;
            const newPos = moveToward(colleague.position, targetPos, speed);
            updateColleaguePosition(colleague.id, newPos);
          }
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
  }, [colleagues, time, updateColleaguePosition, updateColleagueState, updateColleagueAction, triggerColleagueSound, setStateAndAction]);

  return null;
}
