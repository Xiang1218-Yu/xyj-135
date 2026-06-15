import type { AudioSource } from '@/types/office';
import { colleagues } from './colleagues';

const keyboardSources: AudioSource[] = colleagues.map((colleague, index) => ({
  id: `keyboard-${colleague.id}`,
  name: `${colleague.name}的键盘`,
  type: 'keyboard' as const,
  position: { ...colleague.deskPosition },
  baseVolume: 0.0,
  muted: false,
  loop: false,
  category: 'work' as const,
  keyboardType: colleague.keyboardType,
  typingSpeed: colleague.typingSpeed,
  ownerId: colleague.id,
}));

export const audioSources: AudioSource[] = [
  ...keyboardSources,
  {
    id: 'mouse-1',
    name: '鼠标点击',
    type: 'mouse',
    position: { x: 45, y: 45 },
    baseVolume: 0.2,
    muted: false,
    loop: false,
    category: 'work',
  },
  {
    id: 'conversation-1',
    name: '同事交谈',
    type: 'conversation',
    position: { x: 75, y: 60 },
    baseVolume: 0.25,
    muted: false,
    loop: true,
    category: 'social',
  },
  {
    id: 'coffee-machine',
    name: '咖啡机',
    type: 'coffee',
    position: { x: 85, y: 20 },
    baseVolume: 0.18,
    muted: false,
    loop: true,
    category: 'utility',
  },
  {
    id: 'printer',
    name: '打印机',
    type: 'printer',
    position: { x: 12, y: 70 },
    baseVolume: 0.18,
    muted: false,
    loop: true,
    category: 'utility',
  },
  {
    id: 'ac-unit',
    name: '空调',
    type: 'ac',
    position: { x: 50, y: 6 },
    baseVolume: 0.12,
    muted: false,
    loop: true,
    category: 'utility',
  },
  {
    id: 'ambient-office',
    name: '环境白噪音',
    type: 'ambient',
    position: { x: 50, y: 50 },
    baseVolume: 0.2,
    muted: false,
    loop: true,
    category: 'ambient',
  },
  {
    id: 'door-sound',
    name: '门开关声',
    type: 'door',
    position: { x: 3, y: 42 },
    baseVolume: 0.28,
    muted: false,
    loop: false,
    category: 'utility',
  },
  {
    id: 'phone-ring',
    name: '电话铃声',
    type: 'phone',
    position: { x: 55, y: 45 },
    baseVolume: 0.22,
    muted: false,
    loop: false,
    category: 'utility',
  },
];

export const categoryLabels: Record<string, string> = {
  work: '工作声音',
  social: '社交声音',
  utility: '设备声音',
  ambient: '环境声音',
};

export const keyboardVolumeByType: Record<string, number> = {
  'mechanical-loud': 0.45,
  'mechanical-quiet': 0.3,
  'membrane': 0.25,
  'laptop': 0.18,
};

export const keyboardTimingByType: Record<string, { min: number; max: number; burstiness: number }> = {
  'mechanical-loud': { min: 0.08, max: 0.15, burstiness: 0.3 },
  'mechanical-quiet': { min: 0.1, max: 0.2, burstiness: 0.25 },
  'membrane': { min: 0.12, max: 0.25, burstiness: 0.2 },
  'laptop': { min: 0.15, max: 0.3, burstiness: 0.15 },
};
