import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Code, Coffee, BookOpen, Github, Mail, MapPin, Sparkles, PencilLine, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import type { AuthUser, PublicProfile } from '../../types';

interface AboutSectionProps {
  auth: {
    user: AuthUser | null;
    profile: PublicProfile | null;
    isLoggedIn: boolean;
    loading: boolean;
    updateProfile: (d: Record<string, unknown>) => Promise<unknown>;
  };
}

const skills = [
  { name: 'C++', level: 90, color: 'from-blue-500 to-cyan-400', icon: '⚡' },
  { name: 'Crow', level: 82, color: 'from-violet-500 to-purple-400', icon: '🐦' },
  { name: 'SQLite', level: 85, color: 'from-emerald-500 to-green-400', icon: '🗄️' },
  { name: 'Vue 3', level: 78, color: 'from-green-500 to-teal-400', icon: '💚' },
  { name: 'React', level: 72, color: 'from-cyan-500 to-blue-400', icon: '⚛️' },
  { name: 'TypeScript', level: 75, color: 'from-blue-600 to-indigo-400', icon: '🔷' },
  { name: 'Python', level: 70, color: 'from-amber-500 to-yellow-400', icon: '🐍' },
  { name: 'Git', level: 80, color: 'from-orange-500 to-red-400', icon: '📦' },
];

const interests = [
  { icon: Code, label: 'C++ 开发', color: 'bg-blue-500', desc: '热爱底层编程，享受掌控每一行代码的感觉' },
  { icon: BookOpen, label: '技术写作', color: 'bg-emerald-500', desc: '用文字沉淀思考，帮助更多人成长' },
  { icon: Coffee, label: '开源贡献', color: 'bg-amber-500', desc: '参与开源项目，与全球开发者协作' },
  { icon: Globe, label: 'Web 全栈', color: 'bg-violet-500', desc: '从数据库到前端，构建完整应用' },
];

function AnimatedProgress({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 200 + delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return (
    <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export default function AboutSection({ auth }: AboutSectionProps) {
  const { user, profile, isLoggedIn, loading, updateProfile } = auth;
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ nickname: '', bio: '', email: '', github: '', zhihu: '', location: '' });
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!init && profile) {
      setForm({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        email: (profile as any).email || '',
        github: profile.social_links?.github || '',
        zhihu: profile.social_links?.zhihu || '',
        location: '武汉大学',
      });
      setInit(true);
    }
  }, [profile, init]);

  const handleSave = async () => {
    try {
      await updateProfile({
        nickname: form.nickname,
        bio: form.bio,
        email: form.email,
        social_links: { github: form.github, zhihu: form.zhihu },
      });
      toast.success('已更新');
    } catch { toast.error('保存失败'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.nickname || user?.username || 'Lemon';
  const displayBio = profile?.bio || '武汉大学计算机学院 · C++ / 后端 / 数据库';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-12">
      {/* ───── Profile Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[40px] border border-border/40 bg-card p-0"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-[80px]" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <span className="text-4xl md:text-5xl font-bold text-white">{avatarLetter}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground mt-1 text-lg">{displayBio}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />武汉大学</span>
              {profile?.social_links?.github && (
                <a href={profile.social_links.github} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Github className="w-4 h-4" />GitHub
                </a>
              )}
              {profile?.resume_url && (
                <a href={profile.resume_url} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />简历
                </a>
              )}
            </motion.div>
          </div>

          {/* Edit button */}
          {isLoggedIn && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setActiveTab('edit')}>
                <PencilLine className="w-4 h-4 mr-1" />编辑
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ───── Stats Row ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: '学习阶段', value: '大一在读', icon: '🎓' },
          { label: '技术方向', value: 'C++ / AI', icon: '💻' },
          { label: '项目经验', value: '全栈博客', icon: '🚀' },
          { label: 'GitHub', value: user?.username || 'shixuan', icon: '⭐' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/40 bg-card p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ───── Tabs ───── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mx-auto rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl">概览</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl">技能</TabsTrigger>
            <TabsTrigger value="interests" className="rounded-xl">兴趣</TabsTrigger>
            {isLoggedIn && <TabsTrigger value="edit" className="rounded-xl">编辑</TabsTrigger>}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-8 space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
                  关于我
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>我是{displayName}，武汉大学计算机学院大一学生。从 Hello World 开始，逐渐爱上了 C++ 的高效与优雅。目前主攻 C++ Crow 框架后端开发，结合 Vue 3 / React 构建全栈应用。</p>
                <p>我相信好的代码和好的文章一样，都值得被认真地书写与分享。这个博客就是我记录学习历程、分享技术心得的空间。</p>
                <p>从数据库设计到后端 API，从 DIY 排版引擎到前端界面，每一个环节都是自己动手实现。希望我的分享能帮助同样在编程道路上前行的你。</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  当前专注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: '🚀 C++ 后端', items: ['Crow 框架深入', 'JWT 鉴权设计', 'SQLite 优化', 'RESTful API'] },
                    { title: '📝 内容创作', items: ['技术博客更新', '学习笔记', '开源项目', 'DIY 排版引擎'] },
                  ].map((c) => (
                    <div key={c.title} className="rounded-2xl bg-muted/40 p-4">
                      <h4 className="font-semibold mb-2">{c.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {c.items.map((i) => <li key={i}>· {i}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" className="mt-8">
            <Card className="border-0 shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
                  技术栈
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <span>{skill.icon}</span> {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <AnimatedProgress value={skill.level} color={skill.color} delay={i * 80} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interests */}
          <TabsContent value="interests" className="mt-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {interests.map(({ icon: Icon, label, color, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="border-0 shadow-sm rounded-3xl hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{label}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Edit Profile */}
          {isLoggedIn && (
            <TabsContent value="edit" className="mt-8">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle>编辑个人资料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-lg">
                  <div className="space-y-2"><Label>昵称</Label><Input value={form.nickname} onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>简介</Label><Textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} className="min-h-[80px]" /></div>
                  <div className="space-y-2"><Label>邮箱</Label><Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>GitHub URL</Label><Input value={form.github} onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>知乎 URL</Label><Input value={form.zhihu} onChange={(e) => setForm((p) => ({ ...p, zhihu: e.target.value }))} /></div>
                  </div>
                  <Button onClick={handleSave} className="rounded-xl">保存修改</Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}
