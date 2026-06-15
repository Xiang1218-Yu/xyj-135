import { useOfficeStore } from '@/store/useOfficeStore';
import { formatTime } from '@/utils/timeUtils';
import { Clock, Play, Pause, FastForward, Sun, Sunset, Moon } from 'lucide-react';

export function TimeControls() {
  const { time, setTimeSpeed, toggleTimePause } = useOfficeStore();

  const timePresets = [
    { label: '早晨', hour: 9, icon: <Sun className="w-4 h-4" /> },
    { label: '中午', hour: 12, icon: <Sun className="w-4 h-4 text-yellow-500" /> },
    { label: '下午', hour: 15, icon: <Sun className="w-4 h-4 text-orange-400" /> },
    { label: '傍晚', hour: 18, icon: <Sunset className="w-4 h-4 text-orange-500" /> },
    { label: '夜晚', hour: 22, icon: <Moon className="w-4 h-4 text-blue-400" /> },
  ];

  const speedPresets = [
    { label: '1x', value: 1 },
    { label: '5x', value: 5 },
    { label: '10x', value: 10 },
    { label: '30x', value: 30 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">⏰ 时间控制</h3>
      
      <div className="flex items-center justify-center py-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
        <Clock className="w-6 h-6 text-orange-400 mr-3" />
        <span className="text-3xl font-bold text-gray-800 tracking-wider">
          {formatTime(time)}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTimePause}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
        >
          {time.isPaused ? (
            <><Play className="w-4 h-4" /> 继续</>
          ) : (
            <><Pause className="w-4 h-4" /> 暂停</>
          )}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <FastForward className="w-4 h-4" />
          时间流速
        </div>
        <div className="grid grid-cols-4 gap-1">
          {speedPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setTimeSpeed(preset.value)}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                time.speed === preset.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600">
          快速跳转
        </div>
        <div className="grid grid-cols-5 gap-1">
          {timePresets.map((preset) => (
            <button
              key={preset.hour}
              onClick={() => {
                useOfficeStore.setState((state) => ({
                  time: { ...state.time, hour: preset.hour, minute: 0 },
                }));
              }}
              className="py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex flex-col items-center gap-1"
            >
              {preset.icon}
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
