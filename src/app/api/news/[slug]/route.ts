import { type NextRequest, NextResponse } from "next/server"

// Mock data สำหรับข่าวเดี่ยว
const mockNewsDetail = {
  id: "1",
  title: "ChatGPT-5 เปิดตัวแล้ว! ความสามารถใหม่ที่จะเปลี่ยนโลก AI",
  excerpt: "OpenAI เปิดตัว ChatGPT-5 พร้อมความสามารถใหม่ที่ล้ำหน้ากว่าเดิม รองรับการประมวลผลแบบ multimodal และมีความแม่นยำสูงขึ้น",
  content: `
# ChatGPT-5: การปฏิวัติครั้งใหม่ของ AI

OpenAI ได้เปิดตัว **ChatGPT-5** อย่างเป็นทางการ ซึ่งถือเป็นการก้าวกระโดดครั้งใหญ่ในวงการปัญญาประดิษฐ์

## ความสามารถใหม่ที่น่าตื่นตาตื่นใจ

### 1. Multimodal Processing
- รองรับการประมวลผลรูปภาพ เสียง และข้อความพร้อมกัน
- สามารถวิเคราะห์วิดีโอและสร้างเนื้อหาที่เกี่ยวข้อง
- เข้าใจบริบทที่ซับซ้อนมากขึ้น

### 2. ความแม่นยำที่เพิ่มขึ้น
- ลดข้อผิดพลาดในการตอบคำถาม 40%
- ปรับปรุงการเข้าใจภาษาไทยและภาษาท้องถิ่น
- สามารถแก้ไขข้อผิดพลาดของตัวเองได้

## สรุป

ChatGPT-5 ไม่ใช่แค่การอัปเกรด แต่เป็นการปฏิวัติที่จะเปลี่ยนแปลงวิธีที่เราใช้งาน AI ในชีวิตประจำวัน
  `,
  author: "somchai-tech",
  authorName: "สมชาย เทคโนโลยี",
  date: "15 ม.ค. 2024",
  category: "ai-ml",
  categoryName: "AI & ML",
  image: "/placeholder.svg?height=400&width=600",
  featured: true,
  tags: ["ChatGPT", "OpenAI", "AI", "Machine Learning", "Technology"],
  readTime: 5,
  slug: "chatgpt-5-launch-new-ai-capabilities",
  views: 15420,
  likes: 892,
  createdAt: "2024-01-15T00:00:00.000Z",
  updatedAt: "2024-01-15T00:00:00.000Z",
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // พยายามใช้ Firebase ก่อน
    try {
      const { db, isFirebaseAvailable } = await import("@/lib/firebase")

      // ตรวจสอบว่า Firebase พร้อมใช้งานและ db ไม่เป็น null
      if (!isFirebaseAvailable || !db) {
        throw new Error("Firebase not available")
      }

      const { collection, query, where, getDocs, doc, updateDoc, increment } = await import("firebase/firestore")

      const newsQuery = query(collection(db, "news"), where("slug", "==", slug))

      const querySnapshot = await getDocs(newsQuery)

      if (querySnapshot.empty) {
        return NextResponse.json({ error: "News not found" }, { status: 404 })
      }

      const newsDoc = querySnapshot.docs[0]
      const newsData = {
        id: newsDoc.id,
        ...newsDoc.data(),
        createdAt: newsDoc.data().createdAt?.toDate?.()?.toISOString() || newsDoc.data().createdAt,
        updatedAt: newsDoc.data().updatedAt?.toDate?.()?.toISOString() || newsDoc.data().updatedAt,
      }

      // เพิ่มจำนวนการดู
      await updateDoc(doc(db, "news", newsDoc.id), {
        views: increment(1),
      })

      return NextResponse.json(newsData)
    } catch (firebaseError) {
      console.warn("Firebase not available, using mock data:", firebaseError)

      // ใช้ mock data แทน
      if (slug === mockNewsDetail.slug) {
        return NextResponse.json(mockNewsDetail)
      } else {
        return NextResponse.json({ error: "News not found" }, { status: 404 })
      }
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
