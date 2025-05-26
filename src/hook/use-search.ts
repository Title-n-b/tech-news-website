// src/hooks/use-search.ts
import { useState, useEffect, useMemo } from 'react'
import { NewsArticle } from '@/lib/types'

export function useSearch(news: NewsArticle[], searchTerm: string) {
  const [results, setResults] = useState<NewsArticle[]>([])

  const filteredNews = useMemo(() => {
    if (!searchTerm.trim()) return news

    return news.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [news, searchTerm])

  useEffect(() => {
    setResults(filteredNews)
  }, [filteredNews])

  return results
}