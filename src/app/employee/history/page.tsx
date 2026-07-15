"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type AttendanceStatus = "tepat_waktu" | "terlambat" | "absen";

interface AttendanceEntry {
  date: string; // e.g. "26 Juni 2026"
  day: string; // e.g. "Kamis"
  shift: string;
  shiftHours: string; // e.g. "08:00 – 17:00"
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  lateMinutes: number;
  workDuration: string | null; // e.g. "8 jam 10 menit"
  denda: number; // fine in IDR
  gpsValid: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_DATA: AttendanceEntry[] = [
  {
    date: "26 Juni 2026",
    day: "Kamis",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:55",
    clockOut: "17:05",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 10 menit",
    denda: 0,
    gpsValid: true,
  },
  {
    date: "25 Juni 2026",
    day: "Rabu",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "08:22",
    clockOut: "17:10",
    status: "terlambat",
    lateMinutes: 22,
    workDuration: "8 jam 48 menit",
    denda: 25000,
    gpsValid: true,
  },
  {
    date: "24 Juni 2026",
    day: "Selasa",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:58",
    clockOut: "17:02",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 4 menit",
    denda: 0,
    gpsValid: true,
  },
  {
    date: "23 Juni 2026",
    day: "Senin",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: null,
    clockOut: null,
    status: "absen",
    lateMinutes: 0,
    workDuration: null,
    denda: 0,
    gpsValid: false,
  },
  {
    date: "20 Juni 2026",
    day: "Jumat",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:50",
    clockOut: "17:00",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 10 menit",
    denda: 0,
    gpsValid: true,
  },
  {
    date: "19 Juni 2026",
    day: "Kamis",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "08:15",
    clockOut: "17:08",
    status: "terlambat",
    lateMinutes: 15,
    workDuration: "8 jam 53 menit",
    denda: 18000,
    gpsValid: true,
  },
  {
    date: "18 Juni 2026",
    day: "Rabu",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:59",
    clockOut: "17:01",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 2 menit",
    denda: 0,
    gpsValid: true,
  },
  {
    date: "17 Juni 2026",
    day: "Selasa",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "08:10",
    clockOut: "17:05",
    status: "terlambat",
    lateMinutes: 10,
    workDuration: "8 jam 55 menit",
    denda: 15000,
    gpsValid: true,
  },
  {
    date: "16 Juni 2026",
    day: "Senin",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:52",
    clockOut: "17:03",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 11 menit",
    denda: 0,
    gpsValid: true,
  },
  {
    date: "13 Juni 2026",
    day: "Jumat",
    shift: "Pagi",
    shiftHours: "08:00 – 17:00",
    clockIn: "07:48",
    clockOut: "17:00",
    status: "tepat_waktu",
    lateMinutes: 0,
    workDuration: "8 jam 12 menit",
    denda: 0,
    gpsValid: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmtCurrency = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

type FilterKey = "semua" | "tepat_waktu" | "terlambat" | "absen";

const FILTER_PILLS: { key: FilterKey; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "tepat_waktu", label: "Tepat Waktu" },
  { key: "terlambat", label: "Terlambat" },
  { key: "absen", label: "Absen" },
];

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; icon: string; color: string; bg: string }
> = {
  tepat_waktu: {
    label: "Tepat Waktu",
    icon: "check_circle",
    color: "text-[#2ECC71]",
    bg: "bg-[#2ECC71]/10",
  },
  terlambat: {
    label: "Terlambat",
    icon: "warning",
    color: "text-[#F39C12]",
    bg: "bg-[#F39C12]/10",
  },
  absen: {
    label: "Absen",
    icon: "cancel",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function EmployeeHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("semua");

  const filtered =
    activeFilter === "semua"
      ? MOCK_DATA
      : MOCK_DATA.filter((e) => e.status === activeFilter);

  /* ---- Monthly summary figures ---- */
  const attendanceRate = 95;

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-8">
      <div className="mx-auto max-w-md px-4 pt-6 space-y-5">
        {/* ============================================================ */}
        {/*  Page Header                                                  */}
        {/* ============================================================ */}
        <div className="flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#1A1A1A] text-2xl">
            history
          </span>
          <h1 className="text-lg font-semibold text-[#1A1A1A]">
            Riwayat Kehadiran
          </h1>
        </div>

        {/* ============================================================ */}
        {/*  Monthly Summary Card                                         */}
        {/* ============================================================ */}
        <div className="rounded-2xl bg-white shadow-sm p-5 space-y-4 animate-fade-in">
          {/* Month label */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0056D2] text-xl">
              calendar_month
            </span>
            <span className="text-sm font-semibold text-[#1A1A1A]">
              Juni 2026
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <SummaryItem
              icon="work"
              label="Total Hari Kerja"
              value="22 hari"
            />
            <SummaryItem
              icon="schedule"
              label="Total Jam Kerja"
              value="171 jam"
            />
            <SummaryItem
              icon="timer_off"
              label="Keterlambatan"
              value="3 kali"
              valueColor="text-[#F39C12]"
            />
            <SummaryItem
              icon="payments"
              label="Total Denda"
              value={fmtCurrency(58000)}
              valueColor="text-red-500"
            />
          </div>

          {/* Attendance rate progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5A607F]">Tingkat Kehadiran</span>
              <span className="font-semibold text-[#1A1A1A]">
                {attendanceRate}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#EAECEF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2ECC71] transition-all duration-700"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Filter Pills                                                 */}
        {/* ============================================================ */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar animate-fade-in">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => setActiveFilter(pill.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#0056D2] text-white shadow-sm"
                    : "bg-white text-[#5A607F] border border-[#EAECEF]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/*  Daily Attendance Log                                          */}
        {/* ============================================================ */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-2xl bg-white shadow-sm p-6 text-center text-xs text-[#5A607F] animate-fade-in">
              Tidak ada data untuk filter ini.
            </div>
          )}

          {filtered.map((entry, idx) => {
            const cfg = STATUS_CONFIG[entry.status];
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white shadow-sm p-4 space-y-3 animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* ---- Header row ---- */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {entry.date}{" "}
                      <span className="font-normal text-[#5A607F]">
                        — {entry.day}
                      </span>
                    </p>
                    <p className="text-xs text-[#5A607F] mt-0.5">
                      Shift {entry.shift} · {entry.shiftHours}
                    </p>
                  </div>
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.color}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {cfg.icon}
                    </span>
                    {cfg.label}
                  </span>
                </div>

                {/* ---- Clock-in / Clock-out ---- */}
                {entry.status !== "absen" ? (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Clock In */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`material-symbols-outlined text-base ${
                          entry.status === "terlambat"
                            ? "text-[#F39C12]"
                            : "text-[#2ECC71]"
                        }`}
                      >
                        {entry.status === "terlambat"
                          ? "warning"
                          : "check_circle"}
                      </span>
                      <div>
                        <p className="text-[#5A607F] leading-none">Masuk</p>
                        <p className="font-semibold text-[#1A1A1A]">
                          {entry.clockIn}
                        </p>
                      </div>
                    </div>

                    {/* Clock Out */}
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#2ECC71]">
                        check_circle
                      </span>
                      <div>
                        <p className="text-[#5A607F] leading-none">Pulang</p>
                        <p className="font-semibold text-[#1A1A1A]">
                          {entry.clockOut}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-red-400 italic">
                    Tidak ada data clock-in/out
                  </p>
                )}

                {/* ---- Footer row: duration, denda, GPS ---- */}
                <div className="flex items-center justify-between border-t border-[#EAECEF] pt-2.5 text-xs">
                  <div className="flex items-center gap-3">
                    {/* Duration */}
                    {entry.workDuration && (
                      <span className="flex items-center gap-1 text-[#5A607F]">
                        <span className="material-symbols-outlined text-sm">
                          timelapse
                        </span>
                        {entry.workDuration}
                      </span>
                    )}

                    {/* Denda */}
                    {entry.denda > 0 && (
                      <span className="font-semibold text-red-500">
                        -{fmtCurrency(entry.denda)}
                      </span>
                    )}
                  </div>

                  {/* GPS badge */}
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      entry.gpsValid
                        ? "bg-[#2ECC71]/10 text-[#2ECC71]"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {entry.gpsValid ? "location_on" : "location_off"}
                    </span>
                    GPS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Inline keyframe for fade-in ---- */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helper component                                             */
/* ------------------------------------------------------------------ */
function SummaryItem({
  icon,
  label,
  value,
  valueColor = "text-[#1A1A1A]",
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined text-[#0056D2] text-base mt-0.5">
        {icon}
      </span>
      <div>
        <p className="text-[#5A607F] leading-tight">{label}</p>
        <p className={`font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}
