export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorName: string
  date: string
  category: string
  categoryName: string
  image: string
  featured?: boolean
  tags: string[]
  readTime: number
  slug: string
  views: number
  likes: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  count: number
  icon: string
  color: string
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar: string
  email?: string
  social: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

export interface Comment {
  id: string
  articleId: string
  author: string
  content: string
  date: string
  replies?: Comment[]
}

export interface SearchResult {
  articles: NewsArticle[]
  total: number
  page: number
  limit: number
}

// Props interfaces สำหรับ components
export interface NewsCardProps {
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
  featured?: boolean
  slug: string
  views?: number
  readTime?: number
  onClick?: () => void
}

export interface CategoryCardProps {
  id: string
  name: string
  count: number
  icon: string
  color: string
  onClick?: () => void
}

// Firebase related types
export interface FirebaseError {
  code: string
  message: string
}

export interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  state: "running" | "paused" | "success" | "canceled" | "error"
}

// Admin types
export interface AdminNewsItem {
  id: string
  title: string
  excerpt: string
  authorName: string
  date: string
  categoryName: string
  image: string
  featured: boolean
  views: number
}

export interface FormData {
  title: string
  excerpt: string
  content: string
  authorName: string
  categoryName: string
  image: string
  featured: boolean
  tags: string
}

// API Response types
export interface NewsResponse {
  news: NewsArticle[]
  total: number
  page: number
  hasMore: boolean
}

export interface ApiError {
  error: string
  message?: string
}
