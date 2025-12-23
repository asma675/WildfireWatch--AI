import React from 'react';
import { cn } from "@/lib/utils";

export default function RiskGauge({ score, size = "lg" }) {
  const percentage = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return { stroke: "#ef4444", text: "text-red-500", label: "EXTREME" };
    if (score >= 60) return { stroke: "#f97316", text: "text-orange-500", label: "HIGH" };
    if (score >= 40) return { stroke: "#f59e0b", text: "text-amber-500", label: "MODERATE" };
    if (score >= 20) return { stroke: "#22c55e", text: "text-green-500", label: "LOW" };
    return { stroke: "#3b82f6", text: "text-blue-500", label: "MINIMAL" };
  };

  const colorInfo = getColor(score);
  const sizeClasses = size === "lg" ? "w-40 h-40" : "w-24 h-24";
  const textSize = size === "lg" ? "text-4xl" : "text-xl";
  const labelSize = size === "lg" ? "text-xs" : "text-[10px]";

  return (
    <div className={cn("relative", sizeClasses)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/5"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colorInfo.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${colorInfo.stroke}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", textSize, colorInfo.text)}>{Math.round(score)}</span>
        <span className={cn("font-semibold tracking-widest text-slate-400", labelSize)}>
          {colorInfo.label}
        </span>
      </div>
    </div>
  );
}