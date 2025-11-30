import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { Menu, Instagram, Twitter, Mail, Linkedin, X, MoveDown, Cpu, Globe } from 'lucide-react';
import Scene3D from './components/Scene3D';
import PixelBackground from './components/PixelBackground';
import ProjectCard from './components/ProjectCard';
import ChatWidget from './components/ChatWidget';
import { Project } from './types';

// Mock Data
const projects: Project[] = [
  {
    id: 1,
    title: "NEON PROTOCOL",
    category: "Character Design",
    imageUrl: "https://picsum.photos/1000/800?random=1",
    description: "Cyberpunk samurai character series.",
    gridSpan: 2
  },
  {
    id: 2,
    title: "VOID RUNNER",
    category: "Environment",
    imageUrl: "https://picsum.photos/800/1000?random=2",
    description: "Procedurally generated infinite runner environments.",
    gridSpan: 1
  },
  {
    id: 3,
    title: "PIXEL DUNGEON",
    category: "UI/UX",
    imageUrl: "https://picsum.photos/800/800?random=3",
    description: "Retro-modern interface design.",
    gridSpan: 1
  },
  {
    id: 4,
    title: "MECHA SOUL",
    category: "3D Modeling",
    imageUrl: "https://picsum.photos/800/800?random=4",
    description: "High-poly mecha designs.",
    gridSpan: 1
  },
   {
    id: 5,
    title: "GLITCH CITY",
    category: "Concept Art",
    imageUrl: "https://picsum.photos/1000/600?random=5",
    description: "Atmospheric concept pieces exploring urban decay.",
    gridSpan: 2
  }
];

// --- LOCALIZATION DATA ---
type Language = 'en' | 'zh';

