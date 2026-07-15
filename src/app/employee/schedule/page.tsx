"use client";

import React, { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShiftDay {
  date: Date;
  shiftName: string;
  timeRange: string;
  branch: string;
  status: "dijadwalkan" | "selesai" | "hari-ini" | "libur";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Return Monday of the week containing `d`. */
function getMonday(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatWeekRange(monday: Date) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const sameMonth = monday.getMonth() === sunday.getMonth();
  if (sameMonth) {
    return `${monday.getDate()} - ${sunday.getDate()} ${BULAN[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${BULAN[monday.getMonth()]} - ${sunday.getDate()} ${BULAN[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

// ─── Mock Data Generator ──────────────────────────────────────────────────────
function generateMockShifts(monday: Date, today: Date): ShiftDay[] {
  const templates: Omit<ShiftDay, "date" | "status">[] = [
    { shiftName: "Shift Pagi", timeRange: "08:00 - 16:00", branch: "Cabang Sudirman" },
    { shiftName: "Shift Pagi", timeRange: "07:00 - 15:00", branch: "Cabang Sudirman" },
    { shiftName: "Shift Siang", timeRange: "12:00 - 20:00", branch: "Cabang Thamrin" },
    { shiftName: "Libur", timeRange: "-", branch: "-" },
    { shiftName: "Shift Pagi", timeRange: "08:00 - 16:00", branch: "Cabang Sudirman" },
    { shiftName: "Shift Malam", timeRange: "20:00 - 04:00", branch: "Cabang Kemang" },
    { shiftName: "Shift Pagi", timeRange: "09:00 - 17:00", branch: "Cabang Sudirman" },
  ];

  return templates.map((t, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    let status: ShiftDay["status"];
    if (t.shiftName === "Libur") {
      status = "libur";
    } else if (isSameDay(date, today)) {
      status = "hari-ini";
    } else if (date < today) {
      status = "selesai";
    } else {
      status = "dijadwalkan";
    }

    return { ...t, date, status };
  });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ShiftDay["status"] }) {
  const map: Record<ShiftDay["status"], { label: string; cls: string }> = {
    dijadwalkan: {
      label: "Dijadwalkan",
      cls: "bg-primary-teal/10 text-primary-teal",
    },
    selesai: {
      label: "Selesai",
      cls: "bg-success-emerald/10 text-success-emerald",
    },
    "hari-ini": {
      label: "Hari Ini",
      cls: "bg-alert-amber/10 text-alert-amber",
    },
    libur: {
      label: "Libur",
      cls: "bg-success-emerald/10 text-success-emerald",
    },
  };

  const { label, cls } = map[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}
    >
      {status === "selesai" && (
        <span
          className="material-symbols-outlined text-[12px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      )}
      {status === "hari-ini" && (
        <span className="material-symbols-outlined text-[12px]">
          radio_button_checked
        </span>
      )}
      {label}
    </span>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SchedulePage() {
  const today = useMemo(() => new Date(), []);
  const [weekOffset, setWeekOffset] = useState(0);

  const currentMonday = useMemo(() => {
    const mon = getMonday(today);
    mon.setDate(mon.getDate() + weekOffset * 7);
    return mon;
  }, [today, weekOffset]);

  const shifts = useMemo(
    () => generateMockShifts(currentMonday, today),
    [currentMonday, today],
  );

  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  // Weekly summary
  const totalShifts = shifts.filter((s) => s.shiftName !== "Libur").length;
  const estimatedHours = totalShifts * 8;
  const hourlyRate = 25_000;
  const estimatedWages = estimatedHours * hourlyRate;

  // The day‑strip uses Sen‑Min ordering (Mon → Sun)
  const dayStripLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <section className="px-4 pt-6 pb-4 animate-fade-in">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-primary-teal text-2xl">
          calendar_month
        </span>
        <h1 className="text-lg font-bold text-primary-navy tracking-tight">
          Jadwal Shift Saya
        </h1>
      </div>

      {/* ── Week Selector ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-4 py-3 mb-4 border border-outline-variant">
        <button
          aria-label="Minggu sebelumnya"
          onClick={() => setWeekOffset((o) => o - 1)}
          className="p-1.5 rounded-xl hover:bg-surface-container transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-xl">
            chevron_left
          </span>
        </button>

        <div className="text-center">
          <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
            Minggu
          </p>
          <p className="text-sm font-bold text-primary-navy">
            {formatWeekRange(currentMonday)}
          </p>
        </div>

        <button
          aria-label="Minggu berikutnya"
          onClick={() => setWeekOffset((o) => o + 1)}
          className="p-1.5 rounded-xl hover:bg-surface-container transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-xl">
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Day Strip ────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-hide">
        {shifts.map((shift, idx) => {
          const isToday = isSameDay(shift.date, today);
          const isSelected = selectedDayIdx === idx;
          const isOff = shift.shiftName === "Libur";

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIdx(isSelected ? null : idx)}
              className={`flex-1 min-w-[44px] flex flex-col items-center py-2 rounded-2xl transition-all duration-200 border ${
                isToday
                  ? "bg-primary-teal text-white border-primary-teal shadow-md shadow-primary-teal/20"
                  : isSelected
                    ? "bg-primary-teal/10 text-primary-teal border-primary-teal/30"
                    : isOff
                      ? "bg-success-emerald/5 text-on-surface-variant border-outline-variant"
                      : "bg-white text-on-surface border-outline-variant hover:border-primary-teal/30"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase">
                {dayStripLabels[idx]}
              </span>
              <span className="text-sm font-bold mt-0.5">
                {shift.date.getDate()}
              </span>
              {isOff && (
                <span className="w-1.5 h-1.5 rounded-full bg-success-emerald mt-1" />
              )}
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Daily Shift Cards ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-5">
        {(selectedDayIdx !== null ? [shifts[selectedDayIdx]] : shifts).map(
          (shift, idx) => {
            const isOff = shift.shiftName === "Libur";
            const dayLabel = HARI[shift.date.getDay()];
            const dateLabel = `${shift.date.getDate()} ${BULAN[shift.date.getMonth()]}`;

            return (
              <div
                key={selectedDayIdx !== null ? selectedDayIdx : idx}
                className={`rounded-2xl shadow-sm border p-4 transition-all duration-300 animate-fade-in ${
                  isOff
                    ? "bg-gradient-to-br from-success-emerald/5 to-white border-success-emerald/20"
                    : shift.status === "hari-ini"
                      ? "bg-gradient-to-br from-primary-teal/5 to-white border-primary-teal/20 ring-1 ring-primary-teal/10"
                      : "bg-white border-outline-variant"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isOff
                          ? "bg-success-emerald/10"
                          : shift.status === "hari-ini"
                            ? "bg-alert-amber/10"
                            : "bg-primary-teal/10"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          isOff
                            ? "text-success-emerald"
                            : shift.status === "hari-ini"
                              ? "text-alert-amber"
                              : "text-primary-teal"
                        }`}
                      >
                        {isOff ? "beach_access" : "work"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-navy">
                        {dayLabel}, {dateLabel}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          isOff ? "text-success-emerald" : "text-primary-navy"
                        }`}
                      >
                        {shift.shiftName}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={shift.status} />
                </div>

                {/* Card Body */}
                {!isOff && (
                  <div className="flex items-center gap-4 pt-2.5 border-t border-outline-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">
                        schedule
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {shift.timeRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">
                        location_on
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {shift.branch}
                      </span>
                    </div>
                  </div>
                )}

                {isOff && (
                  <p className="text-xs text-success-emerald/70 mt-1">
                    Nikmati hari liburmu! 🌴
                  </p>
                )}
              </div>
            );
          },
        )}
      </div>

      {/* ── Weekly Summary Strip ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary-teal to-primary-teal/85 rounded-2xl shadow-sm p-4 text-white">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="material-symbols-outlined text-white/80 text-sm">
            bar_chart
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Ringkasan Minggu Ini
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold">{totalShifts}</p>
            <p className="text-[10px] text-white/70 font-medium">Total Shift</p>
          </div>
          <div className="text-center border-x border-white/20">
            <p className="text-xl font-bold">{estimatedHours}</p>
            <p className="text-[10px] text-white/70 font-medium">Est. Jam</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold leading-tight">
              {IDR.format(estimatedWages)}
            </p>
            <p className="text-[10px] text-white/70 font-medium">Est. Upah</p>
          </div>
        </div>
      </div>
    </section>
  );
}
