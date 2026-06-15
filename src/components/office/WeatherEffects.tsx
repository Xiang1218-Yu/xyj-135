import { useMemo } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { WeatherType } from '@/types/office';

function RainEffect({ intensity }: { intensity: number }) {
  const drops = useMemo(() =>
    Array.from({ length: Math.floor(120 * intensity) }, (_, i) => ({
      id: i,
      left: Math.random() * 120 - 10,
      top: Math.random() * -20,
      delay: Math.random() * 1.5,
      duration: 0.5 + Math.random() * 0.4,
      width: 1 + Math.random() * 1.5,
      height: 15 + Math.random() * 25,
      opacity: 0.25 + Math.random() * 0.45,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute weather-rain-drop-outdoor"
          style={{
            left: `${drop.left}%`,
            top: `${drop.top}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            background: 'linear-gradient(180deg, rgba(160, 180, 210, 0) 0%, rgba(160, 180, 210, 0.5) 50%, rgba(160, 180, 210, 0.3) 100%)',
            borderRadius: '0 0 1px 1px',
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect({ intensity }: { intensity: number }) {
  const flakes = useMemo(() =>
    Array.from({ length: Math.floor(100 * intensity) }, (_, i) => ({
      id: i,
      left: Math.random() * 110 - 5,
      top: Math.random() * -20,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      size: 2.5 + Math.random() * 5.5,
      opacity: 0.55 + Math.random() * 0.45,
      sway: -30 + Math.random() * 60,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute weather-snow-flake-outdoor"
          style={{
            left: `${flake.left}%`,
            top: `${flake.top}%`,
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
    Array.from({ length: Math.floor(8 * intensity) }, (_, i) => ({
      id: i,
      top: 2 + Math.random() * 35,
      left: -20 + Math.random() * 120,
      scale: 0.7 + Math.random() * 1.1,
      opacity: 0.25 + Math.random() * 0.45,
      duration: 45 + Math.random() * 55,
      delay: Math.random() * 25,
    })),
    [intensity]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute weather-cloud-outdoor"
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
                width: '80px',
                height: '30px',
                background: 'rgba(220, 220, 230, 0.75)',
                filter: 'blur(5px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '50px',
                height: '50px',
                background: 'rgba(225, 225, 235, 0.65)',
                top: '-22px',
                left: '12px',
                filter: 'blur(4px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '38px',
                height: '38px',
                background: 'rgba(230, 230, 240, 0.55)',
                top: '-16px',
                left: '42px',
                filter: 'blur(4px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(235, 235, 245, 0.5)',
                top: '-8px',
                left: '-8px',
                filter: 'blur(3px)',
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
        className="absolute weather-sun-glow-outdoor"
        style={{
          top: '-20%',
          left: '-10%',
          width: '65%',
          height: '65%',
          background: 'radial-gradient(ellipse at 40% 30%, rgba(255, 223, 100, 0.45) 0%, rgba(255, 223, 100, 0.18) 35%, transparent 70%)',
          opacity: intensity,
        }}
      />
      <div
        className="absolute weather-sun-rays-outdoor"
        style={{
          top: '-60%',
          left: '-20%',
          width: '80%',
          height: '160%',
          background: 'conic-gradient(from 10deg, transparent 0deg, rgba(255, 215, 0, 0.06) 3deg, transparent 7deg, transparent 15deg, rgba(255, 215, 0, 0.05) 18deg, transparent 22deg, transparent 30deg, rgba(255, 215, 0, 0.05) 33deg, transparent 37deg, transparent 360deg)',
          opacity: intensity * 0.7,
        }}
      />
      <div
        className="absolute transition-opacity duration-1000"
        style={{
          top: 0,
          left: '15%',
          width: '45%',
          height: '8%',
          background: 'linear-gradient(180deg, rgba(255, 240, 180, 0.35) 0%, rgba(255, 240, 180, 0.15) 60%, transparent 100%)',
          filter: 'blur(8px)',
          opacity: intensity,
        }}
      />
    </div>
  );
}

function LightningEffect({ intensity }: { intensity: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none weather-lightning-outdoor"
      style={{
        background: 'rgba(255, 255, 255, 0.2)',
        opacity: 0,
        '--lightning-intensity': intensity,
      } as React.CSSProperties}
    />
  );
}

function WindowFogEffect({ intensity, weather }: { intensity: number; weather: WeatherType }) {
  if (weather !== 'rainy' && weather !== 'snowy') return null;

  const fogOpacity = weather === 'snowy' ? 0.18 * intensity : 0.1 * intensity;
  const fogColor = weather === 'snowy' ? 'rgba(215, 225, 245,' : 'rgba(140, 155, 180,';

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-2000"
      style={{
        background: `
          linear-gradient(180deg, ${fogColor}${fogOpacity}) 0%, transparent 30%),
          radial-gradient(ellipse at 25% 8%, ${fogColor}${fogOpacity * 1.2}) 0%, transparent 35%),
          radial-gradient(ellipse at 75% 6%, ${fogColor}${fogOpacity}) 0%, transparent 40%)
        `,
        opacity: intensity,
      }}
    />
  );
}

function OutdoorAmbientOverlay({ current, intensity }: { current: WeatherType; intensity: number }) {
  const overlayBg = (() => {
    switch (current) {
      case 'sunny':
        return 'none';
      case 'cloudy':
        return `rgba(150, 150, 160, ${0.06 * intensity})`;
      case 'rainy':
        return `linear-gradient(180deg, rgba(70, 85, 110, ${0.12 * intensity}) 0%, rgba(60, 75, 100, ${0.08 * intensity}) 40%, rgba(50, 65, 90, ${0.05 * intensity}) 100%)`;
      case 'snowy':
        return `linear-gradient(180deg, rgba(200, 215, 240, ${0.09 * intensity}) 0%, rgba(185, 200, 225, ${0.06 * intensity}) 50%, rgba(175, 190, 215, ${0.04 * intensity}) 100%)`;
    }
  })();

  if (overlayBg === 'none') return null;

  return (
    <div
      className="absolute inset-0 transition-all duration-1000 pointer-events-none"
      style={{ background: overlayBg }}
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
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      <CurrentEffect intensity={intensity} />

      {current === 'rainy' && <LightningEffect intensity={intensity} />}

      <WindowFogEffect intensity={intensity} weather={current} />

      <OutdoorAmbientOverlay current={current} intensity={intensity} />
    </div>
  );
}
