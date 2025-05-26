"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ImageUpload from "@/components/image-upload"
import { db, isFirebaseAvailable } from "@/lib/firebase"
import type { FormData } from "@/lib/types"

export default function NewNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    excerpt: "",
    content: "",
    authorName: "",
    categoryName: "",
    image: "",
    featured: false,
    tags: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setLoading(true)

    try {
      const newsData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        date: new Date().toLocaleDateString("th-TH"),
        slug: formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
        views: 0,
        likes: 0,
        readTime: Math.ceil(formData.content.split(" ").length / 200),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // ตรวจสอบว่า Firebase พร้อมใช้งานและ db ไม่เป็น null
      if (!isFirebaseAvailable || !db) {
        console.log("Mock mode: Would save news:", newsData)
        alert("บันทึกข่าวสำเร็จ! (Mock mode)")
        router.push("/admin")
        return
      }

      // Import Firebase functions และใช้งาน
      const { collection, addDoc } = await import("firebase/firestore")
      await addDoc(collection(db, "news"), newsData)

      alert("เพิ่มข่าวสำเร็จ!")
      router.push("/admin")
    } catch (error) {
      console.error("Error adding news:", error)
      alert("เกิดข้อผิดพลาดในการเพิ่มข่าว")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tech-navy via-tech-dark to-tech-navy">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-tech-light hover:text-white transition-colors inline-flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับ</span>
          </button>
          <h1 className="text-3xl font-bold text-white">เพิ่มข่าวใหม่</h1>
        </div>

        {!isFirebaseAvailable && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">โหมดทดสอบ (Mock Mode)</p>
                <p className="text-yellow-300/80 text-sm">Firebase ยังไม่ได้ตั้งค่า ข้อมูลจะไม่ถูกบันทึกจริง</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-8 space-y-6">
            {/* หัวข้อข่าว */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">หัวข้อข่าว *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                placeholder="ใส่หัวข้อข่าว..."
              />
            </div>

            {/* สรุปข่าว */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">สรุปข่าว *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                placeholder="ใส่สรุปข่าว..."
              />
            </div>

            {/* รูปภาพ */}
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={formData.image}
              newsId={`news_${Date.now()}`}
            />

            {/* เนื้อหาข่าว */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">เนื้อหาข่าว *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={15}
                className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                placeholder="ใส่เนื้อหาข่าว... (รองรับ Markdown)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ผู้เขียน */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">ผู้เขียน</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                  placeholder="ชื่อผู้เขียน"
                />
              </div>

              {/* หมวดหมู่ */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">หมวดหมู่</label>
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="การพัฒนา">การพัฒนา</option>
                  <option value="มือถือ">มือถือ</option>
                  <option value="ความปลอดภัย">ความปลอดภัย</option>
                  <option value="Cloud">Cloud</option>
                  <option value="เกมส์">เกมส์</option>
                </select>
              </div>
            </div>

            {/* แท็ก */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">แท็ก</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-3 text-white placeholder-tech-pale/60 focus:outline-none focus:border-tech-light focus:ring-1 focus:ring-tech-light"
                placeholder="แท็ก1, แท็ก2, แท็ก3"
              />
              <p className="text-tech-pale/60 text-sm mt-1">แยกแท็กด้วยเครื่องหมายจุลภาค</p>
            </div>

            {/* ข่าวเด่น */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-tech-blue bg-tech-dark border-tech-blue/30 rounded focus:ring-tech-light"
              />
              <label htmlFor="featured" className="text-white">
                ตั้งเป็นข่าวเด่น
              </label>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-tech-blue/30 text-tech-pale rounded-lg hover:bg-tech-blue/10 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "กำลังบันทึก..." : "บันทึกข่าว"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
