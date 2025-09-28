"use client";
import Image from "next/image";
import { useMemo } from "react";

const MOCK_PLOTS = [
  { id: "1344", name: "แปลงข้าวโพด", province: "นนทบุรี" },
  { id: "A-22", name: "แปลงไม้ยืนต้น", province: "ชัยนาท" },
  { id: "B-09", name: "แปลงมันสำปะหลัง", province: "สระบุรี" },
  { id: "C-77", name: "แปลงข้าว", province: "อยุธยา" },
];
const PLOT_IMAGES  = [
  "/Screenshot 2025-09-17 173152.PNG",
  "/Screenshot 2025-09-17 173158.PNG",
  "/Screenshot 2025-09-17 173207.PNG",
  "/Screenshot 2025-09-17 173216.PNG",
];

export default function PlotImage({ plotId }: { plotId: string }) {
  // หาตำแหน่ง index ของแปลง
  const idx = MOCK_PLOTS.findIndex((p) => p.id === plotId);
  // ถ้าไม่เจอ ใช้รูปแรกเป็น default
  const src = PLOT_IMAGES[idx >= 0 ? idx : 0];

  return (
    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
      <Image
        key={src} // ให้ Next.js render ใหม่เมื่อ src เปลี่ยน
        src={src}
        alt={`plot ${plotId}`}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}