import { useRef, useState, useEffect } from 'react';
import type { DeskLayout, MeetingRoomLayout, KitchenLayout, OfficeObject, Position } from '@/types/office';

export type DraggableItem =
  | { kind: 'desk'; index: number }
  | { kind: 'meeting' }
  | { kind: 'kitchen' }
  | { kind: 'printer' }
  | { kind: 'acUnit' }
  | { kind: 'door' }
  | { kind: 'object'; id: string };

interface LayoutCanvasProps {
  desks: DeskLayout[];
  meetingRoom: MeetingRoomLayout;
  kitchen: KitchenLayout;
  printer: Position;
  acUnit: Position;
  door: Position;
  customObjects: OfficeObject[];
  onMoveDesk: (index: number, pos: { x: number; y: number }) => void;
  onMoveMeeting: (pos: { x: number; y: number }) => void;
  onMoveKitchen: (pos: { x: number; y: number }) => void;
  onMovePrinter: (pos: { x: number; y: number }) => void;
  onMoveAcUnit: (pos: { x: number; y: number }) => void;
  onMoveDoor: (pos: { x: number; y: number }) => void;
  onMoveObject: (id: string, pos: { x: number; y: number }) => void;
  onDeleteObject?: (id: string) => void;
  onRenameDesk?: (index: number, label: string) => void;
}

const itemColors: Record<string, string> = {
  desk: '#FF9F43',
  meeting: '#54A0FF',
  kitchen: '#FF6B6B',
  printer: '#A29BFE',
  acUnit: '#48DBFB',
  door: '#1DD1A1',
  object: '#F368E0',
};

const itemIcons: Record<string, string> = {
  desk: '🪑',
  meeting: '🚪',
  kitchen: '☕',
  printer: '🖨️',
  acUnit: '❄️',
  door: '🚶',
};

