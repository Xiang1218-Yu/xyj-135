import { useEffect, useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import { calculateVolume, calculatePan } from '@/utils/audioUtils';
import type { AudioSource, KeyboardType } from '@/types/office';
import { keyboardVolumeByType, keyboardTimingByType } from '@/data/audioSources';

function createNoiseBuffer(audioContext: AudioContext, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
  }

  return buffer;
}

function createKeyboardSound(
  audioContext: AudioContext,
  keyboardType: KeyboardType,
  velocity: number = 0.7
): AudioBuffer {
  let duration = 0.05;
  let sampleRate = audioContext.sampleRate;
  let baseFreq = 800;
  let noiseMix = 0.7;
  let clickMix = 0.3;
  let attack = 0.002;
  let decay = 80;
  let brightness = 1.0;
  
  switch (keyboardType) {
    case 'mechanical-loud':
      duration = 0.06;
      baseFreq = 900 + Math.random() * 200;
      noiseMix = 0.6;
      clickMix = 0.5;
      decay = 60;
      brightness = 1.2;
      break;
    case 'mechanical-quiet':
      duration = 0.045;
      baseFreq = 700 + Math.random() * 150;
      noiseMix = 0.5;
      clickMix = 0.4;
      decay = 90;
      brightness = 0.9;
      break;
    case 'membrane':
      duration = 0.04;
      baseFreq = 500 + Math.random() * 100;
      noiseMix = 0.8;
      clickMix = 0.2;
      decay = 100;
      brightness = 0.7;
      break;
    case 'laptop':
      duration = 0.035;
      baseFreq = 400 + Math.random() * 80;
      noiseMix = 0.7;
      clickMix = 0.15;
      decay = 120;
      brightness = 0.5;
      break;
  }
  
  baseFreq *= (0.9 + Math.random() * 0.2);
  const volumeAdjust = 0.5 + velocity * 0.5;
  
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  const keyType = Math.random();
  let keyClickFreq = baseFreq;
  let keyNoiseMix = noiseMix;
  let keyClickMix = clickMix;
  
  if (keyType < 0.7) {
  } else if (keyType < 0.85) {
    keyClickFreq = baseFreq * 1.3;
    keyClickMix *= 1.2;
    keyNoiseMix *= 1.1;
  } else if (keyType < 0.95) {
    keyClickFreq = baseFreq * 0.7;
    keyClickMix *= 1.1;
  } else {
    duration *= 2;
    decay *= 0.6;
    keyClickMix *= 1.3;
  }
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    
    let envelope: number;
    if (t < attack) {
      envelope = t / attack;
    } else {
      envelope = Math.exp(-(t - attack) * decay);
    }
    
    const noise = (Math.random() * 2 - 1) * brightness;
    const click = Math.sin(2 * Math.PI * keyClickFreq * t + Math.sin(2 * Math.PI * keyClickFreq * 0.5 * t) * 0.2) * 0.3;
    const body = Math.sin(2 * Math.PI * keyClickFreq * 0.5 * t) * 0.2;
    
    data[i] = (noise * keyNoiseMix + click * keyClickMix + body * 0.3) * envelope * 0.5 * volumeAdjust;
  }
  
  return buffer;
}

function createMouseClickSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.03;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 150);
    const noise = Math.random() * 2 - 1;
    data[i] = noise * envelope * 0.6;
  }
  
  return buffer;
}

function createCoffeeMachineSound(audioContext: AudioContext): AudioBuffer {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioContext.sampleRate;
    const noise = Math.random() * 2 - 1;
    const gurgle = Math.sin(2 * Math.PI * 100 * t + Math.sin(2 * Math.PI * 3 * t) * 5) * 0.3;
    const hiss = noise * 0.4;
    const steam = Math.sin(2 * Math.PI * 2000 * t) * Math.random() * 0.1;
    output[i] = (gurgle + hiss + steam) * 0.2;
  }
  
  return buffer;
}