const content = {
  en: {
    nav: { home: 'HOME', work: 'WORK', logs: 'LOGS', contact: 'CONTACT' },
    hero: {
      role: 'DIGITAL ARCHITECT',
      desc: 'SPECIALIZING IN GAMEPLAY SYSTEMS, AI INTEGRATION, AND IMMERSIVE XR EXPERIENCES.',
      scroll: 'SCROLL'
    },
    logs: {
      title: 'SYSTEM LOGS',
      highlights: {
        title: 'HIGHLIGHTS',
        coreStack: 'CORE STACK',
        coreStackVal: 'C++ / Lua / Python / Unity / UE5',
        languages: 'LANGUAGES',
        languagesVal: 'CET-6 / Full English Dev Environment',
        openSource: 'OPEN SOURCE',
        openSourceVal: 'AI Agent Architecture / Local LLM / ChatBot Maintainer (2k+ users)',
        statusTitle: 'LATEST STATUS',
        statusText: 'Participated in MetaXR UE5.6 adapter fix. Developed AI+VR game prototype with 100+ community stars.'
      },
      projectAlpha: {
        title: 'Project Alpha: MR Romance',
        subtitle: 'TECH DEMO',
        desc: 'Independent design and development of an immersive romance game based on the Quest 3 (MR) platform. Constructed a virtual character framework integrating voice recognition, LLM dialogue, TTS generation, long-term memory, and 3D interaction.',
        platform: 'Quest 3 (MR)',
        stack: 'UE5 / C++ / Python',
        tech: 'LLM Agent / RAG / IK',
        details1Title: 'AI AGENT ARCHITECTURE',
        details1: [
          { label: 'Dual-Mode LLM:', text: 'Hybrid structure for local/cloud models to balance personalization and capability.' },
          { label: 'Multi-Agent System:', text: 'Decoupled logic into Dialogue, Memory, Background, and Level modules via specialized prompts.' },
          { label: 'Memory (Mem0):', text: 'Real-time summarization, storage, and retrieval for long-term character memory.' }
        ],
        details2Title: 'MULTIMODAL INTERACTION',
        details2: [
          { label: 'Full-Link Voice:', text: 'Whisper ASR + TTS + LipSync/Audio2Face for real-time emotive expression.' },
          { label: 'Generative Animation:', text: 'LLM-driven animation state machine mapping dialogue sentiment to actions.' },
          { label: 'Spatial IK:', text: 'Hand-tracking physics feedback and procedural hand-holding IK system.' }
        ]
      },
      exp1: {
        title: 'Top-Tier Mobile Title',
        date: '2025.7 - PRESENT',
        tags: ['UNITY ENGINEER', 'LUA', 'PERFORMANCE'],
        desc: 'Responsible for UI architecture iteration and performance optimization within the combat system. Ensured high-frequency interaction smoothness for a top-grossing chart-topping title.',
        sub1: 'COMBAT SYSTEM REFACTOR',
        text1: 'Reconstructed slot skill logic and cooldown visuals. Implemented new health bar interaction systems with performant animation logic.',
        sub2: 'PERFORMANCE ENGINEERING',
        text2: 'Utilized Profiler to target GC spikes. Optimized Lua-C# bridge overhead. Reduced UI Draw Calls by 80% through hierarchy restructuring and canvas splitting.'
      },
      exp2: {
        title: 'AI Virtual Human Lab',
        date: '2024.10 - 2025.7',
        tags: ['UE ENGINEER', 'TECH ANIM', 'DCC TOOLS'],
        desc: 'Founding engineer involved in the 0-to-1 development of an AI data-driven character system. Secured angel round funding.',
        sub1: 'ENGINE ANIMATION PIPELINE',
        text1: 'Built the pipeline for AI data (Bone/Face/Voice) to Engine reconstruction. Developed custom animation compression algorithms reducing memory usage by 80%.',
        sub2: 'DCC AUTOMATION',
        text2: 'Created Maya-UE bridge plugins for auto-rigging and Control Rig node generation, automating facial rig setups.',
        sub3: 'GAMEPLAY & 3C',
        text3: 'Implemented motion warping for precise interaction. Refined camera collision systems with spring arm damping.'
      }
    },
    work: {
      title: 'SELECTED'
    },
    contact: {
      title: 'CONNECT',
      subtitle: 'READY TO DEPLOY NEXT-GEN EXPERIENCES.',
      cta: 'INITIATE_CHAT'
    }
  },
  zh: {
    nav: { home: '首页', work: '作品', logs: '档案', contact: '联系' },
    hero: {
      role: '数字架构师',
      desc: '专注于玩法系统构建、AI整合工作流以及沉浸式XR体验开发。',
      scroll: '滑动'
    },
    logs: {
      title: '系统档案',
      highlights: {
        title: '个人亮点',
        coreStack: '技术基础',
        coreStackVal: '熟练使用 C++、Lua、Python，参与 IOS/Android 完整开发',
        languages: '学习热情',
        languagesVal: '密切关注科技动态，独立完成 Agent 搭建与本地模型部署',
        openSource: '开源贡献',
        openSourceVal: '维护 Chat Bot 开源项目 (2000+用户)，修复 MetaXR 适配',
        statusTitle: '最新状态',
        statusText: '近期开发 AI+VR 游戏点赞 100+，持续探索 AIGC 在游戏工作流中的应用。'
      },
      projectAlpha: {
        title: '基于MR平台的沉浸式恋爱游戏',
        subtitle: '技术演示',
        desc: '独立设计并开发基于Quest3（MR）平台的沉浸式恋爱游戏，旨在探索新一代AI技术在游戏领域的应用，成功构建一套集成语音识别、LLM对话、TTS语音生成、长期对话记忆、3D角色交互的虚拟角色框架。',
        platform: 'Quest 3 (MR)',
        stack: 'UE5 / C++ / Python',
        tech: 'LLM Agent / RAG / IK',
        details1Title: 'LLM 相关架构',
        details1: [
          { label: '模型部署:', text: '搭建支持本地与云端模型的双模结构。本地模型探索个性化，云端保证能力上限，灵活切换。' },
          { label: 'Agent架构:', text: '设计多Agent系统，拆解为对话、记忆、背景及关卡模块，通过配置Prompt大幅提升扮演效果。' },
          { label: '记忆模块:', text: '基于mem0框架实现对话内容的实时摘要、存储与检索，赋予角色长期记忆能力。' }
        ],
        details2Title: '多模态与空间交互',
        details2: [
          { label: '全链路语音:', text: '集成Whisper + TTS，结合Lip Sync/Audio2Face实现面部口型驱动与音色调节。' },
          { label: 'AI驱动动画:', text: '配置LLM根据对话内容提取情感与意图，通过状态机映射匹配动画资源。' },
          { label: '物理交互:', text: '基于Hand Tracking开发手势识别与物理反馈；基于IK算法实现牵手交互与跟随。' }
        ]
      },
      exp1: {
        title: '恋与深空 (Top-Tier Mobile Title)',
        date: '2025.7 - 当前',
        tags: ['UNITY 工程师', 'LUA', 'UI/Gameplay'],
        desc: '负责战斗系统框架内UI架构的功能迭代与性能优化，保证高频战斗场景下的UI交互流畅度。任职期间游戏获得2025年科隆最佳移动游戏。',
        sub1: '战斗系统与UI重构',
        text1: '重构战斗内Slot技能逻辑，扩展技能冷却表现；实现新血条系统与动效；重构技能状态切换与按键缓存机制，优化战斗手感。',
        sub2: '客户端性能优化',
        text2: '利用 Profiler 定位GC异常。优化 Lua-C# 调用模式降低开销。移除冗余 Canvas 与 ListView，减少 80% UI层级，大幅降低 Draw Call。'
      },
      exp2: {
        title: '米哈游鹿鸣 / AI Lab (Startup)',
        date: '2024.10 - 2025.7',
        tags: ['UE 工程师', '引擎动画', '移动端'],
        desc: '作为首位开发，参与项目从 0 到 1 的完整设计与实现，辅助AI数据驱动角色的全链路路线、引擎动画系统底层优化与3C交互体验打磨。',
        sub1: '引擎动画系统',
        text1: '搭建AI数据(骨骼/面部)到引擎的解析还原管线。编写动画压缩算法减少80%内存占用。利用多线程并行处理骨骼Track数据。',
        sub2: 'DCC工具链自动化',
        text2: '开发Maya-UE联动插件，导出骨骼数据并自动重建Control Rig节点，实现面部Rig引脚批量化自动配置。',
        sub3: '角色表现与3C',
        text3: '设计动画混合状态机融合大模型动作。集成Control Rig实现自动跟随与程序化修型。重构相机碰撞逻辑与背包数值系统。'
      }
    },
    work: {
      title: '精选作品'
    },
    contact: {
      title: '建立连接',
      subtitle: '准备好部署下一代体验了吗？',
      cta: '开启对话'
    }
  }
};

