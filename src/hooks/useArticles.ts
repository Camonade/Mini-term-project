// useArticles — v1.2 (code/msg/data)
import { useState, useEffect, useCallback } from 'react';
import { getArticles, getArticle, getTags, getArchives, getManageArticles } from '../api/articles';
import type { ArticleListItem, ArticleDetail, ArticleListParams, TagWithCount, YearArchive } from '../types';

export function useArticles(params?: ArticleListParams) {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetch = useCallback(async (p?: ArticleListParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getArticles(p || params);
      setArticles(res.data.list);
      setTotal(res.data.pagination.total);
      setTotalPages(res.data.pagination.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取文章失败');
      if (articles.length === 0) setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  return { articles, loading, error, total, totalPages, refetch: fetch };
}

export function useArticle(idOrSlug: string | null) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    getArticle(idOrSlug)
      .then((res) => setArticle(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : '获取详情失败'))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  return { article, loading, error };
}

export function useTags() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags()
      .then((res) => setTags(res.data.tags || []))
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading };
}

export function useArchives() {
  const [archives, setArchives] = useState<YearArchive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArchives()
      .then((res) => setArchives(res.data.archives || []))
      .catch(() => setArchives([]))
      .finally(() => setLoading(false));
  }, []);

  return { archives, loading };
}

// B 端管理列表
export function useManageArticles(params?: ArticleListParams) {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async (p?: ArticleListParams) => {
    setLoading(true);
    try {
      const res = await getManageArticles(p || params);
      setArticles(res.data.list);
      setTotal(res.data.pagination.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  return { articles, loading, total, refetch: fetch };
}
