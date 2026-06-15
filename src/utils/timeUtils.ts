import type { OfficeTime, TimeOfDay } from '@/types/office';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

export function formatTime(time: OfficeTime): string {
  const h = String(Math.floor(time.hour)).padStart(2, '0');
  const m = String(Math.floor(time.minute)).padStart(2, '0');
  return `${h}:${m}`;
}

export function getGreeting(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return '早上好';
    case 'noon':
      return '中午好';
    case 'afternoon':
      return '下午好';
    case 'evening':
      return '晚上好';
    case 'night':
      return '夜深了';
  }
}

export function isWorkingHours(time: OfficeTime): boolean {
  return time.hour >= 9 && time.hour < 18;
}

export function isLunchTime(time: OfficeTime): boolean {
  return time.hour >= 12 && time.hour < 13;
}
