"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Plot = {
  id: string; name: string; area_rai: number; area_text: string;
  lat: number; lon: number; province: string; amphoe: string;
  crop: string; season: "นาปี" | "นาปรัง" | "ฤดูฝน" | "ฤดูแล้ง";
};

const MOCK_PLOTS: Plot[] = [
  { id:"TH-AF-001", name:"แปลงข้าวโพด-นายกฤษ", area_rai:32, area_text:"32 ไร่", lat:18.0412, lon:99.2976, province:"ตาก", amphoe:"แม่สอด", crop:"ข้าวโพดเลี้ยงสัตว์", season:"ฤดูฝน" },
  { id:"TH-RC-002", name:"นาข้าว-นายสุทัต", area_rai:18, area_text:"18 ไร่", lat:16.2455, lon:102.8391, province:"ขอนแก่น", amphoe:"บ้านไผ่", crop:"ข้าวหอมมะลิ", season:"นาปี" },
  { id:"TH-SC-003", name:"สวนอ้อย-นางสาวจิรดา", area_rai:50, area_text:"50 ไร่", lat:9.1402, lon:99.3219, province:"สุราษฎร์ธานี", amphoe:"พุนพิน", crop:"อ้อย", season:"ฤดูฝน" },
  { id:"TH-NN-004", name:"มันสำปะหลัง-นายประวิน", area_rai:24, area_text:"24 ไร่", lat:14.5167, lon:101.3901, province:"นครราชสีมา", amphoe:"ปากช่อง", crop:"มันสำปะหลัง", season:"ฤดูฝน" },
  { id:"TH-CM-005", name:"ลิ้นจี่กึ่งป่า-นางมณี", area_rai:15, area_text:"15 ไร่", lat:18.7849, lon:98.9535, province:"เชียงใหม่", amphoe:"สารภี", crop:"ไม้ผลผสมผสาน", season:"ฤดูฝน" },
  { id:"TH-PT-006", name:"สวนปาล์ม-นายไวนิช", area_rai:60, area_text:"60 ไร่", lat:7.7062, lon:99.6459, province:"ตรัง", amphoe:"ห้วยยอด", crop:"ปาล์มน้ำมัน", season:"ฤดูฝน" },
  { id:"TH-BK-007", name:"แปลงสาธิตชานเมือง", area_rai:8, area_text:"8 ไร่", lat:13.7843, lon:100.5210, province:"กรุงเทพมหานคร", amphoe:"หนองจอก", crop:"ข้าวเจ้าทั่วไป", season:"นาปรัง" },
  { id:"TH-LB-008", name:"สวนยาง-นายบาวดี", area_rai:40, area_text:"40 ไร่", lat:7.8033, lon:100.3401, province:"สงขลา", amphoe:"ระโนด", crop:"ยางพารา", season:"ฤดูฝน" },
];

const PLOT_POLYGONS: Record<string,string> = {
  "TH-AF-001":"18,10 34,12 36,22 20,24 16,18",
  "TH-RC-002":"58,18 70,20 72,28 60,30 55,24",
  "TH-SC-003":"12,36 30,34 32,44 14,46 10,40",
  "TH-NN-004":"44,34 56,36 58,46 46,48 42,42",
  "TH-CM-005":"74,10 88,12 90,22 76,24 72,18",
  "TH-PT-006":"66,40 84,38 86,50 68,52 64,46",
  "TH-BK-007":"28,26 40,26 42,32 30,34 26,30",
  "TH-LB-008":"8,50 22,50 24,58 10,58 6,54",
};

function Stat({label, value}:{label:string; value:string}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3">
      <div className="text-xs text-emerald-900">{label}</div>
      <div className="text-md font-semibold text-emerald-900">{value}</div>
    </div>
  );
}

export default function SelectPlotsPage() {
  const [selectedId, setSelectedId] = useState(MOCK_PLOTS[0].id);
  const plot = useMemo(()=>MOCK_PLOTS.find(p=>p.id===selectedId)!,[selectedId]);
  const plotIndex = useMemo(()=>MOCK_PLOTS.findIndex(p=>p.id===selectedId),[selectedId]);
  const imgNo = ((plotIndex >= 0 ? plotIndex : 0) % 4) + 1; // 1..4 วน
  const mapSrc = `/map${imgNo}.png`; // ใส่รูปไว้ที่ public/maps/map-1.jpg ... map-4.jpg

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-950 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900">Carbon Credit</h1>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow bg-white">
            <div className="p-4 border-b border-emerald-100 text-md text-emerald-900">แผนที่จากรูปในระบบ + ขอบเขตแปลง</div>
            <div className="relative aspect-[16/9]">
              {/* รูปจาก public */}
              <img src={mapSrc} alt={`แผนที่สำหรับ ${plot.name}`} className="absolute inset-0 h-full w-full object-cover" />
              {/* ขอบเขตแปลงทับบนรูป */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                <polygon points={PLOT_POLYGONS[selectedId]} fill="rgba(16,185,129,0.30)" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs shadow">{plot.area_text}</div>
            </div>
          </div>

          <div className="rounded-2xl shadow bg-white p-6">
            <div className="text-md text-emerald-900">เลือกแปลง</div>
            <select className="mt-2 w-full border border-emerald-200 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-300" value={selectedId} onChange={e=>setSelectedId(e.target.value)}>
              {MOCK_PLOTS.map(p=>(<option key={p.id} value={p.id}>{p.name} : {p.province}</option>))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-3 text-md">
              <Stat label="ขนาดพื้นที่" value={`${plot.area_rai} ไร่`} />
              <Stat label="พิกัด" value={`${plot.lat.toFixed(4)}, ${plot.lon.toFixed(4)}`} />
              <Stat label="พืชคาดการณ์" value={plot.crop} />
              <Stat label="ฤดูเพาะปลูก" value={plot.season} />
            </div>

            <Link
              href={`/dash?plot=${encodeURIComponent(selectedId)}&mode=pro`}
              className="mt-6 block w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700"
            >
              ดูรายได้จากคาร์บอน
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
