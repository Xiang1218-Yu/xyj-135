import { useMemo } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { WeatherType } from '@/types/office';

function RainEffect({ intensity }: { intensity: number }) {
  const drops = useMemo(() =>
    Array.from({ length: Math.floor(60 * intensity) }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.4 + Math.random() * 0.3,
      width: 1 + Math.random() * 1.5,
      height: 10 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.4,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 weather-rain-drop"
          style={{
            left: `${drop.left}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            background: 'linear-gradient(180deg, rgba(174, 194, 224, 0) 0%, rgba(174, 194, 224, 0.6) 100%)',
            borderRadius: '0 0 2px 2px',
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect({ intensity }: { intensity: number }) {
  const flakes = useMemo(() =>
    Array.from({ length: Math.floor(50 * intensity) }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 5,
      opacity: 0.5 + Math.random() * 0.5,
      sway: -20 + Math.random() * 40,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 weather-snow-flake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            '--sway': `${flake.sway}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function CloudEffect({ intensity }: { intensity: number }) {
  const clouds = useMemo(() =>
    Array.from({ length: Math.floor(6 * intensity) }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 25,
      left: -15 + Math.random() * 110,
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 30 + Math.random() * 40,
      delay: Math.random() * 20,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute weather-cloud"
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            transform: `scale(${cloud.scale})`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `-${cloud.delay}s`,
          }}
        >
          <div className="relative">
            <div
              className="absolute rounded-full"
              style={{
                width: '60px',
                height: '25px',
                background: 'rgba(200, 200, 210, 0.7)',
                filter: 'blur(3px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '35px',
                height: '35px',
                background: 'rgba(210, 210, 220, 0.6)',
                top: '-15px',
                left: '10px',
                filter: 'blur(2px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '25px',
                height: '25px',
                background: 'rgba(215, 215, 225, 0.5)',
                top: '-10px',
                left: '30px',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SunEffect({ intensity }: { intensity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute weather-sun-glow"
        style={{
          top: '-5%',
          left: '10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255, 223, 100, 0.3) 0%, rgba(255, 223, 100, 0.1) 40%, transparent 70%)',
          opacity: intensity,
        }}
      />
      <div
        className="absolute weather-sun-rays"
        style={{
          top: '-10%',
          left: '5%',
          width: '50%',
          height: '50%',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 215, 0, 0.08) 5deg, transparent 10deg, transparent 20deg, rgba(255, 215, 0, 0.08) 25deg, transparent 30deg, transparent 40deg, rgba(255, 215, 0, 0.08) 45deg, transparent 50deg, transparent 60deg, rgba(255, 215, 0, 0.08) 65deg, transparent 70deg, transparent 80deg, rgba(255, 215, 0, 0.08) 85deg, transparent 90deg)',
          opacity: intensity * 0.6,
        }}
      />
    </div>
  );
}

function LightningEffect({ intensity }: { intensity: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none weather-lightning"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        opacity: 0,
        '--lightning-intensity': intensity,
      } as React.CSSProperties}
    />
  );
}

function WindowFogEffect({ intensity, weather }: { intensity: number; weather: WeatherType }) {
  if (weather !== 'rainy' && weather !== 'snowy') return null;

  const fogOpacity = weather === 'snowy' ? 0.15 * intensity : 0.08 * intensity;
  const fogColor = weather === 'snowy' ? 'rgba(220, 225, 240,' : 'rgba(150, 160, 180,';

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-2000"
      style={{
        background: `radial-gradient(ellipse at 30% 15%, ${fogColor}${fogOpacity}) 0%, transparent 60%), radial-gradient(ellipse at 70% 10%, ${fogColor}${fogOpacity * 0.7}) 0%, transparent 50%)`,
        opacity: intensity,
      }}
    />
  );
}

const effectComponents: Record<WeatherType, React.FC<{ intensity: number }>> = {
  sunny: SunEffect,
  cloudy: CloudEffect,
  rainy: RainEffect,
  snowy: SnowEffect,
};

export function WeatherEffects() {
  const { weather } = useOfficeStore();
  const intensity = weather.intensity;
  const current = weather.current;

  const CurrentEffect = effectComponents[current];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <CurrentEffect intensity={intensity} />

      {current === 'rainy' && <LightningEffect intensity={intensity} />}

      <WindowFogEffect intensity={intensity} weather={current} />

      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{
          background: (() => {
            switch (current) {
              case 'sunny':
                return 'none';
              case 'cloudy':
                return `rgba(150, 150, 160, ${0.05 * intensity})`;
              case 'rainy':
                return `rgba(60, 70, 90, ${0.12 * intensity})`;
              case 'snowy':
                return `rgba(180, 190, 210, ${0.08 * intensity})`;
            }
          })(),
        }}
      />
    </div>
  );
}
