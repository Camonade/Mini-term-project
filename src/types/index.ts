// ============================================================
// 类型定义 — 严格对齐 API 文档 v1.2 (code/msg/data)
// ============================================================

// ---------- 通用响应 ----------
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginatedData<T> {
  list: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// ---------- Auth ----------
export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenData {
  token: string;
  expires_in: number;
  user: { id: number; username: string; avatar_url: string };
}

export interface InitData {
  id: number;
  username: string;
  token: string;
  expires_in: number;
}

export interface AuthUser {
  id: number;
  username: string;
  avatar_url: string;
  created_at: string;
}

// ---------- Profile ----------
export interface PublicProfile {
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  social_links: Record<string, string> | null;
  resume_url: string | null;
}

export interface PrivateProfile extends PublicProfile {
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  nickname?: string; avatar_url?: string; bio?: string;
  email?: string; social_links?: Record<string, string>; resume_url?: string;
}

// ---------- Config ----------
export interface ConfigJson {
  theme: ThemeConfig;
  typography: TypographyConfig;
  layout: LayoutConfig;
  background: BackgroundConfig;
  navbar: NavbarConfig;
  footer: FooterConfig;
}

export interface ConfigData extends ConfigJson {
  version?: number;
  updated_at?: string;
  updated_by?: string;
}

export interface ThemeConfig {
  primary_color: string; secondary_color: string; accent_color: string;
  background_color: string; text_color: string; text_secondary_color: string;
  link_color: string; link_hover_color: string; border_color: string;
  code_background_color: string; blockquote_border_color: string;
}

export interface TypographyConfig {
  font_family: string; heading_font_family: string; code_font_family: string;
  base_font_size: number; heading_scale: number;
  line_height: number; paragraph_spacing: number;
}

export interface LayoutConfig {
  content_max_width: number; sidebar_width: number;
  card_border_radius: number; card_shadow: string;
}

export interface BackgroundConfig {
  type: 'color' | 'image' | 'gradient'; color: string;
  image_url: string; overlay_opacity: number;
  repeat: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
}

export interface NavbarConfig {
  style: 'sticky' | 'fixed' | 'static'; background_color: string;
  backdrop_blur: number; logo_url: string; logo_height: number;
}

export interface FooterConfig {
  text: string; background_color: string; text_color: string;
}

export const defaultConfigV2: ConfigJson = {
  theme: {
    primary_color: '#2C3E50', secondary_color: '#3498DB', accent_color: '#E74C3C',
    background_color: '#FAFAFA', text_color: '#333333', text_secondary_color: '#777777',
    link_color: '#2980B9', link_hover_color: '#1A5276', border_color: '#E0E0E0',
    code_background_color: '#F4F4F4', blockquote_border_color: '#3498DB',
  },
  typography: {
    font_family: "'Noto Sans SC', -apple-system, sans-serif",
    heading_font_family: "'Noto Serif SC', Georgia, serif",
    code_font_family: "'JetBrains Mono', 'Fira Code', monospace",
    base_font_size: 16, heading_scale: 1.25, line_height: 1.8, paragraph_spacing: 1.2,
  },
  layout: {
    content_max_width: 720, sidebar_width: 280,
    card_border_radius: 8, card_shadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  background: {
    type: 'color', color: '#FAFAFA', image_url: '', overlay_opacity: 0, repeat: 'no-repeat',
  },
  navbar: {
    style: 'sticky', background_color: 'rgba(255,255,255,0.95)',
    backdrop_blur: 10, logo_url: '', logo_height: 36,
  },
  footer: {
    text: '&copy; 2026 Lemon. Powered by DIY Engine.',
    background_color: '#2C3E50', text_color: '#CCCCCC',
  },
};

// ---------- Articles ----------
export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleListItem {
  id: number; title: string; slug: string;
  summary: string | null; cover_url: string | null;
  tags: string[]; word_count: number; read_time: number;
  view_count: number; is_top: boolean;
  published_at: string | null; updated_at: string;
  status?: ArticleStatus; created_at?: string; has_autosave?: boolean;
}

export interface ArticleDetail extends ArticleListItem {
  content: string;
  prev_article: { id: number; title: string; slug: string } | null;
  next_article: { id: number; title: string; slug: string } | null;
}

export interface ArticleListParams {
  page?: number; page_size?: number; tag?: string;
  sort?: 'published_at' | 'view_count' | 'updated_at';
  order?: 'asc' | 'desc'; year?: number; search?: string;
  status?: ArticleStatus;
}

export interface CreateArticleRequest {
  title: string; content?: string; summary?: string;
  cover_url?: string; tags?: string[]; status?: ArticleStatus; is_top?: boolean;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface AutosaveRequest {
  content: string; title?: string; summary?: string;
}

export interface BatchActionRequest {
  ids: number[]; action: 'publish' | 'archive' | 'restore' | 'delete_forever';
}

// ---------- Tags ----------
export interface TagWithCount {
  name: string; count: number;
}

// ---------- Archives ----------
export interface MonthArchive { month: number; count: number; }
export interface YearArchive { year: number; months: MonthArchive[]; }

// ---------- Comments ----------
export interface Comment {
  id: number; article_id: number; author_name: string;
  content: string; created_at: string; parent_id?: number | null;
  likes?: number; liked?: boolean; replies?: Comment[];
}

export interface CreateCommentRequest {
  author_name: string; content: string; parent_id?: number;
}

// ---------- Uploads ----------
export type UploadCategory = 'cover' | 'content' | 'avatar' | 'background' | 'general';

export interface UploadItem {
  id: number; url: string; thumbnail_url?: string;
  filename: string; size: number; width?: number; height?: number;
  mime_type: string; category: UploadCategory; created_at: string;
}

export interface BatchUploadResult {
  total: number; success_count: number; failed_count: number;
  success: UploadItem[]; failed: { filename: string; reason: string }[];
}
