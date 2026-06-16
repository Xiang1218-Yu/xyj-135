import { describe, it, expect } from 'vitest';
import { getTimeOfDay, formatTime, getGreeting, isWorkingHours, isLunchTime } from '../timeUtils';
import type { OfficeTime, TimeOfDay } from '@/types/office';

describe('timeUtils', () => {
  describe('getTimeOfDay', () => {
    it('should return morning for 6-9 hour', () => {
      expect(getTimeOfDay(6)).toBe('morning');
      expect(getTimeOfDay(7)).toBe('morning');
      expect(getTimeOfDay(8)).toBe('morning');
    });

    it('should return morning for 9-12 hour', () => {
      expect(getTimeOfDay(9)).toBe('morning');
      expect(getTimeOfDay(10)).toBe('morning');
      expect(getTimeOfDay(11)).toBe('morning');
    });

    it('should return noon for 12-14 hour', () => {
      expect(getTimeOfDay(12)).toBe('noon');
      expect(getTimeOfDay(13)).toBe('noon');
    });

    it('should return afternoon for 14-18 hour', () => {
      expect(getTimeOfDay(14)).toBe('afternoon');
      expect(getTimeOfDay(15)).toBe('afternoon');
      expect(getTimeOfDay(16)).toBe('afternoon');
      expect(getTimeOfDay(17)).toBe('afternoon');
    });

    it('should return evening for 18-21 hour', () => {
      expect(getTimeOfDay(18)).toBe('evening');
      expect(getTimeOfDay(19)).toBe('evening');
      expect(getTimeOfDay(20)).toBe('evening');
    });

    it('should return night for 21-6 hour', () => {
      expect(getTimeOfDay(21)).toBe('night');
      expect(getTimeOfDay(22)).toBe('night');
      expect(getTimeOfDay(23)).toBe('night');
      expect(getTimeOfDay(0)).toBe('night');
      expect(getTimeOfDay(3)).toBe('night');
      expect(getTimeOfDay(5)).toBe('night');
    });
  });

  describe('formatTime', () => {
    it('should format single-digit hour and minute with leading zeros', () => {
      const time: OfficeTime = {
        hour: 5,
        minute: 3,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: 'night',
      };
      expect(formatTime(time)).toBe('05:03');
    });

    it('should format double-digit hour and minute correctly', () => {
      const time: OfficeTime = {
        hour: 14,
        minute: 35,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: 'afternoon',
      };
      expect(formatTime(time)).toBe('14:35');
    });

    it('should handle midnight correctly', () => {
      const time: OfficeTime = {
        hour: 0,
        minute: 0,
        day: 2,
        speed: 1,
        isPaused: false,
        timeOfDay: 'night',
      };
      expect(formatTime(time)).toBe('00:00');
    });

    it('should floor fractional hours and minutes', () => {
      const time: OfficeTime = {
        hour: 9.7,
        minute: 30.5,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: 'morning',
      };
      expect(formatTime(time)).toBe('09:30');
    });
  });

  describe('getGreeting', () => {
    it('should return morning greeting', () => {
      expect(getGreeting('morning')).toBe('早上好');
    });

    it('should return noon greeting', () => {
      expect(getGreeting('noon')).toBe('中午好');
    });

    it('should return afternoon greeting', () => {
      expect(getGreeting('afternoon')).toBe('下午好');
    });

    it('should return evening greeting', () => {
      expect(getGreeting('evening')).toBe('晚上好');
    });

    it('should return night greeting', () => {
      expect(getGreeting('night')).toBe('夜深了');
    });
  });

  describe('isWorkingHours', () => {
    it('should return true during working hours (9-18)', () => {
      const createTime = (hour: number): OfficeTime => ({
        hour,
        minute: 0,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: getTimeOfDay(hour),
      });
      expect(isWorkingHours(createTime(9))).toBe(true);
      expect(isWorkingHours(createTime(12))).toBe(true);
      expect(isWorkingHours(createTime(17))).toBe(true);
    });

    it('should return false outside working hours', () => {
      const createTime = (hour: number): OfficeTime => ({
        hour,
        minute: 0,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: getTimeOfDay(hour),
      });
      expect(isWorkingHours(createTime(8))).toBe(false);
      expect(isWorkingHours(createTime(18))).toBe(false);
      expect(isWorkingHours(createTime(23))).toBe(false);
    });
  });

  describe('isLunchTime', () => {
    it('should return true during lunch time (12-13)', () => {
      const createTime = (hour: number): OfficeTime => ({
        hour,
        minute: 0,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: getTimeOfDay(hour),
      });
      expect(isLunchTime(createTime(12))).toBe(true);
    });

    it('should return false outside lunch time', () => {
      const createTime = (hour: number): OfficeTime => ({
        hour,
        minute: 0,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: getTimeOfDay(hour),
      });
      expect(isLunchTime(createTime(11))).toBe(false);
      expect(isLunchTime(createTime(13))).toBe(false);
      expect(isLunchTime(createTime(9))).toBe(false);
    });
  });
});
