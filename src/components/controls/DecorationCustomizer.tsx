import { useState } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { FurnitureColors, OfficeObject, DeskLayout, MeetingRoomLayout, KitchenLayout } from '@/types/office';
import { LayoutCanvas } from './LayoutCanvas';
import { Paintbrush, LayoutGrid, Sparkles, RotateCcw, Plus, Move } from 'lucide-react';

type DecorTab = 'colors' | 'layout' | 'objects';

const furnitureColorLabels: Record<keyof FurnitureColors, string> = {
  deskTop: '桌面',
  deskSide: '桌侧',
  chair: '椅背',
  chairSeat: '椅垫',
  monitor: '显示器',
  monitorScreen: '屏幕',
  table: '会议桌',
  cabinet: '储物柜',
};

const objectTypes: { value: OfficeObject['type']; label: string; icon: string }[] = [
  { value: 'plant', label: '植物', icon: '🪴' },
  { value: 'bookshelf', label: '书架', icon: '📚' },
  { value: 'painting', label: '画作', icon: '🖼️' },
  { value: 'rug', label: '地毯', icon: '🟫' },
  { value: 'lamp', label: '灯具', icon: '💡' },
  { value: 'decoration', label: '装饰品', icon: '✨' },
];

const objectStyles: Record<string, string[]> = {
  plant: ['small', 'medium', 'large'],
  bookshelf: ['modern', 'classic', 'industrial'],
  painting: ['abstract', 'colorful', 'graffiti', 'japanese', 'classic'],
  rug: ['industrial', 'scandinavian', 'colorful'],
  lamp: ['pendant', 'chandelier'],
  decoration: ['exposed-pipe', 'bamboo', 'neon'],
};

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg border-2 border-gray-200 cursor-pointer shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border-0 p-0"
        />
      </div>
    </div>
  );
}

