"use client";

import React, { useState } from "react";
import Link from "next/link";
import SiftaLogo from "./components/SiftaLogo";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"owner" | "employee" | "receipt">("owner");
  const [currentTime, setCurrentTime] = useState("14:15:00");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [ownerBranch, setOwnerBranch] = useState<"sudirman" | "senopati" | "kemang">("sudirman");
  const [absenSuccess, setAbsenSuccess] = useState(false);

  // GPS Real-time States
  const [gpsMode, setGpsMode] = useState<"mock" | "real">("mock");
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [absenErrorText, setAbsenErrorText] = useState<string | null>(null);

  // EWA Simulator State
  const [ewaAmount, setEwaAmount] = useState(150000);
  const [ewaWallet, setEwaWallet] = useState("GoPay");
  const [ewaStatus, setEwaStatus] = useState<"idle" | "processing" | "success">("idle");
  const [finalEwaAmount, setFinalEwaAmount] = useState(150000);
  const [finalEwaWallet, setFinalEwaWallet] = useState("GoPay");

  const branchStats = {
    sudirman: {
      salary: 62450000,
      cashout: 4200000,
      late: "3 Orang",
      statusText: "Semua absensi shift hari ini di Cabang Sudirman telah di-audit otomatis. Tidak ditemukan bypass Fake GPS."
    },
    senopati: {
      salary: 48900000,
      cashout: 2800000,
      late: "1 Orang",
      statusText: "Semua absensi shift hari ini di Cabang Senopati aman. 1 Karyawan terlambat 15 menit."
    },
    kemang: {
      salary: 75100000,
      cashout: 6150000,
      late: "0 Orang",
      statusText: "Cabang Kemang 100% tepat waktu hari ini. Seluruh staf terverifikasi biometrik selfie."
    }
  };

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (lat1: number, lon1: number) => {
    const lat2 = -6.2198;
    const lon2 = 106.8028;
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // in metres
  };

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation tidak didukung browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    setGpsLocation(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (error) => {
        let msg = "Akses lokasi ditolak.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Akses lokasi ditolak oleh browser.";
        }
        setGpsError(msg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-surface text-primary-navy font-sans antialiased relative overflow-hidden flex flex-col justify-between"
         style={{
           backgroundImage: "radial-gradient(#E5E7EB 1.2px, transparent 1.2px)",
           backgroundSize: "24px 24px"
         }}>
      
      {/* Decorative Blur Background Gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary-teal/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-success-emerald/5 blur-[150px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-outline-variant w-full">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SiftaLogo className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-on-surface-variant">
            <a href="#demo" className="hover:text-primary-teal transition-colors">Demo Tour</a>
            <a href="#fitur" className="hover:text-primary-teal transition-colors">Fitur Utama</a>
            <a href="#komparasi" className="hover:text-primary-teal transition-colors">Sifta vs HRIS</a>
            <a href="#harga" className="hover:text-primary-teal transition-colors">Paket Harga</a>
            <a href="#faq" className="hover:text-primary-teal transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/owner"
              className="px-4 py-2 bg-primary-navy hover:bg-primary-navy/95 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95"
            >
              Demo App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col gap-16 md:gap-24 justify-center items-center">
        
        {/* Main Pitch */}
        <section className="text-center space-y-6 max-w-3xl animate-fade-in pt-6">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-outline-variant text-[11px] font-extrabold text-primary-teal uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
            HRIS Lapangan Anti-Fraud Pertama di Indonesia
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-navy tracking-tight leading-[1.15]">
            Kelola Shift, Absensi & Gaji Karyawan Lapangan secara <span className="text-primary-teal">Presisi</span>
          </h1>
          
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Sifta menyatukan kalender shift visual, absensi geofencing anti-fraud tingkat sistem, verifikasi wajah selfie, serta payroll kasbon instan (EWA) dalam satu ekosistem terpadu untuk bisnis retail, F&B, dan franchise Anda.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/owner"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-navy hover:bg-primary-navy/95 text-white font-extrabold rounded-2xl text-sm shadow-xl hover:shadow-primary-navy/10 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-97"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Dashboard Pemilik (Owner)
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            
            <Link
              href="/employee"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-teal hover:bg-primary-teal/95 text-white font-extrabold rounded-2xl text-sm shadow-xl hover:shadow-primary-teal/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-97"
            >
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              Portal Absen Karyawan (Staff)
            </Link>
          </div>
        </section>

        {/* Trust Badges / Partner Logos */}
        <section className="w-full max-w-4xl text-center space-y-4 py-4 border-y border-outline-variant/60">
          <p className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-widest">
            Dipercaya oleh Pemilik Bisnis Retail & F&B Lokal
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12 opacity-60 hover:opacity-85 transition-opacity">
            <div className="flex items-center gap-1.5 select-none grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-lg text-primary-teal">local_cafe</span>
              <span className="font-extrabold text-xs tracking-tight text-primary-navy">Kopi Sederhana</span>
            </div>
            <div className="flex items-center gap-1.5 select-none grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-lg text-primary-teal">restaurant</span>
              <span className="font-extrabold text-xs tracking-tight text-primary-navy">Ayam Geprek Juara</span>
            </div>
            <div className="flex items-center gap-1.5 select-none grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-lg text-primary-teal">bakery_dining</span>
              <span className="font-extrabold text-xs tracking-tight text-primary-navy">Aroma Bakery</span>
            </div>
            <div className="flex items-center gap-1.5 select-none grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-lg text-primary-teal">storefront</span>
              <span className="font-extrabold text-xs tracking-tight text-primary-navy">Martabak Pecenongan</span>
            </div>
            <div className="flex items-center gap-1.5 select-none grayscale hover:grayscale-0 transition-all">
              <span className="material-symbols-outlined text-lg text-primary-teal">breakfast_dining</span>
              <span className="font-extrabold text-xs tracking-tight text-primary-navy">Roti Bakar 88</span>
            </div>
          </div>
        </section>

        {/* Live Interactive UI Preview / Tour */}
        <section id="demo" className="w-full max-w-4xl space-y-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Live Interactive Product Tour</h2>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">Klik tab di bawah untuk melihat preview modul operasional Sifta</p>
          </div>

          {/* Tabs Switcher */}
          <div className="flex justify-center border-b border-outline-variant pb-px">
            <div className="flex bg-neutral-light border border-outline-variant p-1 rounded-2xl gap-1">
              <button 
                onClick={() => setActiveTab("owner")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "owner" ? "bg-white text-primary-navy shadow-sm" : "text-on-surface-variant hover:text-primary-navy"}`}
              >
                Owner Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("employee")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "employee" ? "bg-white text-primary-navy shadow-sm" : "text-on-surface-variant hover:text-primary-navy"}`}
              >
                Karyawan App
              </button>
              <button 
                onClick={() => setActiveTab("receipt")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "receipt" ? "bg-white text-primary-navy shadow-sm" : "text-on-surface-variant hover:text-primary-navy"}`}
              >
                Struk Kasbon (EWA)
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm min-h-[360px] flex items-center justify-center transition-all animate-fade-in">
            {activeTab === "owner" && (
              <div className="w-full max-w-2xl space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <h4 className="font-extrabold text-sm text-primary-navy flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary-teal">insights</span>
                    Dashboard Pemilik (Summary Panel)
                  </h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={ownerBranch}
                      onChange={(e) => setOwnerBranch(e.target.value as any)}
                      className="bg-neutral-light border border-outline-variant rounded-lg px-2.5 py-1 text-[10px] font-extrabold text-primary-navy focus:ring-1 focus:ring-primary-teal focus:outline-none"
                    >
                      <option value="sudirman">Cabang Sudirman</option>
                      <option value="senopati">Cabang Senopati</option>
                      <option value="kemang">Cabang Kemang</option>
                    </select>
                    <span className="text-[10px] font-bold text-success-emerald bg-success-emerald/10 px-2 py-0.5 rounded-full">SINKRON</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-light border border-outline-variant rounded-2xl">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Liabilitas Gaji</p>
                    <p className="text-lg font-extrabold text-primary-navy mt-1">{formatCurrency(branchStats[ownerBranch].salary)}</p>
                  </div>
                  <div className="p-4 bg-neutral-light border border-outline-variant rounded-2xl">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Kasbon Cair</p>
                    <p className="text-lg font-extrabold text-primary-teal mt-1">{formatCurrency(branchStats[ownerBranch].cashout)}</p>
                  </div>
                  <div className="p-4 bg-neutral-light border border-outline-variant rounded-2xl">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Terlambat</p>
                    <p className="text-lg font-extrabold text-alert-amber mt-1">{branchStats[ownerBranch].late}</p>
                  </div>
                </div>
                <div className="p-3.5 bg-success-emerald/5 border border-success-emerald/20 rounded-2xl flex gap-2.5 items-start text-xs text-success-emerald">
                  <span className="material-symbols-outlined text-sm font-bold mt-0.5">verified</span>
                  <p className="leading-relaxed text-[11px] font-semibold text-success-emerald">
                    {branchStats[ownerBranch].statusText}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "employee" && (
              <div className="w-full max-w-sm border border-outline-variant rounded-[32px] p-4 bg-neutral-light shadow-inner flex flex-col gap-4 relative">
                {/* Mobile mock header */}
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold px-2">
                  <span>Sifta Mobile App</span>
                  <div className="flex bg-white/70 border border-outline-variant p-0.5 rounded-lg gap-0.5">
                    <button
                      onClick={() => {
                        setGpsMode("mock");
                        setGpsLocation(null);
                        setGpsError(null);
                        setAbsenErrorText(null);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all cursor-pointer ${
                        gpsMode === "mock"
                          ? "bg-primary-teal text-white shadow-sm"
                          : "text-on-surface-variant hover:text-primary-navy"
                      }`}
                    >
                      Simulasi
                    </button>
                    <button
                      onClick={() => {
                        setGpsMode("real");
                        setGpsLocation(null);
                        setGpsError(null);
                        setAbsenErrorText(null);
                        requestGPS();
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all cursor-pointer ${
                        gpsMode === "real"
                          ? "bg-primary-teal text-white shadow-sm"
                          : "text-on-surface-variant hover:text-primary-navy"
                      }`}
                    >
                      GPS Asli
                    </button>
                  </div>
                </div>
                {/* Inner screen content */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant space-y-4 relative overflow-hidden min-h-[260px] flex flex-col justify-center">
                  {!absenSuccess && !absenErrorText ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] text-on-surface-variant font-semibold">Absensi Geofence Aktif</p>
                        <p className="text-xl font-black text-primary-navy">{currentTime}</p>
                      </div>
                      
                      {/* GPS Status Indicator */}
                      {gpsMode === "mock" ? (
                        <div className="p-3 bg-primary-teal/5 border border-primary-teal/20 rounded-xl space-y-1 text-center">
                          <p className="text-[10px] text-primary-teal font-extrabold flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-xs">pin_drop</span>
                            Lokasi Terverifikasi (Radius 12m)
                          </p>
                          <p className="text-[8px] text-on-surface-variant">Simulasi Cabang Sudirman (-6.2198, 106.8028)</p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl border border-outline-variant text-center transition-all">
                          {gpsLoading && (
                            <p className="text-[10px] text-on-surface-variant font-bold flex items-center justify-center gap-1 animate-pulse py-1">
                              <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                              Mendeteksi Lokasi GPS...
                            </p>
                          )}
                          
                          {gpsError && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] text-red-500 font-extrabold flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xs">location_disabled</span>
                                Gagal Mengakses GPS
                              </p>
                              <button
                                onClick={requestGPS}
                                className="px-2 py-1 bg-red-500 text-white text-[8px] font-bold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                Minta Ulang Izin
                              </button>
                            </div>
                          )}
                          
                          {gpsLocation && (
                            <div className="space-y-1">
                              <p className="text-[10px] text-success-emerald font-extrabold flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xs">my_location</span>
                                GPS Aktif ({gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)})
                              </p>
                              <p className="text-[9px] text-on-surface-variant">
                                Jarak Anda: <span className="font-extrabold text-primary-navy">{calculateDistance(gpsLocation.lat, gpsLocation.lng)} meter</span> dari Sudirman
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="divide-y divide-outline-variant/50 text-[10px] space-y-2 pt-1">
                        <div className="flex justify-between py-1 font-semibold">
                          <span className="text-on-surface-variant">Bypass Fake GPS Check</span>
                          <span className="text-success-emerald font-extrabold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check_circle</span> PASSED
                          </span>
                        </div>
                        <div className="flex justify-between py-1 font-semibold pt-2">
                          <span className="text-on-surface-variant">Selfie Biometric Check</span>
                          <span className="text-success-emerald font-extrabold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check_circle</span> READY
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (gpsMode === "real") {
                            if (!gpsLocation) {
                              setGpsError("Silakan aktifkan atau izinkan lokasi GPS terlebih dahulu.");
                              return;
                            }
                            const dist = calculateDistance(gpsLocation.lat, gpsLocation.lng);
                            if (dist > 20) {
                              setAbsenErrorText(
                                `Absen Gagal! Anda berada di luar radius geofence Cabang Sudirman. (Batas maksimal: 20m, Jarak Anda saat ini: ${dist}m)`
                              );
                              return;
                            }
                          }
                          setAbsenSuccess(true);
                        }}
                        className={`w-full text-white font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer ${
                          gpsMode === "real" && !gpsLocation
                            ? "bg-on-surface-variant/40 cursor-not-allowed"
                            : "bg-primary-teal hover:bg-primary-teal/95"
                        }`}
                        disabled={gpsMode === "real" && gpsLoading}
                      >
                        <span className="material-symbols-outlined text-xs">photo_camera</span>
                        Mulai Absen Masuk
                      </button>
                    </div>
                  ) : null}

                  {absenErrorText && (
                    <div className="text-center space-y-4 animate-fade-in flex flex-col items-center justify-center py-4">
                      <div className="bg-red-500/10 text-red-500 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl font-bold text-red-500">cancel</span>
                      </div>
                      <div className="space-y-2 px-2">
                        <p className="text-xs font-black text-red-500">Gagal Absen: Luar Geofence</p>
                        <p className="text-[9px] text-on-surface-variant leading-relaxed">
                          {absenErrorText}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full justify-center">
                        <button
                          onClick={() => {
                            setAbsenErrorText(null);
                            requestGPS();
                          }}
                          className="px-3 py-1.5 bg-neutral-light hover:bg-surface-container border border-outline-variant text-[9px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Coba Lagi
                        </button>
                        <button
                          onClick={() => {
                            setAbsenErrorText(null);
                            setGpsMode("mock");
                          }}
                          className="px-3 py-1.5 bg-primary-teal text-white text-[9px] font-bold rounded-lg hover:bg-primary-teal/95 transition-colors cursor-pointer"
                        >
                          Simulasi
                        </button>
                      </div>
                    </div>
                  )}

                  {absenSuccess && (
                    <div className="text-center space-y-4 animate-fade-in flex flex-col items-center justify-center py-4">
                      <div className="bg-success-emerald/10 text-success-emerald p-3 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-primary-navy">Absensi Berhasil Dicatat!</p>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">
                          Jam: {currentTime}<br />
                          Lokasi: Cabang Sudirman<br />
                          Metode: Selfie & {gpsMode === "real" ? "GPS Asli" : "GPS Simulasi"} Terverifikasi.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAbsenSuccess(false);
                          setAbsenErrorText(null);
                        }}
                        className="px-3 py-1.5 bg-neutral-light hover:bg-surface-container border border-outline-variant text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reset Demo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "receipt" && (
              <div className="w-full max-w-sm bg-neutral-light border border-outline-variant rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4 animate-fade-in shadow-inner min-h-[320px] justify-between">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary-teal"></div>
                
                {ewaStatus === "idle" && (
                  <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-center">
                        <h5 className="font-extrabold text-xs text-primary-navy">Simulator Tarik Kasbon Instan</h5>
                        <p className="text-[9px] text-on-surface-variant mt-1">Coba tarik upah berjalan Anda langsung ke e-wallet</p>
                      </div>
                      
                      <div className="space-y-3 pt-2 text-[10px] font-bold text-primary-navy">
                        <div className="space-y-1">
                          <label className="text-on-surface-variant block">Nominal Pencairan (Max Rp200.000)</label>
                          <input
                            type="range"
                            min="50000"
                            max="200000"
                            step="25000"
                            value={ewaAmount}
                            onChange={(e) => setEwaAmount(Number(e.target.value))}
                            className="w-full accent-primary-teal cursor-pointer h-1.5 bg-outline-variant rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-[11px] font-extrabold text-primary-teal mt-1">
                            <span>{formatCurrency(ewaAmount)}</span>
                            <span className="text-[8px] text-success-emerald bg-success-emerald/10 px-1.5 py-0.5 rounded">Upah Tersedia</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-on-surface-variant block">Metode Pencairan</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["GoPay", "OVO", "Dana"].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setEwaWallet(w)}
                                className={`py-1.5 px-2 rounded-lg text-center border text-[9px] font-bold transition-all cursor-pointer ${
                                  ewaWallet === w
                                    ? "border-primary-teal bg-primary-teal/5 text-primary-teal"
                                    : "border-outline-variant bg-white text-on-surface-variant hover:border-primary-teal/50"
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEwaStatus("processing");
                        setFinalEwaAmount(ewaAmount);
                        setFinalEwaWallet(ewaWallet);
                        setTimeout(() => {
                          setEwaStatus("success");
                        }, 1200);
                      }}
                      className="w-full bg-success-emerald text-white font-extrabold py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 mt-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs animate-bounce">bolt</span>
                      Cairkan Sekarang
                    </button>
                  </div>
                )}

                {ewaStatus === "processing" && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3 animate-pulse py-8">
                    <span className="material-symbols-outlined text-3xl text-primary-teal animate-spin">sync</span>
                    <div className="text-center">
                      <p className="text-xs font-black text-primary-navy">Memproses Transaksi...</p>
                      <p className="text-[9px] text-on-surface-variant mt-1">Menghubungkan ke API Payment Gateway...</p>
                    </div>
                  </div>
                )}

                {ewaStatus === "success" && (
                  <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-center space-y-1">
                        <div className="bg-success-emerald/10 text-success-emerald p-2 rounded-full w-9 h-9 flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </div>
                        <h5 className="font-extrabold text-xs text-primary-navy">Bukti Pencairan Kasbon EWA</h5>
                        <p className="text-[9px] text-on-surface-variant">Sifta Payment Gateway</p>
                      </div>

                      <div className="bg-white border border-dashed border-outline-variant rounded-xl p-3.5 space-y-2 text-[10px] text-primary-navy font-semibold">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Karyawan</span>
                          <span>Budi Santoso</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Jumlah Pencairan</span>
                          <span className="text-success-emerald font-extrabold">{formatCurrency(finalEwaAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Metode Cair</span>
                          <span>{finalEwaWallet} (0812-3456-7890)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Status</span>
                          <span className="text-success-emerald bg-success-emerald/10 px-1.5 py-0.5 rounded text-[8px] font-extrabold">SETTLED</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setEwaStatus("idle")}
                      className="w-full bg-neutral-light hover:bg-surface-container border border-outline-variant text-[10px] font-bold py-2 rounded-xl text-center transition-colors mt-2 cursor-pointer"
                    >
                      Coba Nominal Lain
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Core Features Pillars Grid */}
        <section id="fitur" className="w-full space-y-8 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Tiga Pilar Solusi Sifta</h2>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">Dirancang khusus untuk memecahkan problem lapangan harian secara tuntas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Absensi Card */}
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-success-emerald/10 text-success-emerald w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-bold">gps_fixed</span>
              </div>
              <h3 className="font-extrabold text-lg text-primary-navy">1. Absensi Anti Fake-GPS</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Karyawan hanya bisa absen jika berada dalam radius geofence <span className="font-bold">20 meter</span> dari titik GPS cabang. Sistem Sifta secara native memblokir aplikasi mock provider (Fake GPS) serta audit selfie otomatis.
              </p>
              <ul className="space-y-2 pt-2 text-[11px] text-primary-navy font-semibold">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-success-emerald">check_circle</span> Geofencing Radius 20 Meter</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-success-emerald">check_circle</span> Deteksi Mock Location OS</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-success-emerald">check_circle</span> Selfie Camera Audit</li>
              </ul>
            </div>

            {/* Roster Card */}
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-primary-teal/10 text-primary-teal w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-bold">calendar_today</span>
              </div>
              <h3 className="font-extrabold text-lg text-primary-navy">2. Shift Roster Builder</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Atur jadwal shift mingguan staf dengan drag-and-drop. Cegah bentrokan penugasan karyawan lintas cabang franchise secara otomatis, dan kirim jadwal langsung ke WhatsApp karyawan dalam 1 klik.
              </p>
              <ul className="space-y-2 pt-2 text-[11px] text-primary-navy font-semibold">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary-teal">check_circle</span> Scheduler Lintas Cabang</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary-teal">check_circle</span> Kalender Visual Shift</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary-teal">check_circle</span> WhatsApp Schedule Blast</li>
              </ul>
            </div>

            {/* Payroll Card */}
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-alert-amber/10 text-alert-amber w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-bold">payments</span>
              </div>
              <h3 className="font-extrabold text-lg text-primary-navy">3. Payroll & Kasbon Instan</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Perhitungan upah jam kerja harian, potongan keterlambatan otomatis per menit. Karyawan dapat menarik hak upah berjalan (Kasbon EWA) secara instan ke rekening/e-wallet, aman tanpa risiko modal.
              </p>
              <ul className="space-y-2 pt-2 text-[11px] text-primary-navy font-semibold">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-alert-amber">check_circle</span> Potongan Telat Otomatis</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-alert-amber">check_circle</span> Earned Wage Access (EWA)</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-alert-amber">check_circle</span> Cair Instan via Gateway</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section id="komparasi" className="w-full max-w-4xl space-y-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Perbandingan Solusi Sifta</h2>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">Perbandingan fitur operasional untuk kebutuhan staf lapangan dan retail.</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-left text-xs font-semibold text-primary-navy">
              <thead>
                <tr className="bg-neutral-light border-b border-outline-variant text-[10px] text-on-surface-variant uppercase tracking-wider font-extrabold">
                  <th className="p-4">Fitur Utama</th>
                  <th className="p-4 text-primary-teal">Sifta</th>
                  <th className="p-4">HRIS Tradisional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr>
                  <td className="p-4">Akurasi Geofencing (Radius 20m)</td>
                  <td className="p-4 text-success-emerald font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Ya</td>
                  <td className="p-4 text-on-surface-variant">Terbatas</td>
                </tr>
                <tr className="bg-neutral-light/20">
                  <td className="p-4">Sistem Deteksi Manipulasi GPS (Fake GPS)</td>
                  <td className="p-4 text-success-emerald font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Ya</td>
                  <td className="p-4 text-red-500 font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">cancel</span> Tidak</td>
                </tr>
                <tr>
                  <td className="p-4">Visual Multi-Branch Shift Scheduler</td>
                  <td className="p-4 text-success-emerald font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Ya (Drag & Drop)</td>
                  <td className="p-4 text-on-surface-variant">Kaku / Manual</td>
                </tr>
                <tr className="bg-neutral-light/20">
                  <td className="p-4">Kirim Jadwal Shift via WhatsApp</td>
                  <td className="p-4 text-success-emerald font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Ya</td>
                  <td className="p-4 text-red-500 font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">cancel</span> Tidak</td>
                </tr>
                <tr>
                  <td className="p-4">Earned Wage Access (Kasbon Real-Time)</td>
                  <td className="p-4 text-success-emerald font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Ya (Terintegrasi)</td>
                  <td className="p-4 text-red-500 font-extrabold flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">cancel</span> Tidak (Butuh Pihak Ke-3)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing SaaS Section */}
        <section id="harga" className="w-full max-w-4xl space-y-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Pilihan Paket Harga Layanan</h2>
            <p className="text-xs text-on-surface-variant">Sesuai skala bisnis Anda. Transparan tanpa biaya setup tersembunyi.</p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <span className={`text-xs font-bold transition-all ${billingCycle === "monthly" ? "text-primary-navy" : "text-on-surface-variant"}`}>
              Bayar Bulanan
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-12 h-6 bg-neutral-light border border-outline-variant rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer"
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={`w-4 h-4 bg-primary-teal rounded-full transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 transition-all ${billingCycle === "yearly" ? "text-primary-navy" : "text-on-surface-variant"}`}>
              Bayar Tahunan
              <span className="text-[9px] bg-success-emerald/15 text-success-emerald px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Hemat 20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Starter Plan */}
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-on-surface-variant">Paket Starter</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Cocok untuk 1 Cabang / Kafe Kecil</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary-navy">
                      {billingCycle === "monthly" ? "Rp 149rb" : "Rp 119rb"}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">/ bulan</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[9px] text-success-emerald font-bold mt-0.5">
                      Ditagih tahunan Rp 1.428.000
                    </span>
                  )}
                </div>
                <div className="border-t border-outline-variant/60 pt-4">
                  <ul className="space-y-2.5 text-[10px] text-primary-navy font-semibold">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Maksimal 10 Karyawan</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Absensi Geofence Lock</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Laporan Kehadiran Dasar</li>
                  </ul>
                </div>
              </div>
              <Link href="/owner" className="w-full bg-neutral-light hover:bg-surface-container text-primary-navy font-extrabold py-2.5 rounded-xl text-[11px] text-center transition-colors">
                Mulai Uji Coba
              </Link>
            </div>

            {/* Pro Plan - Best Value */}
            <div className="bg-white border-2 border-primary-teal rounded-3xl p-6 shadow-md flex flex-col justify-between gap-6 relative scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-teal text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                REKOMENDASI
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-primary-teal">Paket Pro / Franchise</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Ideal untuk Bisnis Multi-Cabang / Waralaba</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary-navy">
                      {billingCycle === "monthly" ? "Rp 349rb" : "Rp 279rb"}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">/ bulan</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[9px] text-success-emerald font-bold mt-0.5">
                      Ditagih tahunan Rp 3.348.000
                    </span>
                  )}
                </div>
                <div className="border-t border-outline-variant/60 pt-4">
                  <ul className="space-y-2.5 text-[10px] text-primary-navy font-semibold">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Maksimal 50 Karyawan</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Unlimited Cabang Toko</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Lokasi GPS Radius 20m & Foto Selfie</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Modul Kasbon Instan (EWA)</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Blast Roster Shift ke WhatsApp</li>
                  </ul>
                </div>
              </div>
              <Link href="/owner" className="w-full bg-primary-teal hover:bg-primary-teal/95 text-white font-extrabold py-2.5 rounded-xl text-[11px] text-center shadow transition-colors">
                Mulai Uji Coba
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-on-surface-variant">Paket Enterprise</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Untuk Bisnis Skala Industri & Pabrik</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary-navy">Custom</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">/ kontak sales</span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant font-bold mt-0.5">
                    Konsultasi gratis & SLA terjamin
                  </span>
                </div>
                <div className="border-t border-outline-variant/60 pt-4">
                  <ul className="space-y-2.5 text-[10px] text-primary-navy font-semibold">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Unlimited Staf & Cabang</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Dedikasi Server & DB Sendiri</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> API & Webhook Kustom</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs text-primary-teal">check</span> Dukungan CS 24/7 Dedicated</li>
                  </ul>
                </div>
              </div>
              <a href="mailto:sales@sifta.id" className="w-full bg-neutral-light hover:bg-surface-container text-primary-navy font-extrabold py-2.5 rounded-xl text-[11px] text-center transition-colors">
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>

        {/* User Testimonials Section */}
        <section className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Cerita Sukses Bersama Sifta</h2>
            <p className="text-xs text-on-surface-variant">Dipercaya oleh puluhan pemilik bisnis retail dan kedai kopi lokal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed italic">
                &quot;Sebelum menggunakan Sifta, koordinasi jadwal shift mingguan untuk beberapa cabang membutuhkan waktu yang cukup lama. Kini, proses penjadwalan dapat dilakukan secara visual dalam hitungan menit dan roster langsung terkirim ke WhatsApp staf. Validasi lokasi juga membantu memastikan disiplin tim.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-teal/10 text-primary-teal font-extrabold flex items-center justify-center text-xs">
                  HS
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-primary-navy">Hendra Saputra</h5>
                  <p className="text-[10px] text-on-surface-variant">Owner Kopi Sederhana Franchise</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed italic">
                &quot;Fitur kasbon instan Sifta sangat membantu staf lapangan kami saat menghadapi kebutuhan darurat. Penarikan kasbon terintegrasi secara otomatis dengan perhitungan gaji bulanan secara real-time, tercatat transparan, dan tanpa bunga.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-teal/10 text-primary-teal font-extrabold flex items-center justify-center text-xs">
                  LA
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-primary-navy">Lina Amelia</h5>
                  <p className="text-[10px] text-on-surface-variant">Franchisee Ayam Geprek Juara</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Penutup */}
        <section className="w-full max-w-4xl bg-primary-navy border border-outline-variant rounded-3xl p-8 md:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary-teal/15 blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-3xl font-extrabold tracking-tight">Siap Mengoptimalkan Operasional Tim Lapangan Anda?</h2>
          <p className="text-xs opacity-75 max-w-md mx-auto leading-relaxed">
            Mulai digitalisasi absensi geofencing presisi, penjadwalan shift visual, dan sistem kasbon instan terintegrasi untuk bisnis retail atau F&B Anda.
          </p>
          
          <div className="pt-2 flex justify-center">
            <Link
              href="/owner"
              className="bg-primary-teal hover:bg-primary-teal/95 text-white font-extrabold py-3.5 px-10 rounded-2xl text-xs transition-all shadow-lg active:scale-97 flex items-center justify-center gap-1.5"
            >
              Coba Demo Aplikasi Sekarang
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full max-w-3xl space-y-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-navy">Tanya Jawab (FAQ)</h2>
            <p className="text-xs text-on-surface-variant">Penjelasan penting mengenai fungsi operasional dan konsep sistem Sifta.</p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-white border border-outline-variant rounded-2xl p-4.5 transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-primary-navy list-none">
                Mengapa Sifta menggunakan aplikasi mobile untuk absensi karyawan?
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-[18px]">expand_more</span>
              </summary>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/50 pt-3">
                Aplikasi mobile Sifta dirancang khusus untuk memastikan akurasi data presensi. Melalui aplikasi mobile, sistem dapat memverifikasi koordinat GPS secara presisi, mendeteksi penggunaan aplikasi manipulasi lokasi (Fake GPS), dan melakukan verifikasi biometrik wajah secara aman.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-white border border-outline-variant rounded-2xl p-4.5 transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-primary-navy list-none">
                Apakah fitur Kasbon Instan (EWA) aman bagi arus kas perusahaan?
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-[18px]">expand_more</span>
              </summary>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/50 pt-3">
                Sangat aman. Earned Wage Access (EWA) bukanlah pinjaman. Karyawan hanya dapat menarik sebagian upah atas hari kerja yang telah diselesaikan. Nominal penarikan dibatasi hingga persentase tertentu dari upah berjalan, sehingga tidak mengganggu stabilitas arus kas operasional perusahaan.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-white border border-outline-variant rounded-2xl p-4.5 transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-primary-navy list-none">
                Bagaimana proses integrasi pencairan dana kasbon?
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-[18px]">expand_more</span>
              </summary>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/50 pt-3">
                Setelah pengajuan disetujui oleh pemilik atau manajer melalui dashboard, sistem akan menginstruksikan Payment Gateway terintegrasi untuk mentransfer dana secara real-time langsung ke rekening bank atau e-wallet (GoPay/OVO/Dana) karyawan dalam hitungan detik.
              </p>
            </details>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-on-surface-variant font-semibold flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Sifta.id. Hak Cipta Dilindungi.</span>
          <span>Dibuat untuk Efisiensi & Transparansi Tenaga Kerja Indonesia 🇮🇩</span>
        </div>
      </footer>
    </div>
  );
}
