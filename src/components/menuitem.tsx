"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}

export function MenuItem({ icon, label, to, onClick }: MenuItemProps) {
  const pathname = usePathname();

  const isActive = pathname === to;

  return (
    <Link
      href={to}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left font-bold hover:bg-emerald-100 hover:text-blue-950
      ${isActive ? "bg-emerald-500" : ""}`}
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}