import type { OfficeTheme, OfficeThemeType } from '@/types/office';

const modernTheme: OfficeTheme = {
  id: 'modern',
  name: '现代简约',
  description: '干净利落的现代办公空间，简洁明亮',
  icon: '🏢',
  floor: {
    pattern: 'wood-plank',
    colors: {
      morning: '#E8E0D0',
      noon: '#F0EADD',
      afternoon: '#E8E0D0',
      evening: '#C9BFAF',
      night: '#3D3D4D',
    },
    lineColor: '#D0C8B8',
  },
  walls: {
    colors: {
      morning: '#F5F1EB',
      noon: '#FAF8F5',
      afternoon: '#F5F1EB',
      evening: '#C9BFAF',
      night: '#2D2D3D',
    },
    accentColor: '#4A90A4',
  },
  window: {
    style: 'modern',
    frameColor: '#333333',
    glassColor: 'rgba(135, 206, 235, 0.6)',
  },
  furniture: {
    deskTop: '#A0826D',
    deskSide: '#7A6352',
    chair: '#3D2B1F',
    chairSeat: '#5C4033',
    monitor: '#2C2C2C',
    monitorScreen: '#87CEEB',
    table: '#8B7355',
    cabinet: '#6B5344',
  },
  furnitureStyle: 'modern',
  layout: {
    desks: [
      { x: 25, y: 35, label: '小明' },
      { x: 45, y: 35, label: '小红' },
      { x: 65, y: 35, label: '小刚' },
      { x: 35, y: 55, label: '小丽' },
      { x: 55, y: 55, label: '小华' },
      { x: 75, y: 55, label: '阿强' },
    ],
    meetingRoom: { x: 20, y: 78, width: 28, height: 20, style: 'rectangular' },
    kitchen: { x: 85, y: 20, style: 'modern' },
    printer: { x: 12, y: 70 },
    acUnit: { x: 50, y: 6 },
    door: { x: 3, y: 42 },
    plants: [
      { x: 8, y: 25, type: 'medium' },
      { x: 92, y: 45, type: 'large' },
      { x: 40, y: 88, type: 'small' },
    ],
    extraObjects: [
      { id: 'art-1', type: 'painting', x: 70, y: 8, style: 'abstract' },
      { id: 'bookshelf-1', type: 'bookshelf', x: 90, y: 70, style: 'modern' },
    ],
  },
  ambientIntensity: 1.0,
  ceilingLightStyle: 'recessed',
};

const industrialTheme: OfficeTheme = {
  id: 'industrial',
  name: '工业风格',
  description: '裸露砖墙、水泥地面，粗犷有质感',
  icon: '🏭',
  floor: {
    pattern: 'concrete',
    colors: {
      morning: '#8B8682',
      noon: '#9C9792',
      afternoon: '#8B8682',
      evening: '#5A5552',
      night: '#2A2826',
    },
    secondaryColor: '#6B6662',
  },
  walls: {
    colors: {
      morning: '#A0522D',
      noon: '#B8632D',
      afternoon: '#A0522D',
      evening: '#6B3820',
      night: '#3D2214',
    },
    accentColor: '#2F2F2F',
    hasWallDecoration: true,
  },
  window: {
    style: 'classic',
    frameColor: '#1A1A1A',
    glassColor: 'rgba(150, 150, 150, 0.5)',
  },
  furniture: {
    deskTop: '#4A4A4A',
    deskSide: '#3A3A3A',
    chair: '#2A2A2A',
    chairSeat: '#3D3D3D',
    monitor: '#1C1C1C',
    monitorScreen: '#5FA8D3',
    table: '#5C4033',
    cabinet: '#3A3A3A',
  },
  furnitureStyle: 'industrial',
  layout: {
    desks: [
      { x: 30, y: 30, label: '小明' },
      { x: 50, y: 30, label: '小红' },
      { x: 70, y: 30, label: '小刚' },
      { x: 30, y: 60, label: '小丽' },
      { x: 50, y: 60, label: '小华' },
      { x: 70, y: 60, label: '阿强' },
    ],
    meetingRoom: { x: 85, y: 75, width: 25, height: 22, style: 'casual' },
    kitchen: { x: 15, y: 82, style: 'industrial' },
    printer: { x: 88, y: 35 },
    acUnit: { x: 50, y: 8 },
    door: { x: 5, y: 50 },
    plants: [
      { x: 22, y: 45, type: 'small' },
      { x: 78, y: 45, type: 'small' },
    ],
    extraObjects: [
      { id: 'pipe-1', type: 'decoration', x: 30, y: 10, style: 'exposed-pipe' },
      { id: 'pipe-2', type: 'decoration', x: 70, y: 10, style: 'exposed-pipe' },
      { id: 'rug-1', type: 'rug', x: 50, y: 45, style: 'industrial' },
    ],
  },
  ambientIntensity: 0.85,
  ceilingLightStyle: 'track',
};

