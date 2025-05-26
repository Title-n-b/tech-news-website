"use client"

import { Code, Smartphone, Brain, Shield, Cloud, Gamepad2 } from "lucide-react"

const categories = [
  { name: "การพัฒนา", icon: Code, count: 156, color: "from-tech-blue to-tech-light" },
  { name: "มือถือ", icon: Smartphone, count: 89, color: "from-tech-light to-tech-pale" },
  { name: "AI & ML", icon: Brain, count: 234, color: "from-tech-dark to-tech-blue" },
  { name: "ความปลอดภัย", icon: Shield, count: 67, color: "from-tech-navy to-tech-dark" },
  { name: "Cloud", icon: Cloud, count: 123, color: "from-tech-blue to-tech-navy" },
  { name: "เกมส์", icon: Gamepad2, count: 45, color: "from-tech-light to-tech-blue" },
]

export default function Categories() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-tech-navy to-tech-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">หมวดหมู่ข่าวสาร</h2>
          <p className="text-tech-pale text-base sm:text-lg max-w-2xl mx-auto">
            เลือกหมวดหมู่ที่คุณสนใจเพื่อติดตามข่าวสารที่ตรงกับความต้องการ
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-tech-blue/20 rounded-xl p-4 sm:p-6 text-center hover:border-tech-light/40 transition-all duration-300 hover:shadow-lg hover:shadow-tech-blue/10">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 sm:mb-2 group-hover:text-tech-light transition-colors text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-tech-pale/80 text-xs sm:text-sm">{category.count} บทความ</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
