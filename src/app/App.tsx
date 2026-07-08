import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlogSection from './components/BlogSection';
import AboutSection from './components/AboutSection';
import PublishSection from './components/PublishSection';
import AIChatSection from './components/AIChatSection';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../hooks/useConfig';
import { useAuth } from '../hooks/useAuth';
import { useTags } from '../hooks/useTags';

export default function App() {
  const [activeSection, setActiveSection] = useState('blog');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 从后端加载配置 & 认证
  const { configJson } = useConfig();
  const auth = useAuth();
  const { tags } = useTags();

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 应用后端主题配置到 CSS 变量
  useEffect(() => {
    if (!configJson) return;
    const root = document.documentElement;
    const t = configJson.theme;
    root.style.setProperty('--color-primary', t.primary_color);
    root.style.setProperty('--color-background', t.background_color);
    root.style.setProperty('--color-foreground', t.text_color);
    root.style.setProperty('--color-muted-foreground', t.secondary_text_color);
    root.style.setProperty('--color-border', t.border_color);
  }, [configJson]);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'blog':
        return <BlogSection />;
      case 'about':
        return <AboutSection auth={auth} />;
      case 'publish':
        return <PublishSection auth={auth} tags={tags} />;
      case 'ai-chat':
        return <AIChatSection />;
      default:
        return <BlogSection />;
    }
  };

  return (
    <div className="relative min-h-screen grain bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.14),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#fcfaff_45%,_#f3f7ff_100%)] text-foreground transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.2),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-blue-500/[0.04] dark:bg-blue-400/[0.06] blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-violet-500/[0.04] dark:bg-violet-400/[0.06] blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: '3s' }} />
        <div className="absolute -bottom-1/4 left-1/3 w-[40vw] h-[40vw] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-400/[0.05] blur-[100px] animate-[pulse_12s_ease-in-out_infinite]" style={{ animationDelay: '6s' }} />
      </div>
      <div className="relative z-10">
      {/* Header */}
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        user={auth.user}
        isLoggedIn={auth.isLoggedIn}
      />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      </div>{/* z-10 wrapper */}
      {/* Footer */}
      <Footer configJson={configJson} />
    </div>
  );
}
