// 鉴权 API — v1.2
import apiClient from './client';
import type { ApiResponse, LoginRequest, TokenData, InitData, AuthUser } from '../types';

export async function initAdmin(username: string, password: string): Promise<ApiResponse<InitData>> {
  return apiClient.post<ApiResponse<InitData>>('/auth/init', { username, password });
}
export async function login(data: LoginRequest): Promise<ApiResponse<TokenData>> {
  return apiClient.post<ApiResponse<TokenData>>('/auth/login', data);
}
export async function getMe(): Promise<ApiResponse<AuthUser>> {
  return apiClient.get<ApiResponse<AuthUser>>('/auth/me');
}
export async function logout(): Promise<ApiResponse<null>> {
  return apiClient.post<ApiResponse<null>>('/auth/logout');
}
export function setToken(token: string): void { localStorage.setItem('auth_token', token); }
export function getToken(): string | null { return localStorage.getItem('auth_token'); }
export function clearToken(): void { localStorage.removeItem('auth_token'); }
export function isAuthenticated(): boolean { return !!getToken(); }
