import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { List, Envelope, X, ArrowDown, Cpu, Globe, GithubLogo, MonitorPlay, Sun, Moon, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import Scene3D from './components/Scene3D';
import PixelBackground from './components/PixelBackground';
import { getAllPosts, type BlogPost } from './lib/posts';

// --- LOCALIZATION ---
type Language = 'en' | 'zh';

const content = {
  en: {
    nav: { home: 'HOME', logs: 'LOGS', blog: 'BLOG' },
    hero: {
      role: 'Game Engineer & Designer',
      desc: 'FOCUSED ON THE INTEGRATION OF AI AND GAMES, AS WELL AS THE DEVELOPMENT OF IMMERSIVE XR EXPERIENCES.',
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
        title: 'TOP AI COMPANION MOBILE GAME',
        date: '2025.7 - PRESENT',
        tags: ['UNITY ENGINEER', 'LUA', 'PERFORMANCE'],
        desc: 'Responsible for UI architecture iteration and performance optimization within the combat system. Ensured high-frequency interaction smoothness for a top-grossing chart-topping title.',
        sub1: 'COMBAT SYSTEM REFACTOR',
        text1: 'Reconstructed slot skill logic and cooldown visuals. Implemented new health bar interaction systems with performant animation logic.',
        sub2: 'PERFORMANCE ENGINEERING',
        text2: 'Utilized Profiler to target GC spikes. Optimized Lua-C# bridge overhead. Reduced UI Draw Calls by 80% through hierarchy restructuring and canvas splitting.'
      },
      exp2: {
        title: 'TOP VIRTUAL GIRL AI LABORATORY STARTUP TEAM',
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
    blog: {
      title: 'BLOG',
      readMore: 'READ'
    },
    contact: {
      copyright: `\u00A9 2024-${new Date().getFullYear()} DAMUE`,
      status: 'SYSTEM_ONLINE'
    }
  },
  zh: {
    nav: { home: '首页', logs: '档案', blog: '博客' },
    hero: {
      role: '游戏工程师',
      desc: '专注于AI与游戏的融合以及沉浸式XR体验开发。',
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
        openSourceVal: '维护 Chat Bot 开源项目 (2000+用户)，参与修复 MetaXR 适配',
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
        title: '头部情感陪伴类移动游戏',
        date: '2025.7 - 当前',
        tags: ['UNITY 工程师', 'LUA', 'UI/Gameplay'],
        desc: '负责战斗系统框架内UI架构的功能迭代与性能优化，保证高频战斗场景下的UI交互流畅度。任职期间游戏获得2025年科隆最佳移动游戏。',
        sub1: '战斗系统与UI重构',
        text1: '重构战斗内Slot技能逻辑，扩展技能冷却表现；实现新血条系统与动效；重构技能状态切换与按键缓存机制，优化战斗手感。',
        sub2: '客户端性能优化',
        text2: '利用 Profiler 定位GC异常。优化 Lua-C# 调用模式降低开销。移除冗余 Canvas 与 ListView，减少 80% UI层级，大幅降低 Draw Call。'
      },
      exp2: {
        title: '头部虚拟人AI实验室创业团队',
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
    blog: {
      title: '个人博客',
      readMore: '阅读'
    },
    contact: {
      copyright: `\u00A9 2024-${new Date().getFullYear()} DAMUE`,
      status: '系统在线'
    }
  }
};

// --- ANIMATION ---
const titleAnim: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

// --- SPLIT TEXT ---
const SplitText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`inline-flex ${className ?? ''}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block origin-bottom ${char === ' ' ? 'w-[2vw]' : ''}`}
          whileHover={{
            y: -15,
            scale: 1.1,
            rotate: Math.random() * 5 - 2.5,
            color: isDark ? '#a1a1aa' : '#555555',
            transition: { type: 'spring', stiffness: 400, damping: 10 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

// --- BLOG CARD ---
const BlogCard: React.FC<{ post: BlogPost; index: number; readMore: string }> = ({ post, index, readMore }) => {
  const navigate = useNavigate();
  const isFirst = index === 0;
  return (
    <motion.article
      variants={staggerItem}
      className={`group cursor-pointer ${isFirst ? 'md:col-span-2' : ''}`}
      onClick={() => {
        sessionStorage.setItem('blogScrollY', String(window.scrollY));
        navigate(`/blog/${post.slug}`);
      }}
    >
      <div className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors duration-500 bg-white dark:bg-zinc-900/50 ${isFirst ? 'p-10 md:p-12' : 'p-8'}`}>
        {isFirst ? (
          /* First card: horizontal layout */
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1">
              <div className="flex gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500">{tag}</span>
                ))}
                <span className="text-[10px] font-mono text-zinc-400 ml-auto">{post.date}</span>
              </div>
              <div className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.95] mb-6 text-zinc-950 dark:text-zinc-50">
                <SplitText text={post.title} className="flex-wrap" />
              </div>
            </div>
            <div className="md:max-w-xs flex flex-col gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">{post.description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                {readMore} <ArrowRight size={12} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ) : (
          /* Normal cards: vertical layout */
          <>
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500">{tag}</span>
              ))}
              <span className="text-[10px] font-mono text-zinc-400 ml-auto">{post.date}</span>
            </div>
            <div className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-zinc-950 dark:text-zinc-50">
              <SplitText text={post.title} className="flex-wrap" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">{post.description}</p>
            <span className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
              {readMore} <ArrowRight size={12} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const t = content[lang];
  const isZh = lang === 'zh';
  const posts = getAllPosts();

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Restore scroll position when returning from blog post
  useEffect(() => {
    const savedY = sessionStorage.getItem('blogScrollY');
    if (savedY) {
      // Use requestAnimationFrame to ensure DOM is rendered
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedY, 10));
      });
      sessionStorage.removeItem('blogScrollY');
    }
  }, []);

  // Scroll to section (replaces hash anchors for compatibility with HashRouter)
  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <div className={`relative min-h-[100dvh] bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-x-hidden selection:bg-zinc-950 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 ${isZh ? 'tracking-normal' : 'tracking-tight'}`}>
      <div className="noise-overlay"></div>
      <PixelBackground />

      {/* --- FLOATING NAV --- */}
      <nav className="fixed top-6 right-6 z-50 pointer-events-auto flex gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-2.5 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full backdrop-blur-md shadow-sm"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
        </button>

        {/* Language */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 px-4 py-2 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full font-bold font-mono text-sm flex items-center gap-2 backdrop-blur-md shadow-sm"
        >
          <Globe size={16} weight="bold" />
          <span>{lang === 'en' ? 'ZH' : 'EN'}</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => setMenuOpen(true)}
          className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-2.5 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full backdrop-blur-md shadow-sm"
        >
          <List size={20} weight="bold" />
        </button>
      </nav>

      {/* --- FULLSCREEN MENU --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 p-4 border border-white/20 dark:border-zinc-950/20 rounded-full hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-4 text-center">
              {Object.entries(t.nav).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key)}
                  className={`text-[12vw] font-bold leading-none tracking-tighter hover:opacity-50 transition-all uppercase ${isZh ? 'font-black' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ HERO ============ */}
      <section id="home" className="relative min-h-[100dvh] flex flex-col items-start justify-center overflow-hidden px-6 md:px-12">
        {/* 3D Scene – receives pointer events */}
        <div className="absolute inset-0 z-0" style={{ touchAction: 'none' }}>
          <Scene3D />
        </div>

        {/* Typography overlay – pointer-events-none so 3D scene is interactive */}
        <div className="relative z-10 w-full flex flex-col justify-center pointer-events-none select-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'circOut' }}
            className="flex flex-col items-start w-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-zinc-950 dark:bg-zinc-50 rounded-full shadow-lg" />
              <span className={`text-xs tracking-[0.3em] uppercase opacity-80 font-bold ${isZh ? '' : 'font-mono'}`}>
                {t.hero.role}
              </span>
            </div>

            {/* Title text - pointer-events-auto for SplitText hover effects */}
            <div className="pointer-events-auto text-[17vw] leading-[0.8] font-bold tracking-tighter text-zinc-950 dark:text-zinc-50 cursor-default">
              <SplitText text="DAMUE" />
            </div>

            <div className="flex items-baseline gap-4 ml-[1vw]">
              <div className="pointer-events-auto text-[17vw] leading-[0.8] font-bold tracking-tighter pixel-font text-zinc-950/80 dark:text-zinc-50/80 cursor-default">
                <SplitText text="PORTFOLIO" />
              </div>
              <span className="hidden md:inline-block text-sm font-mono opacity-50 rotate-90 origin-left translate-y-8">
                V.2026
              </span>
            </div>

            <div className={`mt-16 max-w-xl text-xl leading-relaxed pl-6 border-l-2 border-zinc-950 dark:border-zinc-50 ${isZh ? 'font-medium opacity-90' : 'font-mono opacity-70'}`}>
              {t.hero.desc}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-4">
          <span className="font-mono text-xs opacity-50 tracking-widest">{t.hero.scroll}</span>
          <motion.div style={{ rotate }} className="p-3 border border-zinc-950/10 dark:border-zinc-50/10 rounded-full">
            <ArrowDown size={20} />
          </motion.div>
        </div>
      </section>

      {/* ============ RESUME / LOGS ============ */}
      <section id="logs" className="relative z-10 bg-zinc-50 dark:bg-zinc-900 py-24 md:py-32 px-4 md:px-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1920px] mx-auto">

          <div className="mb-24 flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              variants={titleAnim}
              className={`text-[6vw] leading-none font-bold tracking-tighter uppercase ${isZh ? 'font-black' : ''}`}
            >
              {t.logs.title}
            </motion.h2>
            <span className="font-mono text-xs text-zinc-400">SYS_ID: 8824_X</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Highlights Column */}
            <div className="lg:col-span-3 flex flex-col gap-12 sticky top-24 self-start">
              <div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 pixel-font uppercase">
                  <Cpu size={20} /> {t.logs.highlights.title}
                </h3>
                <ul className="space-y-8 text-sm">
                  <li className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.coreStack}</span>
                    <span className={`text-base ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.coreStackVal}</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.languages}</span>
                    <span className={`text-base ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.languagesVal}</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-400 text-[10px] font-mono tracking-widest uppercase">{t.logs.highlights.openSource}</span>
                    <span className={`text-base ${isZh ? 'font-medium' : ''}`}>{t.logs.highlights.openSourceVal}</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h4 className="font-bold mb-3 pixel-font text-xs uppercase tracking-widest text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-50 inline-block px-2 py-1">
                  {t.logs.highlights.statusTitle}
                </h4>
                <p className={`text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed ${isZh ? 'font-medium' : ''}`}>
                  {t.logs.highlights.statusText}
                </p>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-9 space-y-32">

              {/* Technical Exploration - Project Alpha */}
              <div className="group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                  <h3 className={`text-4xl md:text-5xl font-bold uppercase ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>
                    {t.logs.projectAlpha.title}
                  </h3>
                  <span className="font-mono bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 px-3 py-1 text-xs font-bold tracking-widest">
                    {t.logs.projectAlpha.subtitle}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12 border-y border-zinc-200 dark:border-zinc-800 py-6">
                  <div className="col-span-1 space-y-1">
                    <div className="text-[10px] font-mono text-zinc-400 tracking-widest">PLATFORM</div>
                    <div className="font-bold font-mono text-sm">{t.logs.projectAlpha.platform}</div>
                  </div>
                  <div className="col-span-1 space-y-1">
                    <div className="text-[10px] font-mono text-zinc-400 tracking-widest">STACK</div>
                    <div className="font-bold font-mono text-sm">{t.logs.projectAlpha.stack}</div>
                  </div>
                  <div className="col-span-1 space-y-1">
                    <div className="text-[10px] font-mono text-zinc-400 tracking-widest">KEY TECH</div>
                    <div className="font-bold font-mono text-sm">{t.logs.projectAlpha.tech}</div>
                  </div>
                </div>

                <div className={`space-y-12 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 ${isZh ? 'text-justify' : ''}`}>
                  <p className="font-light text-2xl text-zinc-950 dark:text-zinc-50">
                    {t.logs.projectAlpha.desc}
                  </p>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors shadow-sm">
                      <h4 className="font-bold mb-6 flex items-center gap-2 text-[10px] font-mono border-b border-zinc-100 dark:border-zinc-700 pb-2 tracking-widest">
                        {t.logs.projectAlpha.details1Title}
                      </h4>
                      <ul className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
                        {t.logs.projectAlpha.details1.map((item, i) => (
                          <li key={i}>
                            <span className="font-bold text-zinc-950 dark:text-zinc-50 block mb-2 text-sm uppercase">{item.label}</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors shadow-sm">
                      <h4 className="font-bold mb-6 flex items-center gap-2 text-[10px] font-mono border-b border-zinc-100 dark:border-zinc-700 pb-2 tracking-widest">
                        {t.logs.projectAlpha.details2Title}
                      </h4>
                      <ul className="space-y-6 text-base text-zinc-600 dark:text-zinc-400">
                        {t.logs.projectAlpha.details2.map((item, i) => (
                          <li key={i}>
                            <span className="font-bold text-zinc-950 dark:text-zinc-50 block mb-2 text-sm uppercase">{item.label}</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience 01 */}
              <div className="group relative pl-8 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                  <h3 className={`text-4xl md:text-5xl font-bold uppercase ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>
                    {t.logs.exp1.title}
                  </h3>
                  <span className="font-mono text-zinc-400 text-sm whitespace-nowrap">{t.logs.exp1.date}</span>
                </div>
                <div className="mb-8 flex gap-3 flex-wrap font-mono text-xs">
                  {t.logs.exp1.tags.map((tag, i) => (
                    <span key={i} className="border border-zinc-200 dark:border-zinc-800 px-3 py-1 uppercase tracking-wider text-zinc-500">{tag}</span>
                  ))}
                </div>
                <p className={`mb-12 text-xl font-light opacity-90 ${isZh ? 'text-justify' : ''}`}>{t.logs.exp1.desc}</p>

                <div className="glass-panel p-8 space-y-8">
                  <div>
                    <h4 className="font-bold mb-2 pixel-font text-xs uppercase tracking-widest">{t.logs.exp1.sub1}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.logs.exp1.text1}</p>
                  </div>
                  <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                  <div>
                    <h4 className="font-bold mb-2 pixel-font text-xs uppercase tracking-widest">{t.logs.exp1.sub2}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.logs.exp1.text2}</p>
                  </div>
                </div>
              </div>

              {/* Experience 02 */}
              <div className="group relative pl-8 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                  <h3 className={`text-4xl md:text-5xl font-bold uppercase ${isZh ? 'tracking-tight' : 'tracking-tighter'}`}>
                    {t.logs.exp2.title}
                  </h3>
                  <span className="font-mono text-zinc-400 text-sm whitespace-nowrap">{t.logs.exp2.date}</span>
                </div>
                <div className="mb-8 flex gap-3 flex-wrap font-mono text-xs">
                  {t.logs.exp2.tags.map((tag, i) => (
                    <span key={i} className="border border-zinc-200 dark:border-zinc-800 px-3 py-1 uppercase tracking-wider text-zinc-500">{tag}</span>
                  ))}
                </div>
                <p className={`mb-12 text-xl font-light opacity-90 ${isZh ? 'text-justify' : ''}`}>{t.logs.exp2.desc}</p>

                <div className="glass-panel p-8 space-y-8">
                  <div>
                    <h4 className="font-bold mb-2 pixel-font text-xs uppercase tracking-widest">{t.logs.exp2.sub1}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.logs.exp2.text1}</p>
                  </div>
                  <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                  <div>
                    <h4 className="font-bold mb-2 pixel-font text-xs uppercase tracking-widest">{t.logs.exp2.sub2}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.logs.exp2.text2}</p>
                  </div>
                  {t.logs.exp2.sub3 && (
                    <>
                      <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                      <div>
                        <h4 className="font-bold mb-2 pixel-font text-xs uppercase tracking-widest">{t.logs.exp2.sub3}</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.logs.exp2.text3}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOG (replaces WORK) ============ */}
      <section id="blog" className="relative z-10 py-24 md:py-32 px-4 md:px-12 max-w-[1920px] mx-auto">
        <div className="mb-24 flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            variants={titleAnim}
            className={`text-[6vw] leading-none font-bold tracking-tighter uppercase ${isZh ? 'font-black' : ''}`}
          >
            {t.blog.title}
          </motion.h2>
          <span className="font-mono text-xs text-zinc-400">BLOG_SYS</span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} readMore={t.blog.readMore} />
          ))}
        </motion.div>
      </section>

      {/* ============ CONTACT (minimized footer strip) ============ */}
      <section id="contact" className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/Damue01"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full"
            >
              <GithubLogo size={20} weight="regular" />
            </a>
            <a
              href="https://space.bilibili.com/5866300"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full"
            >
              <MonitorPlay size={20} weight="regular" />
            </a>
            <a
              href="mailto:damue0@outlook.com"
              className="p-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-full"
            >
              <Envelope size={20} weight="regular" />
            </a>
          </div>

          {/* Copyright + Status */}
          <div className="flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
            <span>{t.contact.copyright}</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {t.contact.status}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
