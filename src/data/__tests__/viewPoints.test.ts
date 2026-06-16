import { describe, it, expect } from 'vitest';
import { viewPoints } from '../viewPoints';
import type { ViewPoint } from '@/types/office';

describe('data/viewPoints', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(viewPoints)).toBe(true);
    expect(viewPoints.length).toBeGreaterThan(0);
  });

  it('should have valid ViewPoint structure for each item', () => {
    viewPoints.forEach((vp: ViewPoint) => {
      expect(vp).toHaveProperty('id');
      expect(vp).toHaveProperty('name');
      expect(vp).toHaveProperty('position');
      expect(vp).toHaveProperty('zoom');
      expect(vp).toHaveProperty('description');
      expect(vp).toHaveProperty('icon');
    });
  });

  it('should have unique ids', () => {
    const ids = viewPoints.map(vp => vp.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid position coordinates (0-100 range)', () => {
    viewPoints.forEach(vp => {
      expect(vp.position.x).toBeGreaterThanOrEqual(0);
      expect(vp.position.x).toBeLessThanOrEqual(100);
      expect(vp.position.y).toBeGreaterThanOrEqual(0);
      expect(vp.position.y).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid zoom values (0.5-2 range based on store constraints)', () => {
    viewPoints.forEach(vp => {
      expect(vp.zoom).toBeGreaterThan(0);
    });
  });

  it('should have non-empty string properties', () => {
    viewPoints.forEach(vp => {
      expect(typeof vp.id).toBe('string');
      expect(vp.id.length).toBeGreaterThan(0);
      expect(typeof vp.name).toBe('string');
      expect(vp.name.length).toBeGreaterThan(0);
      expect(typeof vp.description).toBe('string');
      expect(vp.description.length).toBeGreaterThan(0);
      expect(typeof vp.icon).toBe('string');
      expect(vp.icon.length).toBeGreaterThan(0);
    });
  });

  it('should contain overview view point', () => {
    const overview = viewPoints.find(vp => vp.id === 'overview');
    expect(overview).toBeDefined();
    expect(overview?.name).toBe('全景视角');
  });

  it('should contain desk view points', () => {
    const deskViews = viewPoints.filter(vp => vp.id.startsWith('desk-'));
    expect(deskViews.length).toBeGreaterThan(0);
  });
});