function createPrinterSound(audioContext: AudioContext): AudioBuffer {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioContext.sampleRate;
    const lineCycle = Math.sin(2 * Math.PI * 0.5 * t);
    const printNoise = Math.random() * 2 - 1;
    const carriageMove = Math.sin(2 * Math.PI * 20 * t) * 0.1;
    const paperFeed = lineCycle > 0.9 ? 0.2 : 0;
    
    output[i] = (printNoise * 0.3 + carriageMove + paperFeed) * 0.15;
  }
  
  return buffer;
}

function createACSound(audioContext: AudioContext): AudioBuffer {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.999 * b0 + white * 0.001;
    b1 = 0.995 * b1 + white * 0.005;
    b2 = 0.98 * b2 + white * 0.02;
    b3 = 0.9 * b3 + white * 0.1;
    const rumble = b0 * 2 + b1 * 1.5 + b2 * 0.5 + b3 * 0.2;
    output[i] = rumble * 0.15;
  }
  
  return buffer;
}

function createConversationSound(audioContext: AudioContext): AudioBuffer {
  const bufferSize = 4 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioContext.sampleRate;
    const speechEnv = Math.max(0, Math.sin(2 * Math.PI * 2 * t) * 0.5 + 0.5);
    const noise = Math.random() * 2 - 1;
    
    const formant1 = Math.sin(2 * Math.PI * 500 * (1 + Math.sin(t * 3) * 0.1) * t) * 0.3;
    const formant2 = Math.sin(2 * Math.PI * 1000 * (1 + Math.sin(t * 4) * 0.15) * t) * 0.2;
    const voice = formant1 + formant2;
    
    output[i] = (voice + noise * 0.2) * speechEnv * 0.2;
  }
  
  return buffer;
}

function createDoorSound(audioContext: AudioContext): AudioBuffer {
  const duration = 1.5;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const hingeSqueak = Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 2) * 0.3;
    const thud = Math.exp(-Math.pow((t - 1.2) * 10, 2)) * 0.5;
    const noise = (Math.random() * 2 - 1) * 0.1;
    data[i] = hingeSqueak + thud + noise;
  }
  
  return buffer;
}

function createPhoneSound(audioContext: AudioContext): AudioBuffer {
  const duration = 2;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const ringEnv = Math.sin(2 * Math.PI * 1 * t) > 0 ? 1 : 0;
    const ringTone1 = Math.sin(2 * Math.PI * 800 * t) * 0.5;
    const ringTone2 = Math.sin(2 * Math.PI * 1200 * t) * 0.3;
    data[i] = (ringTone1 + ringTone2) * ringEnv * 0.3;
  }
  
  return buffer;
}

interface SoundInstance {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  timeoutId?: number;
}

interface RandomSoundConfig {
  source: AudioSource;
  minInterval: number;
  maxInterval: number;
  timeoutId?: number;
}

