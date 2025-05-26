import { type NextRequest, NextResponse } from "next/server"

// Mock data สำหรับใช้ในกรณีที่ Firebase ไม่พร้อม
const mockNews = [
  {
    id: "1",
    title: "ChatGPT-5 เปิดตัวแล้ว! ความสามารถใหม่ที่จะเปลี่ยนโลก AI",
    excerpt: "OpenAI เปิดตัว ChatGPT-5 พร้อมความสามารถใหม่ที่ล้ำหน้ากว่าเดิม รองรับการประมวลผลแบบ multimodal และมีความแม่นยำสูงขึ้น",
    author: "somchai-tech",
    authorName: "สมชาย เทคโนโลยี",
    date: "15 ม.ค. 2024",
    category: "ai-ml",
    categoryName: "AI & ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center",
    featured: true,
    tags: ["ChatGPT", "OpenAI", "AI", "Machine Learning", "Technology"],
    readTime: 5,
    slug: "chatgpt-5-launch-new-ai-capabilities",
    views: 15420,
    likes: 892,
    content: "เนื้อหาข่าวสาร ChatGPT-5...",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Next.js 15 เปิดตัวแล้ว พร้อมฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้",
    excerpt: "Vercel เปิดตัว Next.js 15 พร้อมการปรับปรุงประสิทธิภาพและฟีเจอร์ใหม่ที่จะทำให้การพัฒนาเว็บแอปพลิเคชันง่ายขึ้น",
    author: "wichai-coding",
    authorName: "วิชัย โค้ดดิ้ง",
    date: "14 ม.ค. 2024",
    category: "development",
    categoryName: "การพัฒนา",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center",
    featured: false,
    tags: ["Next.js", "React", "Web Development", "JavaScript", "Vercel"],
    readTime: 4,
    slug: "nextjs-15-new-features-developers",
    views: 8930,
    likes: 456,
    content: "เนื้อหาข่าวสาร Next.js 15...",
    createdAt: "2024-01-14T00:00:00.000Z",
    updatedAt: "2024-01-14T00:00:00.000Z",
  },
  {
    id: "3",
    title: "iPhone 16 Pro Max รีวิวเต็ม สเปคใหม่ที่น่าสนใจ",
    excerpt: "รีวิวละเอียด iPhone 16 Pro Max พร้อมการทดสอบประสิทธิภาพ กล้อง และฟีเจอร์ AI ใหม่ที่น่าประทับใจ",
    author: "suda-reviewer",
    authorName: "สุดา รีวิวเวอร์",
    date: "13 ม.ค. 2024",
    category: "mobile",
    categoryName: "มือถือ",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=400&fit=crop&crop=center",
    featured: false,
    tags: ["iPhone", "Apple", "Review", "Mobile", "Smartphone"],
    readTime: 6,
    slug: "iphone-16-pro-max-full-review",
    views: 12340,
    likes: 678,
    content: "เนื้อหารีวิว iPhone 16 Pro Max...",
    createdAt: "2024-01-13T00:00:00.000Z",
    updatedAt: "2024-01-13T00:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limitParam = searchParams.get("limit") || "10"
    const featured = searchParams.get("featured")
    const page = searchParams.get("page") || "1"

    const limitNum = Number.parseInt(limitParam)
    const pageNum = Number.parseInt(page)

    // พยายามใช้ Firebase ก่อน
    try {
      const { db } = await import("@/lib/firebase")
      const { collection, getDocs, query, limit, where } = await import("firebase/firestore")

      if (!db) {
        throw new Error("Database not available")
      }

      let newsQuery

      if (featured === "true") {
        // ใช้ query ง่ายๆ ก่อน ไม่ต้อง orderBy
        newsQuery = query(collection(db, "news"), where("featured", "==", true), limit(limitNum))
      } else if (category) {
        newsQuery = query(collection(db, "news"), where("category", "==", category), limit(limitNum))
      } else {
        // ใช้ query ง่ายๆ ก่อน
        newsQuery = query(collection(db, "news"), limit(limitNum))
      }

      const querySnapshot = await getDocs(newsQuery)
      const news = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      }))

      console.log(`✅ Firebase query successful: ${news.length} items`)

      return NextResponse.json({
        news,
        total: news.length,
        page: pageNum,
        hasMore: news.length === limitNum,
      })
    } catch (firebaseError) {
      console.warn("Firebase query failed, using mock data:", firebaseError)

      // ใช้ mock data แทน
      let filteredNews = [...mockNews]

      if (featured === "true") {
        filteredNews = filteredNews.filter((item) => item.featured)
      } else if (category) {
        filteredNews = filteredNews.filter((item) => item.category === category)
      }

      // จำกัดจำนวน
      const startIndex = (pageNum - 1) * limitNum
      const endIndex = startIndex + limitNum
      const paginatedNews = filteredNews.slice(startIndex, endIndex)

      return NextResponse.json({
        news: paginatedNews,
        total: filteredNews.length,
        page: pageNum,
        hasMore: endIndex < filteredNews.length,
      })
    }
  } catch (error) {
    console.error("Error in news API:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
