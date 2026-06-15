import { Headphones, Coffee, Users, Clock, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const features = [
    { icon: <Headphones className="w-6 h-6" />, title: '空间音频', desc: '3D立体环绕音效' },
    { icon: <Users className="w-6 h-6" />, title: '动态同事', desc: '真实办公节奏模拟' },
    { icon: <Clock className="w-6 h-6" />, title: '时间模拟', desc: '早晚氛围自由切换' },
    { icon: <Coffee className="w-6 h-6" />, title: '沉浸体验', desc: '茶水间会议室齐全' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-32 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            在线办公室
          </h1>
          <p className="text-lg text-gray-600">
            沉浸式虚拟办公环境
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-orange-500 mb-2 flex justify-center">
                {feature.icon}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-0.5">
                {feature.title}
              </div>
              <div className="text-xs text-gray-500">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>开始体验</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="mt-6 text-sm text-gray-400">
          点击进入，戴上耳机效果更佳 🎧
        </p>
      </div>
    </div>
  );
}
