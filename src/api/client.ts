// ============================================================
// API 基础客户端 — 对齐 API v1.2 { code, msg, data }
// 后端: C++ Crow (默认 http://localhost:8080/api/v1)
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {};

    // 文件上传不设 Content-Type，让浏览器自动生成 boundary
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const json = await response.json();

    if (!response.ok || (json.code !== undefined && json.code !== 0)) {
      const message = json?.msg || `HTTP ${response.status}`;
      const error = new Error(message) as Error & { code: number; errors?: Record<string, string[]> };
      error.code = json?.code || response.status;
      error.errors = json?.errors;
      throw error;
    }

    return json as T;
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let query = '';
    if (params) {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) sp.set(k, String(v));
      });
      const qs = sp.toString();
      if (qs) query = `?${qs}`;
    }
    return this.request<T>('GET', `${path}${query}`);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
