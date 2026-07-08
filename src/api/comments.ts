// 评论 API — v1.2
import apiClient from './client';
import type { ApiResponse, Comment, CreateCommentRequest } from '../types';

export async function getComments(articleId: number): Promise<ApiResponse<Comment[]>> {
  return apiClient.get<ApiResponse<Comment[]>>('/comments', { article_id: articleId });
}
export async function createComment(data: CreateCommentRequest & { article_id: number }): Promise<ApiResponse<Comment>> {
  return apiClient.post<ApiResponse<Comment>>('/comments', data);
}
export async function deleteComment(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete<ApiResponse<null>>(`/comments/${id}`);
}
