"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

export default function FeatureCard({ title, desc, icon: Icon }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-blue-900/40 p-6 rounded-2xl border border-blue-800"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-blue-400 shrink-0" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <p className="text-sm text-blue-300">{desc}</p>
    </motion.div>
  );
}