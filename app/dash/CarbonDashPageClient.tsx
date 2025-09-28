
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Mode = "simple" | "pro";
type Props = { initialPlotId: string; initialMode: Mode };

type Plot = {
    id: string; name: string; area_rai: number; area_text: string;
    lat: number; lon: number; province: string; amphoe: string;
    crop: string; season: "นาปี" | "นาปรัง" | "ฤดูฝน" | "ฤดูแล้ง";
    practice: "อินทรีย์" | "ลดไถพรวน" | "ปลูกไม้ยืนต้น" | "จัดการเศษซาก" | "ปกติ";
    irrigation: "ชลประทาน" | "ฝนฟ้าอาศัย";
    ndvi: number; ndwi: number; bai: number; soil_moisture: number; canopy_height_m: number;
    start_date: string; last_update: string;
    crop_probs: Record<string, number>;
};
const MOCK_PRICE_THAI_TVER_THB_PER_TON = 280;

const MOCK_PLOTS: Plot[] = [
    {
        id: "TH-AF-001", name: "แปลงข้าวโพด-นายกฤษ", area_rai: 32, area_text: "32 ไร่", lat: 18.0412, lon: 99.2976, province: "ตาก", amphoe: "แม่สอด",
        crop: "ข้าวโพดเลี้ยงสัตว์", season: "ฤดูฝน", practice: "ลดไถพรวน", irrigation: "ฝนฟ้าอาศัย",
        ndvi: 0.68, ndwi: 0.21, bai: 0.03, soil_moisture: 0.19, canopy_height_m: 1.8,
        start_date: "2025-05-20", last_update: "2025-09-10",
        crop_probs: { ข้าวโพดเลี้ยงสัตว์: 0.83, อ้อย: 0.07, มันสำปะหลัง: 0.05, อื่นๆ: 0.05 }
    },
    {
        id: "TH-RC-002", name: "นาข้าว-นายสุทัต", area_rai: 18, area_text: "18 ไร่", lat: 16.2455, lon: 102.8391, province: "ขอนแก่น", amphoe: "บ้านไผ่",
        crop: "ข้าวหอมมะลิ", season: "นาปี", practice: "จัดการเศษซาก", irrigation: "ฝนฟ้าอาศัย",
        ndvi: 0.74, ndwi: 0.28, bai: 0.02, soil_moisture: 0.24, canopy_height_m: 0.9,
        start_date: "2025-06-05", last_update: "2025-09-12",
        crop_probs: { ข้าวหอมมะลิ: 0.88, ข้าวเจ้าทั่วไป: 0.08, อื่นๆ: 0.04 }
    },
    {
        id: "TH-SC-003", name: "สวนอ้อย-นางสาวจิรดา", area_rai: 50, area_text: "50 ไร่", lat: 9.1402, lon: 99.3219, province: "สุราษฎร์ธานี", amphoe: "พุนพิน",
        crop: "อ้อย", season: "ฤดูฝน", practice: "อินทรีย์", irrigation: "ชลประทาน",
        ndvi: 0.71, ndwi: 0.18, bai: 0.04, soil_moisture: 0.22, canopy_height_m: 2.3,
        start_date: "2025-04-18", last_update: "2025-09-08",
        crop_probs: { อ้อย: 0.81, มันสำปะหลัง: 0.11, อื่นๆ: 0.08 }
    },
    {
        id: "TH-NN-004", name: "มันสำปะหลัง-นายประวิน", area_rai: 24, area_text: "24 ไร่", lat: 14.5167, lon: 101.3901, province: "นครราชสีมา", amphoe: "ปากช่อง",
        crop: "มันสำปะหลัง", season: "ฤดูฝน", practice: "ลดไถพรวน", irrigation: "ฝนฟ้าอาศัย",
        ndvi: 0.62, ndwi: 0.12, bai: 0.05, soil_moisture: 0.16, canopy_height_m: 1.2,
        start_date: "2025-05-10", last_update: "2025-09-11",
        crop_probs: { มันสำปะหลัง: 0.76, ข้าวโพดเลี้ยงสัตว์: 0.16, อื่นๆ: 0.08 }
    },
    {
        id: "TH-CM-005", name: "ลิ้นจี่กึ่งป่า-นางมณี", area_rai: 15, area_text: "15 ไร่", lat: 18.7849, lon: 98.9535, province: "เชียงใหม่", amphoe: "สารภี",
        crop: "ไม้ผลผสมผสาน", season: "ฤดูฝน", practice: "ปลูกไม้ยืนต้น", irrigation: "ชลประทาน",
        ndvi: 0.77, ndwi: 0.25, bai: 0.01, soil_moisture: 0.27, canopy_height_m: 4.8,
        start_date: "2024-12-01", last_update: "2025-09-09",
        crop_probs: { ไม้ผลผสมผสาน: 0.72, ลำไย: 0.15, ลิ้นจี่: 0.09, อื่นๆ: 0.04 }
    },
    {
        id: "TH-PT-006", name: "สวนปาล์ม-นายไวนิช", area_rai: 60, area_text: "60 ไร่", lat: 7.7062, lon: 99.6459, province: "ตรัง", amphoe: "ห้วยยอด",
        crop: "ปาล์มน้ำมัน", season: "ฤดูฝน", practice: "ปกติ", irrigation: "ชลประทาน",
        ndvi: 0.66, ndwi: 0.20, bai: 0.02, soil_moisture: 0.23, canopy_height_m: 6.0,
        start_date: "2023-11-15", last_update: "2025-09-13",
        crop_probs: { ปาล์มน้ำมัน: 0.86, ยางพารา: 0.09, อื่นๆ: 0.05 }
    },
    {
        id: "TH-BK-007", name: "แปลงสาธิตชานเมือง", area_rai: 8, area_text: "8 ไร่", lat: 13.7843, lon: 100.5210, province: "กรุงเทพมหานคร", amphoe: "หนองจอก",
        crop: "ข้าวเจ้าทั่วไป", season: "นาปรัง", practice: "จัดการเศษซาก", irrigation: "ชลประทาน",
        ndvi: 0.58, ndwi: 0.30, bai: 0.00, soil_moisture: 0.31, canopy_height_m: 0.8,
        start_date: "2025-02-01", last_update: "2025-09-07",
        crop_probs: { ข้าวเจ้าทั่วไป: 0.67, ผัก: 0.18, อื่นๆ: 0.15 }
    },
    {
        id: "TH-LB-008", name: "สวนยาง-นายบาวดี", area_rai: 40, area_text: "40 ไร่", lat: 7.8033, lon: 100.3401, province: "สงขลา", amphoe: "ระโนด",
        crop: "ยางพารา", season: "ฤดูฝน", practice: "ปลูกไม้ยืนต้น", irrigation: "ฝนฟ้าอาศัย",
        ndvi: 0.73, ndwi: 0.19, bai: 0.02, soil_moisture: 0.21, canopy_height_m: 10.5,
        start_date: "2022-07-01", last_update: "2025-09-10",
        crop_probs: { ยางพารา: 0.9, ปาล์มน้ำมัน: 0.06, อื่นๆ: 0.04 }
    },
];

