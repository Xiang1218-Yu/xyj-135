import type { KeyboardType } from '@/types/office';
import type { NoiseType, KeyboardSoundConfig } from '@/types/audio';
import { KEYBOARD_SOUND_CONFIGS } from '@/types/audio';

export function createNoiseBuffer(
  audioContext: AudioContext,
  type: NoiseType = 'white'
): AudioBuffer {
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

export function createKeyboardSound(
  audioContext: AudioContext,
  keyboardType: KeyboardType,
  velocity: number = 0.7
): AudioBuffer {
  const config: KeyboardSoundConfig = KEYBOARD_SOUND_CONFIGS[keyboardType];
  const sampleRate = audioContext.sampleRate;
  const baseFreq = config.baseFreq + Math.random() * (keyboardType === 'mechanical-loud' ? 200 : keyboardType === 'mechanical-quiet' ? 150 : 100);
  
  const adjustedBaseFreq = baseFreq * (0.9 + Math.random() * 0.2);
  const volumeAdjust = 0.5 + velocity * 0.5;
  
  const buffer = audioContext.createBuffer(1, Math.floor(config.duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);
  
  const keyType = Math.random();
  let keyClickFreq = adjustedBaseFreq;
  let keyNoiseMix = config.noiseMix;
  let keyClickMix = config.clickMix;
  let decay = config.decay;
  
  if (keyType >= 0.85) {
    if (keyType < 0.95) {
      keyClickFreq = adjustedBaseFreq * 0.7;
      keyClickMix *= 1.1;
    } else {
      decay *= 0.6;
      keyClickMix *= 1.3;
    }
  } else if (keyType >= 0.7) {
    keyClickFreq = adjustedBaseFreq * 1.3;
    keyClickMix *= 1.2;
    keyNoiseMix *= 1.1;
  }
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    
    let envelope: number;
    if (t < config.attack) {
      envelope = t / config.attack;
    } else {
      envelope = Math.exp(-(t - config.attack) * decay);
    }
    
    const noise = (Math.random() * 2 - 1) * config.brightness;
    const click = Math.sin(2 * Math.PI * keyClickFreq * t + Math.sin(2 * Math.PI * keyClickFreq * 0.5 * t) * 0.2) * 0.3;
    const body = Math.sin(2 * Math.PI * keyClickFreq * 0.5 * t) * 0.2;
    
    data[i] = (noise * keyNoiseMix + click * keyClickMix + body * 0.3) * envelope * 0.5 * volumeAdjust;
  }
  
  return buffer;
}

export function createMouseClickSound(audioContext: AudioContext): AudioBuffer {
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

export function createCoffeeMachineSound(audioContext: AudioContext): AudioBuffer {
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

export function createPrinterSound(audioContext: AudioContext): AudioBuffer {
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

export function createACSound(audioContext: AudioContext): AudioBuffer {
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

export function createConversationSound(audioContext: AudioContext): AudioBuffer {
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

export function createDoorSound(audioContext: AudioContext): AudioBuffer {
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

export function createPhoneSound(audioContext: AudioContext): AudioBuffer {
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

export function createFootstepSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.15;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 40);
    const lowThud = Math.sin(2 * Math.PI * 80 * t) * Math.exp(-t * 30);
    const highScuff = (Math.random() * 2 - 1) * Math.exp(-t * 60);
    data[i] = (lowThud * 0.6 + highScuff * 0.4) * envelope * 0.35;
  }

  return buffer;
}

export function createGreetingSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.35;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin(Math.PI * t / duration) * 0.8;
    const pitch = 300 + Math.sin(2 * Math.PI * 6 * t) * 80;
    const formant1 = Math.sin(2 * Math.PI * pitch * t) * 0.4;
    const formant2 = Math.sin(2 * Math.PI * pitch * 1.6 * t) * 0.25;
    const noise = (Math.random() * 2 - 1) * 0.1;
    data[i] = (formant1 + formant2 + noise) * envelope * 0.35;
  }

  return buffer;
}

export function createSipSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.3;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin(Math.PI * t / duration);
    const slurp = (Math.random() * 2 - 1) * Math.exp(-Math.pow((t - 0.15) * 20, 2));
    const swallow = Math.sin(2 * Math.PI * 150 * t) * Math.exp(-(t - 0.2) * 15) * 0.3;
    data[i] = (slurp * 0.7 + swallow) * envelope * 0.35;
  }

  return buffer;
}

export function createPrintPageSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.8;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const headMove = Math.sin(2 * Math.PI * 8 * t) * 0.15;
    const printNoise = (Math.random() * 2 - 1) * 0.5;
    const feedClick = t > 0.7 ? Math.exp(-(t - 0.7) * 30) * 0.4 : 0;
    const envelope = Math.min(1, t * 5) * Math.min(1, (duration - t) * 5);
    data[i] = (headMove + printNoise * 0.3 + feedClick) * envelope * 0.3;
  }

  return buffer;
}

export function createMeetingTalkSound(audioContext: AudioContext): AudioBuffer {
  const duration = 3;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const speechEnv = Math.max(0, Math.sin(2 * Math.PI * 1.5 * t) * 0.5 + 0.3);
    const noise = (Math.random() * 2 - 1);
    const formant1 = Math.sin(2 * Math.PI * 450 * (1 + Math.sin(t * 2) * 0.08) * t) * 0.25;
    const formant2 = Math.sin(2 * Math.PI * 900 * (1 + Math.sin(t * 3) * 0.1) * t) * 0.15;
    data[i] = (formant1 + formant2 + noise * 0.15) * speechEnv * 0.25;
  }

  return buffer;
}

export function createPaperHandleSound(audioContext: AudioContext): AudioBuffer {
  const duration = 0.5;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, Math.floor(duration * sampleRate), sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const rustle = (Math.random() * 2 - 1) * Math.sin(Math.PI * t / duration);
    const crisp = (Math.random() * 2 - 1) * Math.exp(-Math.pow((t - 0.25) * 15, 2)) * 0.5;
    data[i] = (rustle * 0.6 + crisp) * 0.3;
  }

  return buffer;
}
