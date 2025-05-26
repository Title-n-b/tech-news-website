import { db, isFirebaseAvailable } from "./firebase"
import type { NewsArticle, AdminNewsItem } from "./types"

// Helper function สำหรับดึงข่าวทั้งหมด
export async function getAllNews(): Promise<AdminNewsItem[]> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Firebase not available")
  }

  const { collection, getDocs, orderBy, query } = await import("firebase/firestore")
  const newsQuery = query(collection(db, "news"), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(newsQuery)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AdminNewsItem[]
}

// Helper function สำหรับเพิ่มข่าวใหม่
export async function addNews(newsData: Omit<NewsArticle, "id">): Promise<string> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Firebase not available")
  }

  const { collection, addDoc } = await import("firebase/firestore")
  const docRef = await addDoc(collection(db, "news"), newsData)
  return docRef.id
}

// Helper function สำหรับลบข่าว
export async function deleteNews(newsId: string): Promise<void> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Firebase not available")
  }

  const { doc, deleteDoc } = await import("firebase/firestore")
  await deleteDoc(doc(db, "news", newsId))
}

// Helper function สำหรับดึงข่าวเดี่ยว
export async function getNewsById(newsId: string): Promise<NewsArticle | null> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Firebase not available")
  }

  const { doc, getDoc } = await import("firebase/firestore")
  const docSnap = await getDoc(doc(db, "news", newsId))

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as NewsArticle
  }

  return null
}

// Helper function สำหรับอัปเดตข่าว
export async function updateNews(newsId: string, newsData: Partial<NewsArticle>): Promise<void> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Firebase not available")
  }

  const { doc, updateDoc } = await import("firebase/firestore")
  await updateDoc(doc(db, "news", newsId), {
    ...newsData,
    updatedAt: new Date(),
  })
}
