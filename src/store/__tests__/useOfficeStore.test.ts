import { describe, it, expect, beforeEach } from 'vitest';
import { useOfficeStore } from '../useOfficeStore';
import type { Position, WeatherType, OfficeThemeType, ColleagueRole } from '@/types/office';

describe('store/useOfficeStore', () => {
  beforeEach(() => {
    useOfficeStore.setState({
      listenerPosition: { x: 50, y: 50 },
      zoom: 1,
      masterVolume: 0.7,
      isMuted: false,
      isPlaying: false,
      time: {
        hour: 10,
        minute: 0,
        day: 1,
        speed: 1,
        isPaused: false,
        timeOfDay: 'morning',
      },
      isTimePaused: false,
      weather: {
        current: 'sunny',
        previous: 'sunny',
        transitionProgress: 1,
        intensity: 0.7,
        isAutoMode: true,
        autoChangeInterval: 30,
      },
      currentView: 'overview',
      showControlPanel: true,
      showViewSelector: false,
      colleagueSoundEvents: [],
      currentTheme: 'modern',
      customization: {
        colorOverrides: { furniture: {} },
        layoutOverrides: { desks: [] },
        customObjects: [],
        enabled: false,
      },
    });
    useOfficeStore.getState().resetColleagues();
  });

  describe('initial state', () => {
    it('should have default listener position at (50, 50)', () => {
      const { listenerPosition } = useOfficeStore.getState();
      expect(listenerPosition).toEqual({ x: 50, y: 50 });
    });

    it('should have default zoom of 1', () => {
      expect(useOfficeStore.getState().zoom).toBe(1);
    });

    it('should have default masterVolume of 0.7', () => {
      expect(useOfficeStore.getState().masterVolume).toBe(0.7);
    });

    it('should have audio sources and colleagues initialized', () => {
      const { audioSources, colleagues } = useOfficeStore.getState();
      expect(audioSources.length).toBeGreaterThan(0);
      expect(colleagues.length).toBeGreaterThan(0);
    });
  });

  describe('setListenerPosition', () => {
    it('should update listener position', () => {
      const newPosition: Position = { x: 30, y: 40 };
      useOfficeStore.getState().setListenerPosition(newPosition);
      expect(useOfficeStore.getState().listenerPosition).toEqual(newPosition);
    });
  });

  describe('setZoom', () => {
    it('should update zoom within valid range', () => {
      useOfficeStore.getState().setZoom(1.5);
      expect(useOfficeStore.getState().zoom).toBe(1.5);
    });

    it('should clamp zoom to minimum 0.5', () => {
      useOfficeStore.getState().setZoom(0.1);
      expect(useOfficeStore.getState().zoom).toBe(0.5);
    });

    it('should clamp zoom to maximum 2', () => {
      useOfficeStore.getState().setZoom(3);
      expect(useOfficeStore.getState().zoom).toBe(2);
    });
  });

  describe('setMasterVolume', () => {
    it('should update master volume within valid range', () => {
      useOfficeStore.getState().setMasterVolume(0.5);
      expect(useOfficeStore.getState().masterVolume).toBe(0.5);
    });

    it('should clamp volume to minimum 0', () => {
      useOfficeStore.getState().setMasterVolume(-0.5);
      expect(useOfficeStore.getState().masterVolume).toBe(0);
    });

    it('should clamp volume to maximum 1', () => {
      useOfficeStore.getState().setMasterVolume(1.5);
      expect(useOfficeStore.getState().masterVolume).toBe(1);
    });
  });

  describe('toggleMute', () => {
    it('should toggle mute from false to true', () => {
      expect(useOfficeStore.getState().isMuted).toBe(false);
      useOfficeStore.getState().toggleMute();
      expect(useOfficeStore.getState().isMuted).toBe(true);
    });

    it('should toggle mute from true to false', () => {
      useOfficeStore.setState({ isMuted: true });
      useOfficeStore.getState().toggleMute();
      expect(useOfficeStore.getState().isMuted).toBe(false);
    });
  });

  describe('togglePlay', () => {
    it('should toggle play state', () => {
      expect(useOfficeStore.getState().isPlaying).toBe(false);
      useOfficeStore.getState().togglePlay();
      expect(useOfficeStore.getState().isPlaying).toBe(true);
      useOfficeStore.getState().togglePlay();
      expect(useOfficeStore.getState().isPlaying).toBe(false);
    });
  });

  describe('setSourceVolume', () => {
    it('should update volume of a specific audio source', () => {
      const sources = useOfficeStore.getState().audioSources;
      if (sources.length > 0) {
        const sourceId = sources[0].id;
        useOfficeStore.getState().setSourceVolume(sourceId, 0.8);
        const updated = useOfficeStore.getState().audioSources.find(s => s.id === sourceId);
        expect(updated?.baseVolume).toBe(0.8);
      }
    });

    it('should clamp source volume between 0 and 1', () => {
      const sources = useOfficeStore.getState().audioSources;
      if (sources.length > 0) {
        const sourceId = sources[0].id;
        useOfficeStore.getState().setSourceVolume(sourceId, 2);
        const updated = useOfficeStore.getState().audioSources.find(s => s.id === sourceId);
        expect(updated?.baseVolume).toBe(1);
      }
    });
  });

  describe('toggleSourceMute', () => {
    it('should toggle mute for a specific source', () => {
      const sources = useOfficeStore.getState().audioSources;
      if (sources.length > 0) {
        const sourceId = sources[0].id;
        const initialMuted = sources[0].muted;
        useOfficeStore.getState().toggleSourceMute(sourceId);
        const updated = useOfficeStore.getState().audioSources.find(s => s.id === sourceId);
        expect(updated?.muted).toBe(!initialMuted);
      }
    });
  });

  describe('updateColleaguePosition', () => {
    it('should update position of a specific colleague', () => {
      const colleagues = useOfficeStore.getState().colleagues;
      if (colleagues.length > 0) {
        const colleagueId = colleagues[0].id;
        const newPosition: Position = { x: 10, y: 20 };
        useOfficeStore.getState().updateColleaguePosition(colleagueId, newPosition);
        const updated = useOfficeStore.getState().colleagues.find(c => c.id === colleagueId);
        expect(updated?.position).toEqual(newPosition);
      }
    });
  });

  describe('updateColleagueState', () => {
    it('should update state of a specific colleague', () => {
      const colleagues = useOfficeStore.getState().colleagues;
      if (colleagues.length > 0) {
        const colleagueId = colleagues[0].id;
        useOfficeStore.getState().updateColleagueState(colleagueId, 'away');
        const updated = useOfficeStore.getState().colleagues.find(c => c.id === colleagueId);
        expect(updated?.state).toBe('away');
      }
    });
  });

  describe('updateTime', () => {
    it('should advance time by delta minutes', () => {
      useOfficeStore.setState({
        time: { hour: 10, minute: 0, day: 1, speed: 1, isPaused: false, timeOfDay: 'morning' },
      });
      useOfficeStore.getState().updateTime(30);
      const time = useOfficeStore.getState().time;
      expect(time.hour).toBe(10);
      expect(time.minute).toBe(30);
    });

    it('should increment hour when minutes exceed 60', () => {
      useOfficeStore.setState({
        time: { hour: 10, minute: 30, day: 1, speed: 1, isPaused: false, timeOfDay: 'morning' },
      });
      useOfficeStore.getState().updateTime(45);
      const time = useOfficeStore.getState().time;
      expect(time.hour).toBe(11);
      expect(time.minute).toBe(15);
    });

    it('should increment day when hours exceed 24', () => {
      useOfficeStore.setState({
        time: { hour: 23, minute: 30, day: 1, speed: 1, isPaused: false, timeOfDay: 'night' },
      });
      useOfficeStore.getState().updateTime(60);
      const time = useOfficeStore.getState().time;
      expect(time.day).toBe(2);
      expect(time.hour).toBe(0);
      expect(time.minute).toBe(30);
    });

    it('should not update time when paused', () => {
      useOfficeStore.setState({
        time: { hour: 10, minute: 0, day: 1, speed: 1, isPaused: true, timeOfDay: 'morning' },
        isTimePaused: true,
      });
      useOfficeStore.getState().updateTime(60);
      const time = useOfficeStore.getState().time;
      expect(time.hour).toBe(10);
      expect(time.minute).toBe(0);
    });

    it('should apply time speed multiplier', () => {
      useOfficeStore.setState({
        time: { hour: 10, minute: 0, day: 1, speed: 2, isPaused: false, timeOfDay: 'morning' },
      });
      useOfficeStore.getState().updateTime(30);
      const time = useOfficeStore.getState().time;
      expect(time.hour).toBe(11);
      expect(time.minute).toBe(0);
    });
  });

  describe('setTimeSpeed', () => {
    it('should update time speed within valid range', () => {
      useOfficeStore.getState().setTimeSpeed(5);
      expect(useOfficeStore.getState().time.speed).toBe(5);
    });

    it('should clamp speed to minimum 0', () => {
      useOfficeStore.getState().setTimeSpeed(-1);
      expect(useOfficeStore.getState().time.speed).toBe(0);
    });

    it('should clamp speed to maximum 100', () => {
      useOfficeStore.getState().setTimeSpeed(200);
      expect(useOfficeStore.getState().time.speed).toBe(100);
    });
  });

  describe('toggleTimePause', () => {
    it('should toggle time pause state', () => {
      expect(useOfficeStore.getState().time.isPaused).toBe(false);
      expect(useOfficeStore.getState().isTimePaused).toBe(false);
      useOfficeStore.getState().toggleTimePause();
      expect(useOfficeStore.getState().time.isPaused).toBe(true);
      expect(useOfficeStore.getState().isTimePaused).toBe(true);
    });
  });

  describe('setWeather', () => {
    it('should update weather and transition progress', () => {
      const newWeather: WeatherType = 'rainy';
      useOfficeStore.getState().setWeather(newWeather);
      const weather = useOfficeStore.getState().weather;
      expect(weather.current).toBe(newWeather);
      expect(weather.previous).toBe('sunny');
      expect(weather.transitionProgress).toBe(0);
    });
  });

  describe('setWeatherIntensity', () => {
    it('should update weather intensity within valid range', () => {
      useOfficeStore.getState().setWeatherIntensity(0.5);
      expect(useOfficeStore.getState().weather.intensity).toBe(0.5);
    });

    it('should clamp intensity between 0 and 1', () => {
      useOfficeStore.getState().setWeatherIntensity(2);
      expect(useOfficeStore.getState().weather.intensity).toBe(1);
      useOfficeStore.getState().setWeatherIntensity(-1);
      expect(useOfficeStore.getState().weather.intensity).toBe(0);
    });
  });

  describe('setWeatherAutoMode', () => {
    it('should toggle weather auto mode', () => {
      useOfficeStore.getState().setWeatherAutoMode(false);
      expect(useOfficeStore.getState().weather.isAutoMode).toBe(false);
      useOfficeStore.getState().setWeatherAutoMode(true);
      expect(useOfficeStore.getState().weather.isAutoMode).toBe(true);
    });
  });

  describe('setWeatherAutoInterval', () => {
    it('should update auto interval within valid range', () => {
      useOfficeStore.getState().setWeatherAutoInterval(60);
      expect(useOfficeStore.getState().weather.autoChangeInterval).toBe(60);
    });

    it('should clamp interval between 5 and 120', () => {
      useOfficeStore.getState().setWeatherAutoInterval(1);
      expect(useOfficeStore.getState().weather.autoChangeInterval).toBe(5);
      useOfficeStore.getState().setWeatherAutoInterval(200);
      expect(useOfficeStore.getState().weather.autoChangeInterval).toBe(120);
    });
  });

  describe('setCurrentView', () => {
    it('should change view to a valid viewpoint', () => {
      useOfficeStore.getState().setCurrentView('kitchen');
      const state = useOfficeStore.getState();
      expect(state.currentView).toBe('kitchen');
    });

    it('should not change view for invalid viewpoint id', () => {
      const initialView = useOfficeStore.getState().currentView;
      useOfficeStore.getState().setCurrentView('invalid-view');
      expect(useOfficeStore.getState().currentView).toBe(initialView);
    });
  });

  describe('toggleControlPanel and toggleViewSelector', () => {
    it('should toggle control panel', () => {
      expect(useOfficeStore.getState().showControlPanel).toBe(true);
      useOfficeStore.getState().toggleControlPanel();
      expect(useOfficeStore.getState().showControlPanel).toBe(false);
    });

    it('should toggle view selector', () => {
      expect(useOfficeStore.getState().showViewSelector).toBe(false);
      useOfficeStore.getState().toggleViewSelector();
      expect(useOfficeStore.getState().showViewSelector).toBe(true);
    });
  });

  describe('getViewPoints and getTimeOfDay', () => {
    it('should return all viewpoints', () => {
      const viewpoints = useOfficeStore.getState().getViewPoints();
      expect(Array.isArray(viewpoints)).toBe(true);
      expect(viewpoints.length).toBeGreaterThan(0);
    });

    it('should return correct time of day', () => {
      useOfficeStore.setState({
        time: { hour: 10, minute: 0, day: 1, speed: 1, isPaused: false, timeOfDay: 'morning' },
      });
      expect(useOfficeStore.getState().getTimeOfDay()).toBe('morning');
    });
  });

  describe('office theme', () => {
    it('should have default modern theme', () => {
      expect(useOfficeStore.getState().currentTheme).toBe('modern');
    });

    it('should get current theme', () => {
      const theme = useOfficeStore.getState().getCurrentTheme();
      expect(theme.id).toBe('modern');
    });

    it('should get all themes', () => {
      const themes = useOfficeStore.getState().getAllThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should set office theme', () => {
      const newTheme: OfficeThemeType = 'industrial';
      useOfficeStore.getState().setOfficeTheme(newTheme);
      expect(useOfficeStore.getState().currentTheme).toBe(newTheme);
    });
  });

  describe('colleague management', () => {
    it('should remove a colleague', () => {
      const initialCount = useOfficeStore.getState().colleagues.length;
      const colleagueId = useOfficeStore.getState().colleagues[0].id;
      useOfficeStore.getState().removeColleague(colleagueId);
      expect(useOfficeStore.getState().colleagues.length).toBe(initialCount - 1);
    });

    it('should update a colleague', () => {
      const colleagues = useOfficeStore.getState().colleagues;
      if (colleagues.length > 0) {
        const id = colleagues[0].id;
        useOfficeStore.getState().updateColleague(id, { name: '更新的名字' });
        const updated = useOfficeStore.getState().colleagues.find(c => c.id === id);
        expect(updated?.name).toBe('更新的名字');
      }
    });

    it('should update colleague role', () => {
      const colleagues = useOfficeStore.getState().colleagues;
      if (colleagues.length > 0) {
        const id = colleagues[0].id;
        const newRole: ColleagueRole = 'designer';
        useOfficeStore.getState().updateColleagueRole(id, newRole);
        const updated = useOfficeStore.getState().colleagues.find(c => c.id === id);
        expect(updated?.role).toBe(newRole);
      }
    });

    it('should reset colleagues to initial state', () => {
      const initialColleagues = [...useOfficeStore.getState().colleagues];
      useOfficeStore.getState().removeColleague(initialColleagues[0].id);
      expect(useOfficeStore.getState().colleagues.length).toBe(initialColleagues.length - 1);
      useOfficeStore.getState().resetColleagues();
      expect(useOfficeStore.getState().colleagues.length).toBe(initialColleagues.length);
    });
  });

  describe('customization', () => {
    it('should enable customization', () => {
      useOfficeStore.getState().setCustomizationEnabled(true);
      expect(useOfficeStore.getState().customization.enabled).toBe(true);
    });

    it('should update custom furniture color', () => {
      useOfficeStore.getState().updateCustomFurnitureColor('deskTop', '#FF0000');
      expect(useOfficeStore.getState().customization.colorOverrides.furniture.deskTop).toBe('#FF0000');
    });

    it('should update custom wall accent', () => {
      useOfficeStore.getState().updateCustomWallAccent('#00FF00');
      expect(useOfficeStore.getState().customization.colorOverrides.wallAccent).toBe('#00FF00');
    });

    it('should add and remove custom objects', () => {
      const obj = { id: 'test-obj', type: 'lamp' as const, x: 50, y: 50, style: 'pendant' };
      useOfficeStore.getState().addCustomObject(obj);
      expect(useOfficeStore.getState().customization.customObjects.length).toBe(1);
      useOfficeStore.getState().removeCustomObject('test-obj');
      expect(useOfficeStore.getState().customization.customObjects.length).toBe(0);
    });

    it('should update custom object', () => {
      const obj = { id: 'test-obj', type: 'lamp' as const, x: 50, y: 50, style: 'pendant' };
      useOfficeStore.getState().addCustomObject(obj);
      useOfficeStore.getState().updateCustomObject('test-obj', { x: 60 });
      const updated = useOfficeStore.getState().customization.customObjects.find(o => o.id === 'test-obj');
      expect(updated?.x).toBe(60);
    });

    it('should reset customization', () => {
      useOfficeStore.getState().setCustomizationEnabled(true);
      useOfficeStore.getState().updateCustomWallAccent('#00FF00');
      useOfficeStore.getState().resetCustomization();
      expect(useOfficeStore.getState().customization.enabled).toBe(false);
      expect(useOfficeStore.getState().customization.colorOverrides.wallAccent).toBeUndefined();
    });

    it('should get customized theme when enabled', () => {
      useOfficeStore.getState().setCustomizationEnabled(true);
      useOfficeStore.getState().updateCustomFurnitureColor('deskTop', '#FF0000');
      const customizedTheme = useOfficeStore.getState().getCustomizedTheme();
      expect(customizedTheme.furniture.deskTop).toBe('#FF0000');
    });

    it('should get base theme when customization disabled', () => {
      useOfficeStore.getState().setCustomizationEnabled(false);
      const theme = useOfficeStore.getState().getCustomizedTheme();
      expect(theme.id).toBe(useOfficeStore.getState().currentTheme);
    });
  });

  describe('colleague sound events', () => {
    it('should trigger and consume colleague sound event', () => {
      const colleagues = useOfficeStore.getState().colleagues;
      if (colleagues.length > 0) {
        const colleagueId = colleagues[0].id;
        useOfficeStore.getState().triggerColleagueSound(colleagueId, 'keyboard');
        const events = useOfficeStore.getState().colleagueSoundEvents;
        expect(events.length).toBe(1);
        expect(events[0].colleagueId).toBe(colleagueId);
        expect(events[0].soundType).toBe('keyboard');

        const eventId = events[0].id;
        useOfficeStore.getState().consumeColleagueSoundEvent(eventId);
        expect(useOfficeStore.getState().colleagueSoundEvents.length).toBe(0);
      }
    });
  });
});
