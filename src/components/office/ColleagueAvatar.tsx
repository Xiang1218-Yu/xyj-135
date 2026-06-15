import type { Colleague } from '@/types/office';

interface ColleagueAvatarProps {
  colleague: Colleague;
}

export function ColleagueAvatar({ colleague }: ColleagueAvatarProps) {
  if (colleague.state === 'away') {
    return null;
  }

  const isWalking = colleague.state === 'walking';
  const isWorking = colleague.state === 'working';
  const isTalking = colleague.state === 'talking';
  const isResting = colleague.state === 'resting';

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
      style={{
        left: `${colleague.position.x}%`,
        top: `${colleague.position.y}%`,
        zIndex: Math.floor(colleague.position.y * 10),
      }}
    >
      <div
        className={`relative ${isWalking ? 'animate-bounce' : ''}`}
        style={{ width: '24px', height: '36px' }}
      >
        <div
          className="absolute left-1/2 top-0 transform -translate-x-1/2 rounded-full"
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#FFE4C4',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-gray-700 rounded-full"
          />
          <div
            className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-gray-700 rounded-full"
          />
          <div
            className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 ${
              isTalking ? 'w-1.5 h-1' : 'w-1 h-0.5'
            } bg-gray-600 rounded-full`}
          />
        </div>
        
        <div
          className="absolute top-3 left-1/2 transform -translate-x-1/2 rounded-t-sm"
          style={{
            width: '16px',
            height: '18px',
            backgroundColor: colleague.color,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
        
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
            isWalking ? 'animate-pulse' : ''
          }`}
          style={{
            width: '12px',
            height: '6px',
          }}
        >
          <div
            className="absolute left-0 w-1.5 h-full bg-gray-700 rounded-b"
            style={{
              transform: isWalking ? 'rotate(-10deg)' : 'rotate(0)',
              transformOrigin: 'top',
            }}
          />
          <div
            className="absolute right-0 w-1.5 h-full bg-gray-700 rounded-b"
            style={{
              transform: isWalking ? 'rotate(10deg)' : 'rotate(0)',
              transformOrigin: 'top',
            }}
          />
        </div>
        
        {isWorking && (
          <div
            className="absolute -right-1 top-4 w-3 h-2 bg-gray-300 rounded-sm"
            style={{
              animation: 'typing 0.5s infinite alternate',
            }}
          />
        )}
        
        {isTalking && (
          <div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-0.5">
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              />
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}
        
        {isResting && (
          <div
            className="absolute -top-3 right-0 text-xs"
          >
            ☕
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap font-medium">
        {colleague.name}
      </div>
      
      <div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full bg-black opacity-20 blur-sm"
        style={{
          width: '16px',
          height: '4px',
        }}
      />
    </div>
  );
}
