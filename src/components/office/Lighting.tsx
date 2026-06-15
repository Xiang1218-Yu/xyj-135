import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';

const lightingConfigs = {
  morning: {
    bgTop: '#87CEEB',
    bgBottom: '#E0F4FF',
    floorColor: '#F5F1EB',
    windowLight: 'rgba(255, 220, 150, 0.3)',
    ceilingLight: 'rgba(255, 240, 200, 0.1)',
    shadowColor: 'rgba(60, 40, 30, 0.15)',
  },
  noon: {
    bgTop: '#87CEEB',
    bgBottom: '#FFF8E7',
    floorColor: '#F5F1EB',
    windowLight: 'rgba(255, 240, 200, 0.4)',
    ceilingLight: 'rgba(255, 255, 240, 0.1)',
    shadowColor: 'rgba(60, 40, 30, 0.2)',
  },
  afternoon: {
    bgTop: '#B8D4E3',
    bgBottom: '#F5E6D3',
    floorColor: '#EDE7DC',
    windowLight: 'rgba(255, 200, 150, 0.35)',
    ceilingLight: 'rgba(255, 230, 200, 0.15)',
    shadowColor: 'rgba(60, 40, 30, 0.25)',
  },
  evening: {
    bgTop: '#4A6FA5',
    bgBottom: '#C9A66B',
    floorColor: '#D4C9B8',
    windowLight: 'rgba(255, 180, 100, 0.3)',
    ceilingLight: 'rgba(255, 220, 150, 0.4)',
    shadowColor: 'rgba(40, 30, 20, 0.4)',
  },
  night: {
    bgTop: '#1a1a2e',
    bgBottom: '#16213e',
    floorColor: '#2D2D3D',
    windowLight: 'rgba(100, 150, 255, 0.1)',
    ceilingLight: 'rgba(255, 240, 200, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
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
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${config.windowLight} 0%, transparent 50%)`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, ${config.windowLight} 0%, transparent 50%)`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 10%, ${config.ceilingLight} 0%, transparent 40%)`,
        }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 100px ${config.shadowColor}`,
        }}
      />
      
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${config.floorColor} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />
    </>
  );
}
