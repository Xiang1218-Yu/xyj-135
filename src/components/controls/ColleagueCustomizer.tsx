import { useState } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import type { ColleagueRole, HairStyle, HairColor, SkinTone, ColleagueAppearance } from '@/types/office';
import {
  roleLabels,
  hairStyleLabels,
  hairColorLabels,
  hairColorValues,
  skinToneLabels,
  skinToneValues,
} from '@/data/colleagues';
import { Users, Plus, Trash2, RotateCcw, UserPlus, Palette, Briefcase } from 'lucide-react';

type ColleagueTab = 'list' | 'appearance';

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

export function ColleagueCustomizer() {
  const {
    colleagues,
    addColleague,
    removeColleague,
    updateColleague,
    updateColleagueAppearance,
    updateColleagueRole,
    resetColleagues,
    getCustomizedTheme,
  } = useOfficeStore();

  const [activeTab, setActiveTab] = useState<ColleagueTab>('list');
  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<ColleagueRole>('engineer');
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedColleague = colleagues.find((c) => c.id === selectedColleagueId);
  const theme = getCustomizedTheme();

  const handleAddColleague = () => {
    if (!newName.trim()) return;

    const defaultAppearance: ColleagueAppearance = {
      hairStyle: 'short',
      hairColor: 'black',
      skinTone: 'light',
      shirtColor: '#6B7280',
      pantsColor: '#374151',
    };

    addColleague({
      name: newName.trim(),
      role: newRole,
      color: '#6B7280',
      appearance: defaultAppearance,
      deskPosition: { x: 50, y: 50 },
      keyboardType: 'membrane',
      typingSpeed: 0.35,
      schedule: {
        arriveTime: 9,
        lunchStart: 12,
        lunchEnd: 13,
        leaveTime: 18,
      },
      speed: 0.5,
      behaviorPreferences: {
        coffeeFrequency: 0.5,
        printFrequency: 0.5,
        meetingFrequency: 0.5,
        greetingFrequency: 0.5,
        talkativeness: 0.5,
        activityLevel: 0.5,
      },
    });

    setNewName('');
    setShowAddForm(false);
  };

  const tabs: { id: ColleagueTab; label: string; icon: typeof Users }[] = [
    { id: 'list', label: '同事列表', icon: Users },
    { id: 'appearance', label: '外貌设置', icon: Palette },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">同事管理</h3>
          <p className="text-xs text-gray-500">自定义您的团队成员</p>
        </div>
      </div>

      <div className="flex border border-gray-100 rounded-xl overflow-hidden">
        {tabs.map((tab) => {
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

      {activeTab === 'list' && (
        <div className="space-y-3">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm rounded-xl hover:from-orange-500 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              添加新同事
            </button>
          ) : (
            <div className="bg-white border border-orange-200 rounded-xl p-3 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-orange-500" />
                新同事信息
              </h4>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">姓名</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="输入同事姓名"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  岗位
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as ColleagueRole)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                >
                  {(Object.keys(roleLabels) as ColleagueRole[]).map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName('');
                  }}
                  className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddColleague}
                  disabled={!newName.trim()}
                  className="flex-1 py-2 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              团队成员 ({colleagues.length}人)
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {colleagues.map((colleague) => (
                <div
                  key={colleague.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedColleagueId === colleague.id
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedColleagueId(colleague.id);
                    setActiveTab('appearance');
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: colleague.appearance.shirtColor }}
                  >
                    {colleague.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {colleague.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {roleLabels[colleague.role]}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColleague(colleague.id);
                      if (selectedColleagueId === colleague.id) {
                        setSelectedColleagueId(null);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除同事"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetColleagues}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置为默认同事
          </button>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-4">
          {!selectedColleague ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">请先选择一位同事</p>
              <button
                onClick={() => setActiveTab('list')}
                className="mt-3 text-xs text-orange-500 hover:text-orange-600"
              >
                前往同事列表
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: selectedColleague.appearance.shirtColor }}
                  >
                    {selectedColleague.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedColleague.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {roleLabels[selectedColleague.role]}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  岗位设置
                </h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <select
                    value={selectedColleague.role}
                    onChange={(e) => updateColleagueRole(selectedColleague.id, e.target.value as ColleagueRole)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                  >
                    {(Object.keys(roleLabels) as ColleagueRole[]).map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-500" />
                  发型
                </h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(hairStyleLabels) as HairStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateColleagueAppearance(selectedColleague.id, { hairStyle: style })}
                        className={`py-2 px-1 text-xs rounded-lg border-2 transition-all ${
                          selectedColleague.appearance.hairStyle === style
                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                            : 'border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {hairStyleLabels[style]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">发色</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(hairColorLabels) as HairColor[]).map((color) => (
                      <button
                        key={color}
                        onClick={() => updateColleagueAppearance(selectedColleague.id, { hairColor: color })}
                        className={`aspect-square rounded-full border-2 transition-all ${
                          selectedColleague.appearance.hairColor === color
                            ? 'border-orange-400 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: hairColorValues[color] }}
                        title={hairColorLabels[color]}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">肤色</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(skinToneLabels) as SkinTone[]).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateColleagueAppearance(selectedColleague.id, { skinTone: tone })}
                        className={`aspect-square rounded-full border-2 transition-all ${
                          selectedColleague.appearance.skinTone === tone
                            ? 'border-orange-400 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: skinToneValues[tone] }}
                        title={skinToneLabels[tone]}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">服装颜色</h4>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <ColorPicker
                    label="上衣颜色"
                    value={selectedColleague.appearance.shirtColor}
                    onChange={(color) => {
                      updateColleagueAppearance(selectedColleague.id, { shirtColor: color });
                      updateColleague(selectedColleague.id, { color });
                    }}
                  />
                  <ColorPicker
                    label="裤子颜色"
                    value={selectedColleague.appearance.pantsColor}
                    onChange={(color) => updateColleagueAppearance(selectedColleague.id, { pantsColor: color })}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-3 bg-orange-50 rounded-xl">
        <h4 className="font-medium text-orange-800 text-xs mb-1">👥 同事自定义</h4>
        <p className="text-xs text-orange-600">
          添加团队成员，自定义每位同事的外貌和岗位，打造专属办公氛围。
        </p>
      </div>
    </div>
  );
}
