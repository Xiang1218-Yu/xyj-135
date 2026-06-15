import { create } from 'zustand';
import type { Position, OfficeTime, AudioSource, Colleague, ViewPoint, TimeOfDay, WeatherState, WeatherType, AudioSourceType, BehaviorActionType, OfficeThemeType, OfficeTheme } from '@/types/office';
import { audioSources as initialAudioSources } from '@/data/audioSources';
import { colleagues as initialColleagues } from '@/data/colleagues';
import { viewPoints } from '@/data/viewPoints';
import { getTimeOfDay } from '@/utils/timeUtils';
import { getOfficeTheme, getAllThemes } from '@/data/officeThemes';

export interface ColleagueSoundEvent {
  id: string;
  colleagueId: string;
  soundType: AudioSourceType;
  timestamp: number;
  position: Position;
}

interface OfficeState {
  listenerPosition: Position;
  zoom: number;
  masterVolume: number;
  isMuted: boolean;
  isPlaying: boolean;
  audioSources: AudioSource[];
  colleagues: Colleague[];
  time: OfficeTime;
  weather: WeatherState;
  currentView: string;
  showControlPanel: boolean;
  showViewSelector: boolean;
  colleagueSoundEvents: ColleagueSoundEvent[];

  setListenerPosition: (position: Position) => void;
  setZoom: (zoom: number) => void;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  setSourceVolume: (id: string, volume: number) => void;
  toggleSourceMute: (id: string) => void;
  updateColleaguePosition: (id: string, position: Position) => void;
  updateColleagueState: (id: string, state: Colleague['state']) => void;
  updateColleagueAction: (id: string, action: BehaviorActionType, duration: number) => void;
  triggerColleagueSound: (colleagueId: string, soundType: AudioSourceType) => void;
  consumeColleagueSoundEvent: (eventId: string) => void;
  updateTime: (delta: number) => void;
  setTimeSpeed: (speed: number) => void;
  toggleTimePause: () => void;
  setCurrentView: (viewId: string) => void;
  toggleControlPanel: () => void;
  toggleViewSelector: () => void;
  getViewPoints: () => ViewPoint[];
  getTimeOfDay: () => TimeOfDay;
  setWeather: (weather: WeatherType) => void;
  updateWeatherTransition: (progress: number) => void;
  setWeatherAutoMode: (enabled: boolean) => void;
  setWeatherAutoInterval: (interval: number) => void;
  setWeatherIntensity: (intensity: number) => void;
  isTimePaused: boolean;
  currentTheme: OfficeThemeType;
  setOfficeTheme: (theme: OfficeThemeType) => void;
  getCurrentTheme: () => OfficeTheme;
  getAllThemes: () => OfficeTheme[];
}

const currentHour = new Date().getHours();
const currentMinute = new Date().getMinutes();

