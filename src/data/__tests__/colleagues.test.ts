import { describe, it, expect } from 'vitest';
import {
  colleagues,
  roleLabels,
  hairStyleLabels,
  hairColorLabels,
  hairColorValues,
  skinToneLabels,
  skinToneValues,
  meetingRoomTarget,
  kitchenTarget,
  printerTarget,
  entranceTarget,
} from '../colleagues';
import type { Colleague, ColleagueRole, HairStyle, HairColor, SkinTone } from '@/types/office';

describe('data/colleagues', () => {
  describe('colleagues', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(colleagues)).toBe(true);
      expect(colleagues.length).toBeGreaterThan(0);
    });

    it('should have valid Colleague structure for each item', () => {
      colleagues.forEach((colleague: Colleague) => {
        expect(colleague).toHaveProperty('id');
        expect(colleague).toHaveProperty('name');
        expect(colleague).toHaveProperty('role');
        expect(colleague).toHaveProperty('color');
        expect(colleague).toHaveProperty('appearance');
        expect(colleague).toHaveProperty('position');
        expect(colleague).toHaveProperty('state');
        expect(colleague).toHaveProperty('deskPosition');
        expect(colleague).toHaveProperty('keyboardType');
        expect(colleague).toHaveProperty('typingSpeed');
        expect(colleague).toHaveProperty('schedule');
        expect(colleague).toHaveProperty('speed');
        expect(colleague).toHaveProperty('behaviorPreferences');
      });
    });

    it('should have unique ids', () => {
      const ids = colleagues.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid appearance properties', () => {
      colleagues.forEach(colleague => {
        const validHairStyles: HairStyle[] = ['short', 'medium', 'long', 'curly', 'bald', 'ponytail', 'bun'];
        const validHairColors: HairColor[] = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'blue', 'pink', 'purple'];
        const validSkinTones: SkinTone[] = ['light', 'medium', 'tan', 'dark', 'deep'];

        expect(validHairStyles).toContain(colleague.appearance.hairStyle);
        expect(validHairColors).toContain(colleague.appearance.hairColor);
        expect(validSkinTones).toContain(colleague.appearance.skinTone);
        expect(colleague.appearance.shirtColor).toMatch(/^#/);
        expect(colleague.appearance.pantsColor).toMatch(/^#/);
      });
    });

    it('should have valid schedule times', () => {
      colleagues.forEach(colleague => {
        const { arriveTime, lunchStart, lunchEnd, leaveTime } = colleague.schedule;
        expect(arriveTime).toBeGreaterThanOrEqual(0);
        expect(arriveTime).toBeLessThan(24);
        expect(lunchStart).toBeGreaterThan(arriveTime);
        expect(lunchEnd).toBeGreaterThan(lunchStart);
        expect(leaveTime).toBeGreaterThan(lunchEnd);
        expect(leaveTime).toBeLessThanOrEqual(24);
      });
    });

    it('should have valid behavior preferences (0-1 range)', () => {
      colleagues.forEach(colleague => {
        const prefs = colleague.behaviorPreferences;
        Object.values(prefs).forEach(value => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('roleLabels', () => {
    it('should contain labels for all valid roles', () => {
      const roles: ColleagueRole[] = ['engineer', 'designer', 'product-manager', 'marketing', 'sales', 'hr', 'finance', 'ceo', 'intern'];
      roles.forEach(role => {
        expect(roleLabels).toHaveProperty(role);
        expect(typeof roleLabels[role]).toBe('string');
        expect(roleLabels[role].length).toBeGreaterThan(0);
      });
    });
  });

  describe('hairStyleLabels', () => {
    it('should contain labels for all hair styles', () => {
      const styles: HairStyle[] = ['short', 'medium', 'long', 'curly', 'bald', 'ponytail', 'bun'];
      styles.forEach(style => {
        expect(hairStyleLabels).toHaveProperty(style);
        expect(typeof hairStyleLabels[style]).toBe('string');
      });
    });
  });

  describe('hairColorLabels and hairColorValues', () => {
    it('should contain all hair colors', () => {
      const colors: HairColor[] = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'blue', 'pink', 'purple'];
      colors.forEach(color => {
        expect(hairColorLabels).toHaveProperty(color);
        expect(hairColorValues).toHaveProperty(color);
        expect(hairColorValues[color]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('skinToneLabels and skinToneValues', () => {
    it('should contain all skin tones', () => {
      const tones: SkinTone[] = ['light', 'medium', 'tan', 'dark', 'deep'];
      tones.forEach(tone => {
        expect(skinToneLabels).toHaveProperty(tone);
        expect(skinToneValues).toHaveProperty(tone);
        expect(skinToneValues[tone]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('target positions', () => {
    it('should have valid position coordinates (0-100 range)', () => {
      const targets = [meetingRoomTarget, kitchenTarget, printerTarget, entranceTarget];
      targets.forEach(target => {
        expect(target).toHaveProperty('x');
        expect(target).toHaveProperty('y');
        expect(target.x).toBeGreaterThanOrEqual(0);
        expect(target.x).toBeLessThanOrEqual(100);
        expect(target.y).toBeGreaterThanOrEqual(0);
        expect(target.y).toBeLessThanOrEqual(100);
      });
    });
  });
});
