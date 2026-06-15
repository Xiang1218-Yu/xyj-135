import { create } from 'zustand';
import type { Position, OfficeTime, AudioSource, Colleague, ViewPoint, TimeOfDay } from '@/types/office';
import { audioSources as initialAudioSources } from '@/data/audioSources';
import { colleagues as initialColleagues } from '@/data/colleagues';
import { viewPoints } from '@/data/viewPoints';
import { getTimeOfDay } from '@/utils/timeUtils';

interface OfficeState {
  listenerPosition: Position;
  zoom: number;
  masterVolume: number;
  isMuted: boolean;
  isPlaying: boolean;
  audioSources: AudioSource[];
  colleagues: Colleague[];
  time: OfficeTime;
  currentView: string;
  showControlPanel: boolean;
  showViewSelector: boolean;

  setListenerPosition: (position: Position) => void;
  setZoom: (zoom: number) => void;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  setSourceVolume: (id: string, volume: number) => void;
  toggleSourceMute: (id: string) => void;
  updateColleaguePosition: (id: string, position: Position) => void;
  updateColleagueState: (id: string, state: Colleague['state']) => void;
  updateTime: (delta: number) => void;
  setTimeSpeed: (speed: number) => void;
  toggleTimePause: () => void;
  setCurrentView: (viewId: string) => void;
  toggleControlPanel: () => void;
  toggleViewSelector: () => void;
  getViewPoints: () => ViewPoint[];
  getTimeOfDay: () => TimeOfDay;
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
  colleagues: initialColleagues.map(c => ({ ...c })),
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
}));
