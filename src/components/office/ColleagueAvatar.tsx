import { useState, useEffect } from 'react';
import type { Colleague } from '@/types/office';
import { useOfficeStore } from '@/store/useOfficeStore';

interface ColleagueAvatarProps {
  colleague: Colleague;
}

export function ColleagueAvatar({ colleague }: ColleagueAvatarProps) {
  const { time } = useOfficeStore();
  const [animOffset, setAnimOffset] = useState(0);
  const [actionAnimOffset, setActionAnimOffset] = useState(0);

  useEffect(() => {
    const needsAnim = colleague.state === 'walking' || 
                     colleague.state === 'drinking-coffee' || 
                     colleague.state === 'printing' || 
                     colleague.state === 'greeting' ||
                     colleague.state === 'in-meeting' ||
                     colleague.state === 'talking';
    if (needsAnim && !time.isPaused) {
      const interval = setInterval(() => {
        setAnimOffset((prev) => prev + 0.3);
        setActionAnimOffset((prev) => prev + 0.15);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [colleague.state, time.isPaused]);

  if (colleague.state === 'away') {
    return null;
  }

  const isWalking = colleague.state === 'walking';
  const isWorking = colleague.state === 'working';
  const isTalking = colleague.state === 'talking';
  const isResting = colleague.state === 'resting';
  const isDrinkingCoffee = colleague.state === 'drinking-coffee';
  const isPrinting = colleague.state === 'printing';
  const isInMeeting = colleague.state === 'in-meeting';
  const isGreeting = colleague.state === 'greeting';

  const bounceOffset = isWalking ? Math.sin(animOffset) * 2 : 0;
  const legPhase = Math.sin(animOffset * 2);
  const bodyTilt = isWalking ? Math.sin(animOffset * 1.5) * 3 : 0;
  const armSwing = isWalking ? Math.sin(animOffset * 2) * 15 : 0;

  const drinkSipPhase = Math.sin(actionAnimOffset * 3);
  const printHeadPhase = Math.sin(actionAnimOffset * 5);
  const greetWavePhase = Math.sin(actionAnimOffset * 6);
  const meetingNodPhase = Math.sin(actionAnimOffset * 2);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${colleague.position.x}%`,
        top: `${colleague.position.y}%`,
        zIndex: Math.floor(colleague.position.y * 10) + 10000,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative"
        style={{
          width: '20px',
          height: '40px',
          transform: `translateY(${bounceOffset}px) rotateZ(45deg) rotateX(-60deg) translateZ(50px)`,
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
            transform: `translateZ(52px) rotate(${bodyTilt}deg) translateY(${isInMeeting ? meetingNodPhase * 1.5 : 0}px)`,
          }}
        >
          <div
            className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-gray-700 rounded-full"
            style={{ transform: isGreeting ? 'scaleX(1.5)' : 'none' }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-gray-700 rounded-full"
            style={{ transform: isGreeting ? 'scaleX(1.5)' : 'none' }}
          />
          <div
            className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 ${
              isTalking || isGreeting || isInMeeting ? 'w-1.5 h-1' : 'w-1 h-0.5'
            } bg-gray-600 rounded-full`}
            style={{
              height: isDrinkingCoffee ? '0px' : (isTalking || isGreeting ? `${1 + Math.abs(greetWavePhase) * 1.5}px` : undefined),
            }}
          />
        </div>

        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '4px',
            height: '10px',
            transform: `translateZ(55px) translateX(6px) rotateX(-20deg) rotateY(-30deg) rotate(${
              isDrinkingCoffee ? -30 - drinkSipPhase * 25 : isGreeting ? -15 + greetWavePhase * 35 : isPrinting ? 10 + printHeadPhase * 8 : armSwing
            }deg)`,
            transformOrigin: 'top center',
            transition: isWalking || isDrinkingCoffee || isGreeting || isPrinting ? 'none' : 'transform 0.2s',
          }}
        >
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: '#FFE4C4', border: '1px solid rgba(0,0,0,0.08)' }}
          />
          {isDrinkingCoffee && (
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              style={{
                width: '5px',
                height: '6px',
                backgroundColor: '#8B4513',
                borderRadius: '0 0 2px 2px',
                border: '1px solid rgba(0,0,0,0.1)',
                transform: 'rotate(180deg)',
              }}
            >
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  height: '2px',
                  backgroundColor: '#6F4E37',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        </div>

        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '4px',
            height: '10px',
            transform: `translateZ(55px) translateX(-6px) rotateX(-20deg) rotateY(30deg) rotate(${
              isPrinting ? -10 - printHeadPhase * 8 : -armSwing
            }deg)`,
            transformOrigin: 'top center',
            transition: isWalking || isPrinting ? 'none' : 'transform 0.2s',
          }}
        >
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: '#FFE4C4', border: '1px solid rgba(0,0,0,0.08)' }}
          />
          {isPrinting && (
            <div
              className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2"
              style={{
                width: '6px',
                height: `${4 + Math.abs(printHeadPhase) * 3}px`,
                backgroundColor: '#F5F5DC',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            />
          )}
        </div>
        
        <div
          className="absolute top-3 left-1/2 transform -translate-x-1/2 rounded-t-sm"
          style={{
            width: '14px',
            height: '16px',
            backgroundColor: colleague.color,
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
            transform: `translateZ(51px) rotate(${bodyTilt}deg)`,
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
            transform: `translateX(-50%) rotateX(90deg) translateZ(50px)`,
            transformOrigin: 'top center',
          }}
        />
        
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '10px',
            height: '5px',
          }}
        >
          <div
            className="absolute left-0 w-1.5 h-full bg-gray-700 rounded-b"
            style={{
              transform: `translateZ(50px) rotate(${isWalking ? legPhase * 25 : 0}deg)`,
              transformOrigin: 'top',
              transition: isWalking ? 'none' : 'transform 0.2s',
            }}
          />
          <div
            className="absolute right-0 w-1.5 h-full bg-gray-700 rounded-b"
            style={{
              transform: `translateZ(50px) rotate(${isWalking ? -legPhase * 25 : 0}deg)`,
              transformOrigin: 'top',
              transition: isWalking ? 'none' : 'transform 0.2s',
            }}
          />
        </div>
        
        {isWorking && (
          <div
            className="absolute -right-2 top-4 w-2.5 h-1.5 bg-gray-300 rounded-sm"
            style={{
              animation: time.isPaused ? 'none' : 'typing 0.5s infinite alternate',
              transform: 'translateZ(53px)',
            }}
          />
        )}
        
        {(isTalking || isInMeeting) && (
          <div
            className="absolute -top-5 left-1/2 transform -translate-x-1/2"
            style={{ transform: 'translateZ(55px)' }}
          >
            <div className="flex gap-0.5">
              <div
                className="w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  animation: time.isPaused ? 'none' : 'bounce 0.6s infinite',
                  animationDelay: '0s',
                }}
              />
              <div
                className="w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  animation: time.isPaused ? 'none' : 'bounce 0.6s infinite',
                  animationDelay: '0.1s',
                }}
              />
              <div
                className="w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  animation: time.isPaused ? 'none' : 'bounce 0.6s infinite',
                  animationDelay: '0.2s',
                }}
              />
            </div>
          </div>
        )}

        {isGreeting && (
          <div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600"
            style={{ 
              transform: `translateZ(60px) translateY(${Math.abs(greetWavePhase) * -2}px)`,
              opacity: 0.8 + Math.abs(greetWavePhase) * 0.2,
            }}
          >
            👋
          </div>
        )}
        
        {(isResting || isDrinkingCoffee) && (
          <div
            className="absolute -top-2 right-0 text-xs"
            style={{ 
              transform: `translateZ(55px) rotate(${isDrinkingCoffee ? drinkSipPhase * 10 : 0}deg)`,
            }}
          >
            ☕
          </div>
        )}

        {isPrinting && (
          <div
            className="absolute -top-2 right-0 text-xs"
            style={{ transform: 'translateZ(55px)' }}
          >
            📄
          </div>
        )}

        {isInMeeting && (
          <div
            className="absolute -top-2 right-0 text-xs"
            style={{ transform: 'translateZ(55px)' }}
          >
            💼
          </div>
        )}
      </div>
      
      <div
        className="absolute left-1/2 text-xs text-gray-600 whitespace-nowrap font-medium"
        style={{
          bottom: '-18px',
          transform: 'translateX(-50%) rotateZ(45deg) rotateX(-60deg) translateZ(50px)',
        }}
      >
        {colleague.name}
      </div>
      
      <div
        className="absolute left-1/2 rounded-full bg-black"
        style={{
          bottom: '-2px',
          width: isWalking ? `${12 + Math.sin(animOffset) * 2}px` : '14px',
          height: isWalking ? `${5 + Math.sin(animOffset * 2) * 1}px` : '6px',
          transform: 'translateX(-50%) rotateX(90deg) translateZ(10px)',
          opacity: isWalking ? 0.15 + Math.abs(Math.sin(animOffset)) * 0.1 : 0.25,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
