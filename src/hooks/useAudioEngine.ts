import { useEffect, useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import { calculateVolume, calculatePan } from '@/utils/audioUtils';
import type { AudioSource } from '@/types/office';

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

function createKeyboardSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.05;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 80);
    const noise = Math.random() * 2 - 1;
    const click = Math.sin(2 * Math.PI * 800 * t) * 0.3;
    data[i] = (noise * 0.7 + click) * envelope * 0.5;
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

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const loopSoundsRef = useRef<Map<string, SoundInstance>>(new Map());
  const randomSoundsRef = useRef<Map<string, RandomSoundConfig>>(new Map());
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const keyboardBufferRef = useRef<AudioBuffer | null>(null);
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

  const { audioSources, listenerPosition, masterVolume, isMuted, isPlaying } = useOfficeStore();

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
      keyboardBufferRef.current = createKeyboardSound(ctx);
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

  const getBufferForType = useCallback((type: AudioSource['type']): AudioBuffer | null => {
    switch (type) {
      case 'keyboard':
      case 'typing':
        return keyboardBufferRef.current;
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

  const playOneShot = useCallback((source: AudioSource) => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return;
    
    const buffer = getBufferForType(source.type);
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
    
    audioSources.forEach((source) => {
      if (source.loop) {
        playLoopSound(source);
      } else {
        let minInterval = 3;
        let maxInterval = 10;
        
        if (source.type === 'keyboard' || source.type === 'typing') {
          minInterval = 0.1;
          maxInterval = 0.8;
        } else if (source.type === 'mouse') {
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
  }, [audioSources, initAudioContext, playLoopSound, scheduleRandomSound]);

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
