# 沉浸式在线办公室 — 系统架构深度分析

## 一、系统概览

本系统是一个基于 **React + TypeScript + Web Audio API + CSS 3D Transform** 构建的沉浸式在线办公室模拟器。核心理念是通过纯前端技术实现一个具有空间感、时间感和社交感的虚拟办公环境，用户可以拖动视角探索办公室，感受同事的活动、环境音效和光线变化。

**技术栈：**

| 层面 | 技术 |
|------|------|
| UI 框架 | React 18 + TypeScript |
| 状态管理 | Zustand 5 |
| 样式方案 | Tailwind CSS 3 + CSS 3D Transform |
| 音频引擎 | Web Audio API (原生) |
| 3D 渲染 | CSS `transform: preserve-3d` + `perspective` |
| 构建工具 | Vite 6 |

**核心模块关系图：**

```
┌─────────────────────────────────────────────────────────┐
│                       Home.tsx                          │
│            (入口：WelcomeScreen → OfficeScene)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  OfficeScene  │  │  StatusBar   │  │ ControlPanel │  │
│  │  (场景容器)   │  │  (状态栏)    │  │  (控制台)    │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  │
│         │                                               │
│  ┌──────┴───────────────────────────────────────┐      │
│  │              场景渲染层                        │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │      │
│  │  │ OfficeLayout│ │Lighting │ │WeatherEffects│  │      │
│  │  │ (布局渲染) │ │(光照系统)│ │(天气特效)    │  │      │
│  │  └──────────┘ └──────────┘ └──────────────┘  │      │
│  │  ┌──────────────────────────────────────────┐ │      │
│  │  │        ColleagueAvatar (角色渲染)         │ │      │
│  │  └──────────────────────────────────────────┘ │      │
│  └───────────────────────────────────────────────┘      │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │               系统驱动层                        │      │
│  │  ┌──────────────┐ ┌──────────────┐            │      │
│  │  │useAudioEngine│ │useColleagueAI│            │      │
│  │  │ (音频引擎)   │ │ (同事AI)     │            │      │
│  │  └──────────────┘ └──────────────┘            │      │
│  │  ┌──────────────┐ ┌──────────────┐            │      │
│  │  │useTimeSimul. │ │useWeatherSim.│            │      │
│  │  │ (时间模拟)   │ │ (天气模拟)   │            │      │
│  │  └──────────────┘ └──────────────┘            │      │
│  └───────────────────────────────────────────────┘      │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │           Zustand Store (useOfficeStore)       │      │
│  │   全局状态：时间 / 天气 / 同事 / 音源 / 视角  │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 二、音频引擎架构

### 2.1 总体架构

音频引擎完全基于 **Web Audio API** 构建，不依赖任何第三方音频库。所有声音均通过 **程序化合成 (Procedural Synthesis)** 生成，无需加载任何音频文件。核心实现在 [useAudioEngine.ts](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts) 中。

**架构分层：**

```
┌─────────────────────────────────────────────────────┐
│                   用户交互层                          │
│  AudioControls (音量滑块) / OfficeScene (拖动视角)   │
├─────────────────────────────────────────────────────┤
│                 音频调度层                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │
│  │ LoopSound  │ │RandomSound │ │  TypingSystem   │  │
│  │ (循环音)   │ │(随机触发)  │ │ (打字节奏系统)  │  │
│  └─────┬──────┘ └─────┬──────┘ └───────┬────────┘  │
│        │              │                │             │
│  ┌─────┴──────────────┴────────────────┴────────┐   │
│  │           playOneShot / playLoopSound         │   │
│  │              (统一播放接口)                    │   │
│  └──────────────────┬───────────────────────────┘   │
├─────────────────────┼───────────────────────────────┤
│              空间音频处理层                           │
│  ┌──────────────────┴───────────────────────────┐   │
│  │  calculateVolume (距离衰减)                    │   │
│  │  calculatePan   (立体声声像)                   │   │
│  └──────────────────┬───────────────────────────┘   │
├─────────────────────┼───────────────────────────────┤
│              音频合成层                               │
│  ┌──────────────────┴───────────────────────────┐   │
│  │  createKeyboardSound / createNoiseBuffer      │   │
│  │  createMouseClickSound / createCoffeeMachine  │   │
│  │  createPrinterSound / createACSound           │   │
│  │  createConversationSound / createDoorSound    │   │
│  │  createPhoneSound / createFootstepSound       │   │
│  │  createGreetingSound / createSipSound         │   │
│  │  createPrintPageSound / createMeetingTalk     │   │
│  │  createPaperHandleSound                       │   │
│  └──────────────────┬───────────────────────────┘   │
├─────────────────────┼───────────────────────────────┤
│              Web Audio API 底层                      │
│  AudioContext → MasterGain → StereoPanner → Dest    │
└─────────────────────────────────────────────────────┘
```

### 2.2 音频合成系统 (Procedural Synthesis)

所有声音均通过数学函数实时生成 `AudioBuffer`，核心思路是将声学现象建模为 **噪声 + 谐波 + 包络** 的组合。

#### 2.2.1 噪声生成器

实现在 [createNoiseBuffer](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L7-L41)，支持三种噪声类型：

| 类型 | 算法 | 频谱特征 | 用途 |
|------|------|----------|------|
| White Noise | `Math.random() * 2 - 1` | 等功率频谱 | 环境基底音 |
| Pink Noise | Voss-McCartney 滤波器链 | 1/f 频谱 (-3dB/oct) | 环境白噪音(ambient) |
| Brown Noise | 一阶低通滤波 `lastOut + 0.02 * white` | 1/f² 频谱 (-6dB/oct) | 低频环境 |

Pink Noise 的实现采用了经典的级联滤波器方法，通过 6 个系数 (b0~b5) 实现对白噪声的频谱塑形，使其更接近自然环境噪音的频谱分布。

#### 2.2.2 键盘声合成

实现在 [createKeyboardSound](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L43-L135)，这是系统中最复杂的合成器。

**合成模型：** `Output = (Noise × noiseMix + Click × clickMix + Body × 0.3) × Envelope × VolumeAdjust`

四个键盘类型的参数差异：

| 参数 | mechanical-loud | mechanical-quiet | membrane | laptop |
|------|-----------------|------------------|----------|--------|
| duration | 0.06s | 0.045s | 0.04s | 0.035s |
| baseFreq | 900+rand×200 | 700+rand×150 | 500+rand×100 | 400+rand×80 |
| noiseMix | 0.6 | 0.5 | 0.8 | 0.7 |
| clickMix | 0.5 | 0.4 | 0.2 | 0.15 |
| decay | 60 | 90 | 100 | 120 |
| brightness | 1.2 | 0.9 | 0.7 | 0.5 |

**关键设计细节：**

1. **按键随机性**：每次敲击的 `baseFreq` 会乘以 `0.9 + random × 0.2` 的随机因子，模拟不同键位的音高差异
2. **按键类型分布**：70% 普通键 / 15% 高频键(如空格, `clickFreq × 1.3`) / 10% 低频键(如Shift, `clickFreq × 0.7`) / 5% 长键(如Space, `duration × 2`)
3. **Click 分量**：使用频率调制 `sin(2π·f·t + sin(2π·f/2·t)·0.2)` 模拟机械开关的金属质感
4. **包络**：Attack 段为线性上升 (2ms)，Decay 段为指数衰减 `exp(-(t-attack) × decay)`

#### 2.2.3 其他声音合成算法

| 声音 | 位置 | 核心算法 |
|------|------|----------|
| 鼠标点击 | [L137-151](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L137-L151) | 纯噪声 + 指数衰减包络 (decay=150) |
| 咖啡机 | [L153-168](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L153-L168) | FM 合成咕噜声 `sin(2π·100·t + sin(2π·3·t)·5)` + 噪声嘶嘶声 + 蒸汽高频 `sin(2π·2000·t)·random` |
| 打印机 | [L170-186](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L170-L186) | 行扫描噪声 + 字车移动 `sin(2π·20·t)` + 纸张进给脉冲 |
| 空调 | [L188-205](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L188-L205) | 4 级级联低通滤波 (b0~b3, 衰减系数 0.999→0.9) 模拟低频隆隆声 |
| 交谈声 | [L207-225](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L207-L225) | 双共振峰合成 `F1=500Hz, F2=1000Hz` + 频率抖动 + 2Hz 语速包络 |
| 门声 | [L227-242](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L227-L242) | 铰链吱嘎声 `sin(2π·150·t)·exp(-2t)` + 关门撞击高斯脉冲 |
| 电话铃 | [L244-259](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L244-L259) | 双音铃声 `F1=800Hz, F2=1200Hz` + 1Hz 方波通断调制 |
| 脚步声 | [L261-276](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L261-L276) | 低频撞击 `sin(2π·80·t)·exp(-30t)` + 高频摩擦噪声 |
| 问候声 | [L278-295](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L278-L295) | 音高调制 `300+sin(12πt)·80` Hz + 双共振峰 + 半周期正弦包络 |
| 啜饮声 | [L297-312](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L297-L312) | 高斯脉冲噪声模拟吸吮 + 低频吞咽声 |
| 打印出纸 | [L314-330](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L314-L330) | 打印头移动 `sin(2π·8·t)` + 噪声 + 出纸咔嗒高斯脉冲 |
| 会议交谈 | [L332-348](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L332-L348) | 较慢语速 `F1=450Hz, F2=900Hz` + 1.5Hz 包络 |
| 纸张处理 | [L350-364](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L350-L364) | 窄带噪声 + 拿纸清脆声高斯脉冲 |

### 2.3 空间音频实现

空间音频系统通过 **距离衰减 (Distance Attenuation)** 和 **立体声声像 (Stereo Panning)** 两个维度实现 2D 平面上的空间感。核心实现在 [audioUtils.ts](file:///Users/tog/Desktop/code/solo/xyj-135/src/utils/audioUtils.ts) 和 [useAudioEngine.ts](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts) 中。

#### 2.3.1 距离衰减模型

```
                  ┌─────────────────────────────────────────┐
                  │                                         │
   Volume = 1     │  minDistance=5   线性衰减    maxDistance=100
   ───────────────┤─────────────────────────────────────────┤── Volume = 0
                  │                                         │
                  └─────────────────────────────────────────┘
                    音源 ←————— 距离 —————→ 听者
