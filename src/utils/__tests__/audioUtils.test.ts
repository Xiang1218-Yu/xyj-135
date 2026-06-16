import { describe, it, expect } from 'vitest';
import { calculateDistance, calculateVolume, calculatePan } from '../audioUtils';
import type { AudioSource, Position } from '@/types/office';

describe('audioUtils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between same point as 0', () => {
      const a: Position = { x: 0, y: 0 };
      expect(calculateDistance(a, a)).toBe(0);
    });

    it('should calculate horizontal distance correctly', () => {
      const a: Position = { x: 0, y: 0 };
      const b: Position = { x: 3, y: 0 };
      expect(calculateDistance(a, b)).toBe(3);
    });

    it('should calculate vertical distance correctly', () => {
      const a: Position = { x: 0, y: 0 };
      const b: Position = { x: 0, y: 4 };
      expect(calculateDistance(a, b)).toBe(4);
    });

    it('should calculate diagonal distance correctly (3-4-5 triangle)', () => {
      const a: Position = { x: 0, y: 0 };
      const b: Position = { x: 3, y: 4 };
      expect(calculateDistance(a, b)).toBe(5);
    });

    it('should handle negative coordinates correctly', () => {
      const a: Position = { x: -1, y: -1 };
      const b: Position = { x: 2, y: 3 };
      expect(calculateDistance(a, b)).toBe(5);
    });
  });

  describe('calculateVolume', () => {
    const listener: Position = { x: 50, y: 50 };

    it('should return 0 when source is muted', () => {
      const source: AudioSource = {
        id: 'test',
        name: 'test',
        type: 'ambient',
        position: { x: 50, y: 50 },
        baseVolume: 0.5,
        muted: true,
        loop: false,
        category: 'ambient',
      };
      expect(calculateVolume(source, listener, 0.7)).toBe(0);
    });

    it('should return full volume when distance is within minDistance', () => {
      const source: AudioSource = {
        id: 'test',
        name: 'test',
        type: 'ambient',
        position: { x: 50, y: 55 },
        baseVolume: 0.5,
        muted: false,
        loop: false,
        category: 'ambient',
      };
      expect(calculateVolume(source, listener, 1)).toBe(0.5);
    });

    it('should return 0 when distance exceeds maxDistance', () => {
      const source: AudioSource = {
        id: 'test',
        name: 'test',
        type: 'ambient',
        position: { x: 200, y: 200 },
        baseVolume: 0.5,
        muted: false,
        loop: false,
        category: 'ambient',
      };
      expect(calculateVolume(source, listener, 1)).toBe(0);
    });

    it('should apply masterVolume multiplier correctly', () => {
      const source: AudioSource = {
        id: 'test',
        name: 'test',
        type: 'ambient',
        position: { x: 50, y: 55 },
        baseVolume: 0.5,
        muted: false,
        loop: false,
        category: 'ambient',
      };
      expect(calculateVolume(source, listener, 0.5)).toBe(0.25);
    });

    it('should calculate reduced volume for mid-range distance', () => {
      const source: AudioSource = {
        id: 'test',
        name: 'test',
        type: 'ambient',
        position: { x: 50, y: 50 },
        baseVolume: 0.4,
        muted: false,
        loop: false,
        category: 'ambient',
      };
      const listenerFar: Position = { x: 50, y: 100 };
      const result = calculateVolume(source, listenerFar, 1);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(0.4);
    });
  });

  describe('calculatePan', () => {
    const listener: Position = { x: 50, y: 50 };

    it('should return 0 when source is directly above/below listener', () => {
      const source: Position = { x: 50, y: 30 };
      expect(calculatePan(source, listener)).toBe(0);
    });

    it('should return positive pan for source to the right', () => {
      const source: Position = { x: 80, y: 50 };
      expect(calculatePan(source, listener)).toBeGreaterThan(0);
    });

    it('should return negative pan for source to the left', () => {
      const source: Position = { x: 20, y: 50 };
      expect(calculatePan(source, listener)).toBeLessThan(0);
    });

    it('should clamp pan value to maximum 1', () => {
      const source: Position = { x: 500, y: 50 };
      expect(calculatePan(source, listener)).toBe(1);
    });

    it('should clamp pan value to minimum -1', () => {
      const source: Position = { x: -500, y: 50 };
      expect(calculatePan(source, listener)).toBe(-1);
    });

    it('should calculate pan value proportionally within range', () => {
      const source: Position = { x: 90, y: 50 };
      expect(calculatePan(source, listener)).toBe(0.5);
    });
  });
});
