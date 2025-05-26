"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, AlertTriangle, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { db, isFirebaseAvailable } from "@/lib/firebase"
import type { AdminNewsItem } from "@/lib/types"

// Mock data สำหรับใช้เมื่อไม่มี Firebase
const mockNews: AdminNewsItem[] = [
  {
    id: "1",
    title: "ChatGPT-5 เปิดตัวแล้ว! ความสามารถใหม่ที่จะเปลี่ยนโลก AI",
    excerpt: "OpenAI เปิดตัว ChatGPT-5 พร้อมความสามารถใหม่ที่ล้ำหน้ากว่าเดิม",
    authorName: "สมชาย เทคโนโลยี",
    date: "15 ม.ค. 2024",
    categoryName: "AI & ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center",
    featured: true,
    views: 15420,
  },
  {
    id: "2",
    title: "Next.js 15 เปิดตัวแล้ว พร้อมฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้",
    excerpt: "Vercel เปิดตัว Next.js 15 พร้อมการปรับปรุงประสิทธิภาพและฟีเจอร์ใหม่",
    authorName: "วิชัย โค้ดดิ้ง",
    date: "14 ม.ค. 2024",
    categoryName: "การพัฒนา",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center",
    featured: false,
    views: 8930,
  },
]

export default function AdminPage() {
  const [news, setNews] = useState<AdminNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      // ตรวจสอบว่า Firebase พร้อมใช้งานและ db ไม่เป็น null
      if (!isFirebaseAvailable || !db) {
        console.warn("Firebase not available, using mock data")
        setNews(mockNews)
        setLoading(false)
        return
      }

      const { collection, getDocs } = await import("firebase/firestore")
      const querySnapshot = await getDocs(collection(db, "news"))
      const newsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminNewsItem[]

      setNews(newsData)
    } catch (error) {
      console.error("Error fetching news:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      // Fallback to mock data
      setNews(mockNews)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?")) {
      try {
        // ตรวจสอบว่า Firebase พร้อมใช้งานและ db ไม่เป็น null
        if (!isFirebaseAvailable || !db) {
          // Mock delete
          setNews(news.filter((item) => item.id !== id))
          alert("ลบข่าวสำเร็จ (Mock mode)")
          return
        }

        const { deleteDoc, doc } = await import("firebase/firestore")
        await deleteDoc(doc(db, "news", id))
        setNews(news.filter((item) => item.id !== id))
        alert("ลบข่าวสำเร็จ")
      } catch (error) {
        console.error("Error deleting news:", error)
        alert("เกิดข้อผิดพลาดในการลบข่าว")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Status Banner */}
        {!isFirebaseAvailable && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm sm:text-base">โหมดทดสอบ (Mock Mode)</p>
                  <p className="text-yellow-300/80 text-xs sm:text-sm">Firebase ยังไม่ได้ตั้งค่า กำลังใช้ข้อมูลตัวอย่าง</p>
                </div>
              </div>
              <Link
                href="/debug"
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors self-start sm:self-auto"
              >
                <Settings className="w-4 h-4" />
                <span>Debug Info</span>
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium text-sm sm:text-base">เกิดข้อผิดพลาด</p>
                <p className="text-red-300/80 text-xs sm:text-sm break-words">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">จัดการข่าวสาร</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link
              href="/debug"
              className="border border-tech-blue/30 text-tech-pale px-4 py-2 rounded-lg hover:bg-tech-blue/10 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Debug</span>
            </Link>
            <Link
              href="/admin/news/new"
              className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>เพิ่มข่าวใหม่</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-tech-pale">กำลังโหลด...</div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-tech-blue/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">รูปภาพ</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">หัวข้อ</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">หมวดหมู่</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">ผู้เขียน</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">วันที่</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">การดู</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id} className="border-t border-tech-blue/10 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=64&h=48&fit=crop&crop=center"
                            }
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium line-clamp-2 max-w-xs">{item.title}</div>
                        {item.featured && (
                          <span className="inline-block bg-yellow-500 text-black text-xs px-2 py-1 rounded mt-1">
                            เด่น
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-tech-pale">{item.categoryName}</td>
                      <td className="px-6 py-4 text-tech-pale">{item.authorName}</td>
                      <td className="px-6 py-4 text-tech-pale">{item.date}</td>
                      <td className="px-6 py-4 text-tech-pale">{item.views?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/news/${item.id}`}
                            className="text-tech-light hover:text-white transition-colors"
                            title="ดู"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/news/edit/${item.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white/5 border border-tech-blue/20 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=80&h=64&fit=crop&crop=center"
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-tech-pale mb-3">
                        <span>{item.categoryName}</span>
                        <span>•</span>
                        <span>{item.authorName}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-tech-pale">
                          <Eye className="w-3 h-3" />
                          <span>{item.views?.toLocaleString() || 0}</span>
                          {item.featured && (
                            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs ml-2">เด่น</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/news/${item.id}`}
                            className="text-tech-light hover:text-white transition-colors p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/news/edit/${item.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
