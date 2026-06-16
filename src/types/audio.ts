import type { AudioSource, KeyboardType, Position } from './office';

export type NoiseType = 'white' | 'pink' | 'brown';

export interface KeyboardSoundConfig {
  duration: number;
  baseFreq: number;
  noiseMix: number;
  clickMix: number;
  attack: number;
  decay: number;
  brightness: number;
}

export interface SoundInstance {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  timeoutId?: number;
}

export interface RandomSoundConfig {
  source: AudioSource;
  minInterval: number;
  maxInterval: number;
  timeoutId?: number;
}

export interface TypingState {
  source: AudioSource;
  isTyping: boolean;
  burstCount: number;
  nextKeyTime: number;
  pauseUntil: number;
  timeoutId?: number;
}

export interface KeyboardTimingConfig {
  min: number;
  max: number;
  burstiness: number;
}

export interface AudioEngineState {
  audioContext: AudioContext | null;
  loopSounds: Map<string, SoundInstance>;
  randomSounds: Map<string, RandomSoundConfig>;
  typingStates: Map<string, TypingState>;
  noiseBuffer: AudioBuffer | null;
  mouseBuffer: AudioBuffer | null;
  coffeeBuffer: AudioBuffer | null;
  printerBuffer: AudioBuffer | null;
  acBuffer: AudioBuffer | null;
  conversationBuffer: AudioBuffer | null;
  doorBuffer: AudioBuffer | null;
  phoneBuffer: AudioBuffer | null;
  footstepBuffer: AudioBuffer | null;
  greetingBuffer: AudioBuffer | null;
  sipBuffer: AudioBuffer | null;
  printPageBuffer: AudioBuffer | null;
  meetingTalkBuffer: AudioBuffer | null;
  paperHandleBuffer: AudioBuffer | null;
  masterGain: GainNode | null;
  listenerPos: Position;
  masterVolume: number;
  isMuted: boolean;
  processedSoundEvents: Set<string>;
}

export type SoundBufferKey =
  | 'noiseBuffer'
  | 'mouseBuffer'
  | 'coffeeBuffer'
  | 'printerBuffer'
  | 'acBuffer'
  | 'conversationBuffer'
  | 'doorBuffer'
  | 'phoneBuffer'
  | 'footstepBuffer'
  | 'greetingBuffer'
  | 'sipBuffer'
  | 'printPageBuffer'
  | 'meetingTalkBuffer'
  | 'paperHandleBuffer';

export const KEYBOARD_SOUND_CONFIGS: Record<KeyboardType, KeyboardSoundConfig> = {
  'mechanical-loud': {
    duration: 0.06,
    baseFreq: 900,
    noiseMix: 0.6,
    clickMix: 0.5,
    attack: 0.002,
    decay: 60,
    brightness: 1.2,
  },
  'mechanical-quiet': {
    duration: 0.045,
    baseFreq: 700,
    noiseMix: 0.5,
    clickMix: 0.4,
    attack: 0.002,
    decay: 90,
    brightness: 0.9,
  },
  'membrane': {
    duration: 0.04,
    baseFreq: 500,
    noiseMix: 0.8,
    clickMix: 0.2,
    attack: 0.002,
    decay: 100,
    brightness: 0.7,
  },
  'laptop': {
    duration: 0.035,
    baseFreq: 400,
    noiseMix: 0.7,
    clickMix: 0.15,
    attack: 0.002,
    decay: 120,
    brightness: 0.5,
  },
};
