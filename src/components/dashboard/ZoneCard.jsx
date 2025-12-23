import React from 'react';
import { MapPin, Activity, Thermometer, Wind } from 'lucide-react';
import { cn } from "@/lib/utils";
import RiskGauge from './RiskGauge';

export default function ZoneCard({ zone, onClick }) {
  const riskColors = {
    extreme: "border-red-500/30 bg-red-500/5",
    high: "border-orange-500/30 bg-orange-500/5",
    moderate: "border-amber-500/30 bg-amber-500/5",
    low: "border-green-500/30 bg-green-500/5",
    unknown: "border-slate-500/30 bg-slate-500/5",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        riskColors[zone.risk_level] || riskColors.unknown
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-white">{zone.name}</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {zone.latitude?.toFixed(4)}°, {zone.longitude?.toFixed(4)}°
          </p>
          
          {zone.weather_conditions && (
            <div className="flex gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                {zone.weather_conditions.temp || '--'}°
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {zone.weather_conditions.wind || '--'} mph
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {zone.vegetation_index?.toFixed(2) || '--'} NDVI
              </div>
            </div>
          )}
        </div>
        
        <RiskGauge score={zone.risk_score || 0} size="sm" />
      </div>
      
      {zone.analysis_summary && (
        <p className="mt-4 text-xs text-slate-400 line-clamp-2 border-t border-white/5 pt-4">
          {zone.analysis_summary}
        </p>
      )}
    </div>
  );
}