import { useState } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import { AudioControls } from './AudioControls';
import { ViewSelector } from './ViewSelector';
import { TimeControls } from './TimeControls';
import { Volume2, Map, Clock, X, Menu } from 'lucide-react';

type Tab = 'audio' | 'view' | 'time';

const tabs = [
  { id: 'audio' as Tab, label: '声音', icon: Volume2 },
  { id: 'view' as Tab, label: '视角', icon: Map },
  { id: 'time' as Tab, label: '时间', icon: Clock },
];

export function ControlPanel() {
  const { showControlPanel, toggleControlPanel } = useOfficeStore();
  const [activeTab, setActiveTab] = useState<Tab>('audio');

  return (
    <>
      <button
        onClick={toggleControlPanel}
        className="fixed right-4 top-1/2 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        style={{ display: showControlPanel ? 'none' : 'flex' }}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-80 bg-white/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-out ${
          showControlPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              🏢 办公室控制台
            </h2>
            <button
              onClick={toggleControlPanel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-100 px-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'audio' && <AudioControls />}
            {activeTab === 'view' && <ViewSelector />}
            {activeTab === 'time' && <TimeControls />}
          </div>
          
          <div className="px-5 py-3 border-t border-gray-100 text-center text-xs text-gray-400">
            沉浸式在线办公室 · v1.0
          </div>
        </div>
      </div>
    </>
  );
}
