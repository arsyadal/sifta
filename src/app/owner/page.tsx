"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Activity {
  id: number;
  name: string;
  role: string;
  time: string;
  type: "masuk" | "pulang" | "izin" | "terlambat";
  locationStatus?: string;
  avatar: string;
}

export default function OwnerDashboard() {
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      name: "Budi",
      role: "Security",
      time: "07:55",
      type: "masuk",
      locationStatus: "Lokasi Sesuai",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
    },
    {
      id: 2,
      name: "Siti",
      role: "Kasir",
      time: "07:45",
      type: "masuk",
      locationStatus: "Lokasi Sesuai",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
    },
    {
      id: 3,
      name: "Agus",
      role: "Supervisor",
      time: "07:30",
      type: "terlambat",
      locationStatus: "Izin Terlambat",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
    },
  ]);

  const [filter, setFilter] = useState("semua");

  return (
    <div className="space-y-6">
      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Present */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 flex items-center justify-between shadow-sm border-l-4 border-primary-teal hover:shadow-md transition-shadow">
          <div>
            <p className="text-on-surface-variant text-sm font-semibold">Karyawan Hadir</p>
            <h3 className="text-3xl font-bold text-primary-navy mt-1">
              42 <span className="text-sm font-normal text-on-surface-variant">/ 50 orang</span>
            </h3>
            <p className="text-xs text-success-emerald font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              84% Tingkat Kehadiran
            </p>
          </div>
          <div className="bg-primary-teal/10 p-3 rounded-xl text-primary-teal">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
        </div>

        {/* Card Late */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 flex items-center justify-between shadow-sm border-l-4 border-alert-amber hover:shadow-md transition-shadow">
          <div>
            <p className="text-on-surface-variant text-sm font-semibold">Terlambat</p>
            <h3 className="text-3xl font-bold text-alert-amber mt-1">3 <span className="text-sm font-normal text-on-surface-variant">orang</span></h3>
            <p className="text-xs text-alert-amber font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              Butuh verifikasi denda
            </p>
          </div>
          <div className="bg-alert-amber/10 p-3 rounded-xl text-alert-amber">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
        </div>

        {/* Card Unsubmitted */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 flex items-center justify-between shadow-sm border-l-4 border-outline hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-on-surface-variant text-sm font-semibold">Belum Absen</p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">5 <span className="text-sm font-normal text-on-surface-variant">orang</span></h3>
            <p className="text-xs text-on-surface-variant font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Shift Pagi (08:00 - 16:00)
            </p>
          </div>
          <div className="bg-surface-container p-3 rounded-xl text-outline">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-primary-navy mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/owner/employees"
            className="flex items-center justify-center gap-2 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined">person_add</span>
            Tambah Karyawan Baru
          </Link>
          <Link
            href="/owner/schedule"
            className="flex items-center justify-center gap-2 border-2 border-primary-teal text-primary-teal hover:bg-primary-teal/5 font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined">calendar_add_on</span>
            Atur Jadwal Shift Baru
          </Link>
        </div>
      </section>

      {/* Real-time Activity Feed */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-navy">Aktivitas Terbaru</h2>
            <p className="text-xs text-on-surface-variant">Log absensi masuk/pulang real-time hari ini</p>
          </div>
          <button className="text-xs font-bold text-primary-teal hover:underline flex items-center gap-1">
            Lihat Semua Log
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-outline-variant flex gap-4 items-start hover:bg-neutral-light transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant">
                <img className="w-full h-full object-cover" src={act.avatar} alt={act.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">
                      {act.name} <span className="font-normal text-xs text-on-surface-variant">({act.role})</span>
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {act.type === "masuk" && (
                        <span>
                          Melakukan <span className="text-primary-teal font-semibold">Absen Masuk</span>
                        </span>
                      )}
                      {act.type === "terlambat" && (
                        <span>
                          Melakukan <span className="text-alert-amber font-semibold">Absen Terlambat</span>
                        </span>
                      )}
                      {act.type === "pulang" && (
                        <span>
                          Melakukan <span className="text-success-emerald font-semibold">Absen Pulang</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-md font-semibold">
                    {act.time}
                  </span>
                </div>

                {act.locationStatus && (
                  <div className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                    act.type === "terlambat"
                      ? "bg-alert-amber/10 text-alert-amber"
                      : "bg-success-emerald/10 text-success-emerald"
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {act.type === "terlambat" ? "warning" : "location_on"}
                    </span>
                    {act.locationStatus}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
