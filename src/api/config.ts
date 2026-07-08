// 排版配置 API — v1.2
import apiClient from './client';
import type { ApiResponse, ConfigData } from '../types';

export async function getConfig(): Promise<ApiResponse<ConfigData>> {
  return apiClient.get<ApiResponse<ConfigData>>('/config');
}
export async function updateConfig(configJson: Partial<ConfigData>): Promise<ApiResponse<ConfigData>> {
  return apiClient.put<ApiResponse<ConfigData>>('/config', configJson);
}
export async function resetConfig(): Promise<ApiResponse<ConfigData>> {
  return apiClient.post<ApiResponse<ConfigData>>('/config/reset');
}
