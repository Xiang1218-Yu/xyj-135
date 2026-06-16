import type { AudioSource, Colleague, Position } from '@/types/office';
import type { SoundInstance } from '@/types/audio';
import type { AudioBuffers } from './bufferManager';
import { createInitialBuffers, initAllBuffers } from './bufferManager';
import type { AudioContextState } from './audioPlayer';
import { playLoopSound, updateAllSoundVolumes, playColleagueSound } from './audioPlayer';
import type { SchedulerState } from './audioScheduler';
import { createSchedulerState, scheduleRandomSound, scheduleTyping, clearAllScheduled, getRandomSoundIntervals } from './audioScheduler';

export interface AudioEngine {
  audioContext: AudioContext | null;
  masterGain: GainNode | null;
  buffers: AudioBuffers;
  loopSounds: Map<string, SoundInstance>;
  schedulerState: SchedulerState;
  processedSoundEvents: Set<string>;
  listenerPos: Position;
  masterVolume: number;
  isMuted: boolean;
}

export function createAudioEngine(): AudioEngine {
  return {
    audioContext: null,
    masterGain: null,
    buffers: createInitialBuffers(),
    loopSounds: new Map(),
    schedulerState: createSchedulerState(),
    processedSoundEvents: new Set(),
    listenerPos: { x: 50, y: 50 },
    masterVolume: 0.7,
    isMuted: false,
  };
}

export function initAudioContext(engine: AudioEngine): AudioContext | null {
  if (!engine.audioContext) {
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    engine.audioContext = new AudioContextCtor();
    const ctx = engine.audioContext;

    engine.masterGain = ctx.createGain();
    engine.masterGain.connect(ctx.destination);

    initAllBuffers(ctx, engine.buffers);
  }

  if (engine.audioContext.state === 'suspended') {
    engine.audioContext.resume();
  }

  return engine.audioContext;
}

export function getContextState(engine: AudioEngine): AudioContextState {
  return {
    audioContext: engine.audioContext,
    masterGain: engine.masterGain,
    listenerPos: engine.listenerPos,
    masterVolume: engine.masterVolume,
    isMuted: engine.isMuted,
  };
}

export function updateListenerPos(engine: AudioEngine, pos: Position, audioSources: AudioSource[]): void {
  engine.listenerPos = pos;
  updateAllSoundVolumes(getContextState(engine), engine.loopSounds, audioSources);
}

export function updateMasterVolume(engine: AudioEngine, volume: number, audioSources: AudioSource[]): void {
  engine.masterVolume = volume;
  updateAllSoundVolumes(getContextState(engine), engine.loopSounds, audioSources);
}

export function updateIsMuted(engine: AudioEngine, muted: boolean, audioSources: AudioSource[]): void {
  engine.isMuted = muted;
  updateAllSoundVolumes(getContextState(engine), engine.loopSounds, audioSources);
}

export function stopLoopSounds(engine: AudioEngine): void {
  engine.loopSounds.forEach((sound) => {
    try { sound.source.stop(); } catch { /* ignore */ }
  });
  engine.loopSounds.clear();
}

export function startAllSounds(
  engine: AudioEngine,
  audioSources: AudioSource[],
  colleagues: Colleague[]
): void {
  initAudioContext(engine);
  if (!engine.audioContext) return;

  stopLoopSounds(engine);
  clearAllScheduled(engine.schedulerState);

  const ctxState = getContextState(engine);

  audioSources.forEach((source) => {
    if (source.loop) {
      playLoopSound(ctxState, engine.buffers, source, engine.loopSounds);
    } else if (source.type === 'keyboard' || source.type === 'typing') {
      scheduleTyping(ctxState, engine.buffers, source, colleagues, engine.schedulerState);
    } else {
      const { min, max } = getRandomSoundIntervals(source.type);
      scheduleRandomSound(ctxState, engine.buffers, source, min, max, engine.schedulerState);
    }
  });
}

export function stopAllSounds(engine: AudioEngine): void {
  stopLoopSounds(engine);
  clearAllScheduled(engine.schedulerState);
}

export function processColleagueSoundEvents(
  engine: AudioEngine,
  events: Array<{ id: string; position: Position; soundType: AudioSource['type'] }>,
  onConsume: (eventId: string) => void
): void {
  const ctxState = getContextState(engine);

  events.forEach((event) => {
    if (!engine.processedSoundEvents.has(event.id)) {
      engine.processedSoundEvents.add(event.id);
      playColleagueSound(ctxState, engine.buffers, event.position, event.soundType);
      setTimeout(() => {
        onConsume(event.id);
        engine.processedSoundEvents.delete(event.id);
      }, 2000);
    }
  });
}