// ===== Core calc =====
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const raiToHa = (r: number) => r * 0.16;

function weights() { return { ndvi: 0.40, soil: 0.20, ndwi: 0.15, canopy: 0.15, practice: 0.10 }; }

function normalizeParts(p: Plot) {
    const ndvi = clamp01((p.ndvi - 0.4) / 0.5);
    const soil = clamp01((p.soil_moisture - 0.1) / 0.25);
    const ndwi = clamp01((p.ndwi - 0.05) / 0.30);
    const canopy = clamp01(p.canopy_height_m / 8.0);
    const practiceBonus =
        p.practice === "ปลูกไม้ยืนต้น" ? 1.0 :
            p.practice === "อินทรีย์" ? 0.85 :
                p.practice === "ลดไถพรวน" ? 0.7 :
                    p.practice === "จัดการเศษซาก" ? 0.55 : 0.4;
    const practice = clamp01(practiceBonus);
    return { ndvi, soil, ndwi, canopy, practice };
}

function computeScore(p: Plot): number {
    const w = weights();
    const n = normalizeParts(p);
    const raw = n.ndvi * w.ndvi + n.soil * w.soil + n.ndwi * w.ndwi + n.canopy * w.canopy + n.practice * w.practice;
    return Math.round(raw * 100);
}

function estimateTCO2eRaw(p: Plot): number {
    const areaHa = raiToHa(p.area_rai);
    const base =
        p.practice === "ปลูกไม้ยืนต้น" ? 12 :
            p.practice === "อินทรีย์" ? 6.5 :
                p.practice === "ลดไถพรวน" ? 4.0 :
                    p.practice === "จัดการเศษซาก" ? 2.8 : 1.5;

    const idx =
        0.6 * clamp01((p.ndvi - 0.45) / 0.4) +
        0.2 * clamp01((p.ndwi - 0.08) / 0.25) +
        0.2 * clamp01(p.soil_moisture / 0.35);

    const seasonAdj = (p.season === "นาปี" || p.season === "ฤดูฝน") ? 1.0 : 0.85;
    const irrigationAdj = p.irrigation === "ชลประทาน" ? 1.05 : 1.0;

    return areaHa * base * (0.6 + 0.4 * idx) * seasonAdj * irrigationAdj; // ไม่ปัด
}

