import { NextResponse } from "next/server"

// Mock categories data
const mockCategories = [
  {
    id: "ai-ml",
    name: "AI & ML",
    slug: "ai-ml",
    description: "ข่าวสารเกี่ยวกับปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง",
    count: 234,
    icon: "Brain",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "development",
    name: "การพัฒนา",
    slug: "development",
    description: "เทคนิคและเครื่องมือสำหรับการพัฒนาซอฟต์แวร์",
    count: 156,
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "mobile",
    name: "มือถือ",
    slug: "mobile",
    description: "ข่าวสารเกี่ยวกับเทคโนโลยีมือถือและแอปพลิเคชัน",
    count: 89,
    icon: "Smartphone",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "security",
    name: "ความปลอดภัย",
    slug: "security",
    description: "ข่าวสารด้านความปลอดภัยทางไซเบอร์",
    count: 67,
    icon: "Shield",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "cloud",
    name: "Cloud",
    slug: "cloud",
    description: "เทคโนโลยี Cloud Computing และบริการคลาวด์",
    count: 123,
    icon: "Cloud",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "gaming",
    name: "เกมส์",
    slug: "gaming",
    description: "ข่าวสารเกี่ยวกับการพัฒนาเกมและเทคโนโลยีเกม",
    count: 45,
    icon: "Gamepad2",
    color: "from-yellow-500 to-red-500",
  },
]

export async function GET() {
  try {
    // พยายามใช้ Firebase ก่อน
    try {
      const { db, isFirebaseAvailable } = await import("@/lib/firebase")

      // ตรวจสอบว่า Firebase พร้อมใช้งานและ db ไม่เป็น null
      if (!isFirebaseAvailable || !db) {
        throw new Error("Firebase not available")
      }

      const { collection, getDocs, query, orderBy } = await import("firebase/firestore")

      const categoriesQuery = query(collection(db, "categories"), orderBy("name", "asc"))

      const querySnapshot = await getDocs(categoriesQuery)
      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return NextResponse.json(categories)
    } catch (firebaseError) {
      console.warn("Firebase not available, using mock data:", firebaseError)

      // ใช้ mock data แทน
      return NextResponse.json(mockCategories)
    }
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
