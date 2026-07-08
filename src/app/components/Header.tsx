import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AuthUser } from '../../types';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (s: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
}

const navItems = [
  { id: 'blog', label: '博客', icon: '📝' },
  { id: 'about', label: '关于', icon: '👤' },
  { id: 'publish', label: '发布', icon: '✍️' },
  { id: 'ai-chat', label: 'AI', icon: '🤖' },
];

export default function Header({ activeSection, onSectionChange, isDarkMode, onThemeToggle, user, isLoggedIn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/40 bg-background/70 backdrop-blur-2xl shadow-sm'
          : 'border-transparent bg-background/50 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => onSectionChange('blog')}
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 shadow-lg shadow-blue-500/20">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight">{user?.username || 'Lemon'}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">C++ / 后端 / 数据库</p>
            </div>
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {isLoggedIn && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'L'}
                </div>
                <span className="text-xs text-muted-foreground">{user?.username}</span>
              </div>
            )}

            <button
              onClick={onThemeToggle}
              className="w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t"
            >
              <nav className="py-3 space-y-1">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { onSectionChange(item.id); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
