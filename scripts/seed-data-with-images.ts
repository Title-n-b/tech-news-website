import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import dotenv from "dotenv"

// โหลด environment variables
dotenv.config({ path: ".env.local" })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// ฟังก์ชันสำหรับสร้างรูปภาพตัวอย่าง
async function createSampleImage(text: string, width = 800, height = 400): Promise<string> {
  try {
    // สร้าง canvas
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = width
    canvas.height = height

    // สีพื้นหลัง gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#1e3a8a")
    gradient.addColorStop(1, "#3b82f6")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // เขียนข้อความ
    ctx.fillStyle = "white"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // แบ่งข้อความหลายบรรทัด
    const words = text.split(" ")
    const lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width_test = ctx.measureText(currentLine + " " + word).width
      if (width_test < canvas.width - 100) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)

    // วาดข้อความ
    const lineHeight = 40
    const startY = (canvas.height - lines.length * lineHeight) / 2
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
    })

    // แปลงเป็น blob
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          // อัปโหลดไป Firebase Storage
          const fileName = `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`
          const storageRef = ref(storage, `news-images/${fileName}`)

          const snapshot = await uploadBytes(storageRef, blob)
          const downloadURL = await getDownloadURL(snapshot.ref)

          resolve(downloadURL)
        }
      }, "image/png")
    })
  } catch (error) {
    console.error("Error creating sample image:", error)
    return "/placeholder.svg?height=400&width=800"
  }
}

// ข้อมูลข่าวสารพร้อมรูปภาพ
const newsArticlesWithImages = [
  {
    title: "ChatGPT-5 เปิดตัวแล้ว! ความสามารถใหม่ที่จะเปลี่ยนโลก AI",
    excerpt: "OpenAI เปิดตัว ChatGPT-5 พร้อมความสามารถใหม่ที่ล้ำหน้ากว่าเดิม รองรับการประมวลผลแบบ multimodal และมีความแม่นยำสูงขึ้น",
    content: `# ChatGPT-5: การปฏิวัติครั้งใหม่ของ AI\n\nOpenAI ได้เปิดตัว **ChatGPT-5** อย่างเป็นทางการ ซึ่งถือเป็นการก้าวกระโดดครั้งใหญ่ในวงการปัญญาประดิษฐ์`,
    authorName: "สมชาย เทคโนโลยี",
    categoryName: "AI & ML",
    featured: true,
    tags: ["ChatGPT", "OpenAI", "AI"],
  },
  {
    title: "Next.js 15 เปิดตัวแล้ว พร้อมฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้",
    excerpt: "Vercel เปิดตัว Next.js 15 พร้อมการปรับปรุงประสิทธิภาพและฟีเจอร์ใหม่",
    content: `# Next.js 15: ฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้\n\nVercel ได้เปิดตัว **Next.js 15** พร้อมฟีเจอร์ใหม่`,
    authorName: "วิชัย โค้ดดิ้ง",
    categoryName: "การพัฒนา",
    featured: false,
    tags: ["Next.js", "React"],
  },
]

async function seedDataWithImages() {
  try {
    console.log("🌱 เริ่มเพิ่มข้อมูลพร้อมรูปภาพ...")

    for (const article of newsArticlesWithImages) {
      console.log(`📸 สร้างรูปภาพสำหรับ: ${article.title}`)

      // สร้างรูปภาพตัวอย่าง
      const imageUrl = await createSampleImage(article.title)

      const newsData = {
        ...article,
        image: imageUrl,
        date: new Date().toLocaleDateString("th-TH"),
        slug: article.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        readTime: Math.ceil(article.content.split(" ").length / 200),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await addDoc(collection(db, "news"), newsData)
      console.log(`✅ เพิ่มข่าวพร้อมรูป: ${article.title}`)
    }

    console.log("🎉 เพิ่มข้อมูลพร้อมรูปภาพเสร็จสิ้น!")
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error)
  }
}

// รันเฉพาะใน browser environment
if (typeof window !== "undefined") {
  seedDataWithImages()
}
