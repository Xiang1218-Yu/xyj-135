export interface Position {
  x: number;
  y: number;
}

export type AudioSourceType =
  | 'keyboard'
  | 'conversation'
  | 'coffee'
  | 'printer'
  | 'ac'
  | 'ambient'
  | 'typing'
  | 'mouse'
  | 'phone'
  | 'door';

export interface AudioSource {
  id: string;
  name: string;
  type: AudioSourceType;
  position: Position;
  baseVolume: number;
  muted: boolean;
  loop: boolean;
  category: 'work' | 'social' | 'utility' | 'ambient';
  keyboardType?: KeyboardType;
  typingSpeed?: number;
  ownerId?: string;
}

export type KeyboardType = 'mechanical-loud' | 'mechanical-quiet' | 'membrane' | 'laptop';

export type ColleagueState = 'working' | 'walking' | 'talking' | 'resting' | 'away';

export interface Colleague {
  id: string;
  name: string;
  color: string;
  position: Position;
  state: ColleagueState;
  targetPosition?: Position;
  deskPosition: Position;
  keyboardType: KeyboardType;
  typingSpeed: number;
  schedule: {
    arriveTime: number;
    lunchStart: number;
    lunchEnd: number;
    leaveTime: number;
  };
  speed: number;
}

export interface ViewPoint {
  id: string;
  name: string;
  position: Position;
  zoom: number;
  description: string;
  icon: string;
}

export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

export interface OfficeTime {
  hour: number;
  minute: number;
  day: number;
  speed: number;
  isPaused: boolean;
  timeOfDay: TimeOfDay;
}

export interface LightingConfig {
  ambientColor: string;
  lightColor: string;
  shadowOpacity: number;
  windowLightIntensity: number;
  ceilingLightIntensity: number;
}
