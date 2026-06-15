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
  | 'door'
  | 'footstep'
  | 'greeting'
  | 'sip'
  | 'print-page'
  | 'meeting-talk'
  | 'paper-handle';

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

export type ColleagueState = 
  | 'working' 
  | 'walking' 
  | 'talking' 
  | 'resting' 
  | 'away'
  | 'drinking-coffee'
  | 'printing'
  | 'in-meeting'
  | 'greeting'
  | 'getting-coffee';

export interface BehaviorPreferences {
  coffeeFrequency: number;
  printFrequency: number;
  meetingFrequency: number;
  greetingFrequency: number;
  talkativeness: number;
  activityLevel: number;
}

export type BehaviorActionType = 
  | 'none'
  | 'go-coffee'
  | 'drink-coffee'
  | 'go-printer'
  | 'printing'
  | 'go-meeting'
  | 'meeting'
  | 'greet'
  | 'go-desk'
  | 'go-lunch'
  | 'leave-office'
  | 'arrive-office';

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
  behaviorPreferences: BehaviorPreferences;
  currentAction?: BehaviorActionType;
  actionStartTime?: number;
  actionDuration?: number;
  greetingTargetId?: string;
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

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface WeatherState {
  current: WeatherType;
  previous: WeatherType;
  transitionProgress: number;
  intensity: number;
  isAutoMode: boolean;
  autoChangeInterval: number;
}

export interface WeatherLightingConfig {
  ambientColor: string;
  lightColor: string;
  shadowOpacity: number;
  windowLightIntensity: number;
  ceilingLightIntensity: number;
  bgTopAdjust: string;
  bgBottomAdjust: string;
  fogOpacity: number;
  fogColor: string;
}

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
