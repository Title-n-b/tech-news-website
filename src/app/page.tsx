"use client"

import { useNews } from "@/hook/use-news"
import Header from "@/components/header"
import Hero from "@/components/hero"
import NewsCard from "@/components/news-card"
import Categories from "@/components/categories"
import Footer from "@/components/footer"
import { Loader2 } from "lucide-react"

// Mock data สำหรับทดสอบ (ใช้ชั่วคราวถ้า Firebase ยังไม่พร้อม)
const mockNews = [
  {
    id: "1",
    title: "ChatGPT-5 เปิดตัวแล้ว! ความสามารถใหม่ที่จะเปลี่ยนโลก AI",
    excerpt: "OpenAI เปิดตัว ChatGPT-5 พร้อมความสามารถใหม่ที่ล้ำหน้ากว่าเดิม รองรับการประมวลผลแบบ multimodal และมีความแม่นยำสูงขึ้น",
    author: "สมชาย เทคโนโลยี",
    authorName: "สมชาย เทคโนโลยี",
    date: "15 ม.ค. 2024",
    category: "ai-ml",
    categoryName: "AI & ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center",
    featured: true,
    tags: ["ChatGPT", "OpenAI", "AI"],
    readTime: 5,
    slug: "chatgpt-5-launch",
    views: 15420,
    likes: 892,
    content: "",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Next.js 15 เปิดตัวแล้ว พร้อมฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้",
    excerpt: "Vercel เปิดตัว Next.js 15 พร้อมการปรับปรุงประสิทธิภาพและฟีเจอร์ใหม่ที่จะทำให้การพัฒนาเว็บแอปพลิเคชันง่ายขึ้น",
    author: "วิชัย โค้ดดิ้ง",
    authorName: "วิชัย โค้ดดิ้ง",
    date: "14 ม.ค. 2024",
    category: "development",
    categoryName: "การพัฒนา",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center",
    featured: false,
    tags: ["Next.js", "React"],
    readTime: 4,
    slug: "nextjs-15-features",
    views: 8930,
    likes: 456,
    content: "",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "iPhone 16 Pro Max รีวิวเต็ม สเปคใหม่ที่น่าสนใจ",
    excerpt: "รีวิวละเอียด iPhone 16 Pro Max พร้อมการทดสอบประสิทธิภาพ กล้อง และฟีเจอร์ AI ใหม่ที่น่าประทับใจ",
    author: "สุดา รีวิวเวอร์",
    authorName: "สุดา รีวิวเวอร์",
    date: "13 ม.ค. 2024",
    category: "mobile",
    categoryName: "มือถือ",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=400&fit=crop&crop=center",
    featured: false,
    tags: ["iPhone", "Apple"],
    readTime: 6,
    slug: "iphone-16-review",
    views: 12340,
    likes: 678,
    content: "",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
]

export default function Home() {
  const { news, loading, error } = useNews({ limit: 6 })
  const { news: featuredNews, loading: featuredLoading } = useNews({
    featured: true,
    limit: 1,
  })

  // ใช้ mock data ถ้า Firebase ยังไม่พร้อม
  const displayNews = news.length > 0 ? news : mockNews.filter((item) => !item.featured)
  const displayFeatured = featuredNews.length > 0 ? featuredNews : mockNews.filter((item) => item.featured)

  if (error && news.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy">
        <Header />
        <Hero />

        {/* แสดง mock data แทน */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">ข่าวสารล่าสุด</h2>
              <p className="text-tech-pale text-base sm:text-lg max-w-2xl mx-auto">
                ติดตามข่าวสารเทคโนโลยีที่ร้อนแรงและน่าสนใจที่สุดในขณะนี้
              </p>
              <p className="text-yellow-400 text-sm mt-2">* แสดงข้อมูลตัวอย่าง (Firebase ยังไม่เชื่อมต่อ)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mockNews.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.authorName}
                  date={article.date}
                  category={article.categoryName}
                  image={article.image}
                  featured={article.featured}
                  slug={article.slug}
                  views={article.views}
                  readTime={article.readTime}
                />
              ))}
            </div>
          </div>
        </section>

        <Categories />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy">
      <Header />
      <Hero />

      {/* Featured News Section */}
      {!featuredLoading && displayFeatured.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">ข่าวเด่น</h2>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {displayFeatured.map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    author={article.authorName}
                    date={article.date}
                    category={article.categoryName}
                    image={article.image}
                    featured={true}
                    slug={article.slug}
                    views={article.views}
                    readTime={article.readTime}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">ข่าวสารล่าสุด</h2>
            <p className="text-tech-pale text-base sm:text-lg max-w-2xl mx-auto">
              ติดตามข่าวสารเทคโนโลยีที่ร้อนแรงและน่าสนใจที่สุดในขณะนี้
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-tech-light animate-spin" />
              <span className="ml-2 text-tech-pale text-sm sm:text-base">กำลังโหลดข่าวสาร...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayNews.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.authorName}
                  date={article.date}
                  category={article.categoryName}
                  image={article.image}
                  slug={article.slug}
                  views={article.views}
                  readTime={article.readTime}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <button className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 text-sm sm:text-base">
              ดูข่าวทั้งหมด
            </button>
          </div>
        </div>
      </section>

      <Categories />
      <Footer />
    </div>
  )
}
