import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, type FirebaseStorage } from "firebase/storage"
import type { FirebaseConfig, FirebaseTestResult, FirestoreRulesCheck } from "./firebase-types"

// Debug: แสดงค่า environment variables (แต่ซ่อนค่าจริง)
console.log("🔍 Firebase Environment Variables:")
console.log(
  "API_KEY:",
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...)`
    : "❌ Missing",
)
console.log(
  "AUTH_DOMAIN:",
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN})`
    : "❌ Missing",
)
console.log(
  "PROJECT_ID:",
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})`
    : "❌ Missing",
)
console.log(
  "STORAGE_BUCKET:",
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET})`
    : "❌ Missing",
)
console.log(
  "MESSAGING_SENDER_ID:",
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID})`
    : "❌ Missing",
)
console.log(
  "APP_ID:",
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    ? `✅ Found (${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.substring(0, 15)}...)`
    : "❌ Missing",
)

// ตรวจสอบว่ามี environment variables ครบ (แก้ไขการตรวจสอบ)
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

// ตรวจสอบแบบง่ายขึ้น
const envVarStatus = requiredEnvVars.map((envVar) => {
  const value = process.env[envVar]
  return {
    name: envVar,
    value: value,
    exists: Boolean(value && value.trim() !== ""),
  }
})

const missingVars = envVarStatus.filter((env) => !env.exists).map((env) => env.name)

console.log("🔍 Environment Variables Status:")
envVarStatus.forEach((env) => {
  console.log(
    `${env.name}: ${env.exists ? "✅ Found" : "❌ Missing"}${env.value ? ` (${env.value.substring(0, 10)}...)` : ""}`,
  )
})

// แสดงจำนวน missing variables
console.log(`📊 Missing variables count: ${missingVars.length}`)
console.log(`📊 Total variables: ${requiredEnvVars.length}`)

if (missingVars.length > 0) {
  console.error("❌ Missing Firebase environment variables:", missingVars)
  console.error("กรุณาตรวจสอบไฟล์ .env.local")
} else {
  console.log("✅ All Firebase environment variables found!")
}

// ตรวจสอบว่ามี env vars หรือไม่ (แก้ไขเงื่อนไข)
const hasFirebaseConfig = missingVars.length === 0

console.log("🔧 Firebase Config Status:", hasFirebaseConfig ? "✅ Complete" : "❌ Incomplete")
console.log("🔧 Missing count:", missingVars.length)

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null
let initializationError: string | null = null

if (hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    }

    console.log("🔥 Initializing Firebase with config:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      storageBucket: firebaseConfig.storageBucket,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAppId: !!firebaseConfig.appId,
    })

    // Initialize Firebase - ป้องกันการ initialize ซ้ำ
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

    // Initialize Firebase services
    db = getFirestore(app)
    auth = typeof window !== "undefined" ? getAuth(app) : null
    storage = getStorage(app)

    console.log("✅ Firebase initialized successfully!")
    console.log("📊 Services status:", {
      app: !!app,
      db: !!db,
      auth: !!auth,
      storage: !!storage,
    })
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error)
    initializationError = error instanceof Error ? error.message : "Unknown initialization error"
  }
} else {
  console.warn("⚠️ Firebase configuration incomplete. Missing variables:", missingVars)
  initializationError = `Missing environment variables: ${missingVars.join(", ")}`
}

export { db, auth, storage, app, initializationError }

// Helper functions สำหรับ Storage
export async function uploadNewsImage(file: File, newsId: string): Promise<string> {
  if (!storage) {
    console.warn("Firebase Storage not available, returning mock URL")
    return `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(file.name)}`
  }

  try {
    // สร้าง reference สำหรับไฟล์
    const timestamp = Date.now()
    const fileName = `${newsId}_${timestamp}_${file.name}`
    const storageRef = ref(storage, `news-images/${fileName}`)

    // อัปโหลดไฟล์
    const snapshot = await uploadBytes(storageRef, file)

    // ดึง download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log("✅ อัปโหลดรูปภาพสำเร็จ:", downloadURL)
    return downloadURL
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปโหลด:", error)
    // Return mock URL as fallback
    return `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(file.name)}`
  }
}

export async function deleteNewsImage(imageUrl: string): Promise<void> {
  if (!storage) {
    console.warn("Firebase Storage not available, skipping delete")
    return
  }

  try {
    // แยก path จาก URL
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)

    if (pathMatch) {
      const imagePath = decodeURIComponent(pathMatch[1])
      const imageRef = ref(storage, imagePath)
      await deleteObject(imageRef)
      console.log("✅ ลบรูปภาพสำเร็จ")
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการลบรูป:", error)
  }
}

// ฟังก์ชันสำหรับ resize รูปภาพ
export function resizeImage(file: File, maxWidth = 800, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      // คำนวณขนาดใหม่
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // วาดรูปใหม่
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // แปลงเป็น blob แล้วเป็น file
      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })
          resolve(resizedFile)
        },
        file.type,
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

export const collections = {
  news: "news",
  categories: "categories",
  authors: "authors",
  comments: "comments",
} as const

// ตรวจสอบว่า Firebase พร้อมใช้งานหรือไม่
export const isFirebaseAvailable = hasFirebaseConfig && !!db && !initializationError

interface TestResult {
  success: boolean
  error?: string
  details?: {
    message?: string
    stack?: string
    suggestion?: string
    missingVars?: string[]
    initializationError?: string
  }
}

// ฟังก์ชันทดสอบการเชื่อมต่อ (ปรับปรุงให้ละเอียดขึ้น)
export async function testFirebaseConnection(): Promise<FirebaseTestResult> {
  if (!hasFirebaseConfig) {
    return {
      success: false,
      error: "Missing environment variables",
      details: { missingVars },
    }
  }

  if (initializationError) {
    return {
      success: false,
      error: `Initialization failed: ${initializationError}`,
      details: { initializationError },
    }
  }

  if (!db) {
    return {
      success: false,
      error: "Firestore not initialized",
    }
  }

  try {
    console.log("🧪 Testing Firebase connection...")

    const { doc, setDoc, getDoc, deleteDoc, serverTimestamp } = await import("firebase/firestore")

    const testDocRef = doc(db, "test", "connection-test")
    const testData = {
      timestamp: serverTimestamp(),
      message: "Connection test successful",
      testId: Math.random().toString(36).substr(2, 9),
    }

    await setDoc(testDocRef, testData)
    console.log("✅ Write test successful")

    const docSnap = await getDoc(testDocRef)
    if (!docSnap.exists()) {
      throw new Error("Document was not created")
    }
    console.log("✅ Read test successful")

    await deleteDoc(testDocRef)
    console.log("✅ Delete test successful")

    console.log("✅ Firebase connection test completed successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error)

    let errorMessage = "Unknown error"
    const errorDetails: TestResult["details"] = {}

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails.message = error.message
      errorDetails.stack = error.stack
    }

    if (errorMessage.includes("permission-denied")) {
      errorMessage = "Permission denied - ตรวจสอบ Firestore Security Rules"
      errorDetails.suggestion = "กรุณาตั้งค่า Firestore Security Rules ให้อนุญาตการเขียนข้อมูล"
    } else if (errorMessage.includes("not-found")) {
      errorMessage = "Project not found - ตรวจสอบ Project ID"
      errorDetails.suggestion = "กรุณาตรวจสอบ NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    } else if (errorMessage.includes("invalid-api-key")) {
      errorMessage = "Invalid API key - ตรวจสอบ API Key"
      errorDetails.suggestion = "กรุณาตรวจสอบ NEXT_PUBLIC_FIREBASE_API_KEY"
    } else if (errorMessage.includes("app-deleted")) {
      errorMessage = "Firebase app was deleted"
      errorDetails.suggestion = "ลองรีเฟรชหน้าเว็บ"
    }

    return {
      success: false,
      error: errorMessage,
      details: errorDetails,
    }
  }
}

// Types for Firebase configuration
// export interface FirebaseConfig {
//   projectId: string
//   authDomain: string
//   storageBucket: string
//   apiKey: string
//   messagingSenderId: string
//   appId: string
// }

export function getFirebaseConfig(): FirebaseConfig | null {
  if (!hasFirebaseConfig) return null

  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  }
}

// ฟังก์ชันสำหรับตรวจสอบ Firestore Rules
export async function checkFirestoreRules(): Promise<FirestoreRulesCheck> {
  if (!db) {
    return { hasRules: false, suggestion: "Firestore not available" }
  }

  try {
    const { doc, getDoc } = await import("firebase/firestore")

    // ลองอ่านข้อมูลจาก collection ที่ไม่มี
    const testDoc = doc(db, "test-rules", "test")
    await getDoc(testDoc)

    return { hasRules: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission-denied")) {
      return {
        hasRules: false,
        suggestion: "Firestore Security Rules ไม่อนุญาตการเข้าถึง กรุณาตั้งค่า Rules ใน Firebase Console",
      }
    }
    return { hasRules: true } // อาจมี rules แต่เกิด error อื่น
  }
}
