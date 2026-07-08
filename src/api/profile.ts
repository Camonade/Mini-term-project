// ============================================================
// 博主信息 API — v1.2 (Profile)
// ============================================================
import apiClient from './client';
import type { ApiResponse, PublicProfile, PrivateProfile, UpdateProfileRequest } from '../types';

// C 端公开 / B 端完整（自动区分）
export async function getProfile(): Promise<ApiResponse<PublicProfile | PrivateProfile>> {
  return apiClient.get<ApiResponse<PublicProfile | PrivateProfile>>('/profile');
}

export async function updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<PrivateProfile>> {
  return apiClient.put<ApiResponse<PrivateProfile>>('/profile', data);
}
