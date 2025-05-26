import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore"

// Firebase config (ใส่ค่าจริงของคุณ)
const firebaseConfig = {
  apiKey: "AIzaSyCddiU94kJ8U-bePg3aK3m5LbTfFfyKkxM",
  authDomain: "tech-news-website.firebaseapp.com",
  projectId: "tech-news-website",
  storageBucket: "tech-news-website.firebasestorage.app",
  messagingSenderId: "333457670660",
  appId: "1:333457670660:web:f04101a28c98dd998aeb51",
  measurementId: "G-QCHJL76GPH"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ข้อมูลหมวดหมู่
const categories = [
  {
    id: "ai-ml",
    name: "AI & ML",
    slug: "ai-ml",
    description: "ข่าวสารเกี่ยวกับปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง",
    count: 0,
    icon: "Brain",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "development",
    name: "การพัฒนา",
    slug: "development",
    description: "เทคนิคและเครื่องมือสำหรับการพัฒนาซอฟต์แวร์",
    count: 0,
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "mobile",
    name: "มือถือ",
    slug: "mobile",
    description: "ข่าวสารเกี่ยวกับเทคโนโลยีมือถือและแอปพลิเคชัน",
    count: 0,
    icon: "Smartphone",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "security",
    name: "ความปลอดภัย",
    slug: "security",
    description: "ข่าวสารด้านความปลอดภัยทางไซเบอร์",
    count: 0,
    icon: "Shield",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "cloud",
    name: "Cloud",
    slug: "cloud",
    description: "เทคโนโลยี Cloud Computing และบริการคลาวด์",
    count: 0,
    icon: "Cloud",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "gaming",
    name: "เกมส์",
    slug: "gaming",
    description: "ข่าวสารเกี่ยวกับการพัฒนาเกมและเทคโนโลยีเกม",
    count: 0,
    icon: "Gamepad2",
    color: "from-yellow-500 to-red-500",
  },
]

// ข้อมูลผู้เขียน
const authors = [
  {
    id: "somchai-tech",
    name: "สมชาย เทคโนโลยี",
    bio: "นักเขียนด้านเทคโนโลยีที่มีประสบการณ์กว่า 10 ปี เชี่ยวชาญด้าน AI และ Machine Learning",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "somchai@technews.com",
    social: {
      twitter: "@somchai_tech",
      linkedin: "somchai-technology",
      github: "somchai-dev",
    },
  },
  {
    id: "wichai-coding",
    name: "วิชัย โค้ดดิ้ง",
    bio: "Full-stack Developer และนักเขียนเทคนิค เชี่ยวชาญด้าน React, Next.js และ Node.js",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "wichai@technews.com",
    social: {
      twitter: "@wichai_dev",
      linkedin: "wichai-coding",
      github: "wichai-fullstack",
    },
  },
  {
    id: "suda-reviewer",
    name: "สุดา รีวิวเวอร์",
    bio: "นักรีวิวเทคโนโลยีและแกดเจ็ต มีประสบการณ์ในการทดสอบและรีวิวผลิตภัณฑ์เทคโนโลยี",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "suda@technews.com",
    social: {
      twitter: "@suda_review",
      linkedin: "suda-reviewer",
      website: "https://sudareview.com",
    },
  },
]

// ข้อมูลข่าวสาร
const newsArticles = [
  {
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

### 3. การเรียนรู้แบบ Real-time
- อัปเดตความรู้ได้ทันที
- เรียนรู้จากการโต้ตอบกับผู้ใช้
- ปรับปรุงประสิทธิภาพอย่างต่อเนื่อง

## ผลกระทบต่ออุตสาหกรรม

การเปิดตัว ChatGPT-5 คาดว่าจะส่งผลกระทบอย่างมากต่อ:
- อุตสาหกรรมการศึกษา
- การพัฒนาซอฟต์แวร์
- การสร้างเนื้อหา
- การบริการลูกค้า

## สรุป

ChatGPT-5 ไม่ใช่แค่การอัปเกรด แต่เป็นการปฏิวัติที่จะเปลี่ยนแปลงวิธีที่เราใช้งาน AI ในชีวิตประจำวัน
    `,
    author: "somchai-tech",
    authorName: "สมชาย เทคโนโลยี",
    date: "2024-01-15",
    category: "ai-ml",
    categoryName: "AI & ML",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    tags: ["ChatGPT", "OpenAI", "AI", "Machine Learning", "Technology"],
    readTime: 5,
    slug: "chatgpt-5-launch-new-ai-capabilities",
    views: 15420,
    likes: 892,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    title: "Next.js 15 เปิดตัวแล้ว พร้อมฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้",
    excerpt: "Vercel เปิดตัว Next.js 15 พร้อมการปรับปรุงประสิทธิภาพและฟีเจอร์ใหม่ที่จะทำให้การพัฒนาเว็บแอปพลิเคชันง่ายขึ้น",
    content: `
# Next.js 15: ฟีเจอร์ใหม่ที่นักพัฒนาต้องรู้

Vercel ได้เปิดตัว **Next.js 15** พร้อมฟีเจอร์ใหม่ที่จะเปลี่ยนแปลงการพัฒนาเว็บแอปพลิเคชัน

## ฟีเจอร์เด่นใน Next.js 15

### 1. React 19 Support
- รองรับ React 19 อย่างเต็มรูปแบบ
- ใช้ Server Components ได้อย่างมีประสิทธิภาพ
- ปรับปรุง Hydration process

### 2. Turbopack Dev (Stable)
- เร็วขึ้น 700% เมื่อเทียบกับ Webpack
- Hot reload ที่รวดเร็วกว่า
- รองรับ TypeScript และ CSS modules

### 3. Async Request APIs
- ใช้ async/await ใน Server Components
- ปรับปรุงการจัดการ data fetching
- ลดความซับซ้อนในการเขียนโค้ด

### 4. Enhanced Forms
- ใช้ next/form สำหรับ client-side navigation
- ปรับปรุงประสิทธิภาพของฟอร์ม
- รองรับ Progressive Enhancement

## การอัปเกรด

\`\`\`bash
npm install next@15
\`\`\`

## สรุป

Next.js 15 เป็นการอัปเดตที่สำคัญที่จะช่วยให้นักพัฒนาสร้างเว็บแอปพลิเคชันได้เร็วและมีประสิทธิภาพมากขึ้น
    `,
    author: "wichai-coding",
    authorName: "วิชัย โค้ดดิ้ง",
    date: "2024-01-14",
    category: "development",
    categoryName: "การพัฒนา",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
    tags: ["Next.js", "React", "Web Development", "JavaScript", "Vercel"],
    readTime: 4,
    slug: "nextjs-15-new-features-developers",
    views: 8930,
    likes: 456,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    title: "iPhone 16 Pro Max รีวิวเต็ม สเปคใหม่ที่น่าสนใจ",
    excerpt: "รีวิวละเอียด iPhone 16 Pro Max พร้อมการทดสอบประสิทธิภาพ กล้อง และฟีเจอร์ AI ใหม่ที่น่าประทับใจ",
    content: `
# iPhone 16 Pro Max: รีวิวเต็มรูปแบบ

Apple ได้เปิดตัว **iPhone 16 Pro Max** พร้อมฟีเจอร์ใหม่ที่น่าตื่นตาตื่นใจ

## สเปคเด่น

### 1. ชิป A18 Pro
- ประสิทธิภาพเพิ่มขึ้น 20%
- ประหยัดพลังงานมากขึ้น 15%
- รองรับ AI processing

### 2. ระบบกล้อง
- กล้องหลัก 48MP พร้อม sensor ใหม่
- กล้อง Ultra Wide 12MP
- กล้อง Telephoto 12MP พร้อม zoom 5x
- ฟีเจอร์ Night mode ที่ดีขึ้น

### 3. หน้าจอ
- Super Retina XDR 6.9 นิ้ว
- ProMotion 120Hz
- Dynamic Island ที่ปรับปรุงใหม่

### 4. ฟีเจอร์ AI ใหม่
- Siri ที่ฉลาดขึ้น
- การแปลภาษาแบบ real-time
- การจดจำใบหน้าที่แม่นยำขึ้น

## การทดสอบประสิทธิภาพ

### Benchmark Scores
- AnTuTu: 1,250,000
- Geekbench 6: Single-core 2,800, Multi-core 7,200
- 3DMark: 15,500

### แบตเตอรี่
- ใช้งานได้ 18-20 ชั่วโมง
- ชาร์จเร็ว 30W
- ชาร์จไร้สาย 15W

## สรุป

iPhone 16 Pro Max เป็นสมาร์ทโฟนที่มีประสิทธิภาพสูงสุดในปัจจุบัน เหมาะสำหรับผู้ที่ต้องการประสิทธิภาพสูงสุด
    `,
    author: "suda-reviewer",
    authorName: "สุดา รีวิวเวอร์",
    date: "2024-01-13",
    category: "mobile",
    categoryName: "มือถือ",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
    tags: ["iPhone", "Apple", "Review", "Mobile", "Smartphone"],
    readTime: 6,
    slug: "iphone-16-pro-max-full-review",
    views: 12340,
    likes: 678,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    title: "Cybersecurity 2024: แนวโน้มภัยคุกคามใหม่ที่ต้องระวัง",
    excerpt: "วิเคราะห์แนวโน้มภัยคุกคามทางไซเบอร์ในปี 2024 และวิธีการป้องกันที่องค์กรควรเตรียมพร้อม",
    content: `
# Cybersecurity 2024: ภัยคุกคามใหม่ที่ต้องระวัง

ในปี 2024 ภัยคุกคามทางไซเบอร์มีความซับซ้อนและอันตรายมากขึ้น

## แนวโน้มภัยคุกคามหลัก

### 1. AI-Powered Attacks
- การใช้ AI ในการสร้าง malware
- Deepfake สำหรับการหลอกลวง
- Automated phishing attacks

### 2. Ransomware as a Service (RaaS)
- การขายเครื่องมือ ransomware
- เป้าหมายเปลี่ยนเป็น SMEs
- การเรียกค่าไถ่ที่สูงขึ้น

### 3. Supply Chain Attacks
- การโจมตีผ่าน third-party vendors
- การแทรกซึม software dependencies
- การโจมตี cloud services

### 4. IoT Security Threats
- อุปกรณ์ IoT ที่ไม่ปลอดภัย
- Botnet จากอุปกรณ์ smart home
- การโจมตี industrial IoT

## วิธีการป้องกัน

### สำหรับองค์กร
1. **Zero Trust Architecture**
   - ตรวจสอบทุก access request
   - Micro-segmentation
   - Continuous monitoring

2. **Employee Training**
   - การฝึกอบรมด้านความปลอดภัย
   - Phishing simulation
   - Security awareness program

3. **Incident Response Plan**
   - แผนรับมือเหตุการณ์
   - การสำรองข้อมูล
   - การทดสอบระบบป้องกัน

### สำหรับบุคคลทั่วไป
1. **Strong Authentication**
   - ใช้ 2FA/MFA
   - Password manager
   - Biometric authentication

2. **Regular Updates**
   - อัปเดต OS และ software
   - ใช้ antivirus ที่ทันสมัย
   - ตรวจสอบ privacy settings

## สรุป

การเตรียมพร้อมรับมือภัยคุกคามทางไซเบอร์ในปี 2024 ต้องอาศัยการร่วมมือระหว่างเทคโนโลยี กระบวนการ และคน
    `,
    author: "somchai-tech",
    authorName: "สมชาย เทคโนโลยี",
    date: "2024-01-12",
    category: "security",
    categoryName: "ความปลอดภัย",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
    tags: ["Cybersecurity", "Security", "Threats", "Protection", "2024"],
    readTime: 7,
    slug: "cybersecurity-2024-new-threats-trends",
    views: 9876,
    likes: 543,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    title: "AWS เปิดตัวบริการ Cloud ใหม่ เน้นประสิทธิภาพสูง",
    excerpt: "Amazon Web Services เปิดตัวบริการใหม่ที่เน้นประสิทธิภาพสูงและลดต้นทุน เหมาะสำหรับธุรกิจขนาดใหญ่",
    content: `
# AWS เปิดตัวบริการ Cloud ใหม่

Amazon Web Services ได้เปิดตัวบริการใหม่ที่จะเปลี่ยนแปลงวงการ cloud computing

## บริการใหม่ที่เปิดตัว

### 1. EC2 X2iezn Instances
- ประสิทธิภาพสูงสุดสำหรับ memory-intensive workloads
- RAM สูงสุด 4TB
- เหมาะสำหรับ in-memory databases

### 2. Lambda SnapStart
- เริ่มต้น function เร็วขึ้น 90%
- รองรับ Java applications
- ลดค่าใช้จ่าย cold start

### 3. RDS Blue/Green Deployments
- การ deploy ที่ไม่มี downtime
- การทดสอบที่ปลอดภัย
- Rollback ได้ทันที

### 4. CloudWatch Cross-Account Observability
- ติดตามข้ามหลาย AWS accounts
- Centralized monitoring
- ปรับปรุง security และ compliance

## ประโยชน์สำหรับธุรกิจ

### ลดต้นทุน
- ประหยัดค่าใช้จ่าย 30-50%
- Pay-as-you-use model
- Automatic scaling

### เพิ่มประสิทธิภาพ
- Response time ที่เร็วขึ้น
- High availability 99.99%
- Global infrastructure

### ความปลอดภัย
- Encryption ทุกระดับ
- Compliance standards
- Identity and access management

## การใช้งาน

### สำหรับ Startups
- เริ่มต้นด้วยต้นทุนต่ำ
- Scale ได้ตามการเติบโต
- ไม่ต้องลงทุน infrastructure

### สำหรับ Enterprise
- Migration จาก on-premise
- Hybrid cloud solutions
- Multi-region deployment

## สรุป

บริการใหม่ของ AWS จะช่วยให้ธุรกิจสามารถใช้ประโยชน์จาก cloud computing ได้อย่างเต็มประสิทธิภาพ
    `,
    author: "wichai-coding",
    authorName: "วิชัย โค้ดดิ้ง",
    date: "2024-01-11",
    category: "cloud",
    categoryName: "Cloud",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
    tags: ["AWS", "Cloud", "Amazon", "Infrastructure", "Services"],
    readTime: 5,
    slug: "aws-new-cloud-services-high-performance",
    views: 7654,
    likes: 321,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
]

// ฟังก์ชันสำหรับเพิ่มข้อมูล
async function seedData() {
  try {
    console.log("🌱 เริ่มเพิ่มข้อมูลตัวอย่าง...")

    // เพิ่มหมวดหมู่
    console.log("📁 เพิ่มหมวดหมู่...")
    for (const category of categories) {
      await setDoc(doc(db, "categories", category.id), category)
      console.log(`✅ เพิ่มหมวดหมู่: ${category.name}`)
    }

    // เพิ่มผู้เขียน
    console.log("👤 เพิ่มผู้เขียน...")
    for (const author of authors) {
      await setDoc(doc(db, "authors", author.id), author)
      console.log(`✅ เพิ่มผู้เขียน: ${author.name}`)
    }

    // เพิ่มข่าวสาร
    console.log("📰 เพิ่มข่าวสาร...")
    for (const article of newsArticles) {
      await addDoc(collection(db, "news"), article)
      console.log(`✅ เพิ่มข่าว: ${article.title}`)
    }

    console.log("🎉 เพิ่มข้อมูลตัวอย่างเสร็จสิ้น!")
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error)
  }
}

// รันฟังก์ชัน
seedData()
