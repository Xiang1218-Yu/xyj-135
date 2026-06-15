import { create } from 'zustand';
import type { Position, OfficeTime, AudioSource, Colleague, ViewPoint, TimeOfDay, WeatherState, WeatherType, AudioSourceType, BehaviorActionType, OfficeThemeType, OfficeTheme, DecorationCustomization, CustomColorOverrides, CustomLayoutOverrides, FurnitureColors, DeskLayout, OfficeObject, ColleagueRole, ColleagueAppearance, HairStyle, HairColor, SkinTone } from '@/types/office';
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
  customization: DecorationCustomization;
  setCustomizationEnabled: (enabled: boolean) => void;
  updateCustomFurnitureColor: (key: keyof FurnitureColors, color: string) => void;
  updateCustomWallAccent: (color: string) => void;
  updateCustomDeskPosition: (index: number, desk: Partial<DeskLayout>) => void;
  updateCustomLayoutItem: <K extends keyof CustomLayoutOverrides>(key: K, value: CustomLayoutOverrides[K]) => void;
  addCustomObject: (obj: OfficeObject) => void;
  removeCustomObject: (id: string) => void;
  updateCustomObject: (id: string, updates: Partial<OfficeObject>) => void;
  resetCustomization: () => void;
  getCustomizedTheme: () => OfficeTheme;
  addColleague: (colleague: Omit<Colleague, 'id' | 'position' | 'state' | 'currentAction'> & Partial<Pick<Colleague, 'id' | 'position' | 'state'>>) => void;
  removeColleague: (id: string) => void;
  updateColleague: (id: string, updates: Partial<Colleague>) => void;
  updateColleagueAppearance: (id: string, appearance: Partial<ColleagueAppearance>) => void;
  updateColleagueRole: (id: string, role: ColleagueRole) => void;
  resetColleagues: () => void;
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
  customization: {
    colorOverrides: { furniture: {} },
    layoutOverrides: { desks: [] },
    customObjects: [],
    enabled: false,
  },

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

  setCustomizationEnabled: (enabled) =>
    set((state) => ({
      customization: { ...state.customization, enabled },
    })),

  updateCustomFurnitureColor: (key, color) =>
    set((state) => ({
      customization: {
        ...state.customization,
        colorOverrides: {
          ...state.customization.colorOverrides,
          furniture: { ...state.customization.colorOverrides.furniture, [key]: color },
        },
      },
    })),

  updateCustomWallAccent: (color) =>
    set((state) => ({
      customization: {
        ...state.customization,
        colorOverrides: { ...state.customization.colorOverrides, wallAccent: color },
      },
    })),

  updateCustomDeskPosition: (index, desk) =>
    set((state) => {
      const desks = [...state.customization.layoutOverrides.desks];
      if (desks[index]) {
        desks[index] = { ...desks[index], ...desk };
      }
      return {
        customization: {
          ...state.customization,
          layoutOverrides: { ...state.customization.layoutOverrides, desks },
        },
      };
    }),

  updateCustomLayoutItem: (key, value) =>
    set((state) => ({
      customization: {
        ...state.customization,
        layoutOverrides: { ...state.customization.layoutOverrides, [key]: value },
      },
    })),

  addCustomObject: (obj) =>
    set((state) => ({
      customization: {
        ...state.customization,
        customObjects: [...state.customization.customObjects, obj],
      },
    })),

  removeCustomObject: (id) =>
    set((state) => ({
      customization: {
        ...state.customization,
        customObjects: state.customization.customObjects.filter((o) => o.id !== id),
      },
    })),

  updateCustomObject: (id, updates) =>
    set((state) => ({
      customization: {
        ...state.customization,
        customObjects: state.customization.customObjects.map((o) =>
          o.id === id ? { ...o, ...updates } : o
        ),
      },
    })),

  resetCustomization: () =>
    set({
      customization: {
        colorOverrides: { furniture: {} },
        layoutOverrides: { desks: [] },
        customObjects: [],
        enabled: false,
      },
    }),

  getCustomizedTheme: () => {
    const state = get();
    const baseTheme = getOfficeTheme(state.currentTheme);
    if (!state.customization.enabled) return baseTheme;

    const { colorOverrides, layoutOverrides, customObjects } = state.customization;

    const mergedFurniture: FurnitureColors = {
      ...baseTheme.furniture,
      ...colorOverrides.furniture,
    };

    const mergedWalls = colorOverrides.wallAccent
      ? { ...baseTheme.walls, accentColor: colorOverrides.wallAccent }
      : baseTheme.walls;

    const baseDesks = layoutOverrides.desks.length > 0
      ? layoutOverrides.desks
      : baseTheme.layout.desks;

    const mergedLayout = {
      ...baseTheme.layout,
      desks: baseDesks,
      ...(layoutOverrides.meetingRoom && { meetingRoom: layoutOverrides.meetingRoom }),
      ...(layoutOverrides.kitchen && { kitchen: layoutOverrides.kitchen }),
      ...(layoutOverrides.printer && { printer: layoutOverrides.printer }),
      ...(layoutOverrides.acUnit && { acUnit: layoutOverrides.acUnit }),
      ...(layoutOverrides.door && { door: layoutOverrides.door }),
      extraObjects: [...baseTheme.layout.extraObjects, ...customObjects],
    };

    return {
      ...baseTheme,
      furniture: mergedFurniture,
      walls: mergedWalls,
      layout: mergedLayout,
    };
  },

  addColleague: (colleagueData) => {
    const state = get();
    const theme = state.getCustomizedTheme();
    const currentColleagueCount = state.colleagues.length;
    const deskCount = theme.layout.desks.length;
    
    let desk: DeskLayout;
    
    if (currentColleagueCount < deskCount) {
      desk = theme.layout.desks[currentColleagueCount];
    } else {
      const extraIndex = currentColleagueCount - deskCount;
      const cols = 3;
      const row = Math.floor(extraIndex / cols);
      const col = extraIndex % cols;
      const startX = 25;
      const startY = 75;
      const xSpacing = 20;
      const ySpacing = 18;
      const newDeskX = startX + col * xSpacing;
      const newDeskY = startY + row * ySpacing;
      
      desk = {
        x: newDeskX,
        y: newDeskY,
        label: colleagueData.name,
      };
      
      if (!state.customization.enabled) {
        state.setCustomizationEnabled(true);
      }
      
      const currentDesks = state.customization.layoutOverrides.desks.length > 0
        ? [...state.customization.layoutOverrides.desks]
        : theme.layout.desks.map((d) => ({ ...d }));
      
      const newDesks = [...currentDesks, desk];
      state.updateCustomLayoutItem('desks', newDesks);
    }
    
    const newColleague: Colleague = {
      id: colleagueData.id || `colleague-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: colleagueData.name,
      role: colleagueData.role,
      color: colleagueData.color,
      appearance: colleagueData.appearance,
      position: colleagueData.position || { x: desk.x, y: desk.y },
      state: colleagueData.state || 'working',
      deskPosition: { x: desk.x, y: desk.y },
      keyboardType: colleagueData.keyboardType,
      typingSpeed: colleagueData.typingSpeed,
      schedule: colleagueData.schedule,
      speed: colleagueData.speed,
      behaviorPreferences: colleagueData.behaviorPreferences,
      currentAction: 'none',
    };
    
    set((state) => ({
      colleagues: [...state.colleagues, newColleague],
    }));
  },

  removeColleague: (id) =>
    set((state) => ({
      colleagues: state.colleagues.filter((c) => c.id !== id),
    })),

  updateColleague: (id, updates) =>
    set((state) => ({
      colleagues: state.colleagues.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  updateColleagueAppearance: (id, appearance) =>
    set((state) => ({
      colleagues: state.colleagues.map((c) =>
        c.id === id ? { ...c, appearance: { ...c.appearance, ...appearance } } : c
      ),
    })),

  updateColleagueRole: (id, role) =>
    set((state) => ({
      colleagues: state.colleagues.map((c) =>
        c.id === id ? { ...c, role } : c
      ),
    })),

  resetColleagues: () =>
    set({
      colleagues: initialColleagues.map((c) => ({ ...c, currentAction: 'none' as BehaviorActionType })),
    }),
}));
