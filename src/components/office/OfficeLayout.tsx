import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';

const floorColors = {
  morning: '#E8E0D0',
  noon: '#F0EADD',
  afternoon: '#E8E0D0',
  evening: '#C9BFAF',
  night: '#3D3D4D',
};

const wallColors = {
  morning: '#F5F1EB',
  noon: '#FAF8F5',
  afternoon: '#F5F1EB',
  evening: '#C9BFAF',
  night: '#2D2D3D',
};

const deskTopColor = '#A0826D';
const deskSideColor = '#7A6352';
const chairColor = '#3D2B1F';
const chairSeatColor = '#5C4033';
const monitorColor = '#2C2C2C';
const monitorScreenColor = '#87CEEB';

interface DeskProps {
  x: number;
  y: number;
  label?: string;
}

function Desk({ x, y, label }: DeskProps) {
  return (
    <div
      className="absolute"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        width: '14%', 
        height: '10%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: deskTopColor,
          transform: 'translateZ(6px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '2px',
        }}
      />
      
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 0,
          height: '6px',
          backgroundColor: deskSideColor,
          transform: 'rotateX(-90deg)',
          transformOrigin: 'top center',
        }}
      />
      
      <div
        className="absolute top-0 bottom-0"
        style={{
          right: 0,
          width: '6px',
          backgroundColor: deskSideColor,
          filter: 'brightness(0.9)',
          transform: 'rotateY(90deg)',
          transformOrigin: 'left center',
        }}
      />
      
      <div
        className="absolute"
        style={{
          left: '10%',
          top: '20%',
          width: '30%',
          height: '50%',
          transform: 'translateZ(10px)',
        }}
      >
        <div
          className="w-full h-full rounded-sm"
          style={{
            backgroundColor: monitorColor,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute top-1 left-1 right-1 bottom-2 rounded-sm opacity-90"
          style={{ backgroundColor: monitorScreenColor }}
        />
        <div
          className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
          style={{
            width: '25%',
            height: '20%',
            backgroundColor: '#444',
          }}
        />
        <div
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 translate-y-full"
          style={{
            width: '50%',
            height: '8%',
            backgroundColor: '#333',
            borderRadius: '1px',
          }}
        />
      </div>
      
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2"
        style={{
          width: '35%',
          height: '100%',
          transform: 'translateX(-50%) translateZ(3px)',
        }}
      >
        <div
          className="w-full h-3/5 rounded-t-full absolute bottom-0"
          style={{
            backgroundColor: chairSeatColor,
          }}
        />
        <div
          className="w-full h-2/5 rounded-t-lg absolute top-0"
          style={{
            backgroundColor: chairColor,
          }}
        />
      </div>
      
      {label && (
        <div
          className="absolute left-1/2 text-xs text-gray-500 whitespace-nowrap font-medium"
          style={{
            top: '-20px',
            transform: 'translateX(-50%)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

interface MeetingRoomProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

function MeetingRoom({ x, y, width, height }: MeetingRoomProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: 'rgba(180, 180, 180, 0.4)',
          border: '3px solid rgba(150, 150, 150, 0.6)',
          transform: 'translateZ(2px)',
        }}
      />
      
      <div
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: '55%',
          height: '45%',
          backgroundColor: '#8B7355',
          transform: 'translate(-50%, -50%) translateZ(3px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
      
      <div
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: '55%',
          height: '45%',
          backgroundColor: '#6B5344',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(2px)',
          opacity: 0.5,
        }}
      />
      
      {[0, 1, 2, 3].map((i) => {
        const positions = [
          { left: '15%', top: '25%' },
          { left: '70%', top: '25%' },
          { left: '25%', top: '60%' },
          { left: '60%', top: '60%' },
        ];
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '12%',
              height: '18%',
              backgroundColor: chairColor,
              ...positions[i],
              transform: 'translateZ(2px)',
            }}
          />
        );
      })}
      
      <div
        className="absolute left-1/2 text-xs text-gray-500 font-medium whitespace-nowrap"
        style={{
          top: '-18px',
          transform: 'translateX(-50%)',
        }}
      >
        会议室
      </div>
    </div>
  );
}

interface KitchenAreaProps {
  x: number;
  y: number;
}

