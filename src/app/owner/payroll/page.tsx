"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getEWARequests, approveEWARequest, rejectEWARequest } from "../../actions";

interface EWARequest {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  amount: number;
  date: string;
  method: string;
  status: "pending" | "approved" | "rejected";
}

interface EmployeeSalary {
  id: number;
  name: string;
  role: string;
  avatar: string;
  shiftWorked: number;
  hourlyRate: number;
  lateMinutes: number;
  lateFine: number;
  ewaDeductions: number;
  netPay: number;
}

export default function OwnerPayroll() {
  const [ewaRequests, setEwaRequests] = useState<EWARequest[]>([
    {
      id: 1,
      name: "Budi Santoso",
      role: "Security",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      amount: 150000,
      date: "Hari ini, 10:30",
      method: "GoPay",
      status: "pending",
    },
    {
      id: 2,
      name: "Siti Rahma",
      role: "Kasir",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      amount: 200000,
      date: "Kemarin, 16:45",
      method: "Bank BCA",
      status: "pending",
    },
  ]);

  const [salaries, setSalaries] = useState<EmployeeSalary[]>([
    {
      id: 1,
      name: "Budi Santoso",
      role: "Security",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      shiftWorked: 22,
      hourlyRate: 18000,
      lateMinutes: 15,
      lateFine: 30000, // Rp 2.000 per minute late
      ewaDeductions: 250000,
      netPay: 2894000, // (22 shifts * 8h * 18000) - 30000 - 250000
    },
    {
      id: 2,
      name: "Siti Rahma",
      role: "Kasir",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      shiftWorked: 20,
      hourlyRate: 15000,
      lateMinutes: 0,
      lateFine: 0,
      ewaDeductions: 100000,
      netPay: 2300000, // (20 * 8 * 15000) - 100000
    },
    {
      id: 3,
      name: "Agus Riyadi",
      role: "Supervisor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      shiftWorked: 24,
      hourlyRate: 25000,
      lateMinutes: 45,
      lateFine: 90000,
      ewaDeductions: 0,
      netPay: 4710000, // (24 * 8 * 25000) - 90000
    },
  ]);

  const [totalPayrollAccrued, setTotalPayrollAccrued] = useState(62450000);
  const [totalDisbursedEWA, setTotalDisbursedEWA] = useState(4200000);

  interface Receipt {
    name: string;
    role: string;
    amount: number;
    bankName: string;
    bankAccount: string;
    txId: string;
    status: "approved" | "rejected";
  }

  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);

  // Load EWA requests from SQLite database
  const loadEWARequests = useCallback(async () => {
    const dbRequests = await getEWARequests();
    if (dbRequests && dbRequests.length > 0) {
      const mapped: EWARequest[] = dbRequests.map((req: any) => ({
        id: req.id,
        name: req.employee.name,
        role: req.employee.role,
        avatar: req.employee.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        amount: req.amount,
        date: new Date(req.requestedAt).toLocaleDateString("id-ID") + ", " + new Date(req.requestedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        method: req.employee.bankName,
        status: req.status as "pending" | "approved" | "rejected",
      }));
      setEwaRequests(mapped);

      // Recalculate total disbursed from database approved cashouts
      const totalDisbursed = dbRequests
        .filter((r) => r.status === "approved" || r.status === "disbursed")
        .reduce((sum, r) => sum + r.amount, 0);
      setTotalDisbursedEWA(totalDisbursed + 4200000); // base mock + db items
    }
  }, []);

  useEffect(() => {
    loadEWARequests();
  }, [loadEWARequests]);

  const handleApproveEWA = async (id: string | number, amount: number, name: string) => {
    const request = ewaRequests.find((req) => req.id === id);
    
    // Call server action to update database
    const res = await approveEWARequest(String(id));
    if (res.success && res.request) {
      setEwaRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
      );
      setTotalDisbursedEWA((prev) => prev + amount);
      
      // Deduct EWA from that employee's final salary card
      setSalaries((prev) =>
        prev.map((emp) => {
          if (emp.name === name) {
            return {
              ...emp,
              ewaDeductions: emp.ewaDeductions + amount,
              netPay: emp.netPay - amount,
            };
          }
          return emp;
        })
      );

      setActiveReceipt({
        name,
        role: request?.role || "Staf",
        amount,
        bankName: request?.method || "GoPay",
        bankAccount: name === "Budi Santoso" ? "1234567890" : "0823-4567-8901",
        txId: res.request.paymentReference || "EWA-TX-SIMULATED",
        status: "approved",
      });
    } else {
      alert("Gagal menyetujui penarikan kasbon di database.");
    }
  };

  const handleRejectEWA = async (id: string | number, name: string) => {
    const request = ewaRequests.find((req) => req.id === id);
    
    // Call server action to update database
    const res = await rejectEWARequest(String(id));
    if (res.success) {
      setEwaRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
      );
      
      setActiveReceipt({
        name,
        role: request?.role || "Staf",
        amount: request?.amount || 0,
        bankName: request?.method || "GoPay",
        bankAccount: name === "Budi Santoso" ? "1234567890" : "0823-4567-8901",
        txId: "-",
        status: "rejected",
      });
    } else {
      alert("Gagal membatalkan penarikan kasbon di database.");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Payroll Liability */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm border-l-4 border-primary-navy">
          <p className="text-on-surface-variant text-sm font-semibold">Total Liabilitas Gaji Berjalan</p>
          <h3 className="text-3xl font-extrabold text-primary-navy mt-1">{formatCurrency(totalPayrollAccrued)}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Akumulasi upah terhitung dari shift kerja valid bulan ini
          </p>
        </div>

        {/* EWA Disbursed */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm border-l-4 border-primary-teal">
          <p className="text-on-surface-variant text-sm font-semibold">Total Kasbon Karyawan Terbayar (EWA)</p>
          <h3 className="text-3xl font-extrabold text-primary-teal mt-1">{formatCurrency(totalDisbursedEWA)}</h3>
          <p className="text-xs text-primary-teal font-semibold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">payments</span>
            Otomatis dipotong dari transfer gajian akhir bulan
          </p>
        </div>
      </section>

      {/* Pending EWA Requests Section */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-primary-navy">Persetujuan Kasbon Instan (EWA)</h2>
          <p className="text-xs text-on-surface-variant">Permintaan pencairan dana darurat yang butuh approval</p>
        </div>

        {(() => {
          const pendingRequests = ewaRequests.filter((req) => req.status === "pending");
          return pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant bg-neutral-light rounded-xl border border-dashed border-outline-variant font-medium">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">done_all</span>
              <p>Tidak ada pengajuan kasbon pending saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-outline-variant hover:bg-neutral-light/30 transition-all flex flex-col justify-between gap-4 bg-white"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
                    <img className="w-full h-full object-cover" src={req.avatar} alt={req.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">
                      {req.name} <span className="font-normal text-xs text-on-surface-variant">({req.role})</span>
                    </h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Metode: {req.method} • Diajukan: {req.date}</p>
                    <p className="text-sm font-extrabold text-alert-amber mt-2">
                      Request Cair: {formatCurrency(req.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRejectEWA(req.id, req.name)}
                    className="flex-1 py-2 border border-outline-variant hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs transition-all active:scale-95"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => handleApproveEWA(req.id, req.amount, req.name)}
                    className="flex-1 py-2 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">check</span>
                    Setujui & Cairkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      })()}
      </section>

      {/* Roster & Payroll Breakdown List */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-primary-navy">Rincian Slip Gaji Karyawan</h2>
          <p className="text-xs text-on-surface-variant">Perhitungan upah jam kerja valid berjalan, potongan denda telat, dan potongan kasbon</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[850px]">
            <thead>
              <tr className="border-b border-outline-variant bg-neutral-light text-xs text-on-surface-variant font-bold">
                <th className="py-3 px-3">Karyawan</th>
                <th className="py-3 px-2 text-center">Shift Valid</th>
                <th className="py-3 px-2 text-right">Rate / Jam</th>
                <th className="py-3 px-2 text-center">Telat (Mnt)</th>
                <th className="py-3 px-2 text-right text-red-500">Denda Telat</th>
                <th className="py-3 px-2 text-right text-alert-amber">Potongan Kasbon</th>
                <th className="py-3 px-3 text-right text-primary-teal font-bold">Gaji Bersih Diterima</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {salaries.map((emp) => (
                <tr key={emp.id} className="border-b border-outline-variant hover:bg-neutral-light/50 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                      <img className="w-full h-full object-cover" src={emp.avatar} alt={emp.name} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{emp.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">{emp.role}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-on-surface">{emp.shiftWorked} Shift</td>
                  <td className="py-3 px-2 text-right font-medium">{formatCurrency(emp.hourlyRate)}</td>
                  <td className="py-3 px-2 text-center text-on-surface-variant font-bold">{emp.lateMinutes} mnt</td>
                  <td className="py-3 px-2 text-right text-red-500 font-semibold">-{formatCurrency(emp.lateFine)}</td>
                  <td className="py-3 px-2 text-right text-alert-amber font-semibold">-{formatCurrency(emp.ewaDeductions)}</td>
                  <td className="py-3 px-3 text-right text-primary-teal font-extrabold">{formatCurrency(emp.netPay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-primary-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0" onClick={() => setActiveReceipt(null)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden border border-outline-variant shadow-2xl p-6 relative z-10 animate-fade-in text-center">
            
            {activeReceipt.status === "approved" ? (
              <>
                <div className="bg-success-emerald/10 text-success-emerald p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="text-base font-bold text-primary-navy">Pencairan Kasbon Berhasil!</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Dana kasbon disetujui & ditransfer otomatis via Payment Gateway
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/10 text-red-500 p-3 rounded-full flex items-center justify-center w-14 h-14 mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">cancel</span>
                </div>
                <h3 className="text-base font-bold text-red-600">Pengajuan Kasbon Ditolak</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Permintaan pencairan kasbon staf telah dibatalkan
                </p>
              </>
            )}

            {/* Receipt Detail Card */}
            <div className="mt-4 p-4 bg-neutral-light rounded-xl border border-dashed border-outline-variant text-left space-y-2.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">Staf Lapangan</span>
                <span className="font-bold text-primary-navy">{activeReceipt.name} ({activeReceipt.role})</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">Jumlah Pencairan</span>
                <span className={`font-extrabold ${activeReceipt.status === "approved" ? "text-success-emerald" : "text-red-500 line-through"}`}>
                  {formatCurrency(activeReceipt.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">Tujuan Transfer</span>
                <span className="font-bold text-primary-navy">{activeReceipt.bankName} ({activeReceipt.bankAccount})</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">ID Transaksi</span>
                <span className="font-bold text-primary-navy font-mono">{activeReceipt.txId}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">Status Gateway</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                  activeReceipt.status === "approved"
                    ? "bg-success-emerald/10 text-success-emerald"
                    : "bg-red-500/10 text-red-500"
                }`}>
                  {activeReceipt.status === "approved" ? "SETTLED / SUCCESS" : "REJECTED"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveReceipt(null)}
              className="w-full bg-primary-navy hover:bg-primary-navy/90 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 mt-5 flex items-center justify-center gap-1"
            >
              Tutup Slip Pencairan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
