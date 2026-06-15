import type { ViewPoint } from '@/types/office';

export const viewPoints: ViewPoint[] = [
  {
    id: 'overview',
    name: '全景视角',
    position: { x: 50, y: 50 },
    zoom: 1,
    description: '俯瞰整个办公室',
    icon: 'LayoutGrid',
  },
  {
    id: 'desk-1',
    name: '1号工位',
    position: { x: 25, y: 35 },
    zoom: 1.5,
    description: '小明的工位',
    icon: 'Monitor',
  },
  {
    id: 'desk-2',
    name: '2号工位',
    position: { x: 45, y: 35 },
    zoom: 1.5,
    description: '小红的工位',
    icon: 'Monitor',
  },
  {
    id: 'desk-3',
    name: '3号工位',
    position: { x: 65, y: 35 },
    zoom: 1.5,
    description: '小刚的工位',
    icon: 'Monitor',
  },
  {
    id: 'kitchen',
    name: '茶水间',
    position: { x: 85, y: 20 },
    zoom: 1.3,
    description: '咖啡和休息区',
    icon: 'Coffee',
  },
  {
    id: 'meeting',
    name: '会议室',
    position: { x: 20, y: 75 },
    zoom: 1.3,
    description: '会议和讨论区',
    icon: 'Users',
  },
];