function KitchenArea({ x, y }: KitchenAreaProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '22%',
        height: '16%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 rounded"
        style={{
          height: '65%',
          backgroundColor: '#C4A77D',
          transform: 'translateZ(5px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
      
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '65%',
          backgroundColor: '#A08060',
        }}
      />
      
      <div
        className="absolute rounded-sm"
        style={{
          left: '10%',
          bottom: '50%',
          width: '15%',
          height: '35%',
          backgroundColor: '#8B4513',
          transform: 'translateZ(7px)',
        }}
      >
        <div
          className="absolute top-0 left-1/2 w-2 h-2 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      
      <div
        className="absolute rounded-sm"
        style={{
          right: '15%',
          bottom: '55%',
          width: '20%',
          height: '30%',
          backgroundColor: '#D0D0D0',
          transform: 'translateZ(6px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
      
      <div
        className="absolute left-1/2 text-xs text-gray-500 font-medium whitespace-nowrap"
        style={{
          top: '-18px',
          transform: 'translateX(-50%)',
        }}
      >
        茶水间 ☕
      </div>
      
      <div
        className="absolute rounded-full animate-pulse-soft"
        style={{
          top: '5%',
          right: '20%',
          width: '12px',
          height: '12px',
          backgroundColor: 'rgba(255, 200, 100, 0.4)',
          boxShadow: '0 0 15px rgba(255, 200, 100, 0.6)',
          transform: 'translateZ(15px)',
        }}
      />
    </div>
  );
}

interface PrinterProps {
  x: number;
  y: number;
}

function Printer({ x, y }: PrinterProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '7%',
        height: '5.5%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 rounded"
        style={{
          backgroundColor: '#E8E8E8',
          transform: 'translateZ(5px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      />
      <div
        className="absolute top-1 left-1 right-1 h-0.5 bg-gray-400 rounded-sm"
        style={{ transform: 'translateZ(6px)' }}
      />
      <div
        className="absolute left-1/2 text-xs text-gray-400 whitespace-nowrap"
        style={{
          bottom: '-14px',
          transform: 'translateX(-50%)',
        }}
      >
        打印机
      </div>
    </div>
  );
}

interface ACUnitProps {
  x: number;
  y: number;
}

function ACUnit({ x, y }: ACUnitProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '12%',
        height: '4.5%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor: '#F5F5F5',
          transform: 'translateZ(4px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
      <div
        className="absolute top-1/2 left-3 right-3 h-0.5 bg-gray-300 transform -translate-y-1/2"
        style={{ transform: 'translateZ(5px) translateY(-50%)' }}
      />
    </div>
  );
}

interface DoorProps {
  x: number;
  y: number;
}

function Door({ x, y }: DoorProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '6%',
        height: '12%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full rounded-t-lg"
        style={{
          backgroundColor: '#A0522D',
          transform: 'translateZ(3px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      />
      <div
        className="absolute top-1/2 right-1 w-1 h-1 bg-yellow-400 rounded-full"
        style={{ transform: 'translateZ(4px)' }}
      />
    </div>
  );
}

interface PlantProps {
  x: number;
  y: number;
}

function Plant({ x, y }: PlantProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '5%',
        height: '7%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 rounded-b-sm"
        style={{
          width: '55%',
          height: '35%',
          backgroundColor: '#8B4513',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/2 rounded-full"
        style={{
          width: '100%',
          height: '65%',
          backgroundColor: '#7BA05B',
          transform: 'translateX(-50%) translateZ(2px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

export function OfficeLayout() {
  const { time } = useOfficeStore();
  const timeOfDay = getTimeOfDay(time.hour);
  const floorColor = floorColors[timeOfDay];
  const wallColor = wallColors[timeOfDay];

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      <div
        className="absolute inset-0"
        style={{ 
          backgroundColor: floorColor,
          transform: 'translateZ(0px)',
        }}
      />
      
      <div
        className="absolute top-0 left-0 right-0"
        style={{ 
          height: '50px',
          backgroundColor: wallColor,
          transform: 'rotateX(-90deg)',
          transformOrigin: 'top center',
        }}
      />
      
      <div
        className="absolute top-0 left-0 bottom-0"
        style={{ 
          width: '50px',
          backgroundColor: wallColor,
          filter: 'brightness(0.95)',
          transform: 'rotateY(90deg)',
          transformOrigin: 'left center',
        }}
      />
      
      <div
        className="absolute top-0 left-1/4"
        style={{
          width: '60px',
          height: '50px',
          background: 'linear-gradient(180deg, rgba(135, 206, 235, 0.7) 0%, rgba(135, 206, 235, 0.4) 100%)',
          transform: 'rotateX(-90deg) translateZ(1px)',
          transformOrigin: 'top center',
          boxShadow: '0 10px 30px rgba(135, 206, 235, 0.3)',
        }}
      />
      <div
        className="absolute top-0 right-1/4"
        style={{
          width: '60px',
          height: '50px',
          background: 'linear-gradient(180deg, rgba(135, 206, 235, 0.7) 0%, rgba(135, 206, 235, 0.4) 100%)',
          transform: 'rotateX(-90deg) translateZ(1px)',
          transformOrigin: 'top center',
          boxShadow: '0 10px 30px rgba(135, 206, 235, 0.3)',
        }}
      />
      
      <Desk x={25} y={35} label="小明" />
      <Desk x={45} y={35} label="小红" />
      <Desk x={65} y={35} label="小刚" />
      <Desk x={35} y={55} label="小丽" />
      <Desk x={55} y={55} label="小华" />
      <Desk x={75} y={55} label="阿强" />
      
      <MeetingRoom x={20} y={78} width={28} height={20} />
      
      <KitchenArea x={85} y={20} />
      
      <Printer x={12} y={70} />
      
      <ACUnit x={50} y={6} />
      
      <Door x={3} y={42} />
      
      <Plant x={8} y={25} />
      <Plant x={92} y={45} />
      <Plant x={40} y={88} />
    </div>
  );
}