```

**算法（[calculateVolume](file:///Users/tog/Desktop/code/solo/xyj-135/src/utils/audioUtils.ts#L9-L26)）：**

```
if distance ≤ minDistance(5):
    distanceFactor = 1.0       // 近场无衰减
else:
    distanceFactor = max(0, 1 - (distance - minDistance) / (maxDistance - minDistance))

finalVolume = baseVolume × distanceFactor × masterVolume
```

这是一个**线性衰减模型**，而非物理上更准确的反平方律 (`1/r²`)。选择线性模型的原因是：
- 在 2D 俯视角办公室场景中，反平方律衰减过快，导致稍微远一点就听不到
- 线性衰减提供了更均匀的听觉覆盖范围
- `minDistance=5` 保证了近场不会出现音量突变

#### 2.3.2 立体声声像 (Stereo Pan)

**算法（[calculatePan](file:///Users/tog/Desktop/code/solo/xyj-135/src/utils/audioUtils.ts#L28-L35)）：**

```
pan = clamp(dx / maxPanDistance, -1, 1)

其中: dx = source.x - listener.x
      maxPanDistance = 80
```

```
  左声道 ←───────── 听者 ─────────→ 右声道
   pan=-1          pan=0           pan=+1
   dx=-80          dx=0            dx=+80
