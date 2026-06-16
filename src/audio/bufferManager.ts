import type { AudioSource, KeyboardType } from '@/types/office';
import type { SoundBufferKey } from '@/types/audio';
import {
  createNoiseBuffer,
  createKeyboardSound,
  createMouseClickSound,
  createCoffeeMachineSound,
  createPrinterSound,
  createACSound,
  createConversationSound,
  createDoorSound,
  createPhoneSound,
  createFootstepSound,
  createGreetingSound,
  createSipSound,
  createPrintPageSound,
  createMeetingTalkSound,
  createPaperHandleSound,
} from './soundGenerators';

export interface AudioBuffers {
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
}

export function createInitialBuffers(): AudioBuffers {
  return {
    noiseBuffer: null,
    mouseBuffer: null,
    coffeeBuffer: null,
    printerBuffer: null,
    acBuffer: null,
    conversationBuffer: null,
    doorBuffer: null,
    phoneBuffer: null,
    footstepBuffer: null,
    greetingBuffer: null,
    sipBuffer: null,
    printPageBuffer: null,
    meetingTalkBuffer: null,
    paperHandleBuffer: null,
  };
}

export function initAllBuffers(audioContext: AudioContext, buffers: AudioBuffers): void {
  buffers.noiseBuffer = createNoiseBuffer(audioContext, 'pink');
  buffers.mouseBuffer = createMouseClickSound(audioContext);
  buffers.coffeeBuffer = createCoffeeMachineSound(audioContext);
  buffers.printerBuffer = createPrinterSound(audioContext);
  buffers.acBuffer = createACSound(audioContext);
  buffers.conversationBuffer = createConversationSound(audioContext);
  buffers.doorBuffer = createDoorSound(audioContext);
  buffers.phoneBuffer = createPhoneSound(audioContext);
  buffers.footstepBuffer = createFootstepSound(audioContext);
  buffers.greetingBuffer = createGreetingSound(audioContext);
  buffers.sipBuffer = createSipSound(audioContext);
  buffers.printPageBuffer = createPrintPageSound(audioContext);
  buffers.meetingTalkBuffer = createMeetingTalkSound(audioContext);
  buffers.paperHandleBuffer = createPaperHandleSound(audioContext);
}

export function getBufferForType(
  buffers: AudioBuffers,
  audioContext: AudioContext | null,
  type: AudioSource['type'],
  keyboardType?: KeyboardType,
  velocity?: number
): AudioBuffer | null {
  if (!audioContext) return null;

  const bufferMap: Record<AudioSource['type'], () => AudioBuffer | null> = {
    keyboard: () => createKeyboardSound(audioContext, keyboardType || 'membrane', velocity),
    typing: () => createKeyboardSound(audioContext, keyboardType || 'membrane', velocity),
    mouse: () => buffers.mouseBuffer,
    coffee: () => buffers.coffeeBuffer,
    printer: () => buffers.printerBuffer,
    ac: () => buffers.acBuffer,
    conversation: () => buffers.conversationBuffer,
    door: () => buffers.doorBuffer,
    phone: () => buffers.phoneBuffer,
    footstep: () => buffers.footstepBuffer,
    greeting: () => buffers.greetingBuffer,
    sip: () => buffers.sipBuffer,
    'print-page': () => buffers.printPageBuffer,
    'meeting-talk': () => buffers.meetingTalkBuffer,
    'paper-handle': () => buffers.paperHandleBuffer,
    ambient: () => buffers.noiseBuffer,
  };

  return bufferMap[type]?.() ?? buffers.noiseBuffer;
}

export function getBufferKeyForType(type: AudioSource['type']): SoundBufferKey | null {
  const keyMap: Partial<Record<AudioSource['type'], SoundBufferKey>> = {
    mouse: 'mouseBuffer',
    coffee: 'coffeeBuffer',
    printer: 'printerBuffer',
    ac: 'acBuffer',
    conversation: 'conversationBuffer',
    door: 'doorBuffer',
    phone: 'phoneBuffer',
    footstep: 'footstepBuffer',
    greeting: 'greetingBuffer',
    sip: 'sipBuffer',
    'print-page': 'printPageBuffer',
    'meeting-talk': 'meetingTalkBuffer',
    'paper-handle': 'paperHandleBuffer',
    ambient: 'noiseBuffer',
  };
  return keyMap[type] ?? null;
}
