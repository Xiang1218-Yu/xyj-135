import { useState } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { FurnitureColors, OfficeObject, DeskLayout, MeetingRoomLayout, KitchenLayout } from '@/types/office';
import { Paintbrush, LayoutGrid, Sparkles, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight, Move } from 'lucide-react';

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

function DeskEditor({ desks, onChange }: { desks: DeskLayout[]; onChange: (index: number, desk: Partial<DeskLayout>) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-1">
      {desks.map((desk, i) => (
        <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            <span className="font-medium">{desk.label || `工位 ${i + 1}`}</span>
            {expanded === i ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {expanded === i && (
            <div className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">X (%)</label>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    value={desk.x}
                    onChange={(e) => onChange(i, { x: Number(e.target.value) })}
                    className="w-full h-1.5 accent-orange-400"
                  />
                  <span className="text-xs text-gray-500">{desk.x}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Y (%)</label>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={desk.y}
                    onChange={(e) => onChange(i, { y: Number(e.target.value) })}
                    className="w-full h-1.5 accent-orange-400"
                  />
                  <span className="text-xs text-gray-500">{desk.y}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">标签</label>
                <input
                  type="text"
                  value={desk.label}
                  onChange={(e) => onChange(i, { label: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ObjectEditor({ obj, onUpdate, onRemove }: { obj: OfficeObject; onUpdate: (id: string, updates: Partial<OfficeObject>) => void; onRemove: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
      >
        <span className="font-medium flex items-center gap-1.5">
          <Move className="w-3 h-3 text-gray-400" />
          {objectTypes.find((t) => t.value === obj.type)?.icon} {obj.type}-{obj.id.slice(-4)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(obj.id); }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400">X (%)</label>
              <input
                type="range"
                min={5}
                max={95}
                value={obj.x}
                onChange={(e) => onUpdate(obj.id, { x: Number(e.target.value) })}
                className="w-full h-1.5 accent-orange-400"
              />
              <span className="text-xs text-gray-500">{obj.x}</span>
            </div>
            <div>
              <label className="text-xs text-gray-400">Y (%)</label>
              <input
                type="range"
                min={5}
                max={95}
                value={obj.y}
                onChange={(e) => onUpdate(obj.id, { y: Number(e.target.value) })}
                className="w-full h-1.5 accent-orange-400"
              />
              <span className="text-xs text-gray-500">{obj.y}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400">样式</label>
            <select
              value={obj.style || ''}
              onChange={(e) => onUpdate(obj.id, { style: e.target.value })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
            >
              {(objectStyles[obj.type] || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}
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
    if (!layoutOverrides.door) {
      updateCustomLayoutItem('door', { ...theme.layout.door });
    }
  };

  const decorTabs: { id: DecorTab; label: string; icon: typeof Paintbrush }[] = [
    { id: 'colors', label: '配色', icon: Paintbrush },
    { id: 'layout', label: '布局', icon: LayoutGrid },
    { id: 'objects', label: '装饰', icon: Sparkles },
  ];

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
                  🪑 工位布局
                  <span className="text-xs font-normal text-gray-400">拖动滑块调整位置</span>
                </h4>
                <DeskEditor
                  desks={effectiveDesks}
                  onChange={updateCustomDeskPosition}
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🚪 会议室</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">X</label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={effectiveMeetingRoom.x}
                        onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, x: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Y</label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={effectiveMeetingRoom.y}
                        onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, y: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">宽度</label>
                      <input
                        type="range"
                        min={15}
                        max={40}
                        value={effectiveMeetingRoom.width}
                        onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, width: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">高度</label>
                      <input
                        type="range"
                        min={10}
                        max={30}
                        value={effectiveMeetingRoom.height}
                        onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, height: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">风格</label>
                    <select
                      value={effectiveMeetingRoom.style}
                      onChange={(e) => updateCustomLayoutItem('meetingRoom', { ...effectiveMeetingRoom, style: e.target.value as MeetingRoomLayout['style'] })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                    >
                      <option value="rectangular">矩形</option>
                      <option value="round">圆形</option>
                      <option value="casual">休闲</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">☕ 茶水间</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">X</label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={effectiveKitchen.x}
                        onChange={(e) => updateCustomLayoutItem('kitchen', { ...effectiveKitchen, x: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Y</label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={effectiveKitchen.y}
                        onChange={(e) => updateCustomLayoutItem('kitchen', { ...effectiveKitchen, y: Number(e.target.value) })}
                        className="w-full h-1.5 accent-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">风格</label>
                    <select
                      value={effectiveKitchen.style}
                      onChange={(e) => updateCustomLayoutItem('kitchen', { ...effectiveKitchen, style: e.target.value as KitchenLayout['style'] })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                    >
                      <option value="modern">现代</option>
                      <option value="cozy">温馨</option>
                      <option value="industrial">工业</option>
                    </select>
                  </div>
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

              {customObjects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">还没有自定义装饰品</p>
                  <p className="text-xs">选择类型后点击"添加"来放置装饰品</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {customObjects.map((obj) => (
                    <ObjectEditor
                      key={obj.id}
                      obj={obj}
                      onUpdate={updateCustomObject}
                      onRemove={removeCustomObject}
                    />
                  ))}
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
            您的所有自定义修改会叠加在当前主题之上。切换主题后自定义设置仍然保留。
          </p>
        </div>
      )}
    </div>
  );
}
