import type { AudioSource, Position } from '@/types/office';
import type { SoundInstance } from '@/types/audio';
import type { AudioBuffers } from './bufferManager';
import { getBufferForType } from './bufferManager';

export interface AudioContextState {
  audioContext: AudioContext | null;
  masterGain: GainNode | null;
  listenerPos: Position;
  masterVolume: number;
  isMuted: boolean;
}

export function calculateCurrentVolume(
  source: AudioSource,
  listenerPos: Position,
  masterVolume: number,
  isMuted: boolean
): number {
  if (source.muted || isMuted) return 0;

  const dx = source.position.x - listenerPos.x;
  const dy = source.position.y - listenerPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = 100;
  const minDistance = 5;

  let distanceFactor = 1;
  if (distance > minDistance) {
    distanceFactor = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));
  }

  return source.baseVolume * distanceFactor * masterVolume;
}

export function calculateCurrentPan(source: AudioSource, listenerPos: Position): number {
  const dx = source.position.x - listenerPos.x;
  const maxPanDistance = 80;
  return Math.max(-1, Math.min(1, dx / maxPanDistance));
}

export function updateAllSoundVolumes(
  ctxState: AudioContextState,
  loopSounds: Map<string, SoundInstance>,
  audioSources: AudioSource[]
): void {
  const { audioContext, masterGain, listenerPos, masterVolume, isMuted } = ctxState;
  if (!audioContext || !masterGain) return;

  masterGain.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);

  loopSounds.forEach((sound, id) => {
    const source = audioSources.find(s => s.id === id);
    if (source) {
      const vol = calculateCurrentVolume(source, listenerPos, masterVolume, isMuted);
      const pan = calculateCurrentPan(source, listenerPos);
      sound.gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
      sound.pannerNode.pan.setValueAtTime(pan, audioContext.currentTime);
    }
  });
}

export function playLoopSound(
  ctxState: AudioContextState,
  buffers: AudioBuffers,
  source: AudioSource,
  loopSounds: Map<string, SoundInstance>
): void {
  const { audioContext, masterGain, listenerPos, masterVolume, isMuted } = ctxState;
  if (!audioContext || !masterGain) return;

  const buffer = getBufferForType(buffers, audioContext, source.type);
  if (!buffer) return;

  const soundSource = audioContext.createBufferSource();
  soundSource.buffer = buffer;
  soundSource.loop = source.loop;

  const gainNode = audioContext.createGain();
  const pannerNode = audioContext.createStereoPanner();

  const vol = calculateCurrentVolume(source, listenerPos, masterVolume, isMuted);
  const pan = calculateCurrentPan(source, listenerPos);
  gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
  pannerNode.pan.setValueAtTime(pan, audioContext.currentTime);

  soundSource.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(masterGain);

  soundSource.start();

  loopSounds.set(source.id, { source: soundSource, gainNode, pannerNode });
}

export function playOneShot(
  ctxState: AudioContextState,
  buffers: AudioBuffers,
  source: AudioSource,
  velocity?: number
): void {
  const { audioContext, masterGain, listenerPos, masterVolume, isMuted } = ctxState;
  if (!audioContext || !masterGain) return;

  const buffer = getBufferForType(buffers, audioContext, source.type, source.keyboardType, velocity);
  if (!buffer) return;

  const soundSource = audioContext.createBufferSource();
  soundSource.buffer = buffer;

  const gainNode = audioContext.createGain();
  const pannerNode = audioContext.createStereoPanner();

  const vol = calculateCurrentVolume(source, listenerPos, masterVolume, isMuted);
  const pan = calculateCurrentPan(source, listenerPos);

  gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
  pannerNode.pan.setValueAtTime(pan, audioContext.currentTime);

  soundSource.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(masterGain);

  soundSource.start();
  soundSource.onended = () => {
    soundSource.disconnect();
    gainNode.disconnect();
    pannerNode.disconnect();
  };
}

export function playColleagueSound(
  ctxState: AudioContextState,
  buffers: AudioBuffers,
  position: Position,
  soundType: AudioSource['type']
): void {
  const { audioContext, masterGain, listenerPos, masterVolume, isMuted } = ctxState;
  if (!audioContext || !masterGain) return;

  const buffer = getBufferForType(buffers, audioContext, soundType);
  if (!buffer) return;

  const soundSource = audioContext.createBufferSource();
  soundSource.buffer = buffer;

  const gainNode = audioContext.createGain();
  const pannerNode = audioContext.createStereoPanner();

  const dx = position.x - listenerPos.x;
  const dy = position.y - listenerPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 100;
  const minDistance = 5;
  let distanceFactor = 1;
  if (distance > minDistance) {
    distanceFactor = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));
  }

  const baseVolumeMap: Record<string, number> = {
    footstep: 0.12,
    greeting: 0.25,
    sip: 0.2,
    'print-page': 0.15,
    'meeting-talk': 0.2,
  };
  const baseVolume = baseVolumeMap[soundType] ?? 0.18;
  const vol = baseVolume * distanceFactor * masterVolume * (isMuted ? 0 : 1);

  const pan = Math.max(-1, Math.min(1, dx / 80));

  gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
  pannerNode.pan.setValueAtTime(pan, audioContext.currentTime);

  soundSource.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(masterGain);

  soundSource.start();
  soundSource.onended = () => {
    soundSource.disconnect();
    gainNode.disconnect();
    pannerNode.disconnect();
  };
}
