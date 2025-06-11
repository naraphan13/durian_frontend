import React from "react";
import { motion } from "framer-motion";
import shinchanImg from "../picture/S__28746280png.png";
import iconImg from "../picture/S__5275654png (2)888.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-lime-50 to-emerald-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 md:p-14 relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 via-yellow-100 to-transparent rounded-bl-full opacity-30"
        />

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold text-emerald-700 text-center mb-3 tracking-tight"
        >
          ล้งทุเรียนสุริยา 388
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 text-lg mb-8"
        >
          ระบบจัดการทุเรียนอัจฉริยะ ที่จะช่วยให้คุณบริหารจัดการง่ายขึ้น
        </motion.p>

        <motion.img
          src={shinchanImg}
          alt="Shinchan น่ารัก"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-40 h-auto mx-auto mb-8 rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-xl mb-10"
        >
          <p className="text-emerald-800 font-medium text-center sm:text-left">
            ระบบรองรับการสร้างบิล แสดงประวัติย้อนหลัง และวิเคราะห์ข้อมูลทุเรียนในแต่ละวันอย่างครบวงจร
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeCard
            delay={0.9}
            title="สร้างบิล"
            desc="เพิ่มรายการซื้อขายทุเรียนในแต่ละรอบ"
            color="from-green-100 to-green-50"
            text="text-green-700"
          />
          <FadeCard
            delay={1.1}
            title="ดูบิลย้อนหลัง"
            desc="เรียกดูข้อมูลย้อนหลังแบบรวดเร็ว"
            color="from-yellow-100 to-yellow-50"
            text="text-yellow-700"
          />
          <FadeCard
            delay={1.3}
            title="สรุปยอดรายวัน"
            desc="วิเคราะห์ยอดขายแบบเรียลไทม์"
            color="from-red-100 to-red-50"
            text="text-red-700"
          />
        </div>
      </motion.div>
    </div>
  );
}

function FadeCard({ title, desc, color, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 transition duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200`}
    >
      <h2 className={`font-semibold text-xl mb-2 ${text}`}>{title}</h2>
      <p className="text-gray-600 text-sm">{desc}</p>
    </motion.div>
  );
}