const scandinavianTheme: OfficeTheme = {
  id: 'scandinavian',
  name: '北欧风格',
  description: '温馨明亮，大量绿植和自然木材',
  icon: '🌲',
  floor: {
    pattern: 'wood-plank',
    colors: {
      morning: '#F5F0E8',
      noon: '#FAF7F2',
      afternoon: '#F5F0E8',
      evening: '#D4C9B8',
      night: '#5C5448',
    },
    lineColor: '#E8DFD0',
  },
  walls: {
    colors: {
      morning: '#FFFFFF',
      noon: '#FFFFFF',
      afternoon: '#FFFEFC',
      evening: '#E8E4DC',
      night: '#4A4640',
    },
    accentColor: '#8FA998',
  },
  window: {
    style: 'large',
    frameColor: '#F0F0F0',
    glassColor: 'rgba(180, 220, 240, 0.7)',
  },
  furniture: {
    deskTop: '#E8DCC8',
    deskSide: '#D4C4A8',
    chair: '#4A5D4A',
    chairSeat: '#6B7D6B',
    monitor: '#2C2C2C',
    monitorScreen: '#A8D8EA',
    table: '#D4C4A8',
    cabinet: '#C4B498',
  },
  furnitureStyle: 'minimalist',
  layout: {
    desks: [
      { x: 20, y: 40, label: '小明' },
      { x: 40, y: 40, label: '小红' },
      { x: 60, y: 40, label: '小刚' },
      { x: 80, y: 40, label: '小丽' },
      { x: 30, y: 65, label: '小华' },
      { x: 70, y: 65, label: '阿强' },
    ],
    meetingRoom: { x: 50, y: 82, width: 35, height: 18, style: 'casual' },
    kitchen: { x: 15, y: 15, style: 'cozy' },
    printer: { x: 85, y: 80 },
    acUnit: { x: 50, y: 5 },
    door: { x: 5, y: 55 },
    plants: [
      { x: 10, y: 75, type: 'large' },
      { x: 90, y: 30, type: 'large' },
      { x: 50, y: 25, type: 'medium' },
      { x: 25, y: 55, type: 'small' },
      { x: 75, y: 55, type: 'small' },
    ],
    extraObjects: [
      { id: 'lamp-1', type: 'lamp', x: 35, y: 15, style: 'pendant' },
      { id: 'lamp-2', type: 'lamp', x: 65, y: 15, style: 'pendant' },
      { id: 'rug-1', type: 'rug', x: 50, y: 52, style: 'scandinavian' },
    ],
  },
  ambientIntensity: 1.15,
  ceilingLightStyle: 'pendant',
};

