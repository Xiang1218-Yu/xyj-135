import { useOfficeStore } from '@/store/useOfficeStore';
import { getWeatherLabel, getWeatherEmoji } from '@/hooks/useWeatherSimulation';
import type { WeatherType } from '@/types/office';
import { Cloud, Sun, CloudRain, Snowflake, Shuffle, Gauge } from 'lucide-react';

const weatherOptions: { type: WeatherType; icon: typeof Sun; color: string }[] = [
  { type: 'sunny', icon: Sun, color: 'text-yellow-500' },
  { type: 'cloudy', icon: Cloud, color: 'text-gray-400' },
  { type: 'rainy', icon: CloudRain, color: 'text-blue-400' },
  { type: 'snowy', icon: Snowflake, color: 'text-blue-200' },
];

const intervalPresets = [
  { label: '15秒', value: 15 },
  { label: '30秒', value: 30 },
  { label: '60秒', value: 60 },
  { label: '120秒', value: 120 },
];

export function WeatherControls() {
  const {
    weather,
    setWeather,
    setWeatherAutoMode,
    setWeatherAutoInterval,
    setWeatherIntensity,
  } = useOfficeStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">🌤️ 天气模拟</h3>

      <div className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
        <span className="text-3xl mr-3">{getWeatherEmoji(weather.current)}</span>
        <div>
          <div className="text-xl font-bold text-gray-800">{getWeatherLabel(weather.current)}</div>
          <div className="text-xs text-gray-500">
            {weather.isAutoMode ? '自动切换中' : '手动模式'}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600">选择天气</div>
        <div className="grid grid-cols-4 gap-1.5">
          {weatherOptions.map(({ type, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => {
                setWeatherAutoMode(false);
                setWeather(type);
              }}
              className={`py-3 rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                weather.current === type
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${weather.current === type ? 'text-white' : color}`} />
              <span className="text-xs font-medium">{getWeatherLabel(type)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            自动切换
          </div>
          <button
            onClick={() => setWeatherAutoMode(!weather.isAutoMode)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              weather.isAutoMode ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                weather.isAutoMode ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {weather.isAutoMode && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">切换间隔</div>
          <div className="grid grid-cols-4 gap-1.5">
            {intervalPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setWeatherAutoInterval(preset.value)}
                className={`py-2 rounded-lg transition-all text-center ${
                  weather.autoChangeInterval === preset.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          特效强度
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={weather.intensity}
          onChange={(e) => setWeatherIntensity(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>微弱</span>
          <span>{Math.round(weather.intensity * 100)}%</span>
          <span>强烈</span>
        </div>
      </div>
    </div>
  );
}
