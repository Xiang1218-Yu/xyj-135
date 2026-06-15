import { useEffect, useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { WeatherType, WeatherLightingConfig, TimeOfDay } from '@/types/office';

export const weatherLightingConfigs: Record<WeatherType, WeatherLightingConfig> = {
  sunny: {
    ambientColor: '#FFE4B5',
    lightColor: '#FFD700',
    shadowOpacity: 0,
    windowLightIntensity: 1,
    ceilingLightIntensity: 0,
    bgTopAdjust: 'rgba(135, 206, 235, 0)',
    bgBottomAdjust: 'rgba(255, 248, 220, 0)',
    fogOpacity: 0,
    fogColor: 'transparent',
  },
  cloudy: {
    ambientColor: '#C0C0C0',
    lightColor: '#A9A9A9',
    shadowOpacity: 0.15,
    windowLightIntensity: 0.5,
    ceilingLightIntensity: 0.3,
    bgTopAdjust: 'rgba(150, 150, 160, 0.4)',
    bgBottomAdjust: 'rgba(180, 180, 190, 0.3)',
    fogOpacity: 0.1,
    fogColor: 'rgba(200, 200, 210, 0.5)',
  },
  rainy: {
    ambientColor: '#708090',
    lightColor: '#778899',
    shadowOpacity: 0.3,
    windowLightIntensity: 0.2,
    ceilingLightIntensity: 0.5,
    bgTopAdjust: 'rgba(80, 80, 100, 0.5)',
    bgBottomAdjust: 'rgba(100, 100, 120, 0.4)',
    fogOpacity: 0.2,
    fogColor: 'rgba(100, 100, 130, 0.6)',
  },
  snowy: {
    ambientColor: '#B0C4DE',
    lightColor: '#E0E8F0',
    shadowOpacity: 0.1,
    windowLightIntensity: 0.6,
    ceilingLightIntensity: 0.2,
    bgTopAdjust: 'rgba(200, 210, 230, 0.4)',
    bgBottomAdjust: 'rgba(220, 225, 240, 0.3)',
    fogOpacity: 0.25,
    fogColor: 'rgba(220, 225, 240, 0.7)',
  },
};

const weatherTransitionDurations: Record<WeatherType, number> = {
  sunny: 3000,
  cloudy: 2000,
  rainy: 2500,
  snowy: 3000,
};

const autoWeatherPool: WeatherType[] = ['sunny', 'sunny', 'sunny', 'cloudy', 'cloudy', 'rainy', 'snowy'];

export function getWeatherLabel(weather: WeatherType): string {
  const labels: Record<WeatherType, string> = {
    sunny: '晴天',
    cloudy: '多云',
    rainy: '雨天',
    snowy: '雪天',
  };
  return labels[weather];
}

export function getWeatherEmoji(weather: WeatherType): string {
  const emojis: Record<WeatherType, string> = {
    sunny: '☀️',
    cloudy: '⛅',
    rainy: '🌧️',
    snowy: '❄️',
  };
  return emojis[weather];
}

export function getWeatherByTimeOfDay(timeOfDay: TimeOfDay): WeatherType {
  const rand = Math.random();
  switch (timeOfDay) {
    case 'morning':
      return rand < 0.6 ? 'sunny' : rand < 0.9 ? 'cloudy' : 'rainy';
    case 'noon':
      return rand < 0.7 ? 'sunny' : rand < 0.9 ? 'cloudy' : 'rainy';
    case 'afternoon':
      return rand < 0.5 ? 'sunny' : rand < 0.8 ? 'cloudy' : 'rainy';
    case 'evening':
      return rand < 0.3 ? 'sunny' : rand < 0.7 ? 'cloudy' : 'rainy';
    case 'night':
      return rand < 0.2 ? 'sunny' : rand < 0.5 ? 'cloudy' : rand < 0.8 ? 'rainy' : 'snowy';
  }
}

export function useWeatherSimulation() {
  const { weather, setWeather, updateWeatherTransition, isTimePaused } = useOfficeStore();
  const transitionRef = useRef<number>();
  const autoChangeRef = useRef<number>();
  const lastAutoChangeRef = useRef<number>(Date.now());

  const startTransition = useCallback((newWeather: WeatherType) => {
    if (newWeather === weather.current) return;
    useOfficeStore.setState((state) => ({
      weather: {
        ...state.weather,
        previous: state.weather.current,
        current: newWeather,
        transitionProgress: 0,
      },
    }));
  }, [weather.current]);

  useEffect(() => {
    if (weather.transitionProgress >= 1) return;

    const duration = weatherTransitionDurations[weather.current];
    const startTime = Date.now() - weather.transitionProgress * duration;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      updateWeatherTransition(progress);

      if (progress < 1) {
        transitionRef.current = requestAnimationFrame(animate);
      }
    };

    transitionRef.current = requestAnimationFrame(animate);

    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
    };
  }, [weather.current, weather.transitionProgress >= 1, updateWeatherTransition]);

  useEffect(() => {
    if (!weather.isAutoMode || isTimePaused) {
      if (autoChangeRef.current) {
        clearInterval(autoChangeRef.current);
        autoChangeRef.current = undefined;
      }
      return;
    }

    const interval = weather.autoChangeInterval * 1000;

    autoChangeRef.current = window.setInterval(() => {
      const pool = [...autoWeatherPool];
      const filtered = pool.filter(w => w !== weather.current);
      const nextWeather = filtered[Math.floor(Math.random() * filtered.length)];
      startTransition(nextWeather);
    }, interval);

    return () => {
      if (autoChangeRef.current) {
        clearInterval(autoChangeRef.current);
      }
    };
  }, [weather.isAutoMode, weather.autoChangeInterval, weather.current, isTimePaused, startTransition]);

  return {
    weather,
    startTransition,
    setWeather,
    lightingConfig: weatherLightingConfigs[weather.current],
    transitionProgress: weather.transitionProgress,
  };
}