function estimateTCO2e(p: Plot): number {
    return Math.round(estimateTCO2eRaw(p) * 10) / 10; // ใช้โชว์
}

function estimateRevenueTHB(p: Plot, pricePerTon = MOCK_PRICE_THAI_TVER_THB_PER_TON) {
    return Math.round(estimateTCO2eRaw(p) * pricePerTon); // ใช้ raw คูณแล้วค่อยปัด
}


// ===== Reliability =====
function diffDays(a: Date, b: Date) { return Math.round((+a - +b) / (1000 * 3600 * 24)); }
function computeReliability(p: Plot) {
    const days = diffDays(new Date(), new Date(p.last_update));
    let r = 0.6;
    if (days <= 14) r += 0.25;
    else if (days <= 45) r += 0.15;
    else if (days <= 90) r += 0.08;

    const practiceAdj = p.practice === "ปลูกไม้ยืนต้น" ? 0.05 : p.practice === "อินทรีย์" ? 0.03 : p.practice === "ลดไถพรวน" ? 0.02 : 0;
    const n = normalizeParts(p);
    const coherence = 1 - Math.abs(n.ndvi - (0.5 * n.ndwi + 0.5 * n.soil)); // 0..1
    const cohAdj = 0.1 * coherence;

    const score = clamp01(r + practiceAdj + cohAdj);
    const scorePct = Math.round(score * 100);
    const label = score >= 0.8 ? "สูง" : score >= 0.6 ? "ปานกลาง" : "จำกัด";
    const uncertainty = score >= 0.8 ? "±10%" : score >= 0.6 ? "±15%" : "±20–25%";
    return { scorePct, label, uncertainty, days };
}