export function DecorationCustomizer() {
  const {
    customization,
    getCurrentTheme,
    setCustomizationEnabled,
    updateCustomFurnitureColor,
    updateCustomWallAccent,
    updateCustomDeskPosition,
    updateCustomLayoutItem,
    addCustomObject,
    removeCustomObject,
    updateCustomObject,
    resetCustomization,
  } = useOfficeStore();

  const [activeTab, setActiveTab] = useState<DecorTab>('colors');
  const [newObjectType, setNewObjectType] = useState<OfficeObject['type']>('plant');

  const theme = getCurrentTheme();
  const { colorOverrides, layoutOverrides, customObjects, enabled } = customization;

  const effectiveFurniture: FurnitureColors = {
    ...theme.furniture,
    ...colorOverrides.furniture,
  };

  const effectiveDesks = layoutOverrides.desks.length > 0 ? layoutOverrides.desks : theme.layout.desks;
  const effectiveMeetingRoom = layoutOverrides.meetingRoom || theme.layout.meetingRoom;
  const effectiveKitchen = layoutOverrides.kitchen || theme.layout.kitchen;
  const effectivePrinter = layoutOverrides.printer || theme.layout.printer;
  const effectiveAcUnit = layoutOverrides.acUnit || theme.layout.acUnit;
  const effectiveDoor = layoutOverrides.door || theme.layout.door;

  const handleAddObject = () => {
    const styles = objectStyles[newObjectType] || [];
    const obj: OfficeObject = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: newObjectType,
      x: 50,
      y: 50,
      style: styles[0] || undefined,
    };
    addCustomObject(obj);
  };

  const handleInitLayout = () => {
    if (layoutOverrides.desks.length === 0) {
      updateCustomLayoutItem('desks', theme.layout.desks.map((d) => ({ ...d })));
    }
    if (!layoutOverrides.meetingRoom) {
      updateCustomLayoutItem('meetingRoom', { ...theme.layout.meetingRoom });
    }
    if (!layoutOverrides.kitchen) {
      updateCustomLayoutItem('kitchen', { ...theme.layout.kitchen });
    }
    if (!layoutOverrides.printer) {
      updateCustomLayoutItem('printer', { ...theme.layout.printer });
    }
    if (!layoutOverrides.acUnit) {
      updateCustomLayoutItem('acUnit', { ...theme.layout.acUnit });
    }
    if (!layoutOverrides.door) {
      updateCustomLayoutItem('door', { ...theme.layout.door });
    }
  };

  const decorTabs: { id: DecorTab; label: string; icon: typeof Paintbrush }[] = [
    { id: 'colors', label: '配色', icon: Paintbrush },
    { id: 'layout', label: '布局', icon: LayoutGrid },
    { id: 'objects', label: '装饰', icon: Sparkles },
  ];

  const onMoveDesk = (index: number, pos: { x: number; y: number }) => {
    const arr = layoutOverrides.desks.length > 0 ? [...layoutOverrides.desks] : theme.layout.desks.map(d => ({ ...d }));
    if (arr[index]) {
      arr[index] = { ...arr[index], x: pos.x, y: pos.y };
      updateCustomLayoutItem('desks', arr);
    }
  };

  const onRenameDesk = (index: number, label: string) => {
    const arr = layoutOverrides.desks.length > 0 ? [...layoutOverrides.desks] : theme.layout.desks.map(d => ({ ...d }));
    if (arr[index]) {
      arr[index] = { ...arr[index], label };
      updateCustomLayoutItem('desks', arr);
    }
  };

  const onMoveMeeting = (pos: { x: number; y: number }) =>
    updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, x: pos.x, y: pos.y });
  const onMoveKitchen = (pos: { x: number; y: number }) =>
    updateCustomLayoutItem('kitchen', { ...effectiveKitchen, x: pos.x, y: pos.y });
  const onMovePrinter = (pos: { x: number; y: number }) =>
    updateCustomLayoutItem('printer', { x: pos.x, y: pos.y });
  const onMoveAcUnit = (pos: { x: number; y: number }) =>
    updateCustomLayoutItem('acUnit', { x: pos.x, y: pos.y });
  const onMoveDoor = (pos: { x: number; y: number }) =>
    updateCustomLayoutItem('door', { x: pos.x, y: pos.y });
  const onMoveObject = (id: string, pos: { x: number; y: number }) =>
    updateCustomObject(id, { x: pos.x, y: pos.y });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">办公室装饰</h3>
          <p className="text-xs text-gray-500">自定义您的办公空间</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <span className="text-sm text-gray-700 font-medium">启用自定义装饰</span>
        <button
          onClick={() => {
            if (!enabled) handleInitLayout();
            setCustomizationEnabled(!enabled);
          }}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            enabled ? 'bg-orange-400' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex border border-gray-100 rounded-xl overflow-hidden">
            {decorTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">家具配色</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-0.5">
                  {(Object.keys(furnitureColorLabels) as (keyof FurnitureColors)[]).map((key) => (
                    <ColorPicker
                      key={key}
                      label={furnitureColorLabels[key]}
                      value={effectiveFurniture[key]}
                      onChange={(color) => updateCustomFurnitureColor(key, color)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">墙壁装饰色</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <ColorPicker
                    label="强调色"
                    value={colorOverrides.wallAccent || theme.walls.accentColor || '#4A90A4'}
                    onChange={updateCustomWallAccent}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Move className="w-4 h-4 text-orange-500" />
                  办公室布局
                </h4>
                <p className="text-xs text-gray-400 mb-2">
                  直接在画布上拖拽方块移动位置，双击工位可修改标签
                </p>
                <LayoutCanvas
                  desks={effectiveDesks}
                  meetingRoom={effectiveMeetingRoom}
                  kitchen={effectiveKitchen}
                  printer={effectivePrinter}
                  acUnit={effectiveAcUnit}
                  door={effectiveDoor}
                  customObjects={customObjects}
                  onMoveDesk={onMoveDesk}
                  onMoveMeeting={onMoveMeeting}
                  onMoveKitchen={onMoveKitchen}
                  onMovePrinter={onMovePrinter}
                  onMoveAcUnit={onMoveAcUnit}
                  onMoveDoor={onMoveDoor}
                  onMoveObject={onMoveObject}
                  onRenameDesk={onRenameDesk}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1.5">会议室风格</h4>
                  <select
                    value={effectiveMeetingRoom.style}
                    onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, style: e.target.value as MeetingRoomLayout['style'] })}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="rectangular">矩形</option>
                    <option value="round">圆形</option>
                    <option value="casual">休闲</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1.5">茶水间风格</h4>
                  <select
                    value={effectiveKitchen.style}
                    onChange={(e) => updateCustomLayoutItem('kitchen', { ...effectiveKitchen, style: e.target.value as KitchenLayout['style'] })}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="modern">现代</option>
                    <option value="cozy">温馨</option>
                    <option value="industrial">工业</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objects' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <select
                  value={newObjectType}
                  onChange={(e) => setNewObjectType(e.target.value as OfficeObject['type'])}
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg"
                >
                  {objectTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddObject}
                  className="px-3 py-2 bg-orange-400 text-white text-xs rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  添加
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Move className="w-4 h-4 text-pink-500" />
                  装饰品画布
                </h4>
                <p className="text-xs text-gray-400 mb-2">
                  拖拽紫色方块移动装饰品位置，点击后右上角 ✕ 可删除
                </p>
                <LayoutCanvas
                  desks={effectiveDesks}
                  meetingRoom={effectiveMeetingRoom}
                  kitchen={effectiveKitchen}
                  printer={effectivePrinter}
                  acUnit={effectiveAcUnit}
                  door={effectiveDoor}
                  customObjects={customObjects}
                  onMoveDesk={onMoveDesk}
                  onMoveMeeting={onMoveMeeting}
                  onMoveKitchen={onMoveKitchen}
                  onMovePrinter={onMovePrinter}
                  onMoveAcUnit={onMoveAcUnit}
                  onMoveDoor={onMoveDoor}
                  onMoveObject={onMoveObject}
                  onDeleteObject={removeCustomObject}
                  onRenameDesk={onRenameDesk}
                />
              </div>

              {customObjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1.5">装饰品样式</h4>
                  <div className="space-y-1">
                    {customObjects.map((obj) => (
                      <div key={obj.id} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-700 w-14 truncate">
                          {objectTypes.find((t) => t.value === obj.type)?.icon || '✨'} {obj.type}
                        </span>
                        <select
                          value={obj.style || ''}
                          onChange={(e) => updateCustomObject(obj.id, { style: e.target.value })}
                          className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded"
                        >
                          <option value="">默认样式</option>
                          {(objectStyles[obj.type] || []).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={resetCustomization}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置为默认装饰
          </button>
        </>
      )}

      {enabled && (
        <div className="p-3 bg-violet-50 rounded-xl">
          <h4 className="font-medium text-violet-800 text-xs mb-1">🎨 自定义模式已开启</h4>
          <p className="text-xs text-violet-600">
            在画布上直接拖拽方块即可调整位置。切换主题后自定义设置仍然保留。
          </p>
        </div>
      )}
    </div>
  );
}
