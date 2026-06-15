import { useOfficeStore } from '@/store/useOfficeStore';
import { getTimeOfDay } from '@/utils/timeUtils';
import type { OfficeTheme, FurnitureColors, DeskLayout, PlantLayout, OfficeObject, MeetingRoomLayout, KitchenLayout } from '@/types/office';

interface DeskProps extends DeskLayout {
  furniture: FurnitureColors;
}

function Desk({ x, y, label, rotation, furniture }: DeskProps) {
  const transform = rotation 
    ? `translate(-50%, -50%) rotateZ(${rotation}deg)` 
    : 'translate(-50%, -50%)';

  return (
    <div
      className="absolute"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        width: '14%', 
        height: '10%',
        transform,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: furniture.deskTop,
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
          backgroundColor: furniture.deskSide,
          transform: 'rotateX(-90deg)',
          transformOrigin: 'top center',
        }}
      />
      
      <div
        className="absolute top-0 bottom-0"
        style={{
          right: 0,
          width: '6px',
          backgroundColor: furniture.deskSide,
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
            backgroundColor: furniture.monitor,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute top-1 left-1 right-1 bottom-2 rounded-sm opacity-90"
          style={{ backgroundColor: furniture.monitorScreen }}
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
            backgroundColor: furniture.chairSeat,
          }}
        />
        <div
          className="w-full h-2/5 rounded-t-lg absolute top-0"
          style={{
            backgroundColor: furniture.chair,
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

interface MeetingRoomProps extends MeetingRoomLayout {
  furniture: FurnitureColors;
}

function MeetingRoom({ x, y, width, height, style, furniture }: MeetingRoomProps) {
  const tableShape = style === 'round' ? 'rounded-full' : style === 'casual' ? 'rounded-xl' : 'rounded-lg';
  const tableWidth = style === 'round' ? '45%' : '65%';
  const tableHeight = style === 'round' ? '55%' : '45%';

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
        className={`absolute inset-0 ${style === 'casual' ? 'rounded-2xl' : 'rounded-lg'}`}
        style={{
          backgroundColor: 'rgba(180, 180, 180, 0.4)',
          border: '3px solid rgba(150, 150, 150, 0.6)',
          transform: 'translateZ(2px)',
        }}
      />
      
      <div
        className={`absolute top-1/2 left-1/2 ${tableShape}`}
        style={{
          width: tableWidth,
          height: tableHeight,
          backgroundColor: furniture.table,
          transform: 'translate(-50%, -50%) translateZ(3px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
      
      <div
        className={`absolute top-1/2 left-1/2 ${tableShape}`}
        style={{
          width: tableWidth,
          height: tableHeight,
          backgroundColor: furniture.deskSide,
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
              backgroundColor: furniture.chair,
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

interface KitchenAreaProps extends KitchenLayout {
  furniture: FurnitureColors;
}

function KitchenArea({ x, y, style, furniture }: KitchenAreaProps) {
  const cabinetColor = style === 'industrial' ? '#4A4A4A' : style === 'cozy' ? '#D4A574' : furniture.cabinet;
  const counterColor = style === 'industrial' ? '#6B6B6B' : style === 'cozy' ? '#E8C4A0' : furniture.deskTop;

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
          backgroundColor: counterColor,
          transform: 'translateZ(5px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
      
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '65%',
          backgroundColor: cabinetColor,
        }}
      />
      
      <div
        className="absolute rounded-sm"
        style={{
          left: '10%',
          bottom: '50%',
          width: '15%',
          height: '35%',
          backgroundColor: style === 'industrial' ? '#2A2A2A' : '#8B4513',
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
  theme: OfficeTheme;
}

function ACUnit({ x, y, theme }: ACUnitProps) {
  const lightStyle = theme.ceilingLightStyle;
  
  return (
    <>
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
      
      {lightStyle === 'recessed' && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              left: '25%',
              top: `${y + 2}%`,
              width: '3%',
              height: '3%',
              backgroundColor: 'rgba(255, 255, 200, 0.6)',
              boxShadow: '0 0 20px rgba(255, 255, 200, 0.8)',
              transform: 'translate(-50%, -50%) translateZ(2px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: '75%',
              top: `${y + 2}%`,
              width: '3%',
              height: '3%',
              backgroundColor: 'rgba(255, 255, 200, 0.6)',
              boxShadow: '0 0 20px rgba(255, 255, 200, 0.8)',
              transform: 'translate(-50%, -50%) translateZ(2px)',
            }}
          />
        </>
      )}
      
      {lightStyle === 'pendant' && (
        <>
          <div
            className="absolute"
            style={{
              left: '30%',
              top: `${y + 5}%`,
              width: '4%',
              height: '6%',
              transform: 'translate(-50%, -50%)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-0.5 h-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2" />
            <div
              className="absolute bottom-0 left-1/2 w-full h-1/2 rounded-b-full bg-gray-200"
              style={{
                transform: 'translateX(-50%) translateZ(3px)',
                boxShadow: '0 4px 15px rgba(255, 255, 200, 0.5)',
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 w-3/4 h-1/3 rounded-b-full bg-yellow-100 opacity-60"
              style={{ transform: 'translateX(-50%) translateY(2px)' }}
            />
          </div>
          <div
            className="absolute"
            style={{
              left: '70%',
              top: `${y + 5}%`,
              width: '4%',
              height: '6%',
              transform: 'translate(-50%, -50%)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-0.5 h-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2" />
            <div
              className="absolute bottom-0 left-1/2 w-full h-1/2 rounded-b-full bg-gray-200"
              style={{
                transform: 'translateX(-50%) translateZ(3px)',
                boxShadow: '0 4px 15px rgba(255, 255, 200, 0.5)',
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 w-3/4 h-1/3 rounded-b-full bg-yellow-100 opacity-60"
              style={{ transform: 'translateX(-50%) translateY(2px)' }}
            />
          </div>
        </>
      )}
      
      {lightStyle === 'track' && (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: `${y + 3}%`,
            width: '60%',
            height: '1.5%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-full h-full bg-gray-700 rounded-full" style={{ transform: 'translateZ(2px)' }} />
          {[20, 50, 80].map((pos, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${pos}%`,
                top: '50%',
                width: '8%',
                height: '200%',
                backgroundColor: 'rgba(255, 255, 200, 0.7)',
                boxShadow: '0 0 15px rgba(255, 255, 200, 0.9)',
                transform: 'translate(-50%, -50%) translateZ(3px)',
              }}
            />
          ))}
        </div>
      )}
      
      {lightStyle === 'chandelier' && (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: `${y + 8}%`,
            width: '8%',
            height: '10%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-0.5 h-1/3 bg-amber-700 absolute left-1/2 transform -translate-x-1/2" />
          <div
            className="absolute top-1/3 left-1/2 w-full h-2/3"
            style={{
              transform: 'translateX(-50%)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 rounded-full bg-amber-100"
              style={{
                transform: 'translateZ(3px)',
                boxShadow: '0 4px 20px rgba(255, 200, 100, 0.6)',
              }}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-amber-300"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 30}%`,
                  boxShadow: '0 0 10px rgba(255, 200, 100, 0.8)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

interface DoorProps {
  x: number;
  y: number;
  theme: OfficeTheme;
}

function Door({ x, y, theme }: DoorProps) {
  const doorColor = theme.id === 'industrial' ? '#2A2A2A' 
    : theme.id === 'japanese' ? '#C4A87C' 
    : theme.id === 'scandinavian' ? '#E8E0D0'
    : '#A0522D';

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
          backgroundColor: doorColor,
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

interface PlantProps extends PlantLayout {
  theme: OfficeTheme;
}

function Plant({ x, y, type, theme }: PlantProps) {
  const sizeScale = type === 'large' ? 1.8 : type === 'medium' ? 1.2 : 0.8;
  const width = `${5 * sizeScale}%`;
  const height = `${7 * sizeScale}%`;
  const plantColor = theme.id === 'japanese' ? '#6B8E23' 
    : theme.id === 'scandinavian' ? '#8FBC8F' 
    : '#7BA05B';

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width,
        height,
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 rounded-b-sm"
        style={{
          width: '55%',
          height: '35%',
          backgroundColor: theme.id === 'industrial' ? '#4A4A4A' : '#8B4513',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/2 rounded-full"
        style={{
          width: '100%',
          height: '65%',
          backgroundColor: plantColor,
          transform: 'translateX(-50%) translateZ(2px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

interface ExtraObjectProps {
  obj: OfficeObject;
  theme: OfficeTheme;
}

function ExtraObject({ obj, theme }: ExtraObjectProps) {
  const { type, x, y, style } = obj;

  if (type === 'bookshelf') {
    const shelfColor = style === 'classic' ? '#5C4033' 
      : style === 'modern' ? '#4A4A4A' 
      : theme.furniture.cabinet;
    
    return (
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '8%',
          height: '12%',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 rounded"
          style={{
            backgroundColor: shelfColor,
            transform: 'translateZ(4px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-1 right-1 h-0.5 bg-gray-600"
            style={{ 
              top: `${25 + i * 25}%`,
              transform: 'translateZ(5px)',
            }}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`book-${i}`}
            className="absolute w-1.5 h-4 rounded-sm"
            style={{
              left: `${15 + i * 18}%`,
              top: '8%',
              backgroundColor: ['#8B0000', '#006400', '#00008B', '#8B8B00', '#4B0082'][i],
              transform: 'translateZ(6px)',
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'painting') {
    const frameColor = style === 'classic' ? '#8B4513' 
      : style === 'japanese' ? '#4A3728'
      : '#2C2C2C';
    const artColors: Record<string, string[]> = {
      abstract: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77'],
      colorful: ['#FF6B9D', '#9B59B6', '#3498DB', '#2ECC71', '#F39C12'],
      graffiti: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502'],
      japanese: ['#C41E3A', '#FFFFFF', '#1A1A1A'],
      classic: ['#8B4513', '#DAA520', '#2F4F4F'],
    };
    const colors = artColors[style || 'abstract'] || artColors.abstract;
    
    return (
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '10%',
          height: '7%',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 rounded"
          style={{
            backgroundColor: frameColor,
            padding: '4px',
            transform: 'translateZ(2px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="w-full h-full rounded-sm overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.join(', ')})`,
            }}
          />
        </div>
      </div>
    );
  }

  if (type === 'rug') {
    const rugColors: Record<string, string> = {
      industrial: 'repeating-linear-gradient(45deg, #4A4A4A, #4A4A4A 10px, #5A5A5A 10px, #5A5A5A 20px)',
      scandinavian: 'repeating-linear-gradient(90deg, #E8E0D0, #E8E0D0 15px, #D4C9B8 15px, #D4C9B8 30px)',
      colorful: 'conic-gradient(#FF6B6B, #FFD93D, #6BCB77, #4ECDC4, #FF6B6B)',
    };
    const background = rugColors[style || 'scandinavian'] || rugColors.scandinavian;
    
    return (
      <div
        className="absolute rounded-lg"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '25%',
          height: '18%',
          transform: 'translate(-50%, -50%)',
          background,
          opacity: 0.8,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
        }}
      />
    );
  }

  if (type === 'lamp') {
    if (style === 'pendant') {
      return (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '5%',
            height: '8%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-0.5 h-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2" />
          <div
            className="absolute bottom-0 left-1/2 w-full h-1/2 rounded-b-full bg-gray-200"
            style={{
              transform: 'translateX(-50%) translateZ(3px)',
              boxShadow: '0 4px 20px rgba(255, 255, 200, 0.6)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-3/4 h-1/3 rounded-b-full bg-yellow-100 opacity-70"
            style={{ transform: 'translateX(-50%) translateY(3px)' }}
          />
        </div>
      );
    }
    
    if (style === 'chandelier') {
      return (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '6%',
            height: '8%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-0.5 h-1/3 bg-amber-700 absolute left-1/2 transform -translate-x-1/2" />
          <div
            className="absolute top-1/3 left-1/2 w-full h-2/3"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div
              className="absolute inset-0 rounded-full bg-amber-100"
              style={{
                transform: 'translateZ(3px)',
                boxShadow: '0 4px 20px rgba(255, 200, 100, 0.6)',
              }}
            />
          </div>
        </div>
      );
    }
  }

  if (type === 'decoration') {
    if (style === 'exposed-pipe') {
      return (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '30%',
            height: '2%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full bg-gray-600 rounded-full" 
               style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
          <div 
            className="absolute w-3 h-3 bg-gray-500 rounded-full"
            style={{ left: '20%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <div 
            className="absolute w-3 h-3 bg-gray-500 rounded-full"
            style={{ left: '80%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
      );
    }
    
    if (style === 'bamboo') {
      return (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '4%',
            height: '15%',
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${i * 30}%`,
                bottom: 0,
                width: '25%',
                height: `${70 + i * 15}%`,
                backgroundColor: '#90EE90',
                transform: 'translateZ(2px)',
              }}
            >
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="absolute left-0 right-0 h-0.5 bg-green-700"
                  style={{ top: `${25 + j * 25}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    if (style === 'neon') {
      return (
        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '8%',
            height: '5%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center text-2xl font-bold"
            style={{
              color: '#FF00FF',
              textShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
              animation: 'pulse 2s infinite',
            }}
          >
            ✨
          </div>
        </div>
      );
    }
  }

  return null;
}

function FloorPattern({ theme, timeOfDay }: { theme: OfficeTheme; timeOfDay: string }) {
  const { floor } = theme;
  const baseColor = floor.colors[timeOfDay as keyof typeof floor.colors];
  const secondaryColor = floor.secondaryColor;
  const lineColor = floor.lineColor;

  if (floor.pattern === 'wood-plank') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${baseColor} 0px,
            ${baseColor} 60px,
            ${lineColor} 60px,
            ${lineColor} 62px
          ), repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 120px,
            ${lineColor} 120px,
            ${lineColor} 122px
          )`,
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  if (floor.pattern === 'concrete') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${secondaryColor || '#6B6662'}40 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, ${secondaryColor || '#6B6662'}30 0%, transparent 40%),
            radial-gradient(ellipse at 40% 80%, ${secondaryColor || '#6B6662'}25 0%, transparent 35%),
            ${baseColor}
          `,
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  if (floor.pattern === 'tile') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(${baseColor}, ${baseColor}),
            linear-gradient(${lineColor || '#B0A090'}, ${lineColor || '#B0A090'})
          `,
          backgroundSize: '80px 80px, 80px 80px',
          backgroundPosition: '-1px -1px, -1px -1px',
          backgroundRepeat: 'repeat, repeat',
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  if (floor.pattern === 'tatami') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              ${baseColor} 0px,
              ${baseColor} 80px,
              ${lineColor || '#8B7355'} 80px,
              ${lineColor || '#8B7355'} 84px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent 0px,
              transparent 80px,
              ${lineColor || '#8B7355'} 80px,
              ${lineColor || '#8B7355'} 84px
            ),
            ${baseColor}
          `,
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  if (floor.pattern === 'carpet') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, ${secondaryColor || '#5C4A3A'}20 0%, transparent 30%),
            radial-gradient(circle at 75% 75%, ${secondaryColor || '#5C4A3A'}20 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, ${secondaryColor || '#5C4A3A'}10 0%, transparent 50%),
            repeating-linear-gradient(
              45deg,
              ${baseColor} 0px,
              ${baseColor} 4px,
              ${secondaryColor || '#5C4A3A'}30 4px,
              ${secondaryColor || '#5C4A3A'}30 8px
            )
          `,
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  if (floor.pattern === 'herringbone') {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              60deg,
              ${baseColor} 0px,
              ${baseColor} 40px,
              ${lineColor || '#C4A87C'} 40px,
              ${lineColor || '#C4A87C'} 42px
            ),
            repeating-linear-gradient(
              -60deg,
              ${secondaryColor || '#D4C4A8'} 0px,
              ${secondaryColor || '#D4C4A8'} 40px,
              ${lineColor || '#C4A87C'} 40px,
              ${lineColor || '#C4A87C'} 42px
            )
          `,
          transform: 'translateZ(0px)',
        }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: baseColor,
        transform: 'translateZ(0px)',
      }}
    />
  );
}

function Walls({ theme, timeOfDay }: { theme: OfficeTheme; timeOfDay: string }) {
  const { walls, window } = theme;
  const wallColor = walls.colors[timeOfDay as keyof typeof walls.colors];

  const windowPositions = theme.id === 'japanese' 
    ? [{ left: '1/4', width: '80px' }, { left: '3/4', width: '80px' }]
    : theme.id === 'scandinavian' || theme.id === 'creative'
      ? [{ left: '1/5', width: '100px' }, { left: '2/5', width: '100px' }, { left: '3/5', width: '100px' }, { left: '4/5', width: '100px' }]
      : [{ left: '1/4', width: '60px' }, { left: '3/4', width: '60px' }];

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0"
        style={{ 
          height: '50px',
          backgroundColor: wallColor,
          transform: 'rotateX(-90deg)',
          transformOrigin: 'top center',
        }}
      >
        {walls.hasWallDecoration && walls.accentColor && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${wallColor} 0%, ${walls.accentColor}40 50%, ${wallColor} 100%)`,
              opacity: 0.3,
            }}
          />
        )}
      </div>
      
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
      
      {windowPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: pos.left,
            width: pos.width,
            height: '50px',
            transform: 'rotateX(-90deg) translateZ(1px)',
            transformOrigin: 'top center',
          }}
        >
          <div
            className="absolute inset-1 rounded"
            style={{
              background: `linear-gradient(180deg, ${window.glassColor} 0%, ${window.glassColor.replace('0.7', '0.4')} 100%)`,
              boxShadow: `0 10px 30px rgba(135, 206, 235, 0.3)`,
            }}
          />
          <div
            className="absolute inset-0 border-2 rounded"
            style={{ borderColor: window.frameColor }}
          />
          {window.style === 'japanese' && (
            <>
              <div className="absolute top-1/2 left-0 right-0 h-0.5" style={{ backgroundColor: window.frameColor }} />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5" style={{ backgroundColor: window.frameColor }} />
            </>
          )}
          {window.style === 'classic' && (
            <>
              <div className="absolute top-1/3 left-0 right-0 h-0.5" style={{ backgroundColor: window.frameColor }} />
              <div className="absolute top-2/3 left-0 right-0 h-0.5" style={{ backgroundColor: window.frameColor }} />
            </>
          )}
        </div>
      ))}
    </>
  );
}

export function OfficeLayout() {
  const { time, getCustomizedTheme } = useOfficeStore();
  const theme = getCustomizedTheme();
  const timeOfDay = getTimeOfDay(time.hour);
  const { layout, furniture } = theme;

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      <FloorPattern theme={theme} timeOfDay={timeOfDay} />
      
      <Walls theme={theme} timeOfDay={timeOfDay} />
      
      {layout.desks.map((desk, index) => (
        <Desk key={`desk-${index}`} {...desk} furniture={furniture} />
      ))}
      
      <MeetingRoom {...layout.meetingRoom} furniture={furniture} />
      
      <KitchenArea {...layout.kitchen} furniture={furniture} />
      
      <Printer x={layout.printer.x} y={layout.printer.y} />
      
      <ACUnit x={layout.acUnit.x} y={layout.acUnit.y} theme={theme} />
      
      <Door x={layout.door.x} y={layout.door.y} theme={theme} />
      
      {layout.plants.map((plant, index) => (
        <Plant key={`plant-${index}`} {...plant} theme={theme} />
      ))}
      
      {layout.extraObjects.map((obj) => (
        <ExtraObject key={obj.id} obj={obj} theme={theme} />
      ))}
    </div>
  );
}