// ===== UI helpers =====
function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-emerald-400 bg-white p-4">
            <div className="text-xs text-emerald-900">{label}</div>
            <div className="text-lg font-semibold text-emerald-900">{value}</div>
        </div>
    );
}
function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-emerald-400 bg-white p-4">
            <div className="text-xs text-emerald-900">{label}</div>
            <div className="text-sm font-semibold text-emerald-900">{value}</div>
        </div>
    );
}
function Bar({ value }: { value: number }) {
    return (
        <div className="h-2 w-full rounded-full bg-emerald-100">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.max(4, Math.min(100, value * 100))}%` }} />
        </div>
    );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-emerald-900/20" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-emerald-400 bg-white shadow-lg">
                <div className="p-5">{children}</div>
                <div className="p-3 border-t border-emerald-400 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">ปิด</button>
                </div>
            </div>
        </div>
    );
}

// function BoostBadge({ k }: { k: "NDVI" | "NDWI" | "Soil" | "Canopy" | "Practice" }) {
//     const map = { NDVI: "ความเขียว", NDWI: "น้ำในแปลง", Soil: "ความชื้นดิน", Canopy: "ร่มเงา/พุ่มใบ", Practice: "วิธีทำแปลง" } as const;
//     return <span className="inline-block rounded-full border border-emerald-400 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800 mr-1">{map[k]}</span>;
// }

// ===== แผนรายแปลง (ภาษาเกษตร) =====
type Plan = {
    summary: string;
    companions: Array<{ name: string; rate_per_rai: string; window: string; purpose: string; boosts: Array<"NDVI" | "NDWI" | "Soil" | "Canopy" | "Practice"> }>;
    soil_plan: Array<{ action: string; spec: string; timing: string; boosts: Array<"NDVI" | "NDWI" | "Soil" | "Canopy" | "Practice"> }>;
    water_plan: Array<{ method: string; spec: string; timing: string; boosts: Array<"NDVI" | "NDWI" | "Soil"> }>;
    hedgerow?: Array<{ species: string; spacing: string; area_share: string; boosts: Array<"Canopy" | "NDVI"> }>;
};

function getTailoredPlan(p: Plot): Plan {
    const soilBase: Plan["soil_plan"] = [
        { action: "ตรวจดินปีละครั้ง", spec: "วัดกรดด่างและอินทรียวัตถุ", timing: "ก่อนหน้าฝน", boosts: ["Soil"] },
        { action: "ใส่ปุ๋ยหมัก", spec: "400–800 กก./ไร่ แบ่ง 2 ครั้ง", timing: "เตรียมแปลง + กลางฤดู", boosts: ["Soil", "NDVI"] },
        { action: "คลุมหน้าดิน", spec: "ฟาง/เศษพืช หนา 5–7 ซม.", timing: "ตลอดฤดู", boosts: ["NDWI", "Soil"] },
        { action: "ปลูกปอเทืองแล้วไถกลบ", spec: "10–12 กก./ไร่", timing: "ช่วงว่างก่อนปลูก", boosts: ["NDVI", "Soil", "Practice"] },
    ];
    const plan: Plan = { summary: "", companions: [], soil_plan: [...soilBase], water_plan: [], hedgerow: [] };

    const addHedge = () => {
        plan.hedgerow!.push({ species: "ปลูกไม้แนวรั้ว/คอนทัวร์", spacing: "ห่างต้น 3×3 ม. หรือแถวห่าง 6–8 ม.", area_share: "10–15% พื้นที่", boosts: ["Canopy", "NDVI"] });
    };

    if (p.crop.includes("ข้าว")) {
        plan.summary = "ทำนาให้เขียว น้ำพอดี ไม่เผาฟาง";
        plan.water_plan.push({ method: "สลับเปียก-แห้ง", spec: "ปล่อยน้ำให้แห้ง 5–7 วัน แล้วค่อยเติม", timing: "แตกกอ–ตั้งท้อง", boosts: ["NDWI", "Soil"] });
        plan.companions.push(
            { name: "เลี้ยงอะโซลลา", rate_per_rai: "20–30 กก./ไร่", window: "หลังปักดำ น้ำตื้น", purpose: "บังแดดน้ำ ตรึงไนโตรเจน", boosts: ["NDVI", "NDWI", "Soil"] },
            { name: "ปลูกปอเทือง", rate_per_rai: "10–12 กก./ไร่", window: "หลังเกี่ยว", purpose: "ทำปุ๋ยพืชสด กลบลงนา ไม่ต้องเผา", boosts: ["NDVI", "Soil"] },
        );
        plan.soil_plan.push({ action: "จัดการฟาง", spec: "ไม่เผา กลบลงดิน", timing: "หลังเกี่ยว", boosts: ["Soil", "Practice"] });
        addHedge();
    } else if (p.crop.includes("ข้าวโพด")) {
        plan.summary = "ไถให้น้อย ปลูกถั่วแซก รักษาน้ำช่วงติดฝัก";
        plan.companions.push(
            { name: "ปลูกถั่วพุ่ม/ถั่วพร้าแซก", rate_per_rai: "4–6 กก./ไร่", window: "หลังงอก 10–14 วัน", purpose: "บังดิน เพิ่มปุ๋ยธรรมชาติ", boosts: ["NDVI", "Soil"] },
            { name: "ปลูกปอเทืองช่วงว่าง", rate_per_rai: "10–12 กก./ไร่", window: "หลังเก็บเกี่ยว", purpose: "เพิ่มอินทรียวัตถุ", boosts: ["NDVI", "Soil"] },
        );
        plan.water_plan.push({ method: "ทำสระเล็ก + น้ำหยด", spec: "1–2 บ่อ/10 ไร่ ใช้น้ำหยดช่วงติดฝัก", timing: "หน้าแล้งสั้น", boosts: ["NDWI", "Soil"] });
        addHedge();
    } else if (p.crop.includes("มันสำปะหลัง")) {
        plan.summary = "กันหน้าดินไหล ปลูกถั่วแซก ปรับกรดดิน";
        plan.companions.push(
            { name: "ถั่วพร้า/สไตโลแซกระหว่างแถว", rate_per_rai: "3–4 กก./ไร่", window: "หลังปลูก 30 วัน", purpose: "คลุมดิน ตรึงไนโตรเจน", boosts: ["NDVI", "Soil"] },
        );
        plan.soil_plan.push({ action: "หว่านโดโลไมต์", spec: "80–150 กก./ไร่ ถ้าดินเปรี้ยว", timing: "ก่อนฝนแรก", boosts: ["Soil"] });
        plan.water_plan.push({ method: "คลุมโคน", spec: "ใบมัน+ฟาง หนา 5–7 ซม.", timing: "ตลอดฤดู", boosts: ["NDWI", "Soil"] });
        addHedge();
    } else if (p.crop.includes("อ้อย")) {
        plan.summary = "ไม่เผาใบอ้อย ปลูกถั่วเสริม รดน้ำเบาช่วงขาดฝน";
        plan.companions.push(
            { name: "ปอเทือง/มูคูนาในร่องอ้อย", rate_per_rai: "8–10 กก./ไร่", window: "หลังตัด 2–3 สัปดาห์", purpose: "เพิ่มชีวมวล ลดหญ้า", boosts: ["NDVI", "Soil"] },
        );
        plan.water_plan.push({ method: "สปริงเกลอร์เบา", spec: "ให้ละอองสั้นๆ", timing: "ช่วงแตกกอ–ย่างปล้อง", boosts: ["NDWI"] });
        plan.soil_plan.push({ action: "คลุมแปลงด้วยใบอ้อย", spec: "หนา 5–10 ซม.", timing: "หลังตัด", boosts: ["Soil", "NDWI"] });
        addHedge();
    } else if (p.crop.includes("ปาล์ม")) {
        plan.summary = "ปลูกพืชคลุมใต้ปาล์ม กองทางใบอุ้มน้ำ";
        plan.companions.push(
            { name: "Mucuna/Calopogonium ใต้ปาล์ม", rate_per_rai: "2–3 กก./ไร่", window: "ต้นฝน", purpose: "คลุมดินถาวร ลดวัชพืช", boosts: ["NDVI", "Soil"] },
        );
        plan.water_plan.push({ method: "กองทางใบรอบต้น", spec: "ทำวงกว้าง 1.5–2 ม.", timing: "ตลอดปี", boosts: ["NDWI", "Soil"] });
        addHedge();
    } else if (p.crop.includes("ยางพารา")) {
        plan.summary = "ปลูกพืชคลุมระหว่างแถว คลุมโคนด้วยใบยาง";
        plan.companions.push(
            { name: "สไตโล/ถั่วลิสงเถา", rate_per_rai: "2–3 กก./ไร่", window: "ต้นฝน", purpose: "เขียวทั้งปี ลดหญ้า", boosts: ["NDVI", "Soil"] },
        );
        plan.water_plan.push({ method: "คลุมโคน", spec: "เศษกรีด+ใบยาง หนา 5–7 ซม.", timing: "ปลายฝน–หน้าแล้ง", boosts: ["NDWI", "Soil"] });
        addHedge();
    } else {
        plan.summary = "สวนผสมให้พื้นดินเขียวชื้น ปลูกต้นตรึงไนโตรเจนรอบแปลง";
        plan.companions.push(
            { name: "หญ้าถั่ว Arachis/Centrosema", rate_per_rai: "2–4 กก./ไร่", window: "ต้นฝน", purpose: "คลุมถาวรใต้ทรงพุ่ม", boosts: ["NDVI", "Soil"] },
        );
        plan.soil_plan.push({ action: "เพิ่มปุ๋ยหมัก", spec: "300–600 กก./ไร่/รอบ", timing: "ปลายฝน + ต้นฝน", boosts: ["Soil"] });
        addHedge();
    }

    return plan;
}
// ===== Core calc (ต่อท้ายฟังก์ชันเดิมทั้งหมด) =====
// NEW: บูสต์ต่อคำแนะนำแบบง่าย
type Boost = "NDVI" | "NDWI" | "Soil" | "Canopy" | "Practice";
type Impact = { dScore: number; dTons: number; dTHB: number; afterScore: number; afterTons: number; afterTHB: number };

function applyBoosts(p: Plot, boosts: Boost[]): Plot {
    const clone: Plot = { ...p };
    // บูสต์เชิงประสบการณ์แบบ conservative
    const inc = {
        NDVI: 0.04,   // พืชคลุม/ปุ๋ยพืชสด เพิ่มความเขียว
        NDWI: 0.03,   // จัดการน้ำ/คลุมดิน เพิ่มน้ำในแปลง
        Soil: 0.04,   // ปุ๋ยหมัก/คลุมดิน เพิ่มความชื้นดินมีประสิทธิภาพ
        Canopy: 0.5,  // ไม้แนวรั้ว/แทรก เพิ่มความสูงพุ่มเฉลี่ย (เมตร)
    } as const;

    if (boosts.includes("NDVI")) clone.ndvi = Math.min(0.95, clone.ndvi + inc.NDVI);
    if (boosts.includes("NDWI")) clone.ndwi = Math.min(0.9, clone.ndwi + inc.NDWI);
    if (boosts.includes("Soil")) clone.soil_moisture = Math.min(0.6, clone.soil_moisture + inc.Soil);
    if (boosts.includes("Canopy")) clone.canopy_height_m = Math.min(12, clone.canopy_height_m + inc.Canopy);
    if (boosts.includes("Practice")) {
        // ยกระดับ practice ขั้นถัดไปถ้าไม่ใช่ระดับสูงอยู่แล้ว
        const order: Plot["practice"][] = ["ปกติ", "จัดการเศษซาก", "ลดไถพรวน", "อินทรีย์", "ปลูกไม้ยืนต้น"];
        const idx = order.indexOf(clone.practice);
        clone.practice = order[Math.min(order.length - 1, Math.max(idx + 1, 2))]; // ขยับอย่างน้อยไปที่ "ลดไถพรวน"
    }
    return clone;
}


function simulateImpact(p: Plot, boosts: Boost[], pricePerTon = MOCK_PRICE_THAI_TVER_THB_PER_TON): Impact {
    const beforeScore = computeScore(p);
    const beforeRaw = estimateTCO2eRaw(p);

    const afterPlot = applyBoosts(p, boosts);
    const afterScore = computeScore(afterPlot);
    const afterRaw = estimateTCO2eRaw(afterPlot);

    const dTonsRaw = Math.max(0, afterRaw - beforeRaw);
    const dTHBRaw = dTonsRaw * pricePerTon;

    const afterTHB = Math.round(afterRaw * pricePerTon);

    return {
        dScore: Math.max(0, afterScore - beforeScore),
        dTons: Math.round(dTonsRaw * 10) / 10,
        dTHB: Math.round(dTHBRaw),
        afterScore,
        afterTons: Math.round(afterRaw * 10) / 10,
        afterTHB
    };
}


const clean = (n: number) => (Object.is(n, -0) ? 0 : n);
const fmt = (n: number, digits = 1) => {
    const v = clean(n);
    return Number.isInteger(v) ? String(v) : v.toFixed(digits).replace(/\.0+$/, "");
};
function impactLabel(imp: Impact) {
    const s = clean(imp.dScore);
    const t = clean(imp.dTons);
    const h = clean(imp.dTHB);

    const plusScore = s > 0 ? `+ ${s} คะแนน` : `±0 คะแนน`;
    const plusTons = t > 0 ? `+ ${fmt(t)} tCO₂e/ปี` : `±0 tCO₂e/ปี`;
    const plusTHB = h > 0 ? `+ ${fmt(h, 0)} ฿/ปี` : `±0 ฿/ปี`;
    return `${plusScore}  ${plusTons}  ${plusTHB}`;
}
export default function CarbonDashPageClient({ initialPlotId, initialMode }: Props) {
    const [id, setId] = useState(initialPlotId || "");
    const [mode, setMode] = useState<Mode>(initialMode);
    const [openExplain, setOpenExplain] = useState(false);



    const plot = useMemo(() => MOCK_PLOTS.find(p => p.id === id) || MOCK_PLOTS[0], [id]);
    const score = computeScore(plot);
    const tons = estimateTCO2e(plot);
    const revenue = estimateRevenueTHB(plot);
    const rel = computeReliability(plot);
    const parts = normalizeParts(plot);
    const w = weights();
    const plan = useMemo(() => getTailoredPlan(plot), [plot]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-950 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-emerald-900">ภาพรวมแปลงและเครดิตคาร์บอน</h1>
                    <div className="flex gap-2">
                        <Link href="/" className="px-3 py-2 text-sm rounded-lg border border-emerald-400 bg-white hover:bg-emerald-700 hover:text-white">
                            ย้อนกลับ
                        </Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <Stat label="ชื่อแปลง" value={`${plot.name}`} />
                    <Stat label="จังหวัด" value={`${plot.province}`} />

                </div>

                {/* Top metrics */}
                <div className="mt-6 grid lg:grid-cols-2 gap-6">
                    {/* Clickable score -> modal */}
                    <button onClick={() => setOpenExplain(true)} className=" rounded-2xl border border-emerald-400 p-6 text-left hover:bg-emerald-200 hover:text-emerald-900 focus:outline-none bg-emerald-900 text-white">
                        <div className="text-md font-bold">คะแนนแปลง (กดดูวิธีคิด)</div>
                        <div className="text-5xl font-bold mt-2 lg:text-8xl">{score}</div>
                        {/* <div className="text-xs mt-1">ดูง่าย: ความเขียว • น้ำในแปลง • ความชื้นดิน • ร่มเงา • วิธีทำแปลง</div> */}
                    </button>

                    <div>
                        <div className=" rounded-2xl border border-emerald-400 bg-white p-6 mb-6">
                            <div className="text-sm text-emerald-900 font-bold">คาร์บอนต่อปี</div>
                            <div className="text-4xl font-bold mt-2 text-emerald-900">{tons} ตัน CO₂</div>
                            {/* <div className="text-xs text-emerald-900 mt-1">คำนวณจากวิธีทำแปลง + สภาพแปลงจริง</div> */}
                        </div>

                        <div className=" rounded-2xl border border-emerald-400 bg-white p-6">
                            <div className="text-sm text-emerald-900 font-bold">รายได้ประมาณ</div>
                            <div className="text-4xl font-bold mt-2 text-emerald-900">{revenue.toLocaleString()} ฿</div>
                            <div className="text-xs text-emerald-900 mt-1">อ้างอิง {MOCK_PRICE_THAI_TVER_THB_PER_TON} บาท/ตัน CO₂</div>
                        </div>
                    </div>
                </div>
                {/* Pro details inภาษาง่าย */}
                {mode === "pro" ? (
                    <div className="mt-6 rounded-2xl border border-emerald-400 bg-white p-6 font-bold ">
                        <div className="grid md:grid-cols-3 gap-6 text-2xl">
                            <Info label="ความเขียวของพืช (ดัชนี)" value={plot.ndvi.toFixed(2)} />
                            <Info label="น้ำในแปลง (ดัชนี)" value={plot.ndwi.toFixed(2)} />
                            <Info label="ความชื้นดิน" value={plot.soil_moisture.toFixed(2)} />
                            <Info label="ร่มเงา/พุ่มใบ (เมตร)" value={plot.canopy_height_m.toFixed(1)} />
                            <Info label="วิธีทำแปลง" value={plot.practice} />
                            <Info label="น้ำ" value={plot.irrigation} />
                        </div>
                        <div className="mt-6 text-xs text-emerald-900">
                            อัปเดตระบบ: {new Date().toISOString().slice(0, 10)} • ข้อมูลแปลงอัปเดตล่าสุด: {plot.last_update}
                        </div>
                    </div>
                ) : null}

                {/* Tailored plan */}
                <div className="mt-6 rounded-2xl border border-emerald-400 bg-white p-6">
                    <div className="text-xl font-semibold text-emerald-900">แผนทำจริงในแปลงนี้</div>
                    {plan.companions.length > 0 && (
                        <div className="mt-4">
                            <div className="text-md text-emerald-900">ปลูกเสริม/คลุมดิน</div>
                            <ul className="mt-2 space-y-2">
                                {plan.companions.map((c, i) => {
                                    const imp = simulateImpact(plot, c.boosts);
                                    return (
                                        <li key={i} className="rounded-xl border border-emerald-400 p-3">
                                            <div className="text-md font-semibold text-emerald-900">
                                                {c.name} <span className="font-normal">• {c.rate_per_rai}</span>
                                            </div>
                                            <div className="text-md text-emerald-900">ช่วงทำ: {c.window} , ผลที่ได้: {c.purpose}</div>
                                            {/* <div className="mt-1">{c.boosts.map(b => <BoostBadge key={b} k={b} />)}</div> */}
                                            {/* NEW: แสดงผลเพิ่มขึ้นที่คาด */}
                                            <div className="mt-3 text-md text-emerald-900 font-semibold">{impactLabel(imp)}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4">
                        <div className="text-md text-emerald-900">ดูแลดิน</div>
                        <ul className="mt-2 space-y-2">
                            {plan.soil_plan.map((s, i) => {
                                const imp = simulateImpact(plot, s.boosts);
                                return (
                                    <li key={i} className="rounded-xl border border-emerald-400 p-3">
                                        <div className="text-md font-semibold text-emerald-900">
                                            {s.action} <span className="font-normal">• {s.spec}</span>
                                        </div>
                                        <div className="text-xs text-emerald-900">ช่วงทำ: {s.timing}</div>
                                        {/* <div className="mt-1">{s.boosts.map(b => <BoostBadge key={b} k={b} />)}</div> */}
                                        <div className="mt-2 text-md text-emerald-900 font-semibold">{impactLabel(imp)}</div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {plan.water_plan.length > 0 && (
                        <div className="mt-4">
                            <div className="text-md text-emerald-900">จัดการน้ำ</div>
                            <ul className="mt-2 space-y-2">
                                {plan.water_plan.map((wz, i) => {
                                    const imp = simulateImpact(plot, wz.boosts);
                                    return (
                                        <li key={i} className="rounded-xl border border-emerald-400 p-3">
                                            <div className="text-md font-semibold text-emerald-900">
                                                {wz.method} <span className="font-normal">• {wz.spec}</span>
                                            </div>
                                            <div className="text-md text-emerald-900">ช่วงทำ: {wz.timing}</div>
                                            {/* <div className="mt-1">{wz.boosts.map(b => <BoostBadge key={b} k={b} />)}</div> */}
                                            <div className="mt-2 text-md text-emerald-900 font-semibold">{impactLabel(imp)}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {plan.hedgerow && plan.hedgerow.length > 0 && (
                        <div className="mt-4">
                            <div className="text-md text-emerald-900">ปลูกไม้แนวรั้ว/คอนทัวร์</div>
                            <ul className="mt-2 space-y-2">
                                {plan.hedgerow?.map((h, i) => {
                                    const imp = simulateImpact(plot, h.boosts);
                                    return (
                                        <li key={i} className="rounded-xl border border-emerald-400 p-3">
                                            <div className="text-md font-semibold text-emerald-900">{h.species}</div>
                                            <div className="text-md text-emerald-900">ระยะปลูก: {h.spacing} • ใช้พื้นที่: {h.area_share}</div>
                                            {/* <div className="mt-1">{h.boosts.map(b => <BoostBadge key={b} k={b} />)}</div> */}
                                            <div className="mt-2 text-md text-emerald-900 font-semibold">{impactLabel(imp)}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>



                {/* Explain modal: ภาษาเกษตร */}
                <Modal open={openExplain} onClose={() => setOpenExplain(false)}>
                    <div className="text-lg font-bold text-emerald-900">คะแนนคิดยังไง</div>
                    <div className="mt-3 text-md text-emerald-900">
                        ดู 5 อย่างรวมกัน:
                        <div className="mt-2 grid grid-cols-5">
                            <div><div className="text-sm text-emerald-900">ความชื้นดิน (20%)</div><Bar value={parts.soil} /></div>
                            <div><div className="text-sm text-emerald-900">ความเขียว (40%)</div><Bar value={parts.ndvi} /></div>
                            <div><div className="text-sm text-emerald-900">น้ำในแปลง (15%)</div><Bar value={parts.ndwi} /></div>
                            <div><div className="text-sm text-emerald-900">ร่มเงา/พุ่มใบ (15%)</div><Bar value={parts.canopy} /></div>
                            <div><div className="text-sm text-emerald-900">วิธีทำแปลง (10%)</div><Bar value={parts.practice} /></div>
                        </div>
                        <div className="mt-3 text-md text-emerald-900">
                            น้ำหนักแต่ละอย่าง: {Math.round(w.ndvi * 100)}%, {Math.round(w.soil * 100)}%, {Math.round(w.ndwi * 100)}%, {Math.round(w.canopy * 100)}%, {Math.round(w.practice * 100)}%
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="text-md font-semibold text-emerald-900">ความแม่นยำของคะแนน</div>
                        <div className="mt-2 rounded-xl border border-emerald-400 p-4 bg-emerald-50">
                            <div className="flex items-center justify-between text-md">
                                <span className="text-emerald-900">ระดับ: {rel.label}</span>
                                <span className="text-emerald-900">{rel.scorePct}%</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
                                <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${rel.scorePct}%` }} />
                            </div>
                            <div className="mt-2 text-md text-emerald-900">
                                ปรับล่าสุด {plot.last_update} ({rel.days} วันก่อน) • อาจคลาดเคลื่อน {rel.uncertainty}
                            </div>
                        </div>
                        <ul className="mt-2 text-md text-emerald-700/80 list-disc pl-5">
                            <li>เน้นดูสภาพจริงในแปลง จากภาพถ่ายและข้อมูลที่กรอก</li>
                            <li>ยิ่งอัปเดตข้อมูลบ่อย คะแนนยิ่งแม่น</li>
                            <li>นี่เป็นตัวอย่างสำหรับเดโม ยังไม่ใช่ผลรับรองทางการ</li>
                        </ul>
                    </div>

                    <div className="mt-5">
                        <div className="text-md font-semibold text-emerald-900">จะเพิ่มคะแนนให้ไวทำแบบนี้</div>
                        <ul className="mt-2 list-disc pl-5 text-md text-emerald-900">
                            <li>ไม่เผาเศษพืช กลบลงดิน</li>
                            <li>ปลูกพืชคลุมดินหรือถั่วแซก ให้ดินเขียวชุ่ม</li>
                            <li>คุมระดับน้ำให้พอดี ข้าวใช้ “สลับเปียก-แห้ง”</li>
                            <li>ปลูกไม้แนวรั้ว/คอนทัวร์ให้มีร่มเงา 10–15% ของพื้นที่</li>
                            <li>ใส่ปุ๋ยหมักประจำ เพิ่มอินทรียวัตถุในดิน</li>
                        </ul>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
