"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/employee", icon: "home" },
    { name: "Jadwal", href: "/employee/schedule", icon: "calendar_month" },
    { name: "Kasbon", href: "/employee/payroll", icon: "payments" },
    { name: "Riwayat", href: "/employee/history", icon: "history" },
  ];

  return (
    <div className="min-h-screen bg-surface flex justify-center">
      <div className="w-full max-w-md relative min-h-screen pb-20">
        {children}

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex justify-around items-center px-2 py-2 bg-white border-t border-outline-variant shadow-md h-16">
          {navItems.map((item) => {
            const isActive =
              item.href === "/employee"
                ? pathname === "/employee"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-1 transition-all rounded-xl ${
                  isActive
                    ? "text-primary-teal font-bold"
                    : "text-on-surface-variant hover:text-primary-teal"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
