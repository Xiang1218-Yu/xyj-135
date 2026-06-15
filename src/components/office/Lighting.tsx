import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';
import type { TimeOfDay } from '@/types/office';

interface LightingConfig {
  bgTop: string;
  bgBottom: string;
  ambientLight: string;
  ambientIntensity: number;
  directionalLight: string;
  directionalIntensity: number;
  shadowOpacity: number;
}

const lightingConfigs: Record<TimeOfDay, LightingConfig> = {
  morning: {
    bgTop: '#87CEEB',
    bgBottom: '#E0F4FF',
    ambientLight: '#FFE4B5',
    ambientIntensity: 0.3,
    directionalLight: '#FFD700',
    directionalIntensity: 0.5,
    shadowOpacity: 0.15,
  },
  noon: {
    bgTop: '#87CEEB',
    bgBottom: '#FFF8E7',
    ambientLight: '#FFFFF0',
    ambientIntensity: 0.4,
    directionalLight: '#FFFFE0',
    directionalIntensity: 0.6,
    shadowOpacity: 0.2,
  },
  afternoon: {
    bgTop: '#B8D4E3',
    bgBottom: '#F5E6D3',
    ambientLight: '#FFDAB9',
    ambientIntensity: 0.35,
    directionalLight: '#F4A460',
    directionalIntensity: 0.45,
    shadowOpacity: 0.25,
  },
  evening: {
    bgTop: '#4A6FA5',
    bgBottom: '#C9A66B',
    ambientLight: '#DEB887',
    ambientIntensity: 0.25,
    directionalLight: '#CD853F',
    directionalIntensity: 0.3,
    shadowOpacity: 0.35,
  },
  night: {
    bgTop: '#1a1a2e',
    bgBottom: '#16213e',
    ambientLight: '#4169E1',
    ambientIntensity: 0.1,
    directionalLight: '#FFFACD',
    directionalIntensity: 0.15,
    shadowOpacity: 0.5,
  },
};

export function Lighting() {
  const { time } = useOfficeStore();
  const timeOfDay = getTimeOfDay(time.hour);
  const config = lightingConfigs[timeOfDay];

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, ${config.bgTop} 0%, ${config.bgBottom} 100%)`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 30% 10%, ${config.directionalLight} 0%, transparent 60%)`,
          opacity: config.directionalIntensity,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.ambientLight} 0%, transparent 70%)`,
          opacity: config.ambientIntensity,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          boxShadow: `inset 0 0 150px rgba(0, 0, 0, ${config.shadowOpacity})`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: 'linear-gradient(225deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
    </>
  );
}
