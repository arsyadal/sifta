"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SiftaLogo from "../../components/SiftaLogo";
import { getEmployeeDashboardData, requestEWA } from "../../actions";

interface Transaction {
  id: string | number;
  title: string;
  date: string;
  amount: number;
  type: "received" | "withdrawn";
  status: "BERHASIL" | "DITERIMA";
}

export default function EmployeePayroll() {
  const [accruedSalary, setAccruedSalary] = useState(1250000);
  const [maxWithdrawable, setMaxWithdrawable] = useState(850000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      title: "Penarikan EWA (Kasbon)",
      date: "12 Okt 2024 • 14:20",
      amount: 250000,
      type: "withdrawn",
      status: "BERHASIL",
    },
    {
      id: 2,
      title: "Gaji September 2024",
      date: "28 Sep 2024",
      amount: 3050000,
      type: "received",
      status: "DITERIMA",
    },
    {
      id: 3,
      title: "Penarikan EWA (Kasbon)",
      date: "05 Sep 2024 • 09:15",
      amount: 100000,
      type: "withdrawn",
      status: "BERHASIL",
    },
  ]);

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load accrued wages & EWA limits from SQLite database
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getEmployeeDashboardData("0812-3456-7890"); // Seeded Budi Santoso's phone
      if (data) {
        setEmployee(data.employee);
        setAccruedSalary(data.totalWagesAccrued);
        setMaxWithdrawable(data.maxWithdrawable);
        
        // Map database cashout requests to transaction logs
        const dbTxs: Transaction[] = data.employee.cashoutRequests.map((req: any) => ({
          id: req.id,
          title: `Penarikan EWA (${req.status === "approved" ? "Disetujui" : req.status === "rejected" ? "Ditolak" : "Pending"})`,
          date: new Date(req.requestedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          amount: req.amount,
          type: "withdrawn",
          status: req.status === "approved" ? "BERHASIL" : "DITERIMA",
        }));
        
        setTransactions((prev) => [...dbTxs, ...prev]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Modal states for EWA
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100000);
  const [disbursing, setDisbursing] = useState(false);
  const [disbursed, setDisbursed] = useState(false);
  const [bankMethod, setBankMethod] = useState("GoPay");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear error message when withdrawal modal or amount changes
  useEffect(() => {
    setErrorMsg(null);
  }, [withdrawAmount, showModal]);

  const handleWithdraw = async () => {
    if (withdrawAmount > maxWithdrawable) {
      setErrorMsg("Jumlah penarikan melebihi batas dana darurat yang tersedia!");
      return;
    }
    setErrorMsg(null);
    setDisbursing(true);

    if (employee) {
      const res = await requestEWA(employee.id, withdrawAmount, bankMethod);
      if (res.success && res.request) {
        setDisbursing(false);
        setDisbursed(true);
        
        // Update states
        setAccruedSalary((prev) => prev - withdrawAmount);
        setMaxWithdrawable((prev) => prev - withdrawAmount);
        
        const newTx: Transaction = {
          id: res.request.id,
          title: `Penarikan EWA (${bankMethod})`,
          date: "Hari ini • " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          amount: withdrawAmount,
          type: "withdrawn",
          status: "BERHASIL",
        };
        setTransactions((prev) => [newTx, ...prev]);

        setTimeout(() => {
          setDisbursed(false);
          setShowModal(false);
        }, 3000);
      } else {
        setErrorMsg(res.error || "Gagal mengirim pengajuan kasbon.");
        setDisbursing(false);
      }
    } else {
      // Fallback local simulation
      setTimeout(() => {
        setDisbursing(false);
        setDisbursed(true);
        setAccruedSalary((prev) => prev - withdrawAmount);
        setMaxWithdrawable((prev) => prev - withdrawAmount);
        
        const newTx: Transaction = {
          id: Date.now(),
          title: `Penarikan EWA (${bankMethod})`,
          date: "Hari ini • " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          amount: withdrawAmount,
          type: "withdrawn",
          status: "BERHASIL",
        };
        setTransactions([newTx, ...transactions]);

        setTimeout(() => {
          setDisbursed(false);
          setShowModal(false);
        }, 3000);
      }, 2000);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col relative">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant flex justify-between items-center w-full px-4 h-16 shadow-sm">
        <div className="flex items-center gap-2">
          <SiftaLogo className="h-7 w-auto" />
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-teal/20">
          <img
            className="w-full h-full object-cover"
            alt="Employee Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt2FrHPum8hS-KkyGk05PNUH38RKebICLzgKsXyvepXBPIFez95PzaVDcelDCV3YKct5cNVR-6lpIqJer4F-NQPvMrUdxpPo6-B7FDIplEJsp934DYTSANKQywSbi8j7BtOq28Oe6DFPo40NJskFdv60aAO7uPWCkD5hnDH_gQTueOzozU8h1IfKJytH86wEqwgfePVCJRPCUPCbOV2piGbLl4dY0767jtZMpbYccdQ_0gPs5QfD5rItMf6bzSnellTiTVqzgB1_A"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24 space-y-6">
        
        {/* Salary Accumulation Card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-navy to-primary-teal p-6 text-white shadow-lg">
          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-xs opacity-85 font-semibold">Estimasi Gaji Berjalan</p>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1">{formatCurrency(accruedSalary)}</h2>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold opacity-90">
                <span>Progres Kerja Bulan Ini</span>
                <span>40% Selesai</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "40%" }}></div>
              </div>
              <p className="text-[10px] opacity-75 italic text-right">Potensi gaji bulanan: Rp 3.125.000</p>
            </div>
          </div>
          {/* Decorative design bubbles */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
        </section>

        {/* EWA Banner (Kasbon Instan) */}
        <section className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-alert-amber/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-alert-amber">
              <span className="material-symbols-outlined text-3xl font-bold">payments</span>
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-primary-navy">Butuh Dana Cepat?</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tarik sebagian upah dari hari kerja yang sudah Anda selesaikan secara instan tanpa menunggu tanggal gajian.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-alert-amber hover:bg-alert-amber/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold">account_balance_wallet</span>
            Tarik Kasbon Instan (EWA)
          </button>
          
          <p className="text-center text-xs text-on-surface-variant font-medium">
            Maksimal limit penarikan: <span className="text-alert-amber font-bold">{formatCurrency(maxWithdrawable)}</span>
          </p>
        </section>

        {/* Activity history logs */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-sm text-primary-navy">Riwayat Keuangan</h3>
            <button className="text-xs font-bold text-primary-teal hover:underline">Lihat Semua</button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant hover:bg-neutral-light/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.type === "withdrawn" ? "bg-red-50 text-red-500" : "bg-success-emerald/10 text-success-emerald"
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {tx.type === "withdrawn" ? "outbox" : "history_edu"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{tx.title}</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-bold text-xs ${tx.type === "withdrawn" ? "text-red-500" : "text-primary-teal"}`}>
                    {tx.type === "withdrawn" ? "-" : "+"} {formatCurrency(tx.amount)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 text-[8px] font-bold rounded-full ${
                    tx.status === "BERHASIL" ? "bg-success-emerald/10 text-success-emerald" : "bg-neutral-dark/10 text-on-surface"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Information box */}
        <section className="bg-surface-container-low rounded-xl p-4 border border-outline-variant space-y-2">
          <h4 className="font-bold text-xs text-primary-navy flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary-teal">info</span>
            Ketentuan Penarikan EWA
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Sifta EWA bukan pinjaman online. Anda hanya menarik upah yang sudah Anda kumpulkan dari hari kerja yang valid. Biaya administrasi flat sebesar <span className="font-semibold text-primary-navy">Rp 5.000</span> per penarikan.
          </p>
        </section>
      </main>


      {/* EWA Withdrawal Modal Screen */}
      {showModal && (
        <div className="absolute inset-0 bg-primary-navy/70 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-6 animate-slide-up shadow-2xl">
            {disbursed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success-emerald/10 text-success-emerald flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-primary-navy">Dana Berhasil Dikirim!</h3>
                  <p className="text-xs text-on-surface-variant">
                    Dana kasbon sebesar <span className="font-bold text-primary-navy">{formatCurrency(withdrawAmount)}</span> telah berhasil dikirim ke e-wallet {bankMethod} Anda.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-primary-navy">Ajukan Tarik Kasbon</h3>
                  <p className="text-xs text-on-surface-variant">Uang dikirim instan lewat Payment Gateway Sifta</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">Jumlah Penarikan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[100000, 200000, 500000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setWithdrawAmount(amt)}
                        disabled={amt > maxWithdrawable}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          withdrawAmount === amt
                            ? "bg-primary-teal text-white border-primary-teal shadow-md shadow-primary-teal/10"
                            : amt > maxWithdrawable
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-on-surface border-outline-variant hover:bg-neutral-light"
                        }`}
                      >
                        {formatCurrency(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant">Metode Pencairan</label>
                  <select
                    value={bankMethod}
                    onChange={(e) => setBankMethod(e.target.value)}
                    className="w-full bg-neutral-light border border-outline-variant rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
                  >
                    <option value="GoPay">GoPay (Instan)</option>
                    <option value="OVO">OVO (Instan)</option>
                    <option value="Dana">Dana (Instan)</option>
                    <option value="Bank BCA">Bank BCA (Transfer)</option>
                    <option value="Bank Mandiri">Bank Mandiri (Transfer)</option>
                  </select>
                </div>

                <div className="bg-[#FFFCEB] border border-alert-amber/20 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-alert-amber">
                  <span className="material-symbols-outlined text-sm font-bold">payments</span>
                  <div className="leading-relaxed">
                    Biaya admin <span className="font-bold">Rp 5.000</span> akan dipotong saat final bulanan. Dana bersih yang Anda terima adalah <span className="font-bold">{formatCurrency(withdrawAmount)}</span>.
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-[11px] font-bold text-center animate-fade-in">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={disbursing}
                    className="flex-1 py-3 border border-outline-variant hover:bg-neutral-light text-on-surface font-bold rounded-xl text-xs transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={disbursing || withdrawAmount > maxWithdrawable}
                    className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {disbursing ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                        Memproses...
                      </>
                    ) : (
                      "Cairkan Sekarang"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
