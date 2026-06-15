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
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={`relative ${isWalking ? '' : ''}`}
        style={{
          width: '20px',
          height: '40px',
          transform: 'rotateZ(45deg) rotateX(-60deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute left-1/2 top-0 transform -translate-x-1/2 rounded-full"
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#FFE4C4',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateZ(2px)',
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
            width: '14px',
            height: '16px',
            backgroundColor: colleague.color,
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
            transform: 'translateZ(1px)',
          }}
        />
        
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            bottom: '-6px',
            width: '10px',
            height: '8px',
            backgroundColor: colleague.color,
            filter: 'brightness(0.85)',
            transform: 'translateX(-50%) rotateX(90deg)',
            transformOrigin: 'top center',
          }}
        />
        
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
            isWalking ? 'animate-pulse' : ''
          }`}
          style={{
            width: '10px',
            height: '5px',
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
            className="absolute -right-2 top-4 w-2.5 h-1.5 bg-gray-300 rounded-sm"
            style={{
              animation: 'typing 0.5s infinite alternate',
              transform: 'translateZ(3px)',
            }}
          />
        )}
        
        {isTalking && (
          <div
            className="absolute -top-5 left-1/2 transform -translate-x-1/2"
            style={{ transform: 'translateZ(5px)' }}
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
            className="absolute -top-2 right-0 text-xs"
            style={{ transform: 'translateZ(5px)' }}
          >
            ☕
          </div>
        )}
      </div>
      
      <div
        className="absolute left-1/2 text-xs text-gray-600 whitespace-nowrap font-medium"
        style={{
          bottom: '-18px',
          transform: 'translateX(-50%) rotateZ(45deg) rotateX(-60deg)',
        }}
      >
        {colleague.name}
      </div>
      
      <div
        className="absolute left-1/2 rounded-full bg-black"
        style={{
          bottom: '-2px',
          width: '14px',
          height: '6px',
          transform: 'translateX(-50%) rotateX(90deg)',
          opacity: 0.25,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