const japaneseTheme: OfficeTheme = {
  id: 'japanese',
  name: '日式禅意',
  description: '榻榻米风格，原木色调，宁静雅致',
  icon: '🏯',
  floor: {
    pattern: 'tatami',
    colors: {
      morning: '#C4B896',
      noon: '#D4C8A6',
      afternoon: '#C4B896',
      evening: '#9C9070',
      night: '#4A4430',
    },
    lineColor: '#8B7355',
  },
  walls: {
    colors: {
      morning: '#F5F0E0',
      noon: '#FAF7EA',
      afternoon: '#F5F0E0',
      evening: '#C8C0A8',
      night: '#4A4438',
    },
    accentColor: '#8B4513',
    hasWallDecoration: true,
  },
  window: {
    style: 'japanese',
    frameColor: '#4A3728',
    glassColor: 'rgba(240, 230, 200, 0.6)',
  },
  furniture: {
    deskTop: '#C4A87C',
    deskSide: '#A08860',
    chair: '#5C4033',
    chairSeat: '#7C5A43',
    monitor: '#2C2C2C',
    monitorScreen: '#B8D4C8',
    table: '#B89868',
    cabinet: '#8B6914',
  },
  furnitureStyle: 'traditional',
  layout: {
    desks: [
      { x: 25, y: 35, label: '小明', rotation: 0 },
      { x: 50, y: 35, label: '小红', rotation: 0 },
      { x: 75, y: 35, label: '小刚', rotation: 0 },
      { x: 25, y: 60, label: '小丽', rotation: 0 },
      { x: 50, y: 60, label: '小华', rotation: 0 },
      { x: 75, y: 60, label: '阿强', rotation: 0 },
    ],
    meetingRoom: { x: 85, y: 82, width: 22, height: 20, style: 'round' },
    kitchen: { x: 15, y: 82, style: 'cozy' },
    printer: { x: 8, y: 45 },
    acUnit: { x: 50, y: 6 },
    door: { x: 3, y: 25 },
    plants: [
      { x: 12, y: 20, type: 'medium' },
      { x: 88, y: 55, type: 'medium' },
      { x: 40, y: 85, type: 'small' },
      { x: 60, y: 85, type: 'small' },
    ],
    extraObjects: [
      { id: 'art-1', type: 'painting', x: 50, y: 15, style: 'japanese' },
      { id: 'decoration-1', type: 'decoration', x: 5, y: 70, style: 'bamboo' },
    ],
  },
  ambientIntensity: 0.95,
  ceilingLightStyle: 'pendant',
};

const creativeTheme: OfficeTheme = {
  id: 'creative',
  name: '创意工作室',
  description: '色彩丰富，开放布局，充满活力',
  icon: '🎨',
  floor: {
    pattern: 'herringbone',
    colors: {
      morning: '#E8DCC8',
      noon: '#F0E4D0',
      afternoon: '#E8DCC8',
      evening: '#B8A88C',
      night: '#4A4030',
    },
    secondaryColor: '#D4C4A8',
    lineColor: '#C4A87C',
  },
  walls: {
    colors: {
      morning: '#FFFFFF',
      noon: '#FFFFFF',
      afternoon: '#FFFEFC',
      evening: '#E8E4DC',
      night: '#4A4640',
    },
    accentColor: '#FF6B6B',
    hasWallDecoration: true,
  },
  window: {
    style: 'large',
    frameColor: '#2C2C2C',
    glassColor: 'rgba(200, 230, 255, 0.7)',
  },
  furniture: {
    deskTop: '#FFFFFF',
    deskSide: '#F0F0F0',
    chair: '#FF6B6B',
    chairSeat: '#FF8E8E',
    monitor: '#2C2C2C',
    monitorScreen: '#4ECDC4',
    table: '#FFD93D',
    cabinet: '#6BCB77',
  },
  furnitureStyle: 'colorful',
  layout: {
    desks: [
      { x: 20, y: 30, label: '小明' },
      { x: 40, y: 30, label: '小红' },
      { x: 60, y: 30, label: '小刚' },
      { x: 80, y: 30, label: '小丽' },
      { x: 30, y: 55, label: '小华' },
      { x: 70, y: 55, label: '阿强' },
    ],
    meetingRoom: { x: 15, y: 80, width: 25, height: 22, style: 'casual' },
    kitchen: { x: 85, y: 78, style: 'modern' },
    printer: { x: 50, y: 75 },
    acUnit: { x: 50, y: 5 },
    door: { x: 5, y: 42 },
    plants: [
      { x: 12, y: 45, type: 'medium' },
      { x: 88, y: 45, type: 'medium' },
      { x: 50, y: 42, type: 'small' },
    ],
    extraObjects: [
      { id: 'art-1', type: 'painting', x: 30, y: 12, style: 'colorful' },
      { id: 'art-2', type: 'painting', x: 70, y: 12, style: 'graffiti' },
      { id: 'rug-1', type: 'rug', x: 50, y: 42, style: 'colorful' },
      { id: 'decoration-1', type: 'decoration', x: 92, y: 15, style: 'neon' },
    ],
  },
  ambientIntensity: 1.1,
  ceilingLightStyle: 'track',
};

