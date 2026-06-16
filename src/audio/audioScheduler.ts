import type { AudioSource, Colleague, KeyboardType } from '@/types/office';
import type { RandomSoundConfig, TypingState } from '@/types/audio';
import type { AudioBuffers } from './bufferManager';
import type { AudioContextState } from './audioPlayer';
import { playOneShot } from './audioPlayer';
import { keyboardVolumeByType, keyboardTimingByType } from '@/data/audioSources';

export interface SchedulerState {
  randomSounds: Map<string, RandomSoundConfig>;
  typingStates: Map<string, TypingState>;
}

export function createSchedulerState(): SchedulerState {
  return {
    randomSounds: new Map(),
    typingStates: new Map(),
  };
}

export function scheduleRandomSound(
  ctxState: AudioContextState,
  buffers: AudioBuffers,
  source: AudioSource,
  minInterval: number,
  maxInterval: number,
  schedulerState: SchedulerState
): void {
  const nextDelay = minInterval + Math.random() * (maxInterval - minInterval);

  const timeoutId = window.setTimeout(() => {
    if (!source.muted) {
      playOneShot(ctxState, buffers, source);
    }
    scheduleRandomSound(ctxState, buffers, source, minInterval, maxInterval, schedulerState);
  }, nextDelay * 1000);

  schedulerState.randomSounds.set(source.id, { source, minInterval, maxInterval, timeoutId });
}

export function scheduleTyping(
  ctxState: AudioContextState,
  buffers: AudioBuffers,
  source: AudioSource,
  colleagues: Colleague[],
  schedulerState: SchedulerState
): void {
  const keyboardType: KeyboardType = source.keyboardType || 'membrane';
  const typingSpeed = source.typingSpeed || 0.3;
  const timingConfig = keyboardTimingByType[keyboardType];
  const baseVolume = keyboardVolumeByType[keyboardType];
  const sourceWithVolume = { ...source, baseVolume };

  const state: TypingState = {
    source: sourceWithVolume,
    isTyping: false,
    burstCount: 0,
    nextKeyTime: 0,
    pauseUntil: 0,
  };

  schedulerState.typingStates.set(source.id, state);

  const typeNextKey = () => {
    const now = Date.now();
    const typingState = schedulerState.typingStates.get(source.id);
    if (!typingState) return;

    const owner = colleagues.find(c => c.id === source.ownerId);
    const isOwnerWorking = owner && owner.state === 'working';

    if (!isOwnerWorking || source.muted) {
      typingState.timeoutId = window.setTimeout(typeNextKey, 500);
      return;
    }

    if (!typingState.isTyping) {
      if (Math.random() < 0.4 * typingSpeed) {
        typingState.isTyping = true;
        typingState.burstCount = Math.floor(3 + Math.random() * 15);
        typingState.nextKeyTime = now;
      } else {
        typingState.timeoutId = window.setTimeout(typeNextKey, 1000 + Math.random() * 2000);
        return;
      }
    }

    if (typingState.burstCount > 0) {
      if (now >= typingState.nextKeyTime) {
        const velocity = 0.4 + Math.random() * 0.6;
        playOneShot(ctxState, buffers, typingState.source, velocity);
        typingState.burstCount--;

        const keyInterval = (timingConfig.min + Math.random() * (timingConfig.max - timingConfig.min)) / typingSpeed;
        const burstGap = Math.random() < timingConfig.burstiness ? keyInterval * 3 : keyInterval;
        typingState.nextKeyTime = now + burstGap * 1000;
      }
      typingState.timeoutId = window.setTimeout(typeNextKey, 20);
    } else {
      typingState.isTyping = false;
      const pauseTime = 500 + Math.random() * 3000 / typingSpeed;
      typingState.pauseUntil = now + pauseTime;
      typingState.timeoutId = window.setTimeout(typeNextKey, pauseTime);
    }
  };

  state.timeoutId = window.setTimeout(typeNextKey, 1000 + Math.random() * 2000);
}

export function clearRandomSounds(schedulerState: SchedulerState): void {
  schedulerState.randomSounds.forEach((config) => {
    if (config.timeoutId) {
      clearTimeout(config.timeoutId);
    }
  });
  schedulerState.randomSounds.clear();
}

export function clearTypingStates(schedulerState: SchedulerState): void {
  schedulerState.typingStates.forEach((state) => {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }
  });
  schedulerState.typingStates.clear();
}

export function clearAllScheduled(schedulerState: SchedulerState): void {
  clearRandomSounds(schedulerState);
  clearTypingStates(schedulerState);
}

export function getRandomSoundIntervals(type: AudioSource['type']): { min: number; max: number } {
  const intervalMap: Record<string, { min: number; max: number }> = {
    mouse: { min: 0.5, max: 3 },
    door: { min: 30, max: 90 },
    phone: { min: 45, max: 120 },
  };
  return intervalMap[type] ?? { min: 3, max: 10 };
}
