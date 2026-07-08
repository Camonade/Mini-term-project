// 文章 API — v1.2
import apiClient from './client';
import type {
  ApiResponse, PaginatedData, ArticleListItem, ArticleDetail, ArticleListParams,
  CreateArticleRequest, UpdateArticleRequest, AutosaveRequest, BatchActionRequest,
  TagWithCount, YearArchive,
} from '../types';

// C 端
export async function getArticles(params?: ArticleListParams): Promise<ApiResponse<PaginatedData<ArticleListItem>>> {
  return apiClient.get<ApiResponse<PaginatedData<ArticleListItem>>>('/articles', params as Record<string, string | number | boolean | undefined>);
}
export async function getArticle(idOrSlug: string | number): Promise<ApiResponse<ArticleDetail>> {
  return apiClient.get<ApiResponse<ArticleDetail>>(`/articles/${idOrSlug}`);
}
export async function getTags(): Promise<ApiResponse<{ tags: TagWithCount[] }>> {
  return apiClient.get<ApiResponse<{ tags: TagWithCount[] }>>('/articles/tags');
}
export async function getArchives(): Promise<ApiResponse<{ archives: YearArchive[] }>> {
  return apiClient.get<ApiResponse<{ archives: YearArchive[] }>>('/articles/archives');
}

// B 端
export async function getManageArticles(params?: ArticleListParams): Promise<ApiResponse<PaginatedData<ArticleListItem>>> {
  return apiClient.get<ApiResponse<PaginatedData<ArticleListItem>>>('/articles/manage', params as Record<string, string | number | boolean | undefined>);
}
export async function getManageArticle(id: number): Promise<ApiResponse<ArticleListItem & { content: string; has_autosave: boolean }>> {
  return apiClient.get<ApiResponse<ArticleListItem & { content: string; has_autosave: boolean }>>(`/articles/manage/${id}`);
}
export async function createArticle(data: CreateArticleRequest): Promise<ApiResponse<{ id: number; title: string; slug: string; status: string; created_at: string }>> {
  return apiClient.post<ApiResponse<{ id: number; title: string; slug: string; status: string; created_at: string }>>('/articles', data);
}
export async function updateArticle(id: number, data: UpdateArticleRequest): Promise<ApiResponse<{ id: number; slug: string; status: string; published_at: string | null; updated_at: string }>> {
  return apiClient.put<ApiResponse<{ id: number; slug: string; status: string; published_at: string | null; updated_at: string }>>(`/articles/${id}`, data);
}
export async function autosaveArticle(id: number, data: AutosaveRequest): Promise<ApiResponse<{ id: number; autosaved_at: string }>> {
  return apiClient.post<ApiResponse<{ id: number; autosaved_at: string }>>(`/articles/${id}/autosave`, data);
}
export async function deleteArticle(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete<ApiResponse<null>>(`/articles/${id}`);
}
export async function batchArticles(data: BatchActionRequest): Promise<ApiResponse<{ affected_count: number }>> {
  return apiClient.put<ApiResponse<{ affected_count: number }>>('/articles/batch', data);
}
export async function toggleTopArticle(id: number, is_top: boolean): Promise<ApiResponse<{ id: number; is_top: boolean }>> {
  return apiClient.put<ApiResponse<{ id: number; is_top: boolean }>>(`/articles/${id}/top`, { is_top });
}
