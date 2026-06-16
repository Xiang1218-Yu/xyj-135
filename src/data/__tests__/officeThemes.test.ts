import { describe, it, expect } from 'vitest';
import { officeThemes, getOfficeTheme, getAllThemes } from '../officeThemes';
import type { OfficeTheme, OfficeThemeType } from '@/types/office';

describe('data/officeThemes', () => {
  const validThemeTypes: OfficeThemeType[] = [
    'modern', 'industrial', 'scandinavian', 'japanese', 'creative', 'classic'
  ];

  describe('officeThemes', () => {
    it('should contain all expected theme types', () => {
      validThemeTypes.forEach(type => {
        expect(officeThemes).toHaveProperty(type);
      });
    });

    it('should have valid theme structure for each theme', () => {
      Object.values(officeThemes).forEach((theme: OfficeTheme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('icon');
        expect(theme).toHaveProperty('floor');
        expect(theme).toHaveProperty('walls');
        expect(theme).toHaveProperty('window');
        expect(theme).toHaveProperty('furniture');
        expect(theme).toHaveProperty('furnitureStyle');
        expect(theme).toHaveProperty('layout');
        expect(theme).toHaveProperty('ambientIntensity');
        expect(theme).toHaveProperty('ceilingLightStyle');
      });
    });

    it('should have valid floor configuration', () => {
      Object.values(officeThemes).forEach((theme: OfficeTheme) => {
        expect(theme.floor).toHaveProperty('pattern');
        expect(theme.floor).toHaveProperty('colors');
        expect(theme.floor.colors).toHaveProperty('morning');
        expect(theme.floor.colors).toHaveProperty('noon');
        expect(theme.floor.colors).toHaveProperty('afternoon');
        expect(theme.floor.colors).toHaveProperty('evening');
        expect(theme.floor.colors).toHaveProperty('night');
      });
    });

    it('should have valid furniture colors as hex values', () => {
      Object.values(officeThemes).forEach((theme: OfficeTheme) => {
        const colors = theme.furniture;
        Object.values(colors).forEach(color => {
          expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    });

    it('should have layout with desks array', () => {
      Object.values(officeThemes).forEach((theme: OfficeTheme) => {
        expect(Array.isArray(theme.layout.desks)).toBe(true);
        expect(theme.layout.desks.length).toBeGreaterThan(0);
        theme.layout.desks.forEach(desk => {
          expect(desk).toHaveProperty('x');
          expect(desk).toHaveProperty('y');
          expect(desk).toHaveProperty('label');
        });
      });
    });

    it('should have valid ambientIntensity values', () => {
      Object.values(officeThemes).forEach((theme: OfficeTheme) => {
        expect(theme.ambientIntensity).toBeGreaterThan(0);
      });
    });
  });

  describe('getOfficeTheme', () => {
    it('should return the correct theme for each type', () => {
      validThemeTypes.forEach(type => {
        const theme = getOfficeTheme(type);
        expect(theme.id).toBe(type);
        expect(officeThemes[type]).toBe(theme);
      });
    });

    it('should return modern theme as default for invalid type', () => {
      const theme = getOfficeTheme('invalid-type' as OfficeThemeType);
      expect(theme.id).toBe('modern');
    });
  });

  describe('getAllThemes', () => {
    it('should return an array of all themes', () => {
      const themes = getAllThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBe(validThemeTypes.length);
    });

    it('should return themes matching the officeThemes record', () => {
      const themes = getAllThemes();
      const themeIds = themes.map(t => t.id);
      validThemeTypes.forEach(type => {
        expect(themeIds).toContain(type);
      });
    });
  });
});
