import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TechNews - ศูนย์รวมข่าวสาร IT ที่ทันสมัย",
  description: "ติดตามข่าวสารเทคโนโลยี AI การพัฒนาซอฟต์แวร์ และนวัตกรรมล่าสุดที่จะเปลี่ยนโลกในอนาคต",
  keywords: "ข่าวสาร IT, เทคโนโลยี, AI, การพัฒนา, ซอฟต์แวร์, นวัตกรรม",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
