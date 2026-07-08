import { Github, Mail, MapPin, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import type { ConfigJson } from '../../types';

interface FooterProps { configJson: ConfigJson | null; }

const socials = [
  { icon: Github, href: 'https://github.com/shixuan', label: 'GitHub' },
  { icon: Mail, href: 'mailto:shixuan@whu.edu.cn', label: 'Email' },
];

export default function Footer({ configJson }: FooterProps) {
  const fc = configJson?.footer;
  const bg = fc?.background_color || '#0f172a';
  const tc = fc?.text_color || '#cbd5e1';
  const text = fc?.text || '© 2026 Lemon · Powered by DIY Engine';

  return (
    <footer className="mt-20" style={{ backgroundColor: bg, color: tc }}>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
              <span className="text-lg font-semibold text-white">Lemon's Blog</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">
              武汉大学计算机学院 · C++ / 后端 / 数据库 · DIY 排版引擎驱动
            </p>
            <div className="flex gap-2 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">导航</h4>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
              {['博客首页', '关于我', '文章归档', 'AI 助手', 'C++ 学习', '数据库设计'].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">订阅更新</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="你的邮箱" className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">订阅</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs opacity-50">
          <span dangerouslySetInnerHTML={{ __html: text }} />
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 hover:text-white transition-colors">
            <ArrowUp className="w-3 h-3" /> 回顶部
          </button>
        </div>
      </div>
    </footer>
  );
}