export function LayoutCanvas(props: LayoutCanvasProps) {
  const {
    desks, meetingRoom, kitchen, printer, acUnit, door, customObjects,
    onMoveDesk, onMoveMeeting, onMoveKitchen, onMovePrinter, onMoveAcUnit, onMoveDoor,
    onMoveObject, onDeleteObject, onRenameDesk,
  } = props;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ item: DraggableItem; offsetX: number; offsetY: number } | null>(null);
  const [selected, setSelected] = useState<DraggableItem | null>(null);
  const [editingDesk, setEditingDesk] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const pctToPx = (x: number, y: number) => {
    const el = canvasRef.current;
    if (!el) return { px: 0, py: 0 };
    const r = el.getBoundingClientRect();
    return { px: (x / 100) * r.width, py: (y / 100) * r.height };
  };

  const clientToPct = (clientX: number, clientY: number) => {
    const el = canvasRef.current;
    if (!el) return { x: 50, y: 50 };
    const r = el.getBoundingClientRect();
    const nx = ((clientX - r.left) / r.width) * 100;
    const ny = ((clientY - r.top) / r.height) * 100;
    return {
      x: Math.max(5, Math.min(95, nx)),
      y: Math.max(8, Math.min(92, ny)),
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, item: DraggableItem) => {
    e.stopPropagation();
    setSelected(item);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let baseX = 50, baseY = 50;
    switch (item.kind) {
      case 'desk': baseX = desks[item.index]?.x ?? 50; baseY = desks[item.index]?.y ?? 50; break;
      case 'meeting': baseX = meetingRoom.x; baseY = meetingRoom.y; break;
      case 'kitchen': baseX = kitchen.x; baseY = kitchen.y; break;
      case 'printer': baseX = printer.x; baseY = printer.y; break;
      case 'acUnit': baseX = acUnit.x; baseY = acUnit.y; break;
      case 'door': baseX = door.x; baseY = door.y; break;
      case 'object': {
        const o = customObjects.find(o => o.id === item.id);
        if (o) { baseX = o.x; baseY = o.y; }
        break;
      }
    }
    const { px, py } = pctToPx(baseX, baseY);
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    setDragging({ item, offsetX: clientX - r.left - px, offsetY: clientY - r.top - py });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const r = canvasRef.current?.getBoundingClientRect();
      if (!r) return;
      const px = cx - r.left - dragging.offsetX;
      const py = cy - r.top - dragging.offsetY;
      const xPct = Math.max(5, Math.min(95, (px / r.width) * 100));
      const yPct = Math.max(8, Math.min(92, (py / r.height) * 100));
      const pos = { x: xPct, y: yPct };
      switch (dragging.item.kind) {
        case 'desk': onMoveDesk(dragging.item.index, pos); break;
        case 'meeting': onMoveMeeting(pos); break;
        case 'kitchen': onMoveKitchen(pos); break;
        case 'printer': onMovePrinter(pos); break;
        case 'acUnit': onMoveAcUnit(pos); break;
        case 'door': onMoveDoor(pos); break;
        case 'object': onMoveObject(dragging.item.id, pos); break;
      }
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging, desks, meetingRoom, kitchen, printer, acUnit, door, customObjects, onMoveDesk, onMoveMeeting, onMoveKitchen, onMovePrinter, onMoveAcUnit, onMoveDoor, onMoveObject]);

  const startEditDesk = (index: number) => {
    setEditingDesk(index);
    setEditValue(desks[index]?.label || '');
  };

  const commitEdit = () => {
    if (editingDesk !== null && onRenameDesk) {
      onRenameDesk(editingDesk, editValue);
    }
    setEditingDesk(null);
  };

  const selectedLabel = (() => {
    if (!selected) return null;
    switch (selected.kind) {
      case 'desk': return `工位 ${desks[selected.index]?.label || selected.index + 1}`;
      case 'meeting': return '会议室';
      case 'kitchen': return '茶水间';
      case 'printer': return '打印机';
      case 'acUnit': return '空调';
      case 'door': return '大门';
      case 'object': {
        const o = customObjects.find(o => o.id === selected.id);
        return `装饰品 ${o?.type || ''}`;
      }
    }
  })();

  const renderNode = (opts: { kind: string; label: string; icon?: string; x: number; y: number; w?: number; h?: number; item: DraggableItem; color?: string }) => {
    const { kind, label, icon, x, y, w = 44, h = 28, item, color } = opts;
    const isSelected = selected && selected.kind === item.kind && (
      (item.kind === 'desk' && (selected as { index: number }).index === item.index) ||
      (item.kind === 'object' && (selected as { id: string }).id === item.id) ||
      (item.kind !== 'desk' && item.kind !== 'object')
    );
    const bg = color || itemColors[kind] || '#FF9F43';
    return (
      <div
        onMouseDown={(e) => handleStart(e, item)}
        onTouchStart={(e) => handleStart(e, item)}
        onDoubleClick={() => {
          if (item.kind === 'desk') startEditDesk(item.index);
        }}
        className={`absolute flex items-center justify-center rounded-lg text-white text-[10px] font-semibold shadow-md select-none transition-shadow ${
          isSelected ? 'ring-2 ring-offset-1 ring-orange-500 shadow-lg z-10' : ''
        } ${dragging?.item === item ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${w}px`,
          height: `${h}px`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: bg,
          touchAction: 'none',
        }}
      >
        <span className="truncate px-1.5">{icon} {label}</span>
        {item.kind === 'desk' && editingDesk === item.index && (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 rounded-lg text-black text-[10px] px-1.5 outline-none border-2 border-orange-400"
          />
        )}
        {item.kind === 'object' && isSelected && onDeleteObject && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteObject(item.id); setSelected(null); }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center shadow"
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div
        ref={canvasRef}
        onClick={() => setSelected(null)}
        className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200"
        style={{
          background: `
            linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 20px)
          `,
          cursor: selected ? 'default' : 'crosshair',
        }}
      >
        <div className="absolute top-2 left-2 text-[10px] text-gray-400 pointer-events-none">
          顶视图（双击工位可改名）
        </div>

        {desks.map((desk, i) =>
          renderNode({
            kind: 'desk',
            label: desk.label || `${i + 1}`,
            icon: itemIcons.desk,
            x: desk.x,
            y: desk.y,
            w: 46,
            h: 24,
            item: { kind: 'desk', index: i },
          })
        )}

        {renderNode({
          kind: 'meeting',
          label: '会议室',
          icon: itemIcons.meeting,
          x: meetingRoom.x,
          y: meetingRoom.y,
          w: 60,
          h: 34,
          item: { kind: 'meeting' },
        })}

        {renderNode({
          kind: 'kitchen',
          label: '茶水间',
          icon: itemIcons.kitchen,
          x: kitchen.x,
          y: kitchen.y,
          w: 50,
          h: 30,
          item: { kind: 'kitchen' },
        })}

        {renderNode({
          kind: 'printer',
          label: '打印',
          icon: itemIcons.printer,
          x: printer.x,
          y: printer.y,
          w: 34,
          h: 22,
          item: { kind: 'printer' },
        })}

        {renderNode({
          kind: 'acUnit',
          label: '空调',
          icon: itemIcons.acUnit,
          x: acUnit.x,
          y: acUnit.y,
          w: 40,
          h: 18,
          item: { kind: 'acUnit' },
        })}

        {renderNode({
          kind: 'door',
          label: '大门',
          icon: itemIcons.door,
          x: door.x,
          y: door.y,
          w: 30,
          h: 36,
          item: { kind: 'door' },
        })}

        {customObjects.map((obj) =>
          renderNode({
            kind: 'object',
            label: obj.type,
            icon: '✨',
            x: obj.x,
            y: obj.y,
            w: 30,
            h: 22,
            item: { kind: 'object', id: obj.id },
            color: '#F368E0',
          })
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[10px]">
        {Object.entries(itemColors).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1 text-gray-500">
            <span className="inline-block w-2.5 h-2.5 rounded" style={{ backgroundColor: c }} />
            <span>{({ desk: '工位', meeting: '会议', kitchen: '茶水间', printer: '打印', acUnit: '空调', door: '大门', object: '装饰' } as Record<string, string>)[k]}</span>
          </div>
        ))}
      </div>

      {selectedLabel && (
        <div className="px-3 py-2 bg-orange-50 rounded-lg text-xs text-orange-700">
          已选中：<span className="font-semibold">{selectedLabel}</span>，拖拽移动位置
          {selected?.kind === 'desk' && <span className="ml-2 text-orange-500">（双击改名）</span>}
        </div>
      )}
    </div>
  );
}
