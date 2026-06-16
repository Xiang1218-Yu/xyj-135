import { describe, it, expect } from 'vitest';
import { audioSources, categoryLabels, keyboardVolumeByType, keyboardTimingByType } from '../audioSources';
import type { AudioSource } from '@/types/office';

describe('data/audioSources', () => {
  describe('audioSources', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(audioSources)).toBe(true);
      expect(audioSources.length).toBeGreaterThan(0);
    });

    it('should have valid AudioSource structure for each item', () => {
      audioSources.forEach((source: AudioSource) => {
        expect(source).toHaveProperty('id');
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('type');
        expect(source).toHaveProperty('position');
        expect(source.position).toHaveProperty('x');
        expect(source.position).toHaveProperty('y');
        expect(source).toHaveProperty('baseVolume');
        expect(source).toHaveProperty('muted');
        expect(source).toHaveProperty('loop');
        expect(source).toHaveProperty('category');
        expect(typeof source.id).toBe('string');
        expect(typeof source.name).toBe('string');
        expect(typeof source.muted).toBe('boolean');
        expect(typeof source.loop).toBe('boolean');
        expect(source.baseVolume).toBeGreaterThanOrEqual(0);
        expect(source.baseVolume).toBeLessThanOrEqual(1);
      });
    });

    it('should contain keyboard sources for each colleague', () => {
      const keyboardSources = audioSources.filter(s => s.type === 'keyboard');
      expect(keyboardSources.length).toBeGreaterThan(0);
      keyboardSources.forEach(source => {
        expect(source.id).toMatch(/^keyboard-/);
        expect(source).toHaveProperty('keyboardType');
        expect(source).toHaveProperty('typingSpeed');
        expect(source).toHaveProperty('ownerId');
      });
    });

    it('should include all expected ambient and utility sources', () => {
      const sourceIds = audioSources.map(s => s.id);
      expect(sourceIds).toContain('ambient-office');
      expect(sourceIds).toContain('coffee-machine');
      expect(sourceIds).toContain('printer');
      expect(sourceIds).toContain('ac-unit');
    });

    it('should have valid category values', () => {
      const validCategories = ['work', 'social', 'utility', 'ambient'];
      audioSources.forEach(source => {
        expect(validCategories).toContain(source.category);
      });
    });
  });

  describe('categoryLabels', () => {
    it('should contain labels for all valid categories', () => {
      expect(categoryLabels).toHaveProperty('work');
      expect(categoryLabels).toHaveProperty('social');
      expect(categoryLabels).toHaveProperty('utility');
      expect(categoryLabels).toHaveProperty('ambient');
    });

    it('should have non-empty string values', () => {
      Object.values(categoryLabels).forEach(label => {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('keyboardVolumeByType', () => {
    it('should contain volume for all keyboard types', () => {
      expect(keyboardVolumeByType).toHaveProperty('mechanical-loud');
      expect(keyboardVolumeByType).toHaveProperty('mechanical-quiet');
      expect(keyboardVolumeByType).toHaveProperty('membrane');
      expect(keyboardVolumeByType).toHaveProperty('laptop');
    });

    it('should have volume values between 0 and 1', () => {
      Object.values(keyboardVolumeByType).forEach(volume => {
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('keyboardTimingByType', () => {
    it('should contain timing for all keyboard types', () => {
      expect(keyboardTimingByType).toHaveProperty('mechanical-loud');
      expect(keyboardTimingByType).toHaveProperty('mechanical-quiet');
      expect(keyboardTimingByType).toHaveProperty('membrane');
      expect(keyboardTimingByType).toHaveProperty('laptop');
    });

    it('should have valid timing structure', () => {
      Object.values(keyboardTimingByType).forEach(timing => {
        expect(timing).toHaveProperty('min');
        expect(timing).toHaveProperty('max');
        expect(timing).toHaveProperty('burstiness');
        expect(timing.min).toBeGreaterThan(0);
        expect(timing.max).toBeGreaterThan(timing.min);
        expect(timing.burstiness).toBeGreaterThanOrEqual(0);
        expect(timing.burstiness).toBeLessThanOrEqual(1);
      });
    });
  });
});
