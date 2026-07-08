// ============================================================
// 文件上传 API — v1.2
// ============================================================
import apiClient from './client';
import type { ApiResponse, PaginatedData, UploadItem, BatchUploadResult, UploadCategory } from '../types';

// 上传单张图片
export async function uploadImage(file: File, category: UploadCategory = 'general'): Promise<ApiResponse<UploadItem>> {
  const form = new FormData();
  form.append('file', file);
  form.append('category', category);
  return apiClient.post<ApiResponse<UploadItem>>('/uploads/image', form);
}

// 批量上传
export async function uploadImages(files: File[], category: UploadCategory = 'general'): Promise<ApiResponse<BatchUploadResult>> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('category', category);
  return apiClient.post<ApiResponse<BatchUploadResult>>('/uploads/images', form);
}

// 文件列表
export async function getUploads(params?: { page?: number; page_size?: number; category?: string }): Promise<ApiResponse<PaginatedData<UploadItem>>> {
  return apiClient.get<ApiResponse<PaginatedData<UploadItem>>>('/uploads', params as Record<string, string | number | boolean | undefined>);
}

// 删除文件
export async function deleteUpload(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete<ApiResponse<null>>(`/uploads/${id}`);
}
