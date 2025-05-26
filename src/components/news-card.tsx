"use client"

import { Calendar, User, ArrowUpRight, Eye, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { NewsCardProps } from "@/lib/types"

export default function NewsCard({
  title,
  excerpt,
  author,
  date,
  category,
  image,
  featured = false,
  slug,
  views,
  readTime,
  onClick,
}: NewsCardProps) {
  const cardContent = (
    <article className={`group cursor-pointer ${featured ? "col-span-full" : ""}`}>
      <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl overflow-hidden hover:border-tech-light/40 transition-all duration-300 hover:shadow-lg hover:shadow-tech-blue/10 h-full">
        <div className="relative overflow-hidden">
          <Image
            src={
              image || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center"
            }
            alt={title}
            width={featured ? 800 : 400}
            height={featured ? 400 : 200}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              featured ? "h-64 sm:h-80 md:h-96" : "h-40 sm:h-48"
            }`}
            priority={featured}
          />
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className="bg-tech-blue/90 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {category}
            </span>
          </div>
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>

        <div className={`p-4 sm:p-6 ${featured ? "md:p-8" : ""}`}>
          <h3
            className={`font-bold text-white mb-2 sm:mb-3 group-hover:text-tech-light transition-colors line-clamp-2 ${
              featured ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" : "text-base sm:text-lg"
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-tech-pale mb-3 sm:mb-4 line-clamp-3 leading-relaxed ${
              featured ? "text-base sm:text-lg md:text-xl" : "text-sm sm:text-base"
            }`}
          >
            {excerpt}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-tech-pale/80 gap-2 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate max-w-24 sm:max-w-none">{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {readTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{readTime} นาที</span>
                </div>
              )}
              {views && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{views.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>
  }

  return <Link href={`/news/${slug}`}>{cardContent}</Link>
}