// --- ANIMATION CONFIG ---
const titleAnim: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } // "Expo Out" feel
  }
};

// --- COMPONENT: INTERACTIVE SPLIT TEXT ---
const SplitText: React.FC<{ text: string, className?: string, pixel?: boolean }> = ({ text, className, pixel }) => {
  return (
    <div className={`inline-flex overflow-hidden ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block origin-bottom ${char === ' ' ? 'w-[2vw]' : ''}`}
          whileHover={{ 
            y: -15, 
            scale: 1.1, 
            rotate: Math.random() * 5 - 2.5,
            color: "#444444",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('zh'); 
  const { scrollYProgress } = useScroll();
  
  // Parallax Logic
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  // Work section moves slightly UP relative to scroll (creates floating depth)
  const yWork = useTransform(scrollYProgress, [0.3, 1], [100, -100]); 
  // Contact section moves slightly DOWN/delayed (creates anchored depth)
  const yContact = useTransform(scrollYProgress, [0.7, 1], [-50, 50]);

  const t = content[lang];
  const isZh = lang === 'zh';

  return (
    <div className={`relative min-h-screen bg-[#FFFFFF] text-black overflow-x-hidden selection:bg-black selection:text-white ${isZh ? 'tracking-normal' : 'tracking-tight'}`}>
      <div className="noise-overlay"></div>
      <PixelBackground />
      
      {/* Floating Header - Glassmorphism Light */}
      <nav className="fixed top-6 right-6 z-50 pointer-events-auto flex gap-4">
        {/* Language Switcher */}
        <button 
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          className="bg-white/80 border border-[#E5E5E5] px-4 py-2 hover:bg-black hover:text-white transition-all rounded-full font-bold font-mono text-sm flex items-center gap-2 backdrop-blur-md shadow-sm"
        >
          <Globe size={16} />
          <span>{lang === 'en' ? 'ZH' : 'EN'}</span>
        </button>

        <button 
          onClick={() => setMenuOpen(true)}
          className="bg-white/80 border border-[#E5E5E5] p-3 hover:bg-black hover:text-white transition-all rounded-full backdrop-blur-md shadow-sm"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Fullscreen Menu - Pure Black High Contrast */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black text-white flex flex-col justify-center items-center"
          >
             <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                <X size={24} />
             </button>
             <div className="flex flex-col gap-4 text-center">
               {Object.entries(t.nav).map(([key, label]) => (
                  <a 
                    key={key}
                    href={`#${key}`} 
                    onClick={() => setMenuOpen(false)} 
                    className={`text-[12vw] font-bold leading-none tracking-tighter hover:text-gray-400 transition-all uppercase ${isZh ? 'font-black' : ''}`}
                  >
                    {label}
                  </a>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex flex-col items-start justify-center overflow-hidden px-6 md:px-12">
        {/* 3D Scene Background */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
          <Scene3D />
        </div>
        
        {/* Massive Typography Overlay */}
        <div className="relative z-10 w-full flex flex-col justify-center pointer-events-auto select-none text-black">
          <motion.div
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 1, ease: "circOut" }}
             className="flex flex-col items-start w-full"
          >
             <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 bg-black rounded-full shadow-lg" />
                <span className={`text-xs tracking-[0.3em] uppercase opacity-80 font-bold ${isZh ? '' : 'font-mono'}`}>{t.hero.role}</span>
            </div>

            <div className="text-[17vw] leading-[0.8] font-bold tracking-tighter font-['Space_Grotesk'] text-black mix-blend-multiply cursor-default">
              <SplitText text="DAMUE" />
            </div>
            
            <div className="flex items-baseline gap-4 ml-[1vw]">
               <div className="text-[17vw] leading-[0.8] font-bold tracking-tighter pixel-font text-black opacity-80 cursor-default">
                 <SplitText text="PORTFOLIO" />
               </div>
              <span className="hidden md:inline-block text-sm font-mono opacity-50 rotate-90 origin-left translate-y-8 text-black">V.2025 // MONOCHROME</span>
            </div>
            
            <div className={`mt-16 max-w-xl text-xl leading-relaxed pl-6 border-l-2 border-black ${isZh ? 'font-medium opacity-90' : 'font-mono opacity-70'}`}>
               {t.hero.desc}
            </div>

          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 z-20 text-black hidden md:flex items-center gap-4">
             <span className="font-mono text-xs opacity-50 tracking-widest">{t.hero.scroll}</span>
            <motion.div 
              style={{ rotate }}
              className="p-3 border border-black/10 rounded-full"
            >
               <MoveDown size={20} className="text-black" />
            </motion.div>
        </div>
      </section>

      {/* Resume / Logs Section - White Paper Style */}
      <section id="logs" className="relative z-10 bg-[#FAFAFA] text-black py-24 md:py-32 px-4 md:px-12 border-t border-[#E5E5E5]">
        <div className="max-w-[1920px] mx-auto">
          
          <div className="mb-24 flex items-baseline justify-between border-b border-[#E5E5E5] pb-4">
             <motion.h2 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-10%" }}
               variants={titleAnim}
               className={`text-[6vw] leading-none font-bold tracking-tighter uppercase ${isZh ? 'font-black' : ''}`}
             >
                {t.logs.title}
             </motion.h2>
             <span className="font-mono text-xs text-gray-400">SYS_ID: 8824_X</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Highlights Column */}
            <div className="lg:col-span-3 flex flex-col gap-12 sticky top-24 self-start">
               <div>
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2 pixel-font uppercase text-black"><Cpu size={20}/> {t.logs.highlights.title}</h3>
                  <ul className="space-y-8 text-sm">
                    <li className="flex flex-col gap-2">
                       <span className="font-bold text-gray-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.coreStack}</span>
                       <span className={`text-base text-black ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.coreStackVal}</span>
                    </li>
                     <li className="flex flex-col gap-2">
                       <span className="font-bold text-gray-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.languages}</span>
                       <span className={`text-base text-black ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.languagesVal}</span>
                    </li>
                     <li className="flex flex-col gap-2">
                       <span className="font-bold text-gray-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.openSource}</span>
                       <span className={`text-base text-black ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.openSourceVal}</span>
                    </li>
                  </ul>
               </div>
               
               <div className="p-6 bg-white border border-[#E5E5E5] shadow-sm">
                  <h4 className="font-bold mb-3 pixel-font text-xs uppercase tracking-widest text-white bg-black inline-block px-2 py-1">{t.logs.highlights.statusTitle}</h4>
                  <p className={`text-sm text-gray-600 leading-relaxed ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.statusText}</p>
               </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-9 space-y-32">
               
               {/* Technical Exploration */}
               <div className="group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                     <h3 className={`text-4xl md:text-5xl font-bold uppercase text-black ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>{t.logs.projectAlpha.title}</h3>
                     <span className="font-mono bg-black text-white px-3 py-1 text-xs font-bold tracking-widest">{t.logs.projectAlpha.subtitle}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mb-12 border-y border-[#E5E5E5] py-6">
                     <div className="col-span-1 space-y-1">
                        <div className="text-[10px] font-mono text-gray-400 tracking-widest">PLATFORM</div>
                        <div className="font-bold font-mono text-sm text-black">{t.logs.projectAlpha.platform}</div>
                     </div>
                     <div className="col-span-1 space-y-1">
                        <div className="text-[10px] font-mono text-gray-400 tracking-widest">STACK</div>
                        <div className="font-bold font-mono text-sm text-black">{t.logs.projectAlpha.stack}</div>
                     </div>
                     <div className="col-span-1 space-y-1">
                        <div className="text-[10px] font-mono text-gray-400 tracking-widest">KEY TECH</div>
                        <div className="font-bold font-mono text-sm text-black">{t.logs.projectAlpha.tech}</div>
                     </div>
                  </div>

                  <div className={`space-y-12 text-lg leading-relaxed text-gray-600 ${isZh ? 'text-justify' : ''}`}>
                     <p className="font-light text-2xl text-black">
                        {t.logs.projectAlpha.desc}
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-8 border border-[#E5E5E5] bg-white hover:border-black transition-colors shadow-sm">
                           <h4 className="font-bold mb-6 flex items-center gap-2 text-[10px] font-mono border-b border-[#F0F0F0] pb-2 text-black tracking-widest">
                             {t.logs.projectAlpha.details1Title}
                           </h4>
                           <ul className="space-y-6 text-base text-gray-600">
                              {t.logs.projectAlpha.details1.map((item, i) => (
                                <li key={i}><span className="font-bold text-black block mb-2 text-sm uppercase">{item.label}</span> {item.text}</li>
                              ))}
                           </ul>
                        </div>
                        <div className="p-8 border border-[#E5E5E5] bg-white hover:border-black transition-colors shadow-sm">
                           <h4 className="font-bold mb-6 flex items-center gap-2 text-[10px] font-mono border-b border-[#F0F0F0] pb-2 text-black tracking-widest">
                              {t.logs.projectAlpha.details2Title}
                           </h4>
                           <ul className="space-y-6 text-base text-gray-600">
                               {t.logs.projectAlpha.details2.map((item, i) => (
                                <li key={i}><span className="font-bold text-black block mb-2 text-sm uppercase">{item.label}</span> {item.text}</li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Experience 01 */}
               <div className="group relative pl-8 border-l border-[#E5E5E5] hover:border-black transition-colors">
                  
                   <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                     <h3 className={`text-4xl md:text-5xl font-bold uppercase text-black ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>{t.logs.exp1.title}</h3>
                     <span className="font-mono text-gray-400 text-sm whitespace-nowrap">{t.logs.exp1.date}</span>
                  </div>
                  <div className="mb-8 flex gap-3 flex-wrap font-mono text-xs">
                     {t.logs.exp1.tags.map((tag, i) => (
                        <span key={i} className="border border-[#E5E5E5] px-3 py-1 uppercase tracking-wider text-gray-500">{tag}</span>
                     ))}
                  </div>
                  <p className={`mb-12 text-xl font-light text-black opacity-90 ${isZh ? 'text-justify' : ''}`}>{t.logs.exp1.desc}</p>
                  
                  <div className="glass-panel p-8 space-y-8 bg-white/50">
                      <div>
                         <h4 className="font-bold mb-2 pixel-font text-xs text-black uppercase tracking-widest">{t.logs.exp1.sub1}</h4>
                         <p className="text-gray-600 leading-relaxed">{t.logs.exp1.text1}</p>
                      </div>
                      <div className="w-full h-[1px] bg-[#E5E5E5]"></div>
                      <div>
                         <h4 className="font-bold mb-2 pixel-font text-xs text-black uppercase tracking-widest">{t.logs.exp1.sub2}</h4>
                         <p className="text-gray-600 leading-relaxed">{t.logs.exp1.text2}</p>
                      </div>
                  </div>
               </div>

                {/* Experience 02 */}
               <div className="group relative pl-8 border-l border-[#E5E5E5] hover:border-black transition-colors">
                  
                   <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                     <h3 className={`text-4xl md:text-5xl font-bold uppercase text-black ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>{t.logs.exp2.title}</h3>
                     <span className="font-mono text-gray-400 text-sm whitespace-nowrap">{t.logs.exp2.date}</span>
                  </div>
                  <div className="mb-8 flex gap-3 flex-wrap font-mono text-xs">
                     {t.logs.exp2.tags.map((tag, i) => (
                        <span key={i} className="border border-[#E5E5E5] px-3 py-1 uppercase tracking-wider text-gray-500">{tag}</span>
                     ))}
                  </div>
                  <p className={`mb-12 text-xl font-light text-black opacity-90 ${isZh ? 'text-justify' : ''}`}>{t.logs.exp2.desc}</p>
                  
                  <div className="glass-panel p-8 space-y-8 bg-white/50">
                      <div>
                         <h4 className="font-bold mb-2 pixel-font text-xs text-black uppercase tracking-widest">{t.logs.exp2.sub1}</h4>
                         <p className="text-gray-600 leading-relaxed">{t.logs.exp2.text1}</p>
                      </div>
                      <div className="w-full h-[1px] bg-[#E5E5E5]"></div>
                      <div>
                         <h4 className="font-bold mb-2 pixel-font text-xs text-black uppercase tracking-widest">{t.logs.exp2.sub2}</h4>
                         <p className="text-gray-600 leading-relaxed">{t.logs.exp2.text2}</p>
                      </div>
                      {t.logs.exp2.sub3 && (
                        <>
                        <div className="w-full h-[1px] bg-[#E5E5E5]"></div>
                        <div>
                           <h4 className="font-bold mb-2 pixel-font text-xs text-black uppercase tracking-widest">{t.logs.exp2.sub3}</h4>
                           <p className="text-gray-600 leading-relaxed">{t.logs.exp2.text3}</p>
                        </div>
                        </>
                      )}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* Work Grid with Parallax */}
      <section id="work" className="relative z-10 py-32 px-4 md:px-12 max-w-[1920px] mx-auto bg-[#FFFFFF]">
        <motion.div style={{ y: yWork }}>
            <div className="mb-24 flex items-end gap-6">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={titleAnim}
                className="text-[10vw] leading-none font-bold tracking-tighter uppercase text-black"
              >
                {t.work.title}
              </motion.h2>
              <div className="w-4 h-4 bg-black mb-[2vw] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
        </motion.div>
      </section>

      {/* Contact Section with Parallax */}
      <section id="contact" className="relative z-10 py-32 px-6 flex flex-col items-center text-center bg-[#FAFAFA] text-black border-t border-[#E5E5E5]">
        <motion.div style={{ y: yContact }} className="flex flex-col items-center w-full">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={titleAnim}
              className="text-[12vw] leading-none font-bold tracking-tighter mb-4 text-black uppercase"
            >
              {t.contact.title}
            </motion.h2>
            <p className={`text-2xl md:text-3xl mb-16 max-w-2xl font-light opacity-60 text-black ${isZh ? 'font-medium' : 'font-sans'}`}>
              {t.contact.subtitle}
            </p>
            
            <a href="mailto:hello@damue.dev" className="group relative inline-block mb-32">
               <div className="relative border border-black bg-white text-black text-4xl md:text-6xl px-16 py-8 font-bold hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-tight shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[4px]">
                 {t.contact.cta}
               </div>
            </a>

            <div className="flex gap-8 mb-24">
              {[Instagram, Twitter, Linkedin, Mail].map((Icon, i) => (
                 <a key={i} href="#" className="p-4 border border-[#E5E5E5] hover:bg-black hover:text-white hover:border-black transition-all rounded-full">
                    <Icon size={24} strokeWidth={1.5} />
                 </a>
              ))}
            </div>
            
            <footer className="w-full border-t border-[#E5E5E5] py-12 flex flex-col md:flex-row justify-between px-12 opacity-40 text-xs font-mono tracking-widest text-gray-500">
              <span>© 2025 DAMUE PORTFOLIO</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                SYSTEM_ONLINE
              </span>
            </footer>
        </motion.div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default App;