export const useOfficeStore = create<OfficeState>((set, get) => ({
  listenerPosition: { x: 50, y: 50 },
  zoom: 1,
  masterVolume: 0.7,
  isMuted: false,
  isPlaying: false,
  audioSources: [...initialAudioSources],
  colleagues: initialColleagues.map(c => ({ ...c, currentAction: 'none' as BehaviorActionType })),
  time: {
    hour: currentHour,
    minute: currentMinute,
    day: 1,
    speed: 1,
    isPaused: false,
    timeOfDay: getTimeOfDay(currentHour),
  },
  currentView: 'overview',
  showControlPanel: true,
  showViewSelector: false,
  weather: {
    current: 'sunny',
    previous: 'sunny',
    transitionProgress: 1,
    intensity: 0.7,
    isAutoMode: true,
    autoChangeInterval: 30,
  },
  isTimePaused: false,
  colleagueSoundEvents: [],
  currentTheme: 'modern' as OfficeThemeType,

  setListenerPosition: (position) => set({ listenerPosition: position }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
  
  setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setSourceVolume: (id, volume) =>
    set((state) => ({
      audioSources: state.audioSources.map((s) =>
        s.id === id ? { ...s, baseVolume: Math.max(0, Math.min(1, volume)) } : s
      ),
    })),
  
  toggleSourceMute: (id) =>
    set((state) => ({
      audioSources: state.audioSources.map((s) =>
        s.id === id ? { ...s, muted: !s.muted } : s
      ),
    })),
  
  updateColleaguePosition: (id, position) =>
    set((state) => ({
      colleagues: state.colleagues.map((c) =>
        c.id === id ? { ...c, position } : c
      ),
    })),
  
  updateColleagueState: (id, state) =>
    set((prev) => ({
      colleagues: prev.colleagues.map((c) =>
        c.id === id ? { ...c, state } : c
      ),
    })),

  updateColleagueAction: (id, action, duration) =>
    set((prev) => ({
      colleagues: prev.colleagues.map((c) =>
        c.id === id ? { ...c, currentAction: action, actionStartTime: Date.now(), actionDuration: duration } : c
      ),
    })),

  triggerColleagueSound: (colleagueId, soundType) =>
    set((state) => {
      const colleague = state.colleagues.find(c => c.id === colleagueId);
      if (!colleague) return state;
      const event: ColleagueSoundEvent = {
        id: `sound-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        colleagueId,
        soundType,
        timestamp: Date.now(),
        position: { ...colleague.position },
      };
      return {
        colleagueSoundEvents: [...state.colleagueSoundEvents, event].slice(-20),
      };
    }),

  consumeColleagueSoundEvent: (eventId) =>
    set((state) => ({
      colleagueSoundEvents: state.colleagueSoundEvents.filter(e => e.id !== eventId),
    })),
  
  updateTime: (delta) =>
    set((state) => {
      if (state.time.isPaused) return state;
      
      let newMinute = state.time.minute + delta * state.time.speed;
      let newHour = state.time.hour;
      let newDay = state.time.day;
      
      while (newMinute >= 60) {
        newMinute -= 60;
        newHour += 1;
      }
      while (newMinute < 0) {
        newMinute += 60;
        newHour -= 1;
      }
      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }
      while (newHour < 0) {
        newHour += 24;
        newDay -= 1;
      }
      
      return {
        time: {
          ...state.time,
          hour: newHour,
          minute: newMinute,
          day: newDay,
          timeOfDay: getTimeOfDay(newHour),
        },
      };
    }),
  
  setTimeSpeed: (speed) =>
    set((state) => ({
      time: { ...state.time, speed: Math.max(0, Math.min(100, speed)) },
    })),
  
  toggleTimePause: () =>
    set((state) => ({
      time: { ...state.time, isPaused: !state.time.isPaused },
      isTimePaused: !state.time.isPaused,
    })),
  
  setCurrentView: (viewId) => {
    const view = get().getViewPoints().find(v => v.id === viewId);
    if (view) {
      set({
        currentView: viewId,
        listenerPosition: view.position,
        zoom: view.zoom,
      });
    }
  },
  
  toggleControlPanel: () =>
    set((state) => ({ showControlPanel: !state.showControlPanel })),
  
  toggleViewSelector: () =>
    set((state) => ({ showViewSelector: !state.showViewSelector })),
  
  getViewPoints: () => viewPoints,
  
  getTimeOfDay: () => get().time.timeOfDay,
  
  setWeather: (weather: WeatherType) =>
    set((state) => ({
      weather: {
        ...state.weather,
        previous: state.weather.current,
        current: weather,
        transitionProgress: 0,
      },
    })),
  
  updateWeatherTransition: (progress: number) =>
    set((state) => ({
      weather: { ...state.weather, transitionProgress: progress },
    })),
  
  setWeatherAutoMode: (enabled: boolean) =>
    set((state) => ({
      weather: { ...state.weather, isAutoMode: enabled },
    })),
  
  setWeatherAutoInterval: (interval: number) =>
    set((state) => ({
      weather: { ...state.weather, autoChangeInterval: Math.max(5, Math.min(120, interval)) },
    })),
  
  setWeatherIntensity: (intensity: number) =>
    set((state) => ({
      weather: { ...state.weather, intensity: Math.max(0, Math.min(1, intensity)) },
    })),

  setOfficeTheme: (theme: OfficeThemeType) => {
    const newTheme = getOfficeTheme(theme);
    const colleagues = get().colleagues;
    const updatedColleagues = colleagues.map((c, index) => {
      const desk = newTheme.layout.desks[index];
      if (desk) {
        return {
          ...c,
          deskPosition: { x: desk.x, y: desk.y },
          position: c.state === 'working' ? { x: desk.x, y: desk.y } : c.position,
        };
      }
      return c;
    });
    set({ currentTheme: theme, colleagues: updatedColleagues });
  },

  getCurrentTheme: () => getOfficeTheme(get().currentTheme),

  getAllThemes: () => getAllThemes(),
}));
