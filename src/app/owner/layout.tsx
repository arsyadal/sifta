"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SiftaLogo from "../components/SiftaLogo";

interface Notification {
  id: number;
  type: "fraud" | "late" | "ewa";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

interface SearchItem {
  name: string;
  category: "Halaman" | "Aksi Cepat" | "Staf";
  href: string;
  icon: string;
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Dropdown & Modal States
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState("Cabang Sudirman (Jakarta)");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mock Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "fraud",
      title: "Deteksi Fake GPS!",
      message: "Siti Rahma terdeteksi menggunakan Mock Provider saat absen.",
      time: "5 menit yang lalu",
      read: false,
      link: "/owner/reports",
    },
    {
      id: 2,
      type: "late",
      title: "Karyawan Terlambat",
      message: "Agus Riyadi terlambat 24 menit di Cabang Sudirman.",
      time: "45 menit yang lalu",
      read: false,
      link: "/owner",
    },
    {
      id: 3,
      type: "ewa",
      title: "Pengajuan Kasbon EWA",
      message: "Budi Santoso mengajukan kasbon instan Rp150.000.",
      time: "2 jam yang lalu",
      read: false,
      link: "/owner/payroll",
    },
  ]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K) & Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset selected search index on query or modal state change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, searchOpen]);

  const menuItems = [
    { name: "Dashboard", href: "/owner", icon: "dashboard" },
    { name: "Karyawan", href: "/owner/employees", icon: "groups" },
    { name: "Shift", href: "/owner/schedule", icon: "event_note" },
    { name: "Laporan", href: "/owner/reports", icon: "assessment" },
    { name: "Penggajian", href: "/owner/payroll", icon: "account_balance_wallet" },
  ];

  // Static list of search items
  const searchableItems: SearchItem[] = [
    { name: "Dashboard Utama", category: "Halaman", href: "/owner", icon: "dashboard" },
    { name: "Daftar Staf Lapangan", category: "Halaman", href: "/owner/employees", icon: "groups" },
    { name: "Roster / Jadwal Shift", category: "Halaman", href: "/owner/schedule", icon: "event_note" },
    { name: "Laporan & Analitik GPS", category: "Halaman", href: "/owner/reports", icon: "assessment" },
    { name: "Pencairan EWA & Payroll", category: "Halaman", href: "/owner/payroll", icon: "account_balance_wallet" },
    { name: "Tambah Karyawan Baru", category: "Aksi Cepat", href: "/owner/employees?add=true", icon: "person_add" },
    { name: "Kirim Jadwal via WhatsApp", category: "Aksi Cepat", href: "/owner/schedule?broadcast=true", icon: "send" },
    { name: "Verifikasi Kasbon EWA", category: "Aksi Cepat", href: "/owner/payroll?verify=true", icon: "verified_user" },
    { name: "Simulasikan Deteksi Fake GPS Baru (Demo)", category: "Aksi Cepat", href: "#simulate-notif", icon: "notification_important" },
    { name: "Budi Santoso (Security)", category: "Staf", href: "/owner/employees", icon: "person" },
    { name: "Siti Rahma (Kasir)", category: "Staf", href: "/owner/employees", icon: "person" },
    { name: "Agus Riyadi (Supervisor)", category: "Staf", href: "/owner/employees", icon: "person" },
  ];

  const filteredSearchItems = searchableItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast("Semua notifikasi ditandai telah dibaca");
  };

  const simulateNewNotif = () => {
    const names = ["Ahmad Fauzi", "Dewi Lestari", "Rian Hidayat", "Siti Rahma"];
    const name = names[Math.floor(Math.random() * names.length)];
    const newNotif: Notification = {
      id: Date.now(),
      type: "fraud",
      title: "Deteksi Fake GPS!",
      message: `${name} terdeteksi menggunakan Mock Provider/Fake GPS saat melakukan absen.`,
      time: "Baru saja",
      read: false,
      link: "/owner/reports",
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`⚠️ Peringatan: Deteksi Fake GPS Baru (${name})!`);
  };

  const handleClearNotif = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleBranchSwitch = (branchName: string) => {
    setCurrentBranch(branchName);
    setBranchOpen(false);
    showToast(`Berhasil berpindah ke ${branchName}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex-col p-4 gap-2 z-50">
        <div className="mb-8 flex items-center gap-2 px-2 py-1">
          <SiftaLogo className="h-10 w-auto" />
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? "bg-primary-teal text-white shadow-md shadow-primary-teal/20"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Info Footer */}
        <div className="mt-auto pt-4 border-t border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-teal/20">
            <img
              className="w-full h-full object-cover"
              alt="Owner Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzA1QxvAiSlAYI3mKjEPbgYiqfAuqZwrss2BAGGAF05Qz6MxhcMsiJZ9V3CHyUyer-FsbXmHo0LBAwN3Nqsb3pDqwO6dN8fPGvGi6VquN9Bghw8q-MDV1dUHTJp6yVtvJMhRr173xP5louWQhNVlZgkORMdRU_y0E3aD2_zb6HPjYQ_IvvAsjrYeC2gyyIkn2FMrzhTBWjaiXfK5GcZy5F-M92-It7RkMA1nexncnHIyn8MoHO8l7991TZTxE5S2PRbvQUNatd2JE"
            />
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface">Pak Budi</p>
            <p className="text-xs text-on-surface-variant">Owner Franchise</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-6 py-4">
          <div className="flex flex-col relative">
            <h1 className="text-xl font-bold text-primary-navy">Dashboard Pemilik</h1>
            {/* Branch Selector Dropdown Toggle */}
            <div 
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-1 text-xs text-on-surface-variant cursor-pointer hover:text-primary-teal transition-colors"
            >
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="font-semibold">{currentBranch}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>

            {/* Branch Selector Dropdown Panel */}
            {branchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setBranchOpen(false)}></div>
                <div className="absolute top-12 left-0 w-64 bg-white border border-outline-variant rounded-2xl shadow-xl z-20 p-2 space-y-1 animate-fade-in">
                  <div className="text-[10px] font-bold text-on-surface-variant px-3 py-1.5 uppercase tracking-wider">
                    Pilih Cabang Aktif
                  </div>
                  {[
                    "Cabang Sudirman (Jakarta)",
                    "Cabang Dago (Bandung)",
                    "Cabang Thamrin (Jakarta)",
                  ].map((branch) => (
                    <button
                      key={branch}
                      onClick={() => handleBranchSwitch(branch)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentBranch === branch
                          ? "bg-primary-teal/10 text-primary-teal"
                          : "text-on-surface hover:bg-neutral-light"
                      }`}
                    >
                      {branch}
                      {currentBranch === branch && (
                        <span className="material-symbols-outlined text-sm text-primary-teal">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3 relative">
            {/* Search Trigger Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-surface-container rounded-full transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary-navy"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* Notification Dropdown Trigger */}
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 hover:bg-surface-container rounded-full transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary-navy"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)}></div>
                <div className="absolute top-12 right-0 w-80 md:w-96 bg-white border border-outline-variant rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-light border-b border-outline-variant">
                    <h4 className="font-bold text-xs text-primary-navy flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                      Notifikasi Staf
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[9px] font-extrabold text-primary-teal hover:underline"
                      >
                        Tandai Semua Dibaca
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-outline-variant max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-on-surface-variant font-medium text-xs">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setNotifOpen(false);
                            // Mark this particular notif as read
                            setNotifications(notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                            router.push(notif.link);
                          }}
                          className={`p-3.5 hover:bg-neutral-light/50 transition-colors flex gap-3 items-start cursor-pointer relative ${
                            !notif.read ? "bg-primary-teal/5" : ""
                          }`}
                        >
                          {/* Notification icon */}
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            notif.type === "fraud"
                              ? "bg-red-500/10 text-red-600"
                              : notif.type === "late"
                              ? "bg-alert-amber/10 text-alert-amber"
                              : "bg-primary-teal/10 text-primary-teal"
                          }`}>
                            <span className="material-symbols-outlined text-[16px]">
                              {notif.type === "fraud" && "gps_off"}
                              {notif.type === "late" && "warning"}
                              {notif.type === "ewa" && "payments"}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="font-bold text-[11px] text-primary-navy">{notif.title}</h5>
                              <span className="text-[8px] text-on-surface-variant font-medium shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">{notif.message}</p>
                          </div>

                          {/* Dismiss Button */}
                          <button
                            onClick={(e) => handleClearNotif(notif.id, e)}
                            className="absolute bottom-2 right-3 text-on-surface-variant hover:text-red-500"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Mobile Header Profile Indicator */}
            <div className="md:hidden w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="Owner Avatar Small"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzA1QxvAiSlAYI3mKjEPbgYiqfAuqZwrss2BAGGAF05Qz6MxhcMsiJZ9V3CHyUyer-FsbXmHo0LBAwN3Nqsb3pDqwO6dN8fPGvGi6VquN9Bghw8q-MDV1dUHTJp6yVtvJMhRr173xP5louWQhNVlZgkORMdRU_y0E3aD2_zb6HPjYQ_IvvAsjrYeC2gyyIkn2FMrzhTBWjaiXfK5GcZy5F-M92-It7RkMA1nexncnHIyn8MoHO8l7991TZTxE5S2PRbvQUNatd2JE"
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-white border-t border-outline-variant shadow-lg h-16">
        {menuItems.slice(0, 3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
                isActive
                  ? "text-primary-teal font-bold scale-105"
                  : "text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>{item.icon}</span>
              <span className="text-xs mt-0.5">{item.name}</span>
            </Link>
          );
        })}
        {/* Mobile Extra Menu Indicator */}
        <Link
          href="/owner/payroll"
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
            pathname.startsWith("/owner/payroll") || pathname.startsWith("/owner/reports")
              ? "text-primary-teal font-bold"
              : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-xs mt-0.5">Gaji</span>
        </Link>
      </nav>

      {/* Command / Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-primary-navy/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[12vh] px-4">
          <div className="fixed inset-0" onClick={() => setSearchOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-outline-variant z-10 animate-fade-in">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-outline-variant py-3 bg-neutral-light/50">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input
                type="text"
                autoFocus
                placeholder="Cari halaman, aksi cepat, atau nama karyawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev < filteredSearchItems.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredSearchItems[selectedIndex]) {
                      const item = filteredSearchItems[selectedIndex];
                      setSearchOpen(false);
                      if (item.href === "#simulate-notif") {
                        simulateNewNotif();
                      } else {
                        router.push(item.href);
                        showToast(`Navigasi ke: ${item.name}`);
                      }
                    }
                  } else if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                className="w-full bg-transparent pl-3 text-xs font-semibold focus:outline-none placeholder-on-surface-variant text-primary-navy"
              />
              <span className="text-[10px] bg-neutral-light border border-outline-variant px-1.5 py-0.5 rounded text-on-surface-variant mr-3">ESC</span>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-on-surface-variant hover:text-primary-navy"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-72 overflow-y-auto p-2 divide-y divide-outline-variant/30">
              {filteredSearchItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant font-medium">
                  Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredSearchItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSearchOpen(false);
                        if (item.href === "#simulate-notif") {
                          simulateNewNotif();
                        } else {
                          router.push(item.href);
                          showToast(`Navigasi ke: ${item.name}`);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-primary-teal/10 border border-primary-teal/20 translate-x-1"
                          : "hover:bg-neutral-light border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-neutral-light border border-outline-variant rounded-lg text-primary-navy">
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-primary-navy">{item.name}</h4>
                          <p className="text-[9px] text-on-surface-variant font-medium">{item.category}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 bg-primary-navy text-white text-xs font-bold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-fade-in border border-outline-variant">
          <span className="material-symbols-outlined text-[16px] text-primary-teal">info</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
