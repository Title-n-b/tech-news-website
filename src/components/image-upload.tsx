"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadNewsImage, resizeImage } from "@/lib/firebase"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  newsId: string
  className?: string
}

export default function ImageUpload({ onImageUploaded, currentImage, newsId, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น")
      return
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB")
      return
    }

    try {
      setUploading(true)

      // สร้าง preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // ลดขนาดรูปภาพ
      const resizedFile = await resizeImage(file, 1200, 0.8)

      // อัปโหลดไป Firebase Storage
      const downloadURL = await uploadNewsImage(resizedFile, newsId)

      // ส่ง URL กลับไปยัง parent component
      onImageUploaded(downloadURL)

      // ทำความสะอาด preview URL
      URL.revokeObjectURL(previewUrl)
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error)
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ")
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-white mb-2">รูปภาพข่าว</label>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-tech-blue/20">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={uploading}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-tech-blue/30 rounded-lg p-8 text-center cursor-pointer hover:border-tech-light/50 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-tech-pale/60 mx-auto mb-4" />
          <p className="text-tech-pale mb-2">คลิกเพื่อเลือกรูปภาพ</p>
          <p className="text-tech-pale/60 text-sm">รองรับ JPG, PNG, WebP (ไม่เกิน 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center space-x-2 text-tech-light">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">กำลังอัปโหลด...</span>
        </div>
      )}
    </div>
  )
}
