import { useOfficeStore } from '@/store/useOfficeStore';
import { LayoutGrid, Monitor, Coffee, Users, ChevronRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
};

export function ViewSelector() {
  const { getViewPoints, currentView, setCurrentView } = useOfficeStore();
  const viewPoints = getViewPoints();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">🗺️ 视角切换</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {viewPoints.map((view) => (
          <button
            key={view.id}
            onClick={() => setCurrentView(view.id)}
            className={`relative p-3 rounded-xl text-left transition-all duration-200 ${
              currentView === view.id
                ? 'bg-orange-100 border-2 border-orange-400 shadow-md scale-105'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`mb-2 ${
              currentView === view.id ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {iconMap[view.icon] || <LayoutGrid className="w-5 h-5" />}
            </div>
            <div className={`text-sm font-semibold ${
              currentView === view.id ? 'text-orange-700' : 'text-gray-700'
            }`}>
              {view.name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {view.description}
            </div>
            {currentView === view.id && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 flex items-center gap-1">
        <ChevronRight className="w-3 h-3" />
        也可以直接拖动场景自由探索
      </div>
    </div>
  );
}
