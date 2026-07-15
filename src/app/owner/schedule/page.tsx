"use client";

import React, { useState } from "react";

interface Shift {
  employeeId: number;
  name: string;
  role: string;
  avatar: string;
  schedule: {
    [day: string]: {
      shiftName: string;
      color: string;
      time: string;
    };
  };
}

export default function ShiftScheduler() {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  
  const [shifts, setShifts] = useState<Shift[]>([
    {
      employeeId: 1,
      name: "Budi Santoso",
      role: "Security",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      schedule: {
        Senin: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Selasa: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Rabu: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Kamis: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
        Jumat: { shiftName: "Malam", color: "bg-primary-navy/10 text-primary-navy border-primary-navy/20", time: "00:00 - 08:00" },
        Sabtu: { shiftName: "Malam", color: "bg-primary-navy/10 text-primary-navy border-primary-navy/20", time: "00:00 - 08:00" },
        Minggu: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
      },
    },
    {
      employeeId: 2,
      name: "Siti Rahma",
      role: "Kasir",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      schedule: {
        Senin: { shiftName: "Siang", color: "bg-success-emerald/20 text-success-emerald border-success-emerald/30", time: "16:00 - 00:00" },
        Selasa: { shiftName: "Siang", color: "bg-success-emerald/20 text-success-emerald border-success-emerald/30", time: "16:00 - 00:00" },
        Rabu: { shiftName: "Siang", color: "bg-success-emerald/20 text-success-emerald border-success-emerald/30", time: "16:00 - 00:00" },
        Kamis: { shiftName: "Siang", color: "bg-success-emerald/20 text-success-emerald border-success-emerald/30", time: "16:00 - 00:00" },
        Jumat: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
        Sabtu: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
        Minggu: { shiftName: "Siang", color: "bg-success-emerald/20 text-success-emerald border-success-emerald/30", time: "16:00 - 00:00" },
      },
    },
    {
      employeeId: 3,
      name: "Agus Riyadi",
      role: "Supervisor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      schedule: {
        Senin: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Selasa: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Rabu: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
        Kamis: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Jumat: { shiftName: "Pagi", color: "bg-primary-teal/20 text-primary-teal border-primary-teal/30", time: "08:00 - 16:00" },
        Sabtu: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
        Minggu: { shiftName: "Libur", color: "bg-outline/10 text-outline border-outline/20", time: "-" },
      },
    },
  ]);

  const [selectedShift, setSelectedShift] = useState<{ empId: number; day: string } | null>(null);
  const [waSending, setWaSending] = useState(false);
  const [waSent, setWaSent] = useState(false);

  const handleShiftChange = (empId: number, day: string, newShiftName: string) => {
    let color = "bg-outline/10 text-outline border-outline/20";
    let time = "-";
    if (newShiftName === "Pagi") {
      color = "bg-primary-teal/20 text-primary-teal border-primary-teal/30";
      time = "08:00 - 16:00";
    } else if (newShiftName === "Siang") {
      color = "bg-success-emerald/20 text-success-emerald border-success-emerald/30";
      time = "16:00 - 00:00";
    } else if (newShiftName === "Malam") {
      color = "bg-primary-navy/20 text-primary-navy border-primary-navy/30";
      time = "00:00 - 08:00";
    }

    setShifts(
      shifts.map((s) => {
        if (s.employeeId === empId) {
          return {
            ...s,
            schedule: {
              ...s.schedule,
              [day]: { shiftName: newShiftName, color, time },
            },
          };
        }
        return s;
      })
    );
    setSelectedShift(null);
  };

  const blastScheduleViaWA = () => {
    setWaSending(true);
    setTimeout(() => {
      setWaSending(false);
      setWaSent(true);
      setTimeout(() => setWaSent(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Roster Header Filters */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary-navy">Roster Shift Mingguan</h2>
          <p className="text-xs text-on-surface-variant">Periode: 14 Oktober - 20 Oktober 2024</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={blastScheduleViaWA}
            disabled={waSending}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] disabled:bg-gray-300 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs"
          >
            {waSending ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[16px]">sync</span>
                Mengirim...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">send</span>
                Kirim Roster via WhatsApp
              </>
            )}
          </button>
        </div>
      </section>

      {/* WhatsApp Sent Toast Notification */}
      {waSent && (
        <div className="bg-[#E8F8F0] border border-[#25D366]/30 text-[#1E7E34] px-4 py-3.5 rounded-xl flex items-center gap-3 shadow-md animate-bounce">
          <span className="material-symbols-outlined text-[20px] font-bold">check_circle</span>
          <span className="text-sm font-semibold">Sukses! Roster jadwal shift mingguan telah dikirim ke WhatsApp masing-masing karyawan.</span>
        </div>
      )}

      {/* Calendar Shift Table Grid */}
      <section className="bg-white border border-outline-variant rounded-2xl p-4 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-outline-variant bg-neutral-light">
              <th className="py-4 px-4 font-bold text-sm text-primary-navy w-48">Karyawan</th>
              {days.map((day) => (
                <th key={day} className="py-4 px-2 font-bold text-xs text-on-surface-variant text-center w-28">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((emp) => (
              <tr key={emp.employeeId} className="border-b border-outline-variant hover:bg-neutral-light/50 transition-colors">
                {/* Employee Info Header */}
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant">
                    <img className="w-full h-full object-cover" src={emp.avatar} alt={emp.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{emp.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">{emp.role}</p>
                  </div>
                </td>

                {/* Weekday Schedule Grid cells */}
                {days.map((day) => {
                  const s = emp.schedule[day];
                  const isEditing = selectedShift?.empId === emp.employeeId && selectedShift?.day === day;

                  return (
                    <td key={day} className="py-4 px-2 text-center relative">
                      {isEditing ? (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-outline-variant shadow-lg rounded-lg p-1 z-30 flex flex-col gap-1 w-24">
                          {["Pagi", "Siang", "Malam", "Libur"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleShiftChange(emp.employeeId, day, opt)}
                              className="text-[10px] font-semibold text-on-surface hover:bg-surface-container py-1 px-2 rounded text-left transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedShift({ empId: emp.employeeId, day })}
                          className={`w-full py-2.5 px-1 border rounded-xl text-xs font-bold transition-all hover:scale-102 flex flex-col items-center justify-center cursor-pointer ${s.color}`}
                        >
                          <span>{s.shiftName}</span>
                          <span className="text-[9px] font-normal opacity-70 mt-0.5">{s.time}</span>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Legend & Instructions */}
      <section className="bg-[#F8F9FA] rounded-2xl p-6 border border-outline-variant text-xs text-on-surface-variant flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary-teal/20 border border-primary-teal/30 block"></span>
            Shift Pagi (08:00 - 16:00)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-success-emerald/20 border border-success-emerald/30 block"></span>
            Shift Siang (16:00 - 00:00)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary-navy/10 border border-primary-navy/20 block"></span>
            Shift Malam (00:00 - 08:00)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-outline/10 border border-outline/20 block"></span>
            Libur / Off
          </span>
        </div>
        <p className="font-semibold italic text-primary-teal text-center sm:text-right">
          *Klik kotak shift untuk mengubah jadwal karyawan secara instan.
        </p>
      </section>
    </div>
  );
}
