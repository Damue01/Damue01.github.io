import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { List, Envelope, X, ArrowDown, Globe, GithubLogo, MonitorPlay, Sun, Moon, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import Scene3D from './components/Scene3D';
import PixelBackground from './components/PixelBackground';
import { getAllPosts, type BlogPost } from './lib/posts';

// --- LOCALIZATION ---
type Language = 'en' | 'zh';

const content = {
  en: {
    nav: { home: 'HOME', blog: 'BLOG' },
    hero: {
      role: 'Notes & Explorations',
      desc: 'NOTES ON AI, GAMES, AND INTERACTIVE EXPERIENCES.',
      scroll: 'SCROLL'
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
    nav: { home: '首页', blog: '博客' },
    hero: {
      role: '记录与探索',
      desc: '记录 AI、游戏与交互体验相关的学习和探索。',
      scroll: '滑动'
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