interface TypingState {
  source: AudioSource;
  isTyping: boolean;
  burstCount: number;
  nextKeyTime: number;
  pauseUntil: number;
  timeoutId?: number;
}

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const loopSoundsRef = useRef<Map<string, SoundInstance>>(new Map());
  const randomSoundsRef = useRef<Map<string, RandomSoundConfig>>(new Map());
  const typingStatesRef = useRef<Map<string, TypingState>>(new Map());
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const mouseBufferRef = useRef<AudioBuffer | null>(null);
  const coffeeBufferRef = useRef<AudioBuffer | null>(null);
  const printerBufferRef = useRef<AudioBuffer | null>(null);
  const acBufferRef = useRef<AudioBuffer | null>(null);
  const conversationBufferRef = useRef<AudioBuffer | null>(null);
  const doorBufferRef = useRef<AudioBuffer | null>(null);
  const phoneBufferRef = useRef<AudioBuffer | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const listenerPosRef = useRef({ x: 50, y: 50 });
  const masterVolumeRef = useRef(0.7);
  const isMutedRef = useRef(false);

  const { audioSources, colleagues, listenerPosition, masterVolume, isMuted, isPlaying } = useOfficeStore();

  useEffect(() => {
    listenerPosRef.current = listenerPosition;
    updateAllSoundVolumes();
  }, [listenerPosition]);

  useEffect(() => {
    masterVolumeRef.current = masterVolume;
    updateAllSoundVolumes();
  }, [masterVolume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    updateAllSoundVolumes();
  }, [isMuted]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;
      
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.connect(ctx.destination);
      
      noiseBufferRef.current = createNoiseBuffer(ctx, 'pink');
      mouseBufferRef.current = createMouseClickSound(ctx);
      coffeeBufferRef.current = createCoffeeMachineSound(ctx);
      printerBufferRef.current = createPrinterSound(ctx);
      acBufferRef.current = createACSound(ctx);
      conversationBufferRef.current = createConversationSound(ctx);
      doorBufferRef.current = createDoorSound(ctx);
      phoneBufferRef.current = createPhoneSound(ctx);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  }, []);

  const getBufferForType = useCallback((type: AudioSource['type'], keyboardType?: KeyboardType, velocity?: number): AudioBuffer | null => {
    const ctx = audioContextRef.current;
    if (!ctx) return null;
    
    switch (type) {
      case 'keyboard':
      case 'typing':
        return createKeyboardSound(ctx, keyboardType || 'membrane', velocity);
      case 'mouse':
        return mouseBufferRef.current;
      case 'coffee':
        return coffeeBufferRef.current;
      case 'printer':
        return printerBufferRef.current;
      case 'ac':
        return acBufferRef.current;
      case 'conversation':
        return conversationBufferRef.current;
      case 'door':
        return doorBufferRef.current;
      case 'phone':
        return phoneBufferRef.current;
      case 'ambient':
      default:
        return noiseBufferRef.current;
    }
  }, []);

  const calculateCurrentVolume = useCallback((source: AudioSource): number => {
    if (source.muted || isMutedRef.current) return 0;
    
    const pos = listenerPosRef.current;
    const dx = source.position.x - pos.x;
    const dy = source.position.y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = 100;
    const minDistance = 5;
    
    let distanceFactor = 1;
    if (distance > minDistance) {
      distanceFactor = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));
    }
    
    return source.baseVolume * distanceFactor * masterVolumeRef.current;
  }, []);

  const calculateCurrentPan = useCallback((source: AudioSource): number => {
    const pos = listenerPosRef.current;
    const dx = source.position.x - pos.x;
    const maxPanDistance = 80;
    return Math.max(-1, Math.min(1, dx / maxPanDistance));
  }, []);

  const updateAllSoundVolumes = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return;

    masterGainRef.current.gain.setValueAtTime(isMutedRef.current ? 0 : 1, ctx.currentTime);

    loopSoundsRef.current.forEach((sound, id) => {
      const source = audioSources.find(s => s.id === id);
      if (source) {
        const vol = calculateCurrentVolume(source);
        const pan = calculateCurrentPan(source);
        sound.gainNode.gain.setValueAtTime(vol, ctx.currentTime);
        sound.pannerNode.pan.setValueAtTime(pan, ctx.currentTime);
      }
    });
  }, [audioSources, calculateCurrentVolume, calculateCurrentPan]);

  const playLoopSound = useCallback((source: AudioSource) => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return;
    
    const buffer = getBufferForType(source.type);
    if (!buffer) return;
    
    const soundSource = ctx.createBufferSource();
    soundSource.buffer = buffer;
    soundSource.loop = source.loop;
    
    const gainNode = ctx.createGain();
    const pannerNode = ctx.createStereoPanner();
    
    const vol = calculateCurrentVolume(source);
    const pan = calculateCurrentPan(source);
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    pannerNode.pan.setValueAtTime(pan, ctx.currentTime);
    
    soundSource.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(masterGainRef.current);
    
    soundSource.start();
    
    loopSoundsRef.current.set(source.id, { source: soundSource, gainNode, pannerNode });
  }, [getBufferForType, calculateCurrentVolume, calculateCurrentPan]);

  const playOneShot = useCallback((source: AudioSource, velocity?: number) => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return;
    
    const buffer = getBufferForType(source.type, source.keyboardType, velocity);
    if (!buffer) return;

    const soundSource = ctx.createBufferSource();
    soundSource.buffer = buffer;
    
    const gainNode = ctx.createGain();
    const pannerNode = ctx.createStereoPanner();
    
    const vol = calculateCurrentVolume(source);
    const pan = calculateCurrentPan(source);
    
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    pannerNode.pan.setValueAtTime(pan, ctx.currentTime);
    
    soundSource.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(masterGainRef.current);
    
    soundSource.start();
    soundSource.onended = () => {
      soundSource.disconnect();
      gainNode.disconnect();
      pannerNode.disconnect();
    };
  }, [getBufferForType, calculateCurrentVolume, calculateCurrentPan]);

  const scheduleRandomSound = useCallback((source: AudioSource, minInterval: number, maxInterval: number) => {
    const nextDelay = minInterval + Math.random() * (maxInterval - minInterval);
    
    const timeoutId = window.setTimeout(() => {
      if (!source.muted) {
        playOneShot(source);
      }
      scheduleRandomSound(source, minInterval, maxInterval);
    }, nextDelay * 1000);

    randomSoundsRef.current.set(source.id, { source, minInterval, maxInterval, timeoutId });
  }, [playOneShot]);

  const scheduleTyping = useCallback((source: AudioSource) => {
    const keyboardType = source.keyboardType || 'membrane';
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
    
    typingStatesRef.current.set(source.id, state);
    
    const typeNextKey = () => {
      const now = Date.now();
      const typingState = typingStatesRef.current.get(source.id);
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
          playOneShot(typingState.source, velocity);
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
  }, [colleagues, playOneShot]);

  const startAllSounds = useCallback(() => {
    initAudioContext();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    loopSoundsRef.current.forEach((sound) => {
      try { sound.source.stop(); } catch (e) {}
    });
    loopSoundsRef.current.clear();

    randomSoundsRef.current.forEach((config) => {
      if (config.timeoutId) {
        clearTimeout(config.timeoutId);
      }
    });
    randomSoundsRef.current.clear();
    
    typingStatesRef.current.forEach((state) => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
    });
    typingStatesRef.current.clear();
    
    audioSources.forEach((source) => {
      if (source.loop) {
        playLoopSound(source);
      } else if (source.type === 'keyboard' || source.type === 'typing') {
        scheduleTyping(source);
      } else {
        let minInterval = 3;
        let maxInterval = 10;
        
        if (source.type === 'mouse') {
          minInterval = 0.5;
          maxInterval = 3;
        } else if (source.type === 'door') {
          minInterval = 30;
          maxInterval = 90;
        } else if (source.type === 'phone') {
          minInterval = 45;
          maxInterval = 120;
        }
        
        scheduleRandomSound(source, minInterval, maxInterval);
      }
    });
  }, [audioSources, initAudioContext, playLoopSound, scheduleRandomSound, scheduleTyping]);

  const stopAllSounds = useCallback(() => {
    loopSoundsRef.current.forEach((sound) => {
      try { sound.source.stop(); } catch (e) {}
    });
    loopSoundsRef.current.clear();

    randomSoundsRef.current.forEach((config) => {
      if (config.timeoutId) {
        clearTimeout(config.timeoutId);
      }
    });
    randomSoundsRef.current.clear();
    
    typingStatesRef.current.forEach((state) => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
    });
    typingStatesRef.current.clear();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAllSounds();
    } else {
      stopAllSounds();
    }
    
    return () => {
      stopAllSounds();
    };
  }, [isPlaying, startAllSounds, stopAllSounds]);

  useEffect(() => {
    updateAllSoundVolumes();
  }, [audioSources, updateAllSoundVolumes]);

  return {
    initAudioContext,
    startAllSounds,
    stopAllSounds,
    updateAllSoundVolumes,
    isAudioReady: !!audioContextRef.current,
  };
}
