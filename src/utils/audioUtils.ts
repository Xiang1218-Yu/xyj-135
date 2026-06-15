import type { Position, AudioSource } from '@/types/office';

export function calculateDistance(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateVolume(
  source: AudioSource,
  listenerPosition: Position,
  masterVolume: number
): number {
  if (source.muted) return 0;
  
  const distance = calculateDistance(source.position, listenerPosition);
  const maxDistance = 100;
  const minDistance = 10;
  
  let distanceFactor = 1;
  if (distance > minDistance) {
    distanceFactor = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));
  }
  
  return source.baseVolume * distanceFactor * masterVolume;
}

export function calculatePan(
  sourcePosition: Position,
  listenerPosition: Position
): number {
  const dx = sourcePosition.x - listenerPosition.x;
  const maxPanDistance = 80;
  return Math.max(-1, Math.min(1, dx / maxPanDistance));
}
