import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Thermometer, 
  Wind, 
  Droplets, 
  Leaf,
  History,
  AlertTriangle,
  Loader2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import RiskGauge from '../dashboard/RiskGauge';
import { cn } from "@/lib/utils";

export default function AnalysisPanel({ zone, onAnalyze, isAnalyzing }) {
  if (!zone) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Select a zone to view analysis</p>
      </div>
    );
  }

  const weather = zone.weather_conditions || {};

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{zone.name}</h2>
          <p className="text-sm text-slate-500">
            {zone.latitude?.toFixed(4)}°, {zone.longitude?.toFixed(4)}° • {zone.radius_km}km radius
          </p>
        </div>
        <Button
          onClick={() => onAnalyze(zone)}
          disabled={isAnalyzing}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Analyze
        </Button>
      </div>

      {/* Risk Gauge */}
      <div className="flex justify-center mb-6">
        <RiskGauge score={zone.risk_score || 0} size="lg" />
      </div>

      {zone.last_analysis && (
        <p className="text-center text-xs text-slate-500 mb-6 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          Last analyzed: {format(new Date(zone.last_analysis), 'MMM d, h:mm a')}
        </p>
      )}

      {/* Data Points */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <DataPoint 
          icon={Thermometer} 
          label="Temperature" 
          value={weather.temp ? `${weather.temp}°F` : '--'} 
          color="text-red-400"
        />
        <DataPoint 
          icon={Wind} 
          label="Wind Speed" 
          value={weather.wind ? `${weather.wind} mph` : '--'} 
          color="text-blue-400"
        />
        <DataPoint 
          icon={Droplets} 
          label="Humidity" 
          value={weather.humidity ? `${weather.humidity}%` : '--'} 
          color="text-cyan-400"
        />
        <DataPoint 
          icon={Leaf} 
          label="Vegetation (NDVI)" 
          value={zone.vegetation_index?.toFixed(2) || '--'} 
          color="text-green-400"
        />
        <DataPoint 
          icon={History} 
          label="Historic Fires" 
          value={zone.historical_fires ?? '--'} 
          color="text-orange-400"
        />
        <DataPoint 
          icon={AlertTriangle} 
          label="Risk Level" 
          value={zone.risk_level?.toUpperCase() || 'UNKNOWN'} 
          color={getRiskColor(zone.risk_level)}
        />
      </div>

      {/* Analysis Summary */}
      {zone.analysis_summary && (
        <div className="flex-1 overflow-auto">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">AI Analysis</h3>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
            <p className="text-sm text-slate-300 leading-relaxed">{zone.analysis_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DataPoint({ icon: Icon, label, value, color }) {
  return (
    <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function getRiskColor(level) {
  switch (level) {
    case 'extreme': return 'text-red-500';
    case 'high': return 'text-orange-500';
    case 'moderate': return 'text-amber-500';
    case 'low': return 'text-green-500';
    default: return 'text-slate-500';
  }
}