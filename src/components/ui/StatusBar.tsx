import { useOfficeStore } from '@/store/useOfficeStore';
import { formatTime, getGreeting } from '@/utils/timeUtils';
import { Clock, Users, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export function StatusBar() {
  const { time, colleagues, isMuted, toggleMute, isPlaying, togglePlay, masterVolume } = useOfficeStore();
  
  const presentColleagues = colleagues.filter(c => c.state !== 'away').length;

  return (
    <div className="absolute top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <div className="text-center">
              <div className="text-2xl font-bold tracking-wider">
                {formatTime(time)}
              </div>
              <div className="text-xs opacity-75">
                {getGreeting(time.timeOfDay)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">
              {presentColleagues}/{colleagues.length} 人在工位
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-sm font-medium">暂停</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">播放</span>
              </>
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-105"
          >
            {isMuted || masterVolume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
