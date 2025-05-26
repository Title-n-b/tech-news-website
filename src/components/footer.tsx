"use client";

import { Facebook, Twitter, Youtube, Github, Mail } from "lucide-react";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-tech-navy border-t border-tech-blue/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="https://img.icons8.com/?size=100&id=lIabI5WM659d&format=png&color=000000"
                alt="TechNews Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
              <span className="text-white font-tech font-bold text-xl">
                TechNews
              </span>
            </div>

            <p className="text-tech-pale mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              ศูนย์รวมข่าวสารเทคโนโลยีที่ทันสมัย ติดตามเทรนด์ใหม่ๆ
              และนวัตกรรมที่จะเปลี่ยนโลกในอนาคต
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-tech-pale hover:text-tech-light transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-tech-pale hover:text-tech-light transition-colors text-sm sm:text-base"
                >
                  เกี่ยวกับเรา
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-tech-pale hover:text-tech-light transition-colors text-sm sm:text-base"
                >
                  ติดต่อเรา
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-tech-pale hover:text-tech-light transition-colors text-sm sm:text-base"
                >
                  นโยบายความเป็นส่วนตัว
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-tech-pale hover:text-tech-light transition-colors text-sm sm:text-base"
                >
                  เงื่อนไขการใช้งาน
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              รับข่าวสาร
            </h3>
            <p className="text-tech-pale mb-4 text-sm">
              สมัครรับข่าวสารล่าสุดทางอีเมล
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="bg-tech-dark/50 border border-tech-blue/30 rounded-lg px-4 py-2 text-tech-pale placeholder-tech-pale/60 focus:outline-none focus:border-tech-light flex-1 text-sm"
              />
              <button className="bg-gradient-to-r from-tech-blue to-tech-light text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-tech-blue/25 transition-all duration-300 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-tech-blue/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-tech-pale/80 text-sm">
            © 2024 TechNews. สงวนลิขสิทธิ์ทุกประการ
          </p>
        </div>
      </div>
    </footer>
  );
}
