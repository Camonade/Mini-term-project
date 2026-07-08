import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { PenTool, Send, X, Eye, Save, Clock, Calendar, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createArticle, updateArticle, deleteArticle, autosaveArticle } from '../../api/articles';
import { setToken, clearToken } from '../../api/auth';
import { uploadImage } from '../../api/uploads';
import { useArticles } from '../../hooks/useArticles';
import { useConfig } from '../../hooks/useConfig';
import { updateConfig } from '../../api/config';
import type { TagWithCount, ArticleListItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import type { AuthUser, PublicProfile } from '../../types';

interface PublishSectionProps {
  auth: ReturnType<typeof useAuth>;
  tags: TagWithCount[];
}

const templates = [
  {
    id: 'tech',
    name: '技术文章',
    description: 'C++ / 后端 / 数据库技术分享',
    template: `# 标题

## 背景
在这里介绍技术背景...

## 核心内容

### 要点
- 要点1
- 要点2

\`\`\`cpp
// C++ 示例
#include <iostream>
int main() {
    std::cout << "Hello!" << std::endl;
    return 0;
}
\`\`\`

## 总结`
  },
  {
    id: 'life',
    name: '学习笔记',
    description: '学习总结和心得分享',
    template: `# 学习笔记

## 这个月学了什么
- 内容1
- 内容2

## 踩过的坑
在这里记录遇到的问题...

## 下一步计划
接下来要学习的方向...`
  },
  {
    id: 'diary',
    name: '随笔',
    description: '日常思考和感悟',
    template: `# 随笔标题

## 前言
记录当下的想法...

## 正文
展开你的思考...

## 结语
总结与展望...`
  }
];

export default function PublishSection({ auth, tags }: PublishSectionProps) {
  const { user, isLoggedIn, loading: authLoading } = auth;

  // ---- Auth form state ----
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // ---- Editor state ----
  const [activeTab, setActiveTab] = useState('editor');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [scheduledPublish, setScheduledPublish] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 自动保存（每 30 秒）
  useEffect(() => {
    if (!editingArticleId || !content.trim()) return;
    const timer = setInterval(() => {
      autosaveArticle(editingArticleId, { content, title, summary: content.slice(0, 150) })
        .then(() => console.log('自动保存成功'))
        .catch(() => {}); // 静默
    }, 30000);
    return () => clearInterval(timer);
  }, [editingArticleId, content, title]);

  // 粘贴图片上传
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        setUploading(true);
        try {
          const res = await uploadImage(file, 'content');
          const mdImg = `![](${res.data.url})`;
          setContent((prev) => prev + '\n' + mdImg + '\n');
          toast.success('图片已插入');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : '上传失败';
          toast.error(msg);
        } finally {
          setUploading(false);
        }
      }
    }
  };

  // ---- Drafts & Management from API ----
  const { configJson, refetch: refetchConfig } = useConfig();
  const { articles: drafts, refetch: refetchDrafts } = useArticles({ status: 'draft' });
  const { articles: allArticles, refetch: refetchAll } = useArticles({
    status: undefined as unknown as 'published',
    page_size: 100,
  });

  const wordCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error('请填写邮箱和密码');
      return;
    }
    if (authMode === 'register' && !authName.trim()) {
      toast.error('请填写昵称');
      return;
    }
    try {
      if (authMode === 'login') {
        await auth.login({ username: authEmail, password: authPassword });
      } else {
        await auth.register({ username: authEmail, password: authPassword, nickname: authName });
      }
      toast.success(authMode === 'login' ? '登录成功' : '注册成功');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '操作失败');
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('请至少填写标题');
      return;
    }
    setSubmitting(true);
    try {
      if (editingArticleId) {
        await updateArticle(editingArticleId, {
          title,
          content,
          summary: content.slice(0, 150),
          cover_url: coverImage || undefined,
          status: 'draft',
          tags: selectedTags,
        });
        toast.success('草稿已更新');
      } else {
        const res = await createArticle({
          title,
          content,
          summary: content.slice(0, 150),
          cover_url: coverImage || undefined,
          status: 'draft',
          tags: selectedTags,
        });
        setEditingArticleId(res.data.id);
        toast.success('草稿已保存');
      }
      refetchDrafts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('请填写标题和内容');
      return;
    }
    setSubmitting(true);
    try {
      if (editingArticleId) {
        await updateArticle(editingArticleId, {
          title,
          content,
          summary: content.slice(0, 200),
          cover_url: coverImage || undefined,
          status: 'published',
          tags: selectedTags,
        });
        toast.success('文章已更新发布');
      } else {
        await createArticle({
          title,
          content,
          summary: content.slice(0, 200),
          cover_url: coverImage || undefined,
          status: 'published',
          tags: selectedTags,
        });
        toast.success('文章已发布成功！');
      }
      // 重置
      setTitle('');
      setContent('');
      setCategory('');
      setSelectedTags([]);
      setCoverImage('');
      setEditingArticleId(null);
      refetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      toast.success('文章已删除');
      refetchDrafts();
      refetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '删除失败');
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setContent(template.template);
      toast.success(`已加载${template.name}模板`);
    }
  };

  const loadDraft = (draft: Article) => {
    setTitle(draft.title);
    setContent(draft.content || '');
    setCoverImage(draft.cover_url || '');
    setSelectedTags(draft.tags?.map((t) => t.id) || []);
    setEditingArticleId(draft.id);
    toast.success('草稿已加载');
    setActiveTab('editor');
  };

  const loadArticle = (article: Article) => {
    setTitle(article.title);
    setContent(article.content || '');
    setCoverImage(article.cover_url || '');
    setSelectedTags(article.tags?.map((t) => t.id) || []);
    setEditingArticleId(article.id);
    toast.success('文章已加载');
    setActiveTab('editor');
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'archived': return '已归档';
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-amber-600 bg-amber-50';
      case 'archived': return 'text-slate-500 bg-slate-100';
      default: return '';
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          创作发布
        </motion.h1>
        <motion.p
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          记录灵感，分享创作，让文字传递温度
        </motion.p>
      </div>

      {/* Auth + Overview cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <Card className="border-0 shadow-md">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              登录与注册
            </div>
            {!isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex rounded-full bg-muted p-1">
                  <button
                    className={`flex-1 rounded-full px-3 py-2 text-sm ${authMode === 'login' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setAuthMode('login')}
                  >
                    登录
                  </button>
                  <button
                    className={`flex-1 rounded-full px-3 py-2 text-sm ${authMode === 'register' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setAuthMode('register')}
                  >
                    注册
                  </button>
                </div>
                {authMode === 'register' && (
                  <Input placeholder="昵称" value={authName} onChange={(e) => setAuthName(e.target.value)} />
                )}
                <Input placeholder="用户名 / 邮箱" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                <Input type="password" placeholder="密码" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                <Button className="w-full" onClick={handleAuthSubmit}>
                  {authMode === 'login' ? '立即登录' : '创建账号'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user?.nickname?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.nickname || '用户'}</p>
                    <p className="text-sm text-muted-foreground">博主</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm">{user?.bio}</p>
                <Button variant="outline" size="sm" onClick={() => auth.logout()}>退出登录</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              内容管理概览
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-2xl font-semibold">{allArticles.length}</p>
                <p className="text-sm text-muted-foreground">文章总数</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-2xl font-semibold">{tags.length}</p>
                <p className="text-sm text-muted-foreground">分类标签</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Writing Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { value: wordCount, label: '字数统计', color: 'text-blue-600' },
          { value: readTime, label: '预计阅读(分钟)', color: 'text-green-600' },
          { value: selectedTags.length, label: '标签数量', color: 'text-purple-600' },
          { value: drafts.length, label: '草稿数量', color: 'text-orange-600' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center border-0 shadow-md">
            <CardContent className="pt-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="editor">编辑器</TabsTrigger>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="templates">模板</TabsTrigger>
            <TabsTrigger value="drafts">草稿</TabsTrigger>
            <TabsTrigger value="management">管理</TabsTrigger>
            <TabsTrigger value="config">排版</TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PenTool className="w-5 h-5 text-green-500" />
                        <span>编辑器 {editingArticleId && <span className="text-sm text-muted-foreground">(编辑中)</span>}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button onClick={handleSaveDraft} size="sm" variant="outline" disabled={submitting}>
                          <Save className="w-4 h-4 mr-1" />
                          保存草稿
                        </Button>
                        {wordCount > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {readTime}分钟阅读
                          </div>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">文章标题</Label>
                      <Input
                        id="title"
                        placeholder="请输入文章标题..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="content">文章内容 (Markdown)</Label>
                        <div className="text-sm text-muted-foreground">{wordCount} 字符</div>
                      </div>
                      <Textarea
                        id="content"
                        placeholder="在这里开始你的创作... (Ctrl+V 粘贴图片自动上传)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onPaste={handlePaste}
                        className="min-h-[500px] resize-none font-mono"
                      />
                      {uploading && <p className="text-xs text-blue-500">图片上传中...</p>}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>标签</Label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag.name}
                            variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setSelectedTags((prev) =>
                                prev.includes(tag.name) ? prev.filter((id) => id !== tag.name) : [...prev, tag.name]
                              )
                            }
                          >
                            {tag.name}
                            {selectedTags.includes(tag.name) && <X className="w-3 h-3 ml-1" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Send className="w-5 h-5 text-blue-500" />
                      <span>发布设置</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>封面图片 URL</Label>
                      <Input
                        placeholder="https://..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={handlePublish}
                        className="w-full"
                        disabled={!title.trim() || !content.trim() || submitting || !isLoggedIn}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submitting ? '发布中...' : editingArticleId ? '更新发布' : '立即发布'}
                      </Button>
                      <Button onClick={handleSaveDraft} variant="outline" className="w-full" disabled={submitting}>
                        <Save className="w-4 h-4 mr-2" />
                        保存草稿
                      </Button>
                      {!isLoggedIn && (
                        <p className="text-xs text-muted-foreground text-center">请先登录后再发布</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm">📊 写作进度</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>字数目标</span>
                        <span>{wordCount}/1000</span>
                      </div>
                      <Progress value={Math.min((wordCount / 1000) * 100, 100)} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 标题: {title ? '✓' : '○'} 已填写</p>
                      <p>• 标签: {selectedTags.length > 0 ? '✓' : '○'} {selectedTags.length}个</p>
                      <p>• 内容: {content.length > 100 ? '✓' : '○'} {content.length > 100 ? '充足' : '需更多内容'}</p>
                      <p>• 登录: {isLoggedIn ? '✓' : '○'} {isLoggedIn ? '已登录' : '未登录'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span>文章预览</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                {title && <h1 className="text-3xl font-bold mb-4">{title}</h1>}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{readTime}分钟阅读</span>
                  </div>
                </div>
                {selectedTags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {tags.filter((t) => selectedTags.includes(t.id)).map((tag) => (
                      <Badge key={tag.name} variant="outline">{tag.name}</Badge>
                    ))}
                  </div>
                )}
                {content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="text-muted-foreground">请在编辑器中输入内容...</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div key={template.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => loadTemplate(template.id)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded text-xs font-mono line-clamp-6 whitespace-pre-wrap">
                        {template.template.slice(0, 200)}
                      </div>
                      <Button size="sm" className="w-full">使用模板</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="mt-6">
            <div className="space-y-4">
              {drafts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PenTool className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">暂无草稿</p>
                </div>
              ) : (
                drafts.map((draft) => (
                  <motion.div key={draft.id} whileHover={{ scale: 1.01 }}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <h4 className="font-semibold">{draft.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{draft.summary || '(无摘要)'}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>更新于: {draft.updated_at}</span>
                              <span>{draft.word_count} 字</span>
                              {draft.tags?.map((t) => (
                                <Badge key={t.id} variant="outline" className="text-xs">{t.name}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline" onClick={() => loadDraft(draft)}>编辑</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(draft.id)}>删除</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="mt-6">
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>文章管理</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {allArticles.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground text-sm">暂无文章</p>
                  ) : (
                    allArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold">{article.title}</p>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span className={`px-1.5 rounded text-xs ${statusColor(article.status)}`}>
                              {statusLabel(article.status)}
                            </span>
                            <span>·</span>
                            <span>{article.published_at?.slice(0, 10) || article.created_at?.slice(0, 10)}</span>
                            <span>·</span>
                            <span>{article.view_count} 阅读</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => loadArticle(article)}>编辑</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(article.id)}>删除</Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>标签管理</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag.name} variant="secondary">{tag.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>💡 写作小贴士</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• 使用清晰的标题吸引读者</p>
                    <p>• 合理使用标签提高文章可发现性</p>
                    <p>• 添加适当的图片让内容更生动</p>
                    <p>• 定期保存草稿避免内容丢失</p>
                    <p>• 使用Markdown格式美化文章</p>
                    <p>• 保持更新频率建立读者习惯</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Config Tab — 排版配置 */}
          <TabsContent value="config" className="mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>🎨 排版配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>主色调</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 h-9 p-1" value={configJson.theme.primary_color}
                        onChange={(e) => updateConfig({ theme: { ...configJson.theme, primary_color: e.target.value } }).then(refetchConfig)} />
                      <Input value={configJson.theme.primary_color} onChange={(e) => {}} className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>辅助色</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 h-9 p-1" value={configJson.theme.secondary_color}
                        onChange={(e) => updateConfig({ theme: { ...configJson.theme, secondary_color: e.target.value } }).then(refetchConfig)} />
                      <Input value={configJson.theme.secondary_color} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>强调色</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 h-9 p-1" value={configJson.theme.accent_color}
                        onChange={(e) => updateConfig({ theme: { ...configJson.theme, accent_color: e.target.value } }).then(refetchConfig)} />
                      <Input value={configJson.theme.accent_color} readOnly className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>正文字体</Label>
                    <Input value={configJson.typography.font_family} onChange={(e) =>
                      updateConfig({ typography: { ...configJson.typography, font_family: e.target.value } }).then(refetchConfig)} />
                  </div>
                  <div className="space-y-2">
                    <Label>基准字号 ({configJson.typography.base_font_size}px)</Label>
                    <Input type="range" min="12" max="24" value={configJson.typography.base_font_size}
                      onChange={(e) => updateConfig({ typography: { ...configJson.typography, base_font_size: Number(e.target.value) } }).then(refetchConfig)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>页脚文案</Label>
                    <Input value={configJson.footer.text}
                      onChange={(e) => updateConfig({ footer: { ...configJson.footer, text: e.target.value } }).then(refetchConfig)} />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" onClick={() => { updateConfig(configJson); toast.success('配置已保存'); }}>保存配置</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