```

声像只考虑 X 轴方向（水平方向），这是基于办公室的扁平化布局设计的。使用 `StereoPannerNode` 的 `pan` 参数实现左右声道混合，当音源在听者左侧时 pan < 0（左声道更大），在右侧时 pan > 0（右声道更大）。

#### 2.3.3 Web Audio 节点图

每个声音实例的音频信号链路：

```
AudioBufferSourceNode → GainNode → StereoPannerNode → MasterGainNode → AudioContext.destination
                           ↑              ↑
                    calculateVolume   calculatePan
                    (距离+音量控制)   (空间声像)
```

- **循环音 (Loop Sound)**：`AudioBufferSourceNode.loop = true`，持续播放，音量/声像随听者位置实时更新
- **一次性音 (OneShot)**：播放后自动断开连接（`onended` 回调中 `disconnect()`）
- **同事触发音**：通过 Store 的 `colleagueSoundEvents` 事件队列触发，由 `useColleagueAI` 产生事件，`useAudioEngine` 消费事件

### 2.4 音频调度系统

#### 2.4.1 三类声音调度策略

| 调度类型 | 适用音源 | 调度方式 | 存储 |
|----------|----------|----------|------|
| **循环音** | 空调、环境音、咖啡机、交谈声、打印机 | `playLoopSound` → `AudioBufferSource.loop=true` | `loopSoundsRef: Map<string, SoundInstance>` |
| **随机触发音** | 鼠标、门声、电话 | `scheduleRandomSound` → `setTimeout` 递归调度 | `randomSoundsRef: Map<string, RandomSoundConfig>` |
| **打字节奏系统** | 键盘 | `scheduleTyping` → 状态机驱动 | `typingStatesRef: Map<string, TypingState>` |

#### 2.4.2 打字节奏状态机

这是系统中最精细的调度逻辑（[scheduleTyping](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L675-L736)）：

```
                 ┌─────────────────────┐
                 │   检查同事是否在工作  │
                 └──────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │ 否                        │ 是
         500ms后重检              ┌───────┴───────┐
                                 │ 是否正在打字?  │
                                 └───┬───────┬───┘
                                  否 │       │ 是
                    ┌────────────────┘       │
                    │                        │
            random < 0.4×speed?       burstCount > 0?
              │           │              │          │
             否          是             是         否
         1~3s后重试   开始burst     敲下一个键   结束burst
                    burstCount=3~15  间隔=min~max  pauseTime
                                   burstiness=随机长间隙  0.5~3.5s