const classicTheme: OfficeTheme = {
  id: 'classic',
  name: '经典传统',
  description: '深色木质，庄重典雅，大气稳重',
  icon: '🏛️',
  floor: {
    pattern: 'carpet',
    colors: {
      morning: '#4A3C30',
      noon: '#5A4C40',
      afternoon: '#4A3C30',
      evening: '#3A2C20',
      night: '#1A1510',
    },
    secondaryColor: '#5C4A3A',
    lineColor: '#8B6914',
  },
  walls: {
    colors: {
      morning: '#D4C4A8',
      noon: '#E0D0B4',
      afternoon: '#D4C4A8',
      evening: '#9C8C6C',
      night: '#3A3020',
    },
    accentColor: '#8B4513',
    hasWallDecoration: true,
  },
  window: {
    style: 'classic',
    frameColor: '#4A3728',
    glassColor: 'rgba(200, 180, 140, 0.5)',
  },
  furniture: {
    deskTop: '#5C4033',
    deskSide: '#3D2817',
    chair: '#1A0F0A',
    chairSeat: '#2A1F15',
    monitor: '#1C1C1C',
    monitorScreen: '#A8D8EA',
    table: '#4A3728',
    cabinet: '#3D2817',
  },
  furnitureStyle: 'traditional',
  layout: {
    desks: [
      { x: 25, y: 32, label: '小明' },
      { x: 50, y: 32, label: '小红' },
      { x: 75, y: 32, label: '小刚' },
      { x: 25, y: 58, label: '小丽' },
      { x: 50, y: 58, label: '小华' },
      { x: 75, y: 58, label: '阿强' },
    ],
    meetingRoom: { x: 85, y: 80, width: 25, height: 22, style: 'rectangular' },
    kitchen: { x: 15, y: 80, style: 'cozy' },
    printer: { x: 8, y: 45 },
    acUnit: { x: 50, y: 6 },
    door: { x: 3, y: 42 },
    plants: [
      { x: 10, y: 20, type: 'large' },
      { x: 90, y: 20, type: 'large' },
      { x: 40, y: 88, type: 'medium' },
      { x: 60, y: 88, type: 'medium' },
    ],
    extraObjects: [
      { id: 'art-1', type: 'painting', x: 50, y: 12, style: 'classic' },
      { id: 'bookshelf-1', type: 'bookshelf', x: 12, y: 70, style: 'classic' },
      { id: 'bookshelf-2', type: 'bookshelf', x: 88, y: 45, style: 'classic' },
      { id: 'lamp-1', type: 'lamp', x: 35, y: 8, style: 'chandelier' },
      { id: 'lamp-2', type: 'lamp', x: 65, y: 8, style: 'chandelier' },
    ],
  },
  ambientIntensity: 0.9,
  ceilingLightStyle: 'chandelier',
};

export const officeThemes: Record<OfficeThemeType, OfficeTheme> = {
  modern: modernTheme,
  industrial: industrialTheme,
  scandinavian: scandinavianTheme,
  japanese: japaneseTheme,
  creative: creativeTheme,
  classic: classicTheme,
};

export const getOfficeTheme = (themeId: OfficeThemeType): OfficeTheme => {
  return officeThemes[themeId] || modernTheme;
};

export const getAllThemes = (): OfficeTheme[] => {
  return Object.values(officeThemes);
};
