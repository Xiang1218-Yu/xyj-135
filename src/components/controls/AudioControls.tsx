import { useOfficeStore } from '@/store/useOfficeStore';
import { categoryLabels } from '@/data/audioSources';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  muted?: boolean;
  onToggleMute?: () => void;
  icon?: React.ReactNode;
}

function VolumeSlider({ value, onChange, label, muted, onToggleMute, icon }: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      {icon && (
        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700 font-medium">{label}</span>
          <span className="text-xs text-gray-400">{Math.round(value * 100)}%</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full transition-all duration-150"
            style={{ width: `${value * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export function AudioControls() {
  const { 
    audioSources, 
    masterVolume, 
    isMuted,
    setMasterVolume, 
    toggleMute,
    setSourceVolume,
    toggleSourceMute,
  } = useOfficeStore();

  const categories = ['work', 'social', 'utility', 'ambient'] as const;

  return (
    <div className="space-y-4">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">🔊 音量控制</h3>
        <VolumeSlider
          value={masterVolume}
          onChange={setMasterVolume}
          label="总音量"
          muted={isMuted}
          onToggleMute={toggleMute}
          icon={<Volume2 className="w-5 h-5" />}
        />
      </div>
      
      {categories.map((category) => {
        const sources = audioSources.filter(s => s.category === category);
        if (sources.length === 0) return null;
        
        return (
          <div key={category} className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              {categoryLabels[category]}
            </h4>
            {sources.map((source) => (
              <VolumeSlider
                key={source.id}
                value={source.baseVolume}
                onChange={(v) => setSourceVolume(source.id, v)}
                label={source.name}
                muted={source.muted}
                onToggleMute={() => toggleSourceMute(source.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