```

**键盘时序参数（[keyboardTimingByType](file:///Users/tog/Desktop/code/solo/xyj-135/src/data/audioSources.ts#L116-L121)）：**

| 类型 | min间隔(s) | max间隔(s) | burstiness | 基础音量 |
|------|-----------|-----------|------------|---------|
| mechanical-loud | 0.08 | 0.15 | 0.3 | 0.45 |
| mechanical-quiet | 0.10 | 0.20 | 0.25 | 0.30 |
| membrane | 0.12 | 0.25 | 0.20 | 0.25 |
| laptop | 0.15 | 0.30 | 0.15 | 0.18 |

`burstiness` 参数控制打字间隙中出现较长停顿的概率，模拟人类打字的自然节奏。

#### 2.4.3 同事声音事件系统

同事活动触发的声音通过事件队列传递，解耦了 AI 行为系统和音频引擎：

```
useColleagueAI                    useOfficeStore                   useAudioEngine
     │                                  │                                │
     │ triggerColleagueSound(id, type)   │                                │
     │─────────────────────────────────→│                                │
     │                                  │ colleagueSoundEvents: [...]     │
     │                                  │◄───────────────────────────────│
     │                                  │  (useEffect 监听事件变化)       │
     │                                  │  playColleagueSound(pos, type) │
     │                                  │───────────────────────────────→│
     │                                  │                                │ AudioGraph
     │                                  │ consumeColleagueSoundEvent(id) │
     │                                  │◄───────────────────────────────│
```

事件 ID 通过 `processedSoundEventsRef` 去重，2 秒后自动清理，防止内存泄漏。

### 2.5 动态音量更新

当听者位置、主音量或静音状态变化时，通过 [updateAllSoundVolumes](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useAudioEngine.ts#L586-L601) 实时更新所有正在播放的循环音的增益和声像：

```typescript
loopSoundsRef.current.forEach((sound, id) => {
  const source = audioSources.find(s => s.id === id);
  if (source) {
    sound.gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    sound.pannerNode.pan.setValueAtTime(pan, ctx.currentTime);
  }
});
```

使用 `setValueAtTime` 而非 `linearRampToValueAtTime` 实现即时更新，避免在快速拖动视角时产生明显的延迟感。

---

## 三、渲染系统框架

### 3.1 渲染架构总览

渲染系统采用 **CSS 3D Transform** 方案，不使用 WebGL/Canvas，而是通过 CSS `perspective` + `transform-style: preserve-3d` + 3D 变换矩阵将 2D DOM 元素投影为等轴测视角的 3D 场景。

**渲染管线：**

```
┌─────────────────────────────────────────────────────┐
│                  OfficeScene (容器)                  │
│  perspective: 1500px                                 │
│  ┌───────────────────────────────────────────────┐  │
│  │           WeatherEffects (z-index: 3)          │  │
│  │  Rain / Snow / Cloud / Sun / Lightning / Fog   │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │          场景变换层 (200% × 200%)              │  │
│  │  transform: translate3d + scale + rotateX(60°) │  │
│  │                + rotateZ(-45°)                  │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │         场景内容 (70% × 70%)             │   │  │
│  │  │  ┌────────────────────────────────────┐  │   │  │
│  │  │  │     Lighting (光照覆盖层)           │  │   │  │
│  │  │  └────────────────────────────────────┘  │   │  │
│  │  │  ┌────────────────────────────────────┐  │   │  │
│  │  │  │     OfficeLayout (办公室布局)       │  │   │  │
│  │  │  │  FloorPattern / Walls / Desk /      │  │   │  │
│  │  │  │  MeetingRoom / Kitchen / Printer /  │  │   │  │
│  │  │  │  ACUnit / Door / Plant / ExtraObj   │  │   │  │
│  │  │  └────────────────────────────────────┘  │   │  │
│  │  │  ┌────────────────────────────────────┐  │   │  │
│  │  │  │  ColleagueAvatar[] (角色渲染)       │  │   │  │
│  │  │  └────────────────────────────────────┘  │   │  │
│  │  │  ┌────────────────────────────────────┐  │   │  │
│  │  │  │     听者标记 (橙色圆点)             │  │   │  │
│  │  │  └────────────────────────────────────┘  │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.2 等轴测投影实现

