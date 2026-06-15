import { useOfficeStore } from '@/store/useOfficeStore';
import type { OfficeThemeType } from '@/types/office';
import { Palette } from 'lucide-react';

export function ThemeControls() {
  const { currentTheme, setOfficeTheme, getAllThemes } = useOfficeStore();
  const themes = getAllThemes();

  const handleThemeChange = (themeId: OfficeThemeType) => {
    setOfficeTheme(themeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">办公室主题</h3>
          <p className="text-xs text-gray-500">选择您喜欢的办公风格</p>
        </div>
      </div>

      <div className="space-y-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              currentTheme === theme.id
                ? 'border-orange-400 bg-orange-50 shadow-md'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.furniture.deskTop}40, ${theme.walls.colors.noon}40)`,
                }}
              >
                {theme.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">{theme.name}</h4>
                  {currentTheme === theme.id && (
                    <span className="px-2 py-0.5 bg-orange-400 text-white text-xs rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.floor.colors.noon }}
                  title="地板颜色"
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.walls.colors.noon }}
                  title="墙壁颜色"
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.furniture.deskTop }}
                  title="桌面颜色"
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.furniture.chair }}
                  title="椅子颜色"
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.furniture.monitorScreen }}
                  title="屏幕颜色"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-0.5 bg-gray-100 rounded">
                地板: {theme.floor.pattern}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">
                灯具: {theme.ceilingLightStyle}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <h4 className="font-medium text-blue-800 text-sm mb-2">💡 小提示</h4>
        <p className="text-xs text-blue-600">
          切换主题时，办公室的地板、墙壁、家具颜色和布局都会自动调整。同事们也会自动移动到新的工位上！
        </p>
      </div>
    </div>
  );
}
