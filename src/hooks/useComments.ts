// useComments — v1.2
import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, deleteComment } from '../api/comments';
import type { Comment, CreateCommentRequest } from '../types';

export function useComments(articleId: number | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!articleId) return;
    setLoading(true);
    try {
      const res = await getComments(articleId);
      setComments((res.data || []).map((c) => ({ ...c, likes: c.likes || 0, liked: false, replies: [] })));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评论失败');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addComment = useCallback(async (data: CreateCommentRequest & { article_id: number }) => {
    setSubmitting(true);
    try {
      const res = await createComment(data);
      setComments((prev) => [{ ...res.data, likes: 0, liked: false, replies: [] }, ...prev]);
      return res.data;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const removeComment = useCallback(async (id: number) => {
    await deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleLike = useCallback((id: number) => {
    setComments((prev) => prev.map((c) =>
      c.id === id ? { ...c, liked: !c.liked, likes: (c.likes || 0) + (c.liked ? -1 : 1) } : c
    ));
  }, []);

  return { comments, loading, submitting, error, addComment, removeComment, toggleLike, refetch: fetch };
}
