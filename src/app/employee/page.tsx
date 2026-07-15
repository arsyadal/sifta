"use client";

import React, { useState, useEffect, useCallback } from "react";
import SiftaLogo from "../components/SiftaLogo";
import { getEmployeeDashboardData, clockIn, clockOut } from "../actions";

export default function EmployeeDashboard() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [isWithinGeofence, setIsWithinGeofence] = useState(true);
  const [fakeGpsDetected, setFakeGpsDetected] = useState(false);
  
  // Real GPS variables
  const [realLat, setRealLat] = useState<number | null>(null);
  const [realLng, setRealLng] = useState<number | null>(null);
  const [realDistance, setRealDistance] = useState<number | null>(null);
  const [useRealGps, setUseRealGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  interface CustomAlert {
    type: "info" | "warning" | "error" | "confirm";
    title: string;
    message: string;
    action?: () => void;
  }
  
  const [activeAlert, setActiveAlert] = useState<CustomAlert | null>(null);

  // Database integration state variables
  const [employee, setEmployee] = useState<any>(null);
  const [todayShift, setTodayShift] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cabang Sudirman Coordinates (Jalan Sudirman, Jakarta)
  const branchLat = -6.2197;
  const branchLng = 106.8208;
  const geofenceRadius = 20; // 20 meters

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  const checkRealGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }
    
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setRealLat(lat);
        setRealLng(lng);
        
        const dist = getDistance(lat, lng, branchLat, branchLng);
        setRealDistance(dist);
        setUseRealGps(true);
        setIsWithinGeofence(dist <= geofenceRadius);
      },
      (error) => {
        setGpsError("Gagal mengambil GPS. Pastikan izin lokasi aktif.");
      }
    );
  };
  
  // Camera simulation state
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDate(now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    // Fetch for seeded employee (Budi Santoso's phone)
    const data = await getEmployeeDashboardData("0812-3456-7890");
    if (data) {
      setEmployee(data.employee);
      setTodayShift(data.todayShift);
      setTodayAttendance(data.todayAttendance);
      if (data.todayAttendance) {
        setIsClockedIn(true);
        setClockInTime(
          new Date(data.todayAttendance.clockIn).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setCapturedPhoto(
          data.todayAttendance.clockInPhotoUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
        );
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
        setCapturedPhoto(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleClockInAction = () => {
    if (fakeGpsDetected) {
      setActiveAlert({
        type: "error",
        title: "Absen Diblokir!",
        message: "Aplikasi mendeteksi adanya Fake GPS / Mock Provider aktif pada perangkat Anda. Silakan matikan software tersebut dan coba lagi.",
      });
      return;
    }
    if (!isWithinGeofence) {
      setActiveAlert({
        type: "warning",
        title: "Di Luar Radius Cabang",
        message: "Anda berada di luar zona geofencing 20 meter dari Cabang Sudirman. Silakan dekati area cabang toko untuk melakukan absensi.",
      });
      return;
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    const photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200";
    setCapturedPhoto(photo);
    setShowCamera(false);

    if (employee && todayShift) {
      const lat = realLat || -6.2197;
      const lng = realLng || 106.8208;
      const res = await clockIn(employee.id, todayShift.id, lat, lng, fakeGpsDetected, photo);
      if (res.success && res.attendance) {
        setTodayAttendance(res.attendance);
        setIsClockedIn(true);
        setClockInTime(new Date(res.attendance.clockIn).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        setActiveAlert({
          type: "info",
          title: "Absen Masuk Berhasil",
          message: "Selamat bekerja! Shift pagi Anda telah terdaftar dan verifikasi foto wajah selesai.",
        });
      } else {
        alert("Gagal mencatat absensi ke database.");
      }
    } else {
      // Fallback
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      setActiveAlert({
        type: "info",
        title: "Absen Masuk Berhasil (Simulasi)",
        message: "Selamat bekerja! Shift pagi Anda telah terdaftar (Mode offline simulator).",
      });
    }
  };

  const handleClockOutAction = () => {
    setActiveAlert({
      type: "confirm",
      title: "Konfirmasi Absen Keluar",
      message: "Apakah Anda yakin ingin menyelesaikan shift kerja harian Anda sekarang? Jam kerja harian Anda akan dihitung.",
      action: async () => {
        if (todayAttendance) {
          const res = await clockOut(todayAttendance.id);
          if (res.success) {
            setIsClockedIn(false);
            setClockInTime(null);
            setCapturedPhoto(null);
            setTodayAttendance(null);
            setActiveAlert({
              type: "info",
              title: "Absen Keluar Berhasil",
              message: "Terima kasih atas dedikasi Anda hari ini! Data jam kerja harian Anda telah tersimpan.",
            });
            loadDashboardData();
          } else {
            alert("Gagal mencatat absen keluar.");
          }
        } else {
          setIsClockedIn(false);
          setClockInTime(null);
          setCapturedPhoto(null);
          setActiveAlert({
            type: "info",
            title: "Absen Keluar Berhasil (Simulasi)",
            message: "Terima kasih atas dedikasi Anda hari ini! Data jam kerja harian Anda telah tersimpan.",
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col relative">
      
      {/* Employee Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant flex justify-between items-center w-full px-4 h-16 shadow-sm">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-2xl ${isWithinGeofence && !fakeGpsDetected ? "text-primary-teal" : "text-alert-amber"}`}>
            {fakeGpsDetected ? "dangerous" : "location_on"}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-semibold leading-none">Lokasi Absensi</span>
            <span className="text-xs font-bold text-on-surface mt-0.5">
              {fakeGpsDetected ? "Sistem Diblokir" : isWithinGeofence ? "Cabang Sudirman" : "Di Luar Zona Toko"}
            </span>
          </div>
        </div>
        <SiftaLogo className="h-7 w-auto" />
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-teal/20">
          <img
            className="w-full h-full object-cover"
            alt="Employee"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt2FrHPum8hS-KkyGk05PNUH38RKebICLzgKsXyvepXBPIFez95PzaVDcelDCV3YKct5cNVR-6lpIqJer4F-NQPvMrUdxpPo6-B7FDIplEJsp934DYTSANKQywSbi8j7BtOq28Oe6DFPo40NJskFdv60aAO7uPWCkD5hnDH_gQTueOzozU8h1IfKJytH86wEqwgfePVCJRPCUPCbOV2piGbLl4dY0767jtZMpbYccdQ_0gPs5QfD5rItMf6bzSnellTiTVqzgB1_A"
          />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 pb-24 space-y-6">
        
        {/* Testing Simulator Box (For Demo) */}
        <section className="bg-primary-navy/5 p-3 rounded-xl border border-primary-navy/10 text-xs text-primary-navy space-y-2">
          <p className="font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">construction</span>
              SIMULATOR ABSENSI (Uji Coba Lapangan)
            </span>
            <span className="text-[10px] font-semibold bg-primary-teal/10 text-primary-teal px-2 py-0.5 rounded">
              {useRealGps ? "Mode GPS Real" : "Mode Simulator"}
            </span>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUseRealGps(false);
                  setIsWithinGeofence(!isWithinGeofence);
                }}
                className={`flex-1 py-1.5 px-2 bg-white border rounded font-semibold text-center hover:bg-neutral-light active:scale-95 transition-all ${
                  !useRealGps && isWithinGeofence ? "border-primary-teal text-primary-teal bg-primary-teal/5" : "border-primary-navy/20"
                }`}
              >
                {isWithinGeofence && !useRealGps ? "Simulasi Keluar Zona" : "Simulasi Masuk Zona"}
              </button>
              <button
                onClick={() => setFakeGpsDetected(!fakeGpsDetected)}
                className="flex-1 py-1.5 px-2 bg-white border border-primary-navy/20 rounded font-semibold text-center hover:bg-neutral-light active:scale-95 transition-all text-red-600"
              >
                {fakeGpsDetected ? "Matikan Fake GPS" : "Deteksi Fake GPS"}
              </button>
            </div>
            
            <button
              onClick={checkRealGPS}
              className={`w-full py-1.5 px-2 bg-primary-teal text-white rounded font-bold text-center hover:bg-primary-teal/90 active:scale-95 transition-all flex items-center justify-center gap-1 ${
                useRealGps ? "ring-2 ring-primary-teal/40" : ""
              }`}
            >
              <span className="material-symbols-outlined text-sm">my_location</span>
              Uji Pakai GPS Asli HP / Browser Anda
            </button>

            {gpsError && (
              <p className="text-[10px] text-red-600 text-center font-medium">{gpsError}</p>
            )}
          </div>
        </section>

        {/* Time and Status Hero */}
        <section className="text-center py-4 flex flex-col items-center">
          <div className="text-4xl font-extrabold text-primary-navy tracking-tight">{currentTime || "00:00:00"}</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">{currentDate || "Memuat Hari..."}</div>
          
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-outline-variant rounded-full shadow-sm text-xs font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? "bg-success-emerald" : "bg-alert-amber"} animate-pulse`}></span>
            <span>{isClockedIn ? `Status: Bekerja sejak ${clockInTime}` : "Status: Belum Absen"}</span>
          </div>
        </section>

        {/* Geofencing Status Warning Card */}
        {fakeGpsDetected ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
            <span className="material-symbols-outlined text-red-500 font-bold">report</span>
            <div>
              <h4 className="font-bold text-sm">Fake GPS Terdeteksi</h4>
              <p className="text-xs text-red-600/90 mt-0.5">Sistem mendeteksi aplikasi Mock Location aktif. Tombol absensi dinonaktifkan demi integritas data.</p>
            </div>
          </div>
        ) : !isWithinGeofence ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
            <span className="material-symbols-outlined text-amber-500 font-bold">wrong_location</span>
            <div>
              <h4 className="font-bold text-sm">Di Luar Zona Absensi</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {useRealGps && realDistance !== null ? (
                  <span>Anda berjarak <strong>{Math.round(realDistance).toLocaleString("id-ID")} meter</strong> dari Cabang Sudirman (Batas radius: 20 meter).</span>
                ) : (
                  "Anda berada terlalu jauh dari cabang Sudirman (di luar radius 20 meter). Silakan mendekat ke lokasi toko."
                )}
              </p>
              {useRealGps && realLat && realLng && (
                <p className="text-[10px] text-amber-700/80 mt-1">Koordinat Anda: {realLat.toFixed(5)}, {realLng.toFixed(5)}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-success-emerald/5 border border-success-emerald/20 text-success-emerald rounded-2xl p-4 flex gap-3 items-start shadow-sm">
            <span className="material-symbols-outlined text-success-emerald font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <h4 className="font-bold text-sm">Lokasi Sesuai</h4>
              <p className="text-xs text-success-emerald/90 mt-0.5">
                {useRealGps && realDistance !== null ? (
                  <span>Perangkat terverifikasi hanya berjarak <strong>{Math.round(realDistance)}m</strong> dari titik pusat Cabang Sudirman.</span>
                ) : (
                  "Perangkat Anda berada di dalam radius zona cabang Sudirman yang terverifikasi."
                )}
              </p>
              {useRealGps && realLat && realLng && (
                <p className="text-[10px] text-success-emerald/80 mt-1">Koordinat Anda: {realLat.toFixed(5)}, {realLng.toFixed(5)}</p>
              )}
            </div>
          </div>
        )}

        {/* Clock In / Out Actions */}
        <section className="grid grid-cols-2 gap-4">
          {/* Clock In Button */}
          <button
            onClick={handleClockInAction}
            disabled={isClockedIn || fakeGpsDetected || !isWithinGeofence}
            className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-lg transition-all active:scale-95 border-2 ${
              isClockedIn || fakeGpsDetected || !isWithinGeofence
                ? "bg-surface-dim text-outline border-outline-variant cursor-not-allowed opacity-50 shadow-none"
                : "bg-primary-teal text-white border-primary-teal hover:bg-primary-teal/90"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl font-bold">login</span>
            </div>
            <span className="font-bold text-sm">Masuk</span>
            <span className="text-[10px] opacity-85">Absen Datang</span>
          </button>

          {/* Clock Out Button */}
          <button
            onClick={handleClockOutAction}
            disabled={!isClockedIn}
            className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-lg transition-all active:scale-95 border-2 ${
              !isClockedIn
                ? "bg-surface-dim text-outline border-outline-variant cursor-not-allowed opacity-50 shadow-none"
                : "bg-alert-amber text-white border-alert-amber hover:bg-alert-amber/90"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl font-bold">logout</span>
            </div>
            <span className="font-bold text-sm">Pulang</span>
            <span className="text-[10px] opacity-85">Absen Keluar</span>
          </button>
        </section>

        {/* Today's Working Summary */}
        <section className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-primary-navy">Ringkasan Hari Ini</h3>
          
          <div className="grid grid-cols-2 gap-4 border-b border-outline-variant pb-4">
            <div className="space-y-1">
              <p className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span> Jam Kerja
              </p>
              <h4 className="text-xl font-bold text-on-surface">{isClockedIn ? "3j 45m" : "0j 0m"}</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">payments</span> Estimasi Gaji
              </p>
              <h4 className="text-xl font-bold text-primary-teal">{isClockedIn ? "Rp 93.750" : "Rp 0"}</h4>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Shift Pagi: 08:00 - 16:00</span>
            <a href="/employee/history" className="text-primary-teal font-bold hover:underline cursor-pointer">Lihat Riwayat</a>
          </div>
        </section>

        {/* Tip Box */}
        <div className="bg-primary-teal/5 border border-primary-teal/20 rounded-2xl p-4 flex gap-3 text-xs text-primary-teal">
          <span className="material-symbols-outlined text-xl">lightbulb</span>
          <p className="leading-relaxed">
            Pastikan Anda tidak menutup aplikasi Sifta selama shift aktif agar modul pelacakan lembur harian Anda berjalan dengan akurat.
          </p>
        </div>
      </main>



      {/* Face Check Camera Overlay Simulation */}
      {showCamera && (
        <div className="absolute inset-0 bg-primary-navy/90 z-50 flex flex-col justify-between p-6">
          <div className="text-center text-white space-y-1">
            <h3 className="text-lg font-bold">Verifikasi Wajah</h3>
            <p className="text-xs opacity-75">Harap posisikan wajah Anda di dalam lingkaran</p>
          </div>

          {/* Camera Frame Circle */}
          <div className="relative w-64 h-64 rounded-full border-4 border-primary-teal mx-auto overflow-hidden flex items-center justify-center bg-black shadow-inner">
            <span className="material-symbols-outlined text-white/20 text-8xl animate-pulse">account_circle</span>
            <div className="absolute inset-4 rounded-full border border-white/20 border-dashed animate-spin"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCamera(false)}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleCapture}
              className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/95 text-white font-bold rounded-xl text-sm transition-all"
            >
              Ambil Foto
            </button>
          </div>
        </div>
      )}

      {/* Custom In-App Modal Dialog */}
      {activeAlert && (
        <div className="absolute inset-0 bg-primary-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl animate-fade-in space-y-4 border border-outline-variant">
            
            {activeAlert.type === "error" && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">error</span>
              </div>
            )}
            {activeAlert.type === "warning" && (
              <div className="bg-alert-amber/10 text-alert-amber p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">warning</span>
              </div>
            )}
            {activeAlert.type === "info" && (
              <div className="bg-success-emerald/10 text-success-emerald p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
              </div>
            )}
            {activeAlert.type === "confirm" && (
              <div className="bg-primary-teal/10 text-primary-teal p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">help</span>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-primary-navy">{activeAlert.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed px-2">
                {activeAlert.message}
              </p>
            </div>

            {activeAlert.type === "confirm" ? (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveAlert(null)}
                  className="flex-1 py-2.5 border border-outline-variant hover:bg-neutral-light text-on-surface font-bold rounded-xl text-xs transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const action = activeAlert.action;
                    setActiveAlert(null);
                    if (action) action();
                  }}
                  className="flex-1 py-2.5 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => setActiveAlert(null)}
                  className="w-full py-2.5 bg-primary-navy hover:bg-primary-navy/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  Selesai
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
