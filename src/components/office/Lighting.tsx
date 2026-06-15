import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';
import { weatherLightingConfigs } from '@/hooks/useWeatherSimulation';
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

function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function Lighting() {
  const { time, weather } = useOfficeStore();
  const timeOfDay = getTimeOfDay(time.hour);
  const config = lightingConfigs[timeOfDay];
  const weatherConfig = weatherLightingConfigs[weather.current];
  const t = weather.transitionProgress;
  const intensity = weather.intensity;

  const effectiveShadowOpacity = config.shadowOpacity + weatherConfig.shadowOpacity * intensity * t;
  const effectiveAmbientIntensity = config.ambientIntensity * (1 - t * (1 - weatherConfig.windowLightIntensity) * intensity * 0.5);
  const effectiveDirectionalIntensity = config.directionalIntensity * (1 - t * (1 - weatherConfig.windowLightIntensity) * intensity * 0.6);

  const effectiveBgTop = t > 0 && intensity > 0
    ? lerpColor(config.bgTop, weatherConfig.bgTopAdjust.replace(/rgba?\([^,]+,[^,]+,[^,]+,\s*[\d.]+\)/, config.bgTop), t * intensity * 0.5)
    : config.bgTop;
  const effectiveBgBottom = t > 0 && intensity > 0
    ? lerpColor(config.bgBottom, weatherConfig.bgBottomAdjust.replace(/rgba?\([^,]+,[^,]+,[^,]+,\s*[\d.]+\)/, config.bgBottom), t * intensity * 0.5)
    : config.bgBottom;

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, ${effectiveBgTop} 0%, ${effectiveBgBottom} 100%)`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 30% 10%, ${config.directionalLight} 0%, transparent 60%)`,
          opacity: effectiveDirectionalIntensity,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.ambientLight} 0%, transparent 70%)`,
          opacity: effectiveAmbientIntensity,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          boxShadow: `inset 0 0 150px rgba(0, 0, 0, ${effectiveShadowOpacity})`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: 'linear-gradient(225deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      {weatherConfig.ceilingLightIntensity > 0 && t > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(255, 250, 230, ${weatherConfig.ceilingLightIntensity * t * intensity * 0.3}) 0%, transparent 50%)`,
          }}
        />
      )}

      {weatherConfig.fogOpacity > 0 && t > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1500"
          style={{
            background: `radial-gradient(ellipse at 30% 15%, ${weatherConfig.fogColor} 0%, transparent 60%), radial-gradient(ellipse at 70% 10%, ${weatherConfig.fogColor} 0%, transparent 50%)`,
            opacity: weatherConfig.fogOpacity * t * intensity,
          }}
        />
      )}
    </>
  );
}
