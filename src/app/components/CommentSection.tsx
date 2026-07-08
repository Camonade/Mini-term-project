import React, { useState } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useComments } from "../../hooks/useComments";
import type { Comment } from "../../types";

interface CommentSectionProps {
  postId: number;
  postTitle: string;
}

function CommentItem({
  comment,
  onLike,
  onReplyLike,
  onAddReply,
}: {
  comment: Comment;
  onLike: (id: number) => void;
  onReplyLike: (commentId: number, replyId: number) => void;
  onAddReply: (commentId: number, content: string) => void;
}) {
  const [showReplies, setShowReplies] = useState(true);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
    setReplyOpen(false);
  };

  const avatarChar = comment.author_name.charAt(0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="group">
      <div className="flex gap-3">
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-background">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-sm font-semibold">
            {avatarChar}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author_name}</span>
              <span className="text-xs text-muted-foreground">{comment.created_at}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-1.5 px-1">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                comment.liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.liked ? "fill-rose-500" : ""}`} />
              <span>{comment.likes || 0}</span>
            </button>

            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>回复</span>
            </button>

            {(comment.replies?.length ?? 0) > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{comment.replies!.length} 条回复</span>
                {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Reply input */}
          <AnimatePresence>
            {replyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`回复 ${comment.author_name}...`}
                    className="text-sm resize-none min-h-[70px] bg-background/80 border-border/60"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmitReply();
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim()}
                    className="self-end bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          <AnimatePresence>
            {showReplies && (comment.replies?.length ?? 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-3 pl-4 border-l-2 border-violet-200 dark:border-violet-800"
              >
                {comment.replies!.map((reply) => (
                  <div key={reply.id} className="flex gap-2.5">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback
                        className={`text-xs font-semibold text-white bg-gradient-to-br from-teal-500 to-cyan-500`}
                      >
                        {reply.author_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted/30 rounded-2xl rounded-tl-sm px-3 py-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-xs">{reply.author_name}</span>
                          <span className="text-[11px] text-muted-foreground">{reply.created_at}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/85">{reply.content}</p>
                      </div>
                      <button
                        onClick={() => onReplyLike(comment.id, reply.id)}
                        className={`flex items-center gap-1 text-[11px] mt-1 px-1 transition-colors ${
                          reply.liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${reply.liked ? "fill-rose-500" : ""}`} />
                        <span>{reply.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { comments, submitting, addComment, toggleLike } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("访客用户");
  const [sortBy, setSortBy] = useState<"newest" | "hottest">("newest");

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment({
        article_id: postId,
        author_name: authorName || "访客用户",
        content: newComment.trim(),
      });
      setNewComment("");
    } catch {
      // 静默失败 — toast 在 hook 层可选
    }
  };

  // 前端回复（因为后端评论没有嵌套，这里保持前端模拟回复功能）
  const handleAddReply = (commentId: number, content: string) => {
    // 前端模拟 — 后端若无嵌套回复接口，纯前端管理
    // 实际生产环境需要后端支持 parent_id
  };

  const sorted = [...comments].sort((a, b) =>
    sortBy === "hottest"
      ? (b.likes || 0) - (a.likes || 0)
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalCount = comments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-bold">评论区</h3>
          <Badge variant="secondary" className="ml-1">{totalCount}</Badge>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["newest", "hottest"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-3 py-1 rounded-md transition-all duration-200 ${
                sortBy === s
                  ? "bg-background shadow-sm font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "newest" ? "最新" : "最热"}
            </button>
          ))}
        </div>
      </div>

      {/* Comment input */}
      <div className="flex gap-3">
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-sm font-semibold">
            我
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="你的昵称"
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border/60 bg-background focus:border-violet-400 focus:outline-none transition-colors"
            />
          </div>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="说点什么吧… (Ctrl+Enter 快速发送)"
            className="resize-none min-h-[90px] bg-background border-border/60 focus:border-violet-400 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{newComment.length} 字</span>
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md"
              size="sm"
            >
              {submitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  发送中
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  发表评论
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/40" />

      {/* Comment list */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {sorted.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={toggleLike}
              onReplyLike={() => {}}
              onAddReply={handleAddReply}
            />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">还没有评论，来发表第一条吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
