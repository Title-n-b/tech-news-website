"use client"

import { useState, useEffect, useCallback } from "react"

interface NewsArticle {
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

interface UseNewsOptions {
  category?: string
  limit?: number
  featured?: boolean
  page?: number
}

interface NewsResponse {
  news: NewsArticle[]
  total: number
  page: number
  hasMore: boolean
}

export function useNews(options: UseNewsOptions = {}) {
  const [data, setData] = useState<NewsResponse>({
    news: [],
    total: 0,
    page: 1,
    hasMore: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.category) params.append("category", options.category)
      if (options.limit) params.append("limit", options.limit.toString())
      if (options.featured) params.append("featured", "true")
      if (options.page) params.append("page", options.page.toString())

      const response = await fetch(`/api/news?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const responseData = await response.json()
      setData(responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [options.category, options.limit, options.featured, options.page])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return {
    news: data.news,
    total: data.total,
    page: data.page,
    hasMore: data.hasMore,
    loading,
    error,
    refetch: fetchNews,
  }
}

// Hook สำหรับดึงข่าวเดี่ยว
export function useNewsArticle(slug: string) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/news/${slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch article")
        }

        const data = await response.json()
        setArticle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  return { article, loading, error }
}
