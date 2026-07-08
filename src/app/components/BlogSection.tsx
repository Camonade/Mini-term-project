import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Calendar, Eye, Heart, MessageCircle, TrendingUp, Users, FileText, Clock, ArrowRight, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArchives } from '../../hooks/useArticles';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CommentSection from './CommentSection';
import { useArticles, useArticle } from '../../hooks/useArticles';
import { useTags } from '../../hooks/useTags';
import type { ArticleListItem } from '../../types';

// 骨架屏
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/60 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ArticleListItem | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [sortBy, setSortBy] = useState<'published_at' | 'view_count'>('published_at');
  const [page, setPage] = useState(1);

  const { articles, loading, total, totalPages } = useArticles({
    status: 'published',
    search: searchKeyword || undefined,
    tag: selectedTag !== '全部' ? selectedTag : undefined,
    sort: sortBy,
    order: 'desc',
    page,
    page_size: 9,
  });
  const { tags } = useTags();
  const { archives } = useArchives();
  const { article: detailArticle } = useArticle(selectedSlug);

  useEffect(() => {
    if (detailArticle && selectedSlug) setSelectedPost(detailArticle as unknown as ArticleListItem);
  }, [detailArticle, selectedSlug]);

  useEffect(() => {
    const items = articles.filter((a) => a.is_top).slice(0, 3);
    if (items.length === 0) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [articles]);

  const featuredPosts = articles.filter((post) => post.is_top);
  const regularPosts = articles.filter((post) => !post.is_top);
  const allTags = tags.map((t) => t.name);
  const carouselItems = featuredPosts.slice(0, 3);

  const statsDisplay = [
    { label: '总访问量', value: '--', icon: Eye, color: 'from-blue-500 to-cyan-400' },
    { label: '文章总数', value: String(total), icon: FileText, color: 'from-emerald-500 to-green-400' },
    { label: '评论总数', value: '--', icon: Users, color: 'from-violet-500 to-purple-400' },
    { label: '获赞总数', value: '--', icon: Heart, color: 'from-rose-500 to-pink-400' },
  ];

  return (
    <div className="space-y-16">
      {/* ───── Hero Banner ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[40px] shimmer-border border border-white/30 bg-slate-950 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.8)]"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/30 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative grid gap-8 px-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6 text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-slate-200 backdrop-blur"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              个人博客 · DIY 排版引擎
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="gradient-text">
                  把灵感与代码
                </span>
                <br />
                <span className="shimmer-text">
                  一起写进博客里
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-400">
                这里记录 C++ 探索、后端开发、数据库设计与学习笔记，让每一次思考都被留下来。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-xl bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/20">
                阅读文章 <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl border-white/25 text-white hover:bg-white/10">
                关于我
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 6).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=640&fit=crop"
              alt="Workspace"
              className="h-64 w-full rounded-[20px] object-cover"
            />
            <div className="mt-4 rounded-2xl border border-white/5 bg-black/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">最新文章</p>
              <h2 className="mt-1 text-lg font-semibold text-white leading-snug">
                {articles[0]?.title || '欢迎来到我的博客'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2">
                {articles[0]?.summary || '分享技术心得与学习笔记。'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ───── Stats ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statsDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-sm border border-border/40 transition-shadow hover:shadow-md"
            >
              <div className="absolute top-0 right-0 w-20 h-20 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ───── Carousel ───── */}
      {carouselItems.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl group/carousel">
          <div className="relative h-80 lg:h-96">
            {carouselItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="absolute inset-0 cursor-pointer"
                initial={false}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                onClick={() => setSelectedSlug(item.slug)}
              >
                <ImageWithFallback src={item.cover_url || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=500&fit=crop'} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <Badge className="mb-3 bg-white/20 text-white border-0 backdrop-blur">{item.tags?.[0] || '精选'}</Badge>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 max-w-xl">{item.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel controls */}
          <button onClick={() => setCurrentSlide((p) => (p - 1 + carouselItems.length) % carouselItems.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentSlide((p) => (p + 1) % carouselItems.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-8 flex gap-2">
            {carouselItems.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>
      )}

      {/* ───── Filters ───── */}
      <div className="sticky top-20 z-30 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input placeholder="搜索文章..." value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setPage(1); }}
              className="border-0 bg-muted/50 focus-visible:ring-1 rounded-xl h-10" />
          </div>
          <div className="flex gap-2">
            <Select value={selectedTag} onValueChange={(v) => { setSelectedTag(v); setPage(1); }}>
              <SelectTrigger className="w-32 rounded-xl h-10"><SelectValue placeholder="标签" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部标签</SelectItem>
                {allTags.map((tag) => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'published_at' | 'view_count')}>
              <SelectTrigger className="w-32 rounded-xl h-10"><SelectValue placeholder="排序" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published_at">最新</SelectItem>
                <SelectItem value="view_count">最热</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ───── Featured Posts ───── */}
      {featuredPosts.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="decorative-line text-sm font-medium text-primary tracking-wide uppercase">Featured</p>
              <h2 className="text-3xl font-bold mt-3">精选文章</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedSlug(post.slug)}
                className="group cursor-pointer"
              >
                <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-500 rounded-3xl spotlight-card">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback src={post.cover_url || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'} alt={post.title}
                      className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-500/90 hover:bg-amber-500 border-0 backdrop-blur">
                        <Star className="w-3 h-3 mr-1 fill-white" /> 精选
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="space-y-2 pb-1">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-lg">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{post.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.published_at?.slice(0, 10) || post.created_at?.slice(0, 10)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}分钟</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.view_count}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comment_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ───── Loading / Empty / Posts Grid ───── */}
      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : regularPosts.length === 0 && featuredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">暂无文章</p>
          <p className="text-sm text-muted-foreground/60 mt-1">调整筛选条件或等待作者发布新内容</p>
        </div>
      ) : (
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="decorative-line text-sm font-medium text-primary tracking-wide uppercase">Latest</p>
              <h2 className="text-3xl font-bold mt-3">最新文章</h2>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> 共 {total} 篇
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedSlug(post.slug)}
                className="group cursor-pointer"
              >
                <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback src={post.cover_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=350&fit=crop'} alt={post.title}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <CardHeader className="space-y-2 pb-1">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs rounded-lg">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{post.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.published_at?.slice(0, 10) || post.created_at?.slice(0, 10)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.view_count}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comment_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ───── Pagination ───── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button size="sm" variant="outline" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> 上一页
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${n === page ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted text-muted-foreground'}`}>
                {n}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="rounded-xl" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            下一页 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ───── Archives ───── */}
      {archives.length > 0 && (
        <>
          <div className="wavy-divider" />
          <section className="space-y-6">
            <div>
              <p className="decorative-line text-sm font-medium text-primary tracking-wide uppercase">Archives</p>
              <h2 className="text-3xl font-bold mt-3">文章归档</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {archives.map((year) => (
                <Card key={year.year} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="text-xl">{year.year}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {year.months.map((m) => (
                        <Badge key={m.month} variant="secondary" className="rounded-lg text-sm px-3 py-1.5">
                          {m.month}月 <span className="ml-1 opacity-50">{m.count}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ───── Article Detail Sheet ───── */}
      <Sheet open={!!selectedPost} onOpenChange={(open) => !open && (setSelectedPost(null), setSelectedSlug(null))}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 flex flex-col">
          {selectedPost && (
            <>
              <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {(selectedPost.tags as string[])?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs rounded-lg">{tag}</Badge>
                    ))}
                  </div>
                  <SheetTitle className="text-xl leading-snug">{selectedPost.title}</SheetTitle>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedPost.published_at?.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedPost.read_time} 分钟</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{selectedPost.view_count}</span>
                  </div>
                </div>
              </SheetHeader>
              <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-8">
                  {selectedPost.cover_url && (
                    <div className="overflow-hidden rounded-2xl">
                      <ImageWithFallback src={selectedPost.cover_url} alt={selectedPost.title} className="w-full h-56 object-cover" />
                    </div>
                  )}
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {selectedPost.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPost.content}</ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground">{selectedPost.summary}</p>
                    )}
                  </div>
                  <div className="border-t pt-8">
                    <CommentSection postId={selectedPost.id} postTitle={selectedPost.title} />
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
