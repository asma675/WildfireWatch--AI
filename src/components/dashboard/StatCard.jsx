import React from 'react';
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }) {
  const variants = {
    default: "from-slate-800/50 to-slate-900/50 border-white/5",
    warning: "from-amber-950/30 to-amber-900/20 border-amber-500/20",
    danger: "from-red-950/30 to-red-900/20 border-red-500/20",
    success: "from-green-950/30 to-green-900/20 border-green-500/20",
  };

  const iconVariants = {
    default: "bg-slate-700/50 text-slate-300",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
    success: "bg-green-500/20 text-green-400",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br border p-6",
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium mt-2",
              trend.positive ? "text-green-400" : "text-red-400"
            )}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", iconVariants[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
    </div>
  );
}