"use client";

import React, { useState } from "react";

interface AttendanceRecord {
  id: number;
  date: string;
  employeeName: string;
  role: string;
  avatar: string;
  branchName: string;
  shiftName: string;
  shiftHours: string;
  clockIn: string;
  clockOut: string;
  workDuration: string;
  status: "tepat_waktu" | "terlambat" | "izin" | "absen";
  lateMinutes: number;
  fineAmount: number;
  gpsDistance: string;
  fakeGpsDetected: boolean;
}

export default function OwnerReports() {
  // Filter States
  const [dateRange, setDateRange] = useState("7_hari");
  const [selectedBranch, setSelectedBranch] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  // Export State
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Mock Attendance Logs
  const [records] = useState<AttendanceRecord[]>([
    {
      id: 1,
      date: "26 Juni 2026",
      employeeName: "Budi Santoso",
      role: "Security",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      branchName: "Cabang Sudirman",
      shiftName: "Shift Pagi",
      shiftHours: "08:00 - 16:00",
      clockIn: "07:55",
      clockOut: "16:05",
      workDuration: "8 jam 10 menit",
      status: "tepat_waktu",
      lateMinutes: 0,
      fineAmount: 0,
      gpsDistance: "12m",
      fakeGpsDetected: false,
    },
    {
      id: 2,
      date: "26 Juni 2026",
      employeeName: "Siti Rahma",
      role: "Kasir",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      branchName: "Cabang Sudirman",
      shiftName: "Shift Pagi",
      shiftHours: "08:00 - 16:00",
      clockIn: "07:45",
      clockOut: "16:00",
      workDuration: "8 jam 15 menit",
      status: "tepat_waktu",
      lateMinutes: 0,
      fineAmount: 0,
      gpsDistance: "8m",
      fakeGpsDetected: false,
    },
    {
      id: 3,
      date: "26 Juni 2026",
      employeeName: "Agus Riyadi",
      role: "Supervisor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      branchName: "Cabang Sudirman",
      shiftName: "Shift Pagi",
      shiftHours: "08:00 - 16:00",
      clockIn: "08:24",
      clockOut: "16:02",
      workDuration: "7 jam 38 menit",
      status: "terlambat",
      lateMinutes: 24,
      fineAmount: 48000, // denda 2000 per menit
      gpsDistance: "25m (Butuh Izin)",
      fakeGpsDetected: false,
    },
    {
      id: 4,
      date: "25 Juni 2026",
      employeeName: "Budi Santoso",
      role: "Security",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      branchName: "Cabang Sudirman",
      shiftName: "Shift Pagi",
      shiftHours: "08:00 - 16:00",
      clockIn: "08:05",
      clockOut: "16:00",
      workDuration: "7 jam 55 menit",
      status: "terlambat",
      lateMinutes: 5,
      fineAmount: 10000,
      gpsDistance: "15m",
      fakeGpsDetected: false,
    },
    {
      id: 5,
      date: "25 Juni 2026",
      employeeName: "Siti Rahma",
      role: "Kasir",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      branchName: "Cabang Sudirman",
      shiftName: "Shift Pagi",
      shiftHours: "08:00 - 16:00",
      clockIn: "07:50",
      clockOut: "16:00",
      workDuration: "8 jam 10 menit",
      status: "tepat_waktu",
      lateMinutes: 0,
      fineAmount: 0,
      gpsDistance: "21m (Fake GPS Spoof)",
      fakeGpsDetected: true,
    },
    {
      id: 6,
      date: "24 Juni 2026",
      employeeName: "Agus Riyadi",
      role: "Supervisor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      branchName: "Cabang Dago",
      shiftName: "Shift Malam",
      shiftHours: "16:00 - 00:00",
      clockIn: "--:--",
      clockOut: "--:--",
      workDuration: "0 jam",
      status: "absen",
      lateMinutes: 0,
      fineAmount: 0,
      gpsDistance: "-",
      fakeGpsDetected: false,
    },
    {
      id: 7,
      date: "24 Juni 2026",
      employeeName: "Rudi Hartono",
      role: "Barista",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
      branchName: "Cabang Dago",
      shiftName: "Shift Siang",
      shiftHours: "12:00 - 20:00",
      clockIn: "11:55",
      clockOut: "20:05",
      workDuration: "8 jam 10 menit",
      status: "tepat_waktu",
      lateMinutes: 0,
      fineAmount: 0,
      gpsDistance: "5m",
      fakeGpsDetected: false,
    },
  ]);

  // Filter Logic
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch =
      selectedBranch === "semua" ||
      rec.branchName.toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesStatus =
      statusFilter === "semua" || rec.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Calculate Metrics from current filtered records
  const totalHours = filteredRecords.reduce((acc, curr) => {
    if (curr.status === "absen") return acc;
    // Simple duration parser: "X jam Y menit"
    const hourPart = parseInt(curr.workDuration.split(" ")[0]) || 0;
    return acc + hourPart;
  }, 0);

  const lateCount = filteredRecords.filter((rec) => rec.status === "terlambat").length;
  const totalFines = filteredRecords.reduce((acc, curr) => acc + curr.fineAmount, 0);
  const fakeGpsCount = filteredRecords.filter((rec) => rec.fakeGpsDetected).length;

  const handleExport = (type: "excel" | "pdf") => {
    setIsExporting(type);
    setTimeout(() => {
      setIsExporting(null);
      alert(`Laporan berhasil diekspor sebagai ${type === "excel" ? "File Excel (sifta_laporan.xlsx)" : "Dokumen PDF (sifta_laporan.pdf)"}`);
    }, 1500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Export Actions */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary-navy">Laporan & Analitik Absensi</h2>
          <p className="text-xs text-on-surface-variant">
            Pantau ringkasan jam kerja staf, tingkat keterlambatan, denda, dan audit lokasi GPS
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleExport("excel")}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-light border border-outline-variant text-primary-navy font-bold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            {isExporting === "excel" ? "Mengekspor..." : "Unduh Excel/CSV"}
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="flex items-center justify-center gap-2 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            {isExporting === "pdf" ? "Mengekspor..." : "Unduh Ringkasan PDF"}
          </button>
        </div>
      </section>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Hours */}
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm border-l-4 border-primary-teal">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Total Jam Kerja</p>
              <h3 className="text-2xl font-bold text-primary-navy mt-1.5">{totalHours} Jam</h3>
            </div>
            <div className="bg-primary-teal/10 p-2 rounded-xl text-primary-teal">
              <span className="material-symbols-outlined text-xl">schedule</span>
            </div>
          </div>
          <p className="text-[10px] text-success-emerald font-semibold mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">trending_up</span>
            +8.2% dari minggu lalu
          </p>
        </div>

        {/* Total Late */}
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm border-l-4 border-alert-amber">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Keterlambatan</p>
              <h3 className="text-2xl font-bold text-alert-amber mt-1.5">{lateCount} Insiden</h3>
            </div>
            <div className="bg-alert-amber/10 p-2 rounded-xl text-alert-amber">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant font-semibold mt-3">
            Rata-rata telat: 14.5 menit
          </p>
        </div>

        {/* Total Fine Amount */}
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Potongan Denda</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1.5">{formatCurrency(totalFines)}</h3>
            </div>
            <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
              <span className="material-symbols-outlined text-xl">money_off</span>
            </div>
          </div>
          <p className="text-[10px] text-red-500 font-semibold mt-3">
            Dialokasikan ke kas kesejahteraan staf
          </p>
        </div>

        {/* GPS Block alerts */}
        <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm border-l-4 border-red-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Fake GPS Terdeteksi</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1.5">{fakeGpsCount} Kasus</h3>
            </div>
            <div className="bg-red-600/10 p-2 rounded-xl text-red-600">
              <span className="material-symbols-outlined text-xl">gps_off</span>
            </div>
          </div>
          <p className="text-[10px] text-red-600 font-bold mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">security</span>
            Diblokir otomatis oleh Aplikasi
          </p>
        </div>
      </section>

      {/* Roster & Chart Visualization */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Chart */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-primary-navy">Tingkat Kehadiran Harian</h4>
              <p className="text-[10px] text-on-surface-variant">Persentase kehadiran dalam 7 hari terakhir</p>
            </div>
            <span className="text-[10px] font-bold bg-neutral-light px-2.5 py-1 rounded-lg text-primary-navy">
              Rata-rata: 88.5%
            </span>
          </div>

          {/* Simple Custom Bar Chart in HTML/CSS */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-outline-variant pb-2">
            {[
              { day: "Sen", pct: 90, active: false },
              { day: "Sel", pct: 85, active: false },
              { day: "Rab", pct: 95, active: false },
              { day: "Kam", pct: 92, active: false },
              { day: "Jum", pct: 88, active: false },
              { day: "Sab", pct: 75, active: false },
              { day: "Min", pct: 94, active: true },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full relative bg-neutral-light rounded-t-lg h-36 flex items-end">
                  <div
                    style={{ height: `${bar.pct}%` }}
                    className={`w-full rounded-t-lg transition-all group-hover:opacity-90 ${
                      bar.active ? "bg-primary-teal shadow-md" : "bg-primary-navy/40"
                    }`}
                  ></div>
                  {/* Tooltip on Hover */}
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-primary-navy text-white text-[9px] font-bold py-1 px-1.5 rounded transition-opacity shadow pointer-events-none z-10">
                    {bar.pct}%
                  </span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GPS Fraud Log Audits */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-sm text-primary-navy">Audit Keamanan Absensi</h4>
            <p className="text-[10px] text-on-surface-variant">Laporan anomali Fake GPS / Geofence Breach</p>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {records
              .filter((rec) => rec.fakeGpsDetected || rec.status === "terlambat")
              .map((rec) => (
                <div key={rec.id} className="p-3 bg-neutral-light rounded-xl border border-outline-variant flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img className="w-8 h-8 rounded-full object-cover border" src={rec.avatar} alt={rec.employeeName} />
                    <div>
                      <h5 className="font-bold text-xs text-primary-navy">{rec.employeeName}</h5>
                      <p className="text-[9px] text-on-surface-variant">{rec.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {rec.fakeGpsDetected ? (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold bg-red-600/10 text-red-600 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[10px]">gps_off</span>
                        Mock GPS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold bg-alert-amber/10 text-alert-amber px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                        Telat {rec.lateMinutes}m
                      </span>
                    )}
                    <p className="text-[8px] text-on-surface-variant mt-1">{rec.date}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Interactive Logs Table Section */}
      <section className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 border-b border-outline-variant bg-neutral-light/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-outline-variant bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal w-full md:w-56"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="py-2 px-3 border border-outline-variant bg-white rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="semua">Semua Cabang</option>
              <option value="sudirman">Cabang Sudirman</option>
              <option value="dago">Cabang Dago</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 border border-outline-variant bg-white rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="semua">Semua Status</option>
              <option value="tepat_waktu">Tepat Waktu</option>
              <option value="terlambat">Terlambat</option>
              <option value="izin">Izin</option>
              <option value="absen">Absen</option>
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex bg-neutral-light p-1 rounded-xl border border-outline-variant self-start md:self-auto">
            {[
              { id: "hari_ini", label: "Hari ini" },
              { id: "7_hari", label: "7 Hari" },
              { id: "bulan_ini", label: "Bulan ini" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setDateRange(btn.id)}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                  dateRange === btn.id
                    ? "bg-white text-primary-navy shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Viewport */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-light border-b border-outline-variant text-on-surface-variant font-bold">
                <th className="py-3 px-5">Nama / Peran</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Cabang & Shift</th>
                <th className="py-3 px-5">Masuk & Pulang</th>
                <th className="py-3 px-5">Durasi</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Denda</th>
                <th className="py-3 px-5 text-right">Deteksi GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-white">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant font-medium">
                    Tidak ada log absensi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-light/35 transition-colors">
                    {/* Employee Profile */}
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                        <img className="w-full h-full object-cover" src={rec.avatar} alt={rec.employeeName} />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{rec.employeeName}</h4>
                        <p className="text-[10px] text-on-surface-variant">{rec.role}</p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 font-semibold text-on-surface-variant">
                      {rec.date}
                    </td>

                    {/* Branch & Shift */}
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-primary-navy">{rec.branchName}</p>
                      <p className="text-[10px] text-on-surface-variant">{rec.shiftName} ({rec.shiftHours})</p>
                    </td>

                    {/* In / Out */}
                    <td className="py-3.5 px-5 font-mono">
                      <span className={rec.status === "terlambat" ? "text-alert-amber font-bold" : "text-on-surface"}>
                        {rec.clockIn}
                      </span>
                      {" / "}
                      <span>{rec.clockOut}</span>
                    </td>

                    {/* Work Duration */}
                    <td className="py-3.5 px-5 font-medium text-on-surface">
                      {rec.workDuration}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        rec.status === "tepat_waktu"
                          ? "bg-success-emerald/10 text-success-emerald"
                          : rec.status === "terlambat"
                          ? "bg-alert-amber/10 text-alert-amber"
                          : rec.status === "izin"
                          ? "bg-primary-teal/10 text-primary-teal"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {rec.status === "tepat_waktu" && "Tepat Waktu"}
                        {rec.status === "terlambat" && "Terlambat"}
                        {rec.status === "izin" && "Izin"}
                        {rec.status === "absen" && "Mangkir / Absen"}
                      </span>
                    </td>

                    {/* Fine Amount */}
                    <td className="py-3.5 px-5 font-bold">
                      {rec.fineAmount > 0 ? (
                        <span className="text-red-500">-{formatCurrency(rec.fineAmount)}</span>
                      ) : (
                        <span className="text-on-surface-variant">-</span>
                      )}
                    </td>

                    {/* GPS audit */}
                    <td className="py-3.5 px-5 text-right font-medium">
                      {rec.fakeGpsDetected ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-600/5 px-2.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[10px]">gps_off</span>
                          Mock GPS Blocked
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold ${
                          rec.status === "absen" ? "text-on-surface-variant" : "text-success-emerald"
                        }`}>
                          {rec.status !== "absen" && (
                            <>
                              <span className="material-symbols-outlined text-[10px]">location_on</span>
                              Aman ({rec.gpsDistance})
                            </>
                          )}
                          {rec.status === "absen" && "-"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
