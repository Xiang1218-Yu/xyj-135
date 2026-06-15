import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';

const floorColors = {
  morning: '#EDE5D8',
  noon: '#F5F1EB',
  afternoon: '#EDE5D8',
  evening: '#D4C9B8',
  night: '#3D3D4D',
};

const wallColors = {
  morning: '#F5F1EB',
  noon: '#FAF8F5',
  afternoon: '#F5F1EB',
  evening: '#C9BFAF',
  night: '#2D2D3D',
};

const deskColor = '#8B7355';
const deskTopColor = '#A0826D';
const chairColor = '#3D2B1F';
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
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, width: '12%', height: '8%' }}
    >
      <div
        className="absolute bottom-0 left-1 right-1 h-3/4 rounded-sm"
        style={{
          backgroundColor: deskColor,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-1/4 rounded-sm"
        style={{
          backgroundColor: deskTopColor,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
      
      <div
        className="absolute top-1 left-1/2 transform -translate-x-1/2"
        style={{ width: '60%', height: '50%' }}
      >
        <div
          className="w-full h-full rounded-sm"
          style={{
            backgroundColor: monitorColor,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute top-1 left-1 right-1 bottom-2 rounded-sm opacity-80"
          style={{ backgroundColor: monitorScreenColor }}
        />
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
          style={{
            width: '20%',
            height: '15%',
            backgroundColor: '#444',
          }}
        />
      </div>
      
      <div
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
        style={{
          width: '40%',
          height: '30%',
          backgroundColor: chairColor,
          borderRadius: '50% 50% 10% 10%',
        }}
      />
      
      {label && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
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
      }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          border: '2px solid rgba(150, 150, 150, 0.5)',
        }}
      />
      
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60%',
          height: '40%',
          backgroundColor: '#8B7355',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      />
      
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '12%',
            height: '15%',
            backgroundColor: chairColor,
            left: i < 2 ? (i === 0 ? '10%' : '78%') : (i === 2 ? '25%' : '63%'),
            top: i < 2 ? '20%' : '65%',
          }}
        />
      ))}
      
      <div
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium"
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
        width: '20%',
        height: '15%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-3/5 rounded"
        style={{
          backgroundColor: '#C4A77D',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
      
      <div
        className="absolute bottom-3/5 left-2 w-6 h-4 rounded-sm"
        style={{
          backgroundColor: '#8B4513',
        }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div
        className="absolute bottom-3/5 right-4 w-8 h-5 rounded-sm"
        style={{
          backgroundColor: '#C0C0C0',
        }}
      />
      
      <div
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium whitespace-nowrap"
      >
        茶水间 ☕
      </div>
      
      <div
        className="absolute top-1/4 right-2 w-6 h-6 rounded-full animate-pulse"
        style={{
          backgroundColor: 'rgba(255, 200, 100, 0.3)',
          boxShadow: '0 0 10px rgba(255, 200, 100, 0.5)',
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
        width: '6%',
        height: '5%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-full h-full rounded"
        style={{
          backgroundColor: '#E0E0E0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <div
        className="absolute top-1 left-1 right-1 h-1 bg-gray-400 rounded-sm"
      />
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
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
        width: '10%',
        height: '4%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor: '#F0F0F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
      <div
        className="absolute top-1/2 left-2 right-2 h-0.5 bg-gray-300 transform -translate-y-1/2"
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
        height: '10%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-full h-full rounded-t-lg"
        style={{
          backgroundColor: '#A0522D',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <div
        className="absolute top-1/2 right-1 w-1 h-1 bg-yellow-400 rounded-full"
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
        width: '4%',
        height: '6%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-b-sm"
        style={{
          width: '60%',
          height: '40%',
          backgroundColor: '#8B4513',
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 rounded-full"
        style={{
          width: '100%',
          height: '70%',
          backgroundColor: '#7BA05B',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: floorColor }}
      />
      
      <div
        className="absolute top-0 left-0 right-0 h-12"
        style={{ backgroundColor: wallColor }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-4"
        style={{ backgroundColor: wallColor, opacity: 0.7 }}
      />
      <div
        className="absolute top-0 bottom-0 left-0 w-4"
        style={{ backgroundColor: wallColor, opacity: 0.7 }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-4"
        style={{ backgroundColor: wallColor, opacity: 0.7 }}
      />
      
      <div
        className="absolute top-0 left-1/4 w-12 h-12"
        style={{
          background: 'linear-gradient(180deg, rgba(135, 206, 235, 0.6) 0%, rgba(135, 206, 235, 0.3) 100%)',
          boxShadow: '0 4px 20px rgba(135, 206, 235, 0.3)',
        }}
      />
      <div
        className="absolute top-0 right-1/4 w-12 h-12"
        style={{
          background: 'linear-gradient(180deg, rgba(135, 206, 235, 0.6) 0%, rgba(135, 206, 235, 0.3) 100%)',
          boxShadow: '0 4px 20px rgba(135, 206, 235, 0.3)',
        }}
      />
      
      <Desk x={25} y={35} label="小明" />
      <Desk x={45} y={35} label="小红" />
      <Desk x={65} y={35} label="小刚" />
      <Desk x={35} y={55} label="小丽" />
      <Desk x={55} y={55} label="小华" />
      <Desk x={75} y={55} label="阿强" />
      
      <MeetingRoom x={20} y={78} width={25} height={18} />
      
      <KitchenArea x={85} y={20} />
      
      <Printer x={12} y={70} />
      
      <ACUnit x={50} y={8} />
      
      <Door x={5} y={40} />
      
      <Plant x={10} y={25} />
      <Plant x={90} y={45} />
      <Plant x={40} y={85} />
    </div>
  );
}