等轴测 (Isometric) 视角通过 CSS 3D Transform 实现（[OfficeScene.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/OfficeScene.tsx#L96-L109)）：

```css
transform:
  translate(-50%, -50%)
  translate3d(offsetX, offsetY, 0)   /* 视角平移 */
  scale(zoom)                         /* 缩放 */
  rotateX(60deg)                      /* X轴旋转 → 俯视角度 */
  rotateZ(-45deg)                     /* Z轴旋转 → 45°倾斜 */
```

**投影原理：**

```
  原始 2D 平面          rotateX(60°)           rotateZ(-45°)
  ┌─────────┐          ╱─────────╲           ╱╲
  │         │    →     ╱           ╲    →    ╱  ╲
  │         │         ╱─────────────╲       ╱────╲
  └─────────┘                               等轴测视角
```

- `rotateX(60°)` 将平面从正面翻转为俯视角度
- `rotateZ(-45°)` 将俯视角度旋转 45°，形成经典的等轴测菱形布局
- `perspective: 1500px` 提供适度的透视深度感
- `translate3d(offsetX, offsetY, 0)` 根据听者位置计算偏移量

**视角拖动机制（[OfficeScene.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/OfficeScene.tsx#L32-L59)）：**

```
offsetX = (50 - listenerPosition.x) × 2
offsetY = (50 - listenerPosition.y) × 1.5
```

用户拖动时更新 `listenerPosition`，系统自动计算场景偏移量。X 方向偏移系数为 2，Y 方向为 1.5，反映了等轴测投影下 X/Y 轴的视觉权重差异。

### 3.3 光照系统

光照系统在 [Lighting.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/Lighting.tsx) 中实现，采用 **多层半透明覆盖层** 模拟光照效果。

#### 3.3.1 时间驱动的光照配置

5 个时段的光照参数（[lightingConfigs](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/Lighting.tsx#L16-L62)）：

| 时段 | 天空顶色 | 天空底色 | 环境光 | 环境光强度 | 方向光 | 方向光强度 | 阴影透明度 |
|------|----------|----------|--------|-----------|--------|-----------|-----------|
| morning | #87CEEB | #E0F4FF | #FFE4B5 | 0.3 | #FFD700 | 0.5 | 0.15 |
| noon | #87CEEB | #FFF8E7 | #FFFFF0 | 0.4 | #FFFFE0 | 0.6 | 0.2 |
| afternoon | #B8D4E3 | #F5E6D3 | #FFDAB9 | 0.35 | #F4A460 | 0.45 | 0.25 |
| evening | #4A6FA5 | #C9A66B | #DEB887 | 0.25 | #CD853F | 0.3 | 0.35 |
| night | #1a1a2e | #16213e | #4169E1 | 0.1 | #FFFACD | 0.15 | 0.5 |

#### 3.3.2 光照渲染层结构

```
┌─────────────────────────────────────┐
│ Layer 1: 天空渐变背景               │  linear-gradient(bgTop → bgBottom)
│                                     │  天气影响时通过 lerpColor 混合
├─────────────────────────────────────┤
│ Layer 2: 方向光 (窗户侧光)          │  radial-gradient 30% 10% 方向
│                                     │  opacity = directionalIntensity
├─────────────────────────────────────┤
│ Layer 3: 环境光 (中心漫射)          │  radial-gradient circle 50% 50%
│                                     │  opacity = ambientIntensity
├─────────────────────────────────────┤
│ Layer 4: 阴影遮罩                   │  inset box-shadow
│                                     │  rgba(0,0,0, shadowOpacity)
├─────────────────────────────────────┤
│ Layer 5: 高光反射                   │  linear-gradient 225° 白色微光
├─────────────────────────────────────┤
│ Layer 6: 天花板灯 (阴天/雨天/雪天)  │  radial-gradient 50% 0%
├─────────────────────────────────────┤
│ Layer 7: 雾气效果 (天气)            │  双 radial-gradient 混合
└─────────────────────────────────────┘
```

#### 3.3.3 天气-光照混合

天气对光照的影响通过 `transitionProgress` 和 `intensity` 两个参数进行混合：

```typescript
effectiveShadowOpacity = baseShadowOpacity + weatherConfig.shadowOpacity × intensity × t
effectiveAmbientIntensity = baseAmbient × (1 - t × (1 - windowLightIntensity) × intensity × 0.5)
effectiveDirectionalIntensity = baseDirectional × (1 - t × (1 - windowLightIntensity) × intensity × 0.6)
```

颜色混合使用 [lerpColor](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/Lighting.tsx#L64-L75) 函数，对时间光照色和天气光照色进行线性插值（RGB 空间）。

### 3.4 天气特效系统

天气特效在 [WeatherEffects.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/WeatherEffects.tsx) 中实现，独立于办公室场景，位于最顶层（z-index: 3）。

#### 3.4.1 粒子系统设计

| 天气 | 粒子类型 | 数量 | 动画方式 | 参数 |
|------|----------|------|----------|------|
| ☀️ 晴天 | 太阳光晕 | 1 | radial-gradient + conic-gradient | 光晕 + 光线 + 窗户光带 |
| ⛅ 多云 | 云朵 | 8×intensity | CSS 动画水平移动 | 4 层圆形叠加 + blur |
| 🌧️ 雨天 | 雨滴 | 120×intensity | CSS `@keyframes` 垂直下落 | 0.5~0.9s 宽1~2.5px 高15~40px |
| ❄️ 雪天 | 雪花 | 100×intensity | CSS `@keyframes` 飘落 + 摇摆 | 4~9s 大小2.5~8px sway=-30~30px |

**关键设计模式：**
- 粒子数据通过 `useMemo` 缓存，仅当 `intensity` 变化时重新生成
- 每个粒子有独立的随机属性（位置、速度、大小、延迟），通过内联 `style` 设置
- 动画完全由 CSS `@keyframes` 驱动，避免 JS 动画循环的性能开销

#### 3.4.2 雨天附加效果

- **闪电效果**：全屏白色覆盖层 + CSS 动画随机闪烁
- **窗户雾气**：多层 gradient 模拟水汽凝结
- **环境色调偏移**：灰蓝色覆盖层 `rgba(70, 85, 110, 0.12×intensity)`

#### 3.4.3 天气过渡动画

天气切换通过 `requestAnimationFrame` 驱动的渐进过渡实现（[useWeatherSimulation](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useWeatherSimulation.ts#L115-L139)）：

```
transitionProgress: 0 ────────→ 1
                   旧天气        新天气
                   duration: 2000~3000ms
```

自动天气切换基于加权随机池 `['sunny'×3, 'cloudy'×2, 'rainy', 'snowy']`，确保晴天出现概率最高。

### 3.5 办公室布局渲染

办公室布局在 [OfficeLayout.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/OfficeLayout.tsx) 中实现，采用组件化渲染策略。

#### 3.5.1 组件层次

```
OfficeLayout
├── FloorPattern          地板纹理 (6种图案)
├── Walls                 墙壁 + 窗户
├── Desk[]                工位 (桌面+侧面+显示器+椅子)
├── MeetingRoom           会议室 (围栏+桌子+椅子)
├── KitchenArea           茶水间 (柜台+咖啡机+水池)
├── Printer               打印机
├── ACUnit                空调 + 天花板灯 (4种灯型)
├── Door                  门 (主题色)
├── Plant[]               植物 (3种尺寸)
└── ExtraObject[]         额外装饰物
    ├── bookshelf         书架
    ├── painting          画作
    ├── rug               地毯
    ├── lamp              灯具 (pendant/chandelier)
    └── decoration        装饰 (exposed-pipe/bamboo/neon)
```

#### 3.5.2 3D 效果实现策略

所有家具通过 **CSS 3D Transform** 实现立体感，核心技巧：

1. **桌面**：`translateZ(6px)` 将桌面提升到 Z 轴上方
2. **桌面侧面**：`rotateX(-90deg)` 将侧面元素绕 X 轴旋转 90° 竖起
3. **显示器**：`translateZ(10px)` 在桌面之上
4. **阴影**：`box-shadow: 0 2px 8px rgba(0,0,0,0.15)` 模拟

```
侧面 (rotateX-90°)
  │
  ├────────── 桌面 (translateZ 6px)
  │           │
  │           ├── 显示器 (translateZ 10px)
  │           │
  │           └── 椅子 (translateZ 3px)
  │
  └── 地板 (translateZ 0px)
```

#### 3.5.3 主题系统

6 种办公室主题（[officeThemes.ts](file:///Users/tog/Desktop/code/solo/xyj-135/src/data/officeThemes.ts)），每种主题定义了完整的地板/墙壁/窗户/家具/布局参数：

| 主题 | 地板 | 天花板灯 | 特色 |
|------|------|----------|------|
| modern | wood-plank | recessed | 简约现代 |
| industrial | concrete | track | 裸露管道 |
| scandinavian | herringbone | pendant | 北欧简约 |
| japanese | tatami | chandelier | 和风禅意 |
| creative | carpet | track | 彩色创意 |
| classic | tile | chandelier | 传统经典 |

主题支持**自定义覆盖**，通过 `customization` 状态层实现基础主题 + 用户定制的合并（[getCustomizedTheme](file:///Users/tog/Desktop/code/solo/xyj-135/src/store/useOfficeStore.ts#L387-L424)）。

### 3.6 角色渲染系统

角色渲染在 [ColleagueAvatar.tsx](file:///Users/tog/Desktop/code/solo/xyj-135/src/components/office/ColleagueAvatar.tsx) 中实现，采用 **CSS 3D + 纯 DOM** 方案渲染像素风格的小人。

#### 3.6.1 角色结构

```
ColleagueAvatar
├── 头部 (12×12px 圆形)
│   ├── 头发 (7种发型: short/medium/long/curly/bald/ponytail/bun)
│   ├── 眼睛 (2个圆点)
│   └── 嘴巴 (状态驱动大小变化)
├── 右臂 (4×10px, 关节旋转)
│   └── [咖啡杯 / 拿纸]
├── 左臂 (4×10px, 关节旋转)
├── 身体 (14×16px, 衬衫色)
├── 腿部 (10×8px, 关节旋转)
├── 状态图标
│   ├── 💬 交谈气泡 (3个跳动圆点)
│   ├── 👋 问候手势
│   ├── ☕ 咖啡 / 休息
│   ├── 📄 打印
│   └── 💼 会议
├── 名牌
└── 影子 (模糊椭圆)
```

#### 3.6.2 动画系统

角色动画通过 `requestAnimationFrame` 驱动的正弦波运动实现：

```typescript
const bounceOffset = isWalking ? sin(animOffset) × 2 : 0     // 行走弹跳
const legPhase = sin(animOffset × 2)                           // 腿部摆动
const bodyTilt = isWalking ? sin(animOffset × 1.5) × 3 : 0    // 身体倾斜
const armSwing = isWalking ? sin(animOffset × 2) × 15 : 0     // 手臂摆动
const drinkSipPhase = sin(actionAnimOffset × 3)                // 喝咖啡
const greetWavePhase = sin(actionAnimOffset × 6)               // 挥手
```

**Z 排序**：角色通过 `zIndex = Math.floor(position.y × 10) + 10000` 实现基于 Y 坐标的前后遮挡关系，越靠下（Y 越大）的角色渲染在越上层。

**3D 变换**：角色通过 `rotateZ(45deg) rotateX(-60deg) translateZ(50px)` 与等轴测视角对齐。

### 3.7 同事 AI 驱动系统

同事行为由 [useColleagueAI](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useColleagueAI.ts) 驱动，实现了一个基于**有限状态机 + 行为概率**的 AI 系统。

#### 3.7.1 状态机

```
                          ┌──────────┐
                 arrive   │          │  leave
            ┌────────────→│  away    │←──────────┐
            │             │          │            │
            │             └────┬─────┘            │
            │                  │ arrive           │ after-leave
            │                  ▼                  │
            │             ┌──────────┐            │
            │             │ walking  │←──────────┐│
            │             │ (过渡态) │           ││
            │             └──┬───┬──┘           ││
            │      到达工位 │   │ 到达目标      ││
            │                ▼   ▼               ││
            │          ┌──────┐ ┌────────────┐  ││
            │          │working│ │drinking-coffee│ ││
            │          │      │ │(厨房位置)  │  ││
            │          └──┬───┘ └─────┬──────┘  ││
            │             │概率触发     │超时     ││
            │             ▼            │         ││
            │     ┌──────────────┐     │         ││
            │     │概率选择行为   │     │         ││
            │     ├─ go-coffee   │─────┘         ││
            │     ├─ go-printer  │──→ printing    ││
            │     ├─ go-meeting  │──→ in-meeting  ││
            │     └─ greet/talk  │──→ greeting    ││
            │            │                      ││
            │            └───── walking ─────────┘│
            │                                   ││
            └─── lunch ──→ resting ──→ walking ──┘│
                                              leave
```

#### 3.7.2 行为概率系统

每个同事有独立的**行为偏好参数**（`behaviorPreferences`），结合当前时段的活动水平计算行为触发概率：

```typescript
coffeeProb = getCoffeeProbability(hour, pref.coffeeFrequency) × activityLevel
printProb  = getPrintProbability(hour, pref.printFrequency)  × activityLevel
meetingProb = getMeetingProbability(hour, pref.meetingFrequency) × activityLevel
talkProb   = 0.06 × pref.talkativeness × activityLevel
```

**活动水平（[getActivityLevel](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useColleagueAI.ts#L27-L36)）** 随时间变化：

| 时段 | 活动水平 |
|------|---------|
| 8-10点 | 0.5 |
| 10-12点 | 1.0 (高峰) |
| 12-13点 | 0.3 (午休) |
| 13-15点 | 0.85 |
| 15-17点 | 1.0 (高峰) |
| 17-18点 | 0.7 |
| 18-19点 | 0.4 |
| 其他 | 0.1 |

#### 3.7.3 移动系统

角色移动使用**直线插值**（[moveToward](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useColleagueAI.ts#L12-L25)），不同状态下的速度系数不同：

| 状态 | 速度系数 |
|------|---------|
| walking / talking / greeting | `speed × deltaSeconds × 25` |
| resting / drinking-coffee | `speed × deltaSeconds × 20` |
| printing / in-meeting (未到目标) | `speed × deltaSeconds × 25` |
| working (回工位) | `speed × deltaSeconds × 30` |

### 3.8 时间模拟系统

时间模拟在 [useTimeSimulation](file:///Users/tog/Desktop/code/solo/xyj-135/src/hooks/useTimeSimulation.ts) 中实现，使用 `requestAnimationFrame` 驱动：

```typescript
deltaMinutes = (now - lastTime) / 1000 × time.speed
updateTime(deltaMinutes)
```

支持 0~100 倍速和暂停，时间推进影响：
- 同事调度（到岗/午餐/离岗）
- 光照变化（5个时段）
- 天气自动切换

---

## 四、数据流与状态管理

### 4.1 Zustand Store 架构

全局状态集中在 [useOfficeStore](file:///Users/tog/Desktop/code/solo/xyj-135/src/store/useOfficeStore.ts)，主要分为 7 个领域：

```
useOfficeStore
├── 视角状态     listenerPosition / zoom / currentView
├── 音频状态     masterVolume / isMuted / isPlaying / audioSources
├── 同事状态     colleagues / colleagueSoundEvents
├── 时间状态     time (hour/minute/day/speed/isPaused/timeOfDay)
├── 天气状态     weather (current/previous/transitionProgress/intensity/isAutoMode)
├── 主题状态     currentTheme / customization
└── UI 状态      showControlPanel / showViewSelector
```

### 4.2 核心数据流

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Action │────→│    Store     │────→│   React UI   │
│  (拖动/点击)  │     │  (Zustand)   │     │  (渲染更新)   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────┴───────┐
                     │  Hooks 读取   │
                     │  Store 状态   │
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
      useAudioEngine  useColleagueAI  useWeatherSim
      (音频调度)      (AI行为驱动)   (天气过渡)
              │             │             │
              └─────────────┼─────────────┘
                            │
                     ┌──────▼───────┐
                     │  反写 Store   │
                     │  (位置/状态)  │
                     └──────────────┘
```

---

## 五、技术特点与设计决策

### 5.1 为什么选择 CSS 3D 而非 WebGL

| 维度 | CSS 3D Transform | WebGL (Three.js 等) |
|------|-----------------|---------------------|
| 开发成本 | 低，React 组件直接映射 | 高，需建模/材质/相机系统 |
| 性能 | 适合有限元素 (<100) | 适合大量元素 (>1000) |
| 可访问性 | DOM 元素可交互/可选中 | Canvas 像素，需额外处理 |
| 调试 | Chrome DevTools 直接检查 | 需专用调试工具 |
| 适用场景 | 简单等轴测/2.5D | 复杂 3D 场景 |

本系统选择 CSS 3D 的原因：办公室场景元素有限（~50个），等轴测视角不需要真正的 3D 渲染管线，CSS 3D 可以在保持开发效率的同时提供足够的视觉深度感。

### 5.2 为什么选择程序化音频合成

| 维度 | 程序化合成 | 音频文件 |
|------|-----------|---------|
| 体积 | 0 KB | 数 MB |
| 随机性 | 每次生成不同 | 固定波形 |
| 参数化 | 可动态调整频率/时长 | 不可变 |
| 质量 | 受限于合成算法 | 可达到录音级别 |
| 延迟 | 无加载延迟 | 需预加载 |

程序化合成的核心优势在于**零资源加载 + 天然随机性**，使键盘声每次都略有不同，增强了真实感。代价是合成质量不如真实录音，但对于环境音效而言足够。

### 5.3 架构局限性

1. **空间音频仅支持立体声**：使用 `StereoPannerNode` 只能实现左右声道差异，无法实现真正的前后/高低方向感。若需完整 3D 空间音频，应使用 `PannerNode` + `AudioListener`
2. **线性距离衰减**：不遵循物理声学 `1/r²` 规律，远距离声音偏大
3. **CSS 3D 性能瓶颈**：大量元素或复杂 transform 会导致 GPU 合成层过多
4. **同事 AI 无协作**：每个同事独立决策，无社会关系网络
5. **无持久化**：所有状态仅在内存中，刷新即丢失
