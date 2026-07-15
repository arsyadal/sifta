"use client";

import React, { useState, useCallback, useEffect } from "react";
import { getEmployees, createEmployee } from "../../actions";

interface Employee {
  id: string | number;
  name: string;
  role: string;
  phone: string;
  hourlyRate: number;
  bankName: string;
  bankAccount: string;
  avatar: string;
  status: "aktif" | "nonaktif";
}

interface FormErrors {
  name?: string;
  phone?: string;
  rate?: string;
  account?: string;
}

// Preset rate options for quick selection
const RATE_PRESETS = [
  { label: "Rp10.000", value: 10000 },
  { label: "Rp15.000", value: 15000 },
  { label: "Rp20.000", value: 20000 },
  { label: "Rp25.000", value: 25000 },
  { label: "Rp35.000", value: 35000 },
];

const ROLE_OPTIONS = [
  { value: "Kasir", icon: "point_of_sale" },
  { value: "Security", icon: "security" },
  { value: "Supervisor", icon: "supervisor_account" },
  { value: "Barista", icon: "coffee" },
  { value: "Kurir", icon: "local_shipping" },
  { value: "Cleaning", icon: "cleaning_services" },
  { value: "Koki", icon: "restaurant" },
];

export default function OwnerEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Budi Santoso",
      role: "Security",
      phone: "0812-3456-7890",
      hourlyRate: 18000,
      bankName: "Bank BCA",
      bankAccount: "1234567890",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      status: "aktif",
    },
    {
      id: 2,
      name: "Siti Rahma",
      role: "Kasir",
      phone: "0823-4567-8901",
      hourlyRate: 15000,
      bankName: "GoPay",
      bankAccount: "082345678901",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      status: "aktif",
    },
    {
      id: 3,
      name: "Agus Riyadi",
      role: "Supervisor",
      phone: "0857-8901-2345",
      hourlyRate: 25000,
      bankName: "Bank Mandiri",
      bankAccount: "9876543210",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      status: "aktif",
    },
  ]);

  // Load employees from SQLite database
  useEffect(() => {
    async function loadData() {
      const dbEmployees = await getEmployees();
      if (dbEmployees && dbEmployees.length > 0) {
        const mapped: Employee[] = dbEmployees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          phone: emp.phoneNumber,
          hourlyRate: emp.hourlyRate,
          bankName: emp.bankName,
          bankAccount: emp.bankAccountNumber,
          avatar: emp.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
          status: emp.status as "aktif" | "nonaktif",
        }));
        setEmployees(mapped);
      }
    }
    loadData();
  }, []);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Kasir");
  const [newPhone, setNewPhone] = useState("");
  const [newRateDisplay, setNewRateDisplay] = useState("15.000");
  const [newRateValue, setNewRateValue] = useState(15000);
  const [newBank, setNewBank] = useState("GoPay");
  const [newAccount, setNewAccount] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formStep, setFormStep] = useState(1); // 1 = profil, 2 = keuangan
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Format number to Indonesian locale string (e.g. 15000 -> "15.000")
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Format phone number as user types: 08xx-xxxx-xxxx
  const formatPhoneInput = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 13)}`;
  };

  // Parse rate display string back to number
  const parseRateInput = (display: string): number => {
    return parseInt(display.replace(/\D/g, ""), 10) || 0;
  };

  // Validate name: must contain at least 2 words, each at least 2 chars, letters only
  const validateName = (name: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) return "Nama lengkap wajib diisi";
    if (trimmed.length < 3) return "Nama terlalu pendek (min. 3 karakter)";
    const words = trimmed.split(/\s+/).filter((w) => w.length >= 2);
    if (words.length < 2) return "Masukkan nama lengkap (nama depan & belakang)";
    if (!/^[a-zA-Z\s'.]+$/.test(trimmed)) return "Nama hanya boleh mengandung huruf";
    return undefined;
  };

  // Validate phone: must start with 08 or +62, 10-15 digits
  const validatePhone = (phone: string): string | undefined => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "Nomor WhatsApp wajib diisi";
    if (!digits.startsWith("08") && !digits.startsWith("62"))
      return "Nomor harus diawali 08xx atau +62xx";
    if (digits.length < 10) return "Nomor terlalu pendek (min. 10 digit)";
    if (digits.length > 15) return "Nomor terlalu panjang (maks. 15 digit)";
    return undefined;
  };

  // Validate rate: must be between 5000 and 500000
  const validateRate = (rate: number): string | undefined => {
    if (!rate || rate < 5000) return "Minimum Rp5.000 / jam";
    if (rate > 500000) return "Maksimum Rp500.000 / jam";
    return undefined;
  };

  const handleRateInputChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const num = parseInt(digits, 10) || 0;
    // Clamp display to max 500000
    const clamped = Math.min(num, 500000);
    setNewRateValue(clamped);
    setNewRateDisplay(clamped > 0 ? formatNumber(clamped) : "");
    // Clear rate error if valid
    if (clamped >= 5000 && clamped <= 500000) {
      setFormErrors((prev) => ({ ...prev, rate: undefined }));
    }
  };

  const handlePhoneInputChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    // Limit to 15 digits
    const limited = digits.slice(0, 15);
    setNewPhone(formatPhoneInput(limited));
    // Clear phone error on valid input
    const err = validatePhone(limited);
    if (!err) setFormErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleNameChange = (value: string) => {
    // Only allow letters, spaces, apostrophes, and dots
    const sanitized = value.replace(/[^a-zA-Z\s'.]/g, "");
    setNewName(sanitized);
    // Clear name error if becoming valid
    const err = validateName(sanitized);
    if (!err) setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const validateStep1 = (): boolean => {
    const errors: FormErrors = {};
    errors.name = validateName(newName);
    errors.phone = validatePhone(newPhone);
    // Remove undefined entries
    const clean: FormErrors = {};
    if (errors.name) clean.name = errors.name;
    if (errors.phone) clean.phone = errors.phone;
    setFormErrors(clean);
    return Object.keys(clean).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: FormErrors = { ...formErrors };
    errors.rate = validateRate(newRateValue);
    const clean: FormErrors = {};
    if (errors.rate) clean.rate = errors.rate;
    setFormErrors(clean);
    return Object.keys(clean).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setFormStep(2);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddEmployee = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateStep2()) return;

      const phoneDigits = newPhone.replace(/\D/g, "");
      const formattedPhone = formatPhoneInput(phoneDigits);

      const newEmp: Employee = {
        id: Date.now().toString(),
        name: newName.trim().replace(/\s+/g, " "),
        role: newRole,
        phone: formattedPhone,
        hourlyRate: newRateValue,
        bankName: newBank,
        bankAccount: newAccount || formattedPhone,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
        status: "aktif",
      };

      // Call database server action to persist
      createEmployee({
        name: newEmp.name,
        role: newEmp.role,
        phoneNumber: newEmp.phone,
        hourlyRate: newEmp.hourlyRate,
        bankName: newEmp.bankName,
        bankAccountNumber: newEmp.bankAccount,
      }).then((res) => {
        if (res.success && res.employee) {
          const dbEmp: Employee = {
            id: res.employee.id,
            name: res.employee.name,
            role: res.employee.role,
            phone: res.employee.phoneNumber,
            hourlyRate: res.employee.hourlyRate,
            bankName: res.employee.bankName,
            bankAccount: res.employee.bankAccountNumber,
            avatar: res.employee.avatar || newEmp.avatar,
            status: res.employee.status as "aktif" | "nonaktif",
          };
          setEmployees((prev) => [dbEmp, ...prev]);
        } else {
          // Fallback to local memory state on error
          setEmployees((prev) => [newEmp, ...prev]);
        }
      });

      setShowAddModal(false);

      // Reset form
      setNewName("");
      setNewPhone("");
      setNewRateDisplay("15.000");
      setNewRateValue(15000);
      setNewAccount("");
      setNewRole("Kasir");
      setNewBank("GoPay");
      setFormErrors({});
      setFormStep(1);

      showToast(`✅ ${newEmp.name} berhasil ditambahkan sebagai ${newEmp.role}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newName, newRole, newPhone, newRateValue, newBank, newAccount]
  );

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormStep(1);
    setFormErrors({});
  };

  const handleToggleStatus = (
    id: string | number,
    currentStatus: "aktif" | "nonaktif"
  ) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: currentStatus === "aktif" ? "nonaktif" : "aktif",
            }
          : emp
      )
    );
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary-navy">
            Daftar Karyawan Lapangan
          </h2>
          <p className="text-xs text-on-surface-variant">
            Manajemen staf, data rekening pencairan kasbon EWA, dan rate upah
            per jam
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs"
        >
          <span className="material-symbols-outlined text-[16px]">
            person_add
          </span>
          Tambah Karyawan Baru
        </button>
      </section>

      {/* Employee List Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between ${
              emp.status === "nonaktif"
                ? "opacity-60 border-dashed border-outline"
                : "border-outline-variant"
            }`}
          >
            {/* Header info card */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={emp.avatar}
                  alt={emp.name}
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-on-surface">
                    {emp.name}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      emp.status === "aktif"
                        ? "bg-success-emerald/10 text-success-emerald"
                        : "bg-neutral-dark/10 text-on-surface-variant"
                    }`}
                  >
                    {emp.status === "aktif" ? "Aktif" : "Non-aktif"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{emp.role}</p>
              </div>
            </div>

            {/* Details panel */}
            <div className="space-y-2 border-t border-b border-outline-variant py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">No. Telepon:</span>
                <span className="font-bold text-on-surface">{emp.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  Rate Upah / Jam:
                </span>
                <span className="font-bold text-primary-teal">
                  {formatCurrency(emp.hourlyRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  Rekening Pencairan:
                </span>
                <span className="font-bold text-on-surface">
                  {emp.bankName} - {emp.bankAccount}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => handleToggleStatus(emp.id, emp.status)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                  emp.status === "aktif"
                    ? "border-outline text-on-surface-variant hover:bg-neutral-light"
                    : "border-success-emerald text-success-emerald hover:bg-success-emerald/5"
                }`}
              >
                {emp.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                onClick={() => {
                  const rate = prompt(
                    `Ubah rate upah per jam untuk ${emp.name}:`,
                    emp.hourlyRate.toString()
                  );
                  if (rate !== null && !isNaN(Number(rate))) {
                    setEmployees(
                      employees.map((e) =>
                        e.id === emp.id
                          ? { ...e, hourlyRate: Number(rate) }
                          : e
                      )
                    );
                    showToast(
                      `Rate upah ${emp.name} diubah → ${formatCurrency(Number(rate))}/jam`
                    );
                  }
                }}
                className="flex-1 py-2 bg-neutral-light border border-outline-variant hover:bg-surface-container text-primary-navy font-bold rounded-xl text-xs transition-all active:scale-95"
              >
                Ubah Rate
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Add Employee Modal Dialog ─── */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-primary-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <form
            onSubmit={handleAddEmployee}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden"
          >
            {/* Modal Header with gradient accent */}
            <div className="bg-gradient-to-r from-primary-teal to-primary-teal/80 px-6 py-5 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -right-8 -bottom-6 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Tambah Karyawan Baru
                  </h3>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Daftarkan profil dan nomor rekening karyawan lapangan Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white/15 hover:bg-white/25 p-1.5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Step indicator */}
              <div className="relative z-10 flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    formStep >= 1 ? "bg-white text-primary-teal" : "bg-white/20 text-white/60"
                  }`}>1</span>
                  <span className="text-[10px] font-bold text-white/90">Data Profil</span>
                </div>
                <div className={`flex-1 h-0.5 rounded ${formStep >= 2 ? "bg-white" : "bg-white/20"}`}></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    formStep >= 2 ? "bg-white text-primary-teal" : "bg-white/20 text-white/60"
                  }`}>2</span>
                  <span className="text-[10px] font-bold text-white/90">Keuangan</span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {/* ── Step 1: Profile ── */}
              {formStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                      Nama Lengkap
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      maxLength={50}
                      className={`w-full bg-neutral-light border rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors ${
                        formErrors.name
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                          : "border-outline-variant focus:border-primary-teal focus:ring-primary-teal"
                      }`}
                    />
                    <div className="flex justify-between items-center">
                      {formErrors.name ? (
                        <p className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">error</span>
                          {formErrors.name}
                        </p>
                      ) : (
                        <p className="text-[10px] text-on-surface-variant">Nama depan dan belakang (huruf saja)</p>
                      )}
                      <span className={`text-[9px] font-bold ${newName.length > 45 ? "text-alert-amber" : "text-on-surface-variant"}`}>
                        {newName.length}/50
                      </span>
                    </div>
                  </div>

                  {/* Peran / Jabatan - Card Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">work</span>
                      Peran / Jabatan
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {ROLE_OPTIONS.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setNewRole(role.value)}
                          className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                            newRole === role.value
                              ? "bg-primary-teal/10 border-primary-teal text-primary-teal shadow-sm"
                              : "bg-neutral-light border-outline-variant text-on-surface-variant hover:border-primary-teal/40"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{role.icon}</span>
                          {role.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      Nomor WhatsApp / Telepon
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">+62</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newPhone}
                        onChange={(e) => handlePhoneInputChange(e.target.value)}
                        placeholder="0812-3456-7890"
                        className={`w-full bg-neutral-light border rounded-xl py-2.5 pl-14 pr-3 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors tracking-wide ${
                          formErrors.phone
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                            : "border-outline-variant focus:border-primary-teal focus:ring-primary-teal"
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">error</span>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Step 1 Actions */}
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-3 border border-outline-variant hover:bg-neutral-light text-on-surface-variant font-bold rounded-xl text-xs transition-all active:scale-95"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      Lanjut
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Financial ── */}
              {formStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  {/* Rate Upah */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      Rate Upah / Jam
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-primary-teal">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newRateDisplay}
                        onChange={(e) => handleRateInputChange(e.target.value)}
                        placeholder="15.000"
                        className={`w-full bg-neutral-light border rounded-xl py-2.5 pl-10 pr-12 text-xs font-semibold focus:outline-none focus:ring-1 transition-colors ${
                          formErrors.rate
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                            : "border-outline-variant focus:border-primary-teal focus:ring-primary-teal"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-medium">/jam</span>
                    </div>
                    {formErrors.rate ? (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">error</span>
                        {formErrors.rate}
                      </p>
                    ) : (
                      <p className="text-[10px] text-on-surface-variant">Rp5.000 – Rp500.000 per jam</p>
                    )}

                    {/* Quick Rate Preset Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {RATE_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            setNewRateValue(preset.value);
                            setNewRateDisplay(formatNumber(preset.value));
                            setFormErrors((prev) => ({ ...prev, rate: undefined }));
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${
                            newRateValue === preset.value
                              ? "bg-primary-teal/10 border-primary-teal text-primary-teal"
                              : "bg-neutral-light border-outline-variant text-on-surface-variant hover:border-primary-teal/40"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metode Pencairan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                      Metode Pencairan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "GoPay", color: "bg-blue-500" },
                        { value: "OVO", color: "bg-purple-500" },
                        { value: "Dana", color: "bg-sky-500" },
                        { value: "Bank BCA", color: "bg-blue-700" },
                        { value: "Bank Mandiri", color: "bg-yellow-600" },
                        { value: "Bank BRI", color: "bg-blue-800" },
                      ].map((bank) => (
                        <button
                          key={bank.value}
                          type="button"
                          onClick={() => setNewBank(bank.value)}
                          className={`flex items-center gap-2 py-2 px-2.5 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                            newBank === bank.value
                              ? "bg-primary-teal/10 border-primary-teal text-primary-teal shadow-sm"
                              : "bg-neutral-light border-outline-variant text-on-surface-variant hover:border-primary-teal/40"
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${bank.color} shrink-0`}></span>
                          {bank.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* No Rekening */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">credit_card</span>
                      No. Rekening / E-Wallet
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newAccount}
                      onChange={(e) => {
                        // Only allow digits
                        const val = e.target.value.replace(/\D/g, "");
                        setNewAccount(val);
                      }}
                      placeholder="Kosongkan jika sama dengan No. HP"
                      maxLength={20}
                      className="w-full bg-neutral-light border border-outline-variant rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal tracking-wide"
                    />
                    <p className="text-[10px] text-on-surface-variant">
                      Jika dikosongkan, nomor HP akan digunakan sebagai nomor rekening
                    </p>
                  </div>

                  {/* Summary Preview */}
                  <div className="bg-neutral-light/80 border border-outline-variant rounded-xl p-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ringkasan Data</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                      <span className="text-on-surface-variant">Nama:</span>
                      <span className="font-bold text-primary-navy truncate">{newName || "—"}</span>
                      <span className="text-on-surface-variant">Peran:</span>
                      <span className="font-bold text-primary-navy">{newRole}</span>
                      <span className="text-on-surface-variant">No. HP:</span>
                      <span className="font-bold text-primary-navy">{newPhone || "—"}</span>
                      <span className="text-on-surface-variant">Rate:</span>
                      <span className="font-bold text-primary-teal">{newRateValue > 0 ? formatCurrency(newRateValue) : "—"}/jam</span>
                      <span className="text-on-surface-variant">Pencairan:</span>
                      <span className="font-bold text-primary-navy">{newBank}</span>
                    </div>
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="flex-1 py-3 border border-outline-variant hover:bg-neutral-light text-on-surface-variant font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary-teal hover:bg-primary-teal/90 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Simpan Staf Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 bg-primary-navy text-white text-xs font-bold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 z-[60] animate-fade-in border border-outline-variant max-w-sm">
          <span className="material-symbols-outlined text-[16px] text-success-emerald">check_circle</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
