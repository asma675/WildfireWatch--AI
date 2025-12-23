import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function AlertItem({ alert }) {
  const levelStyles = {
    extreme: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-500" },
    high: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", icon: "text-orange-500" },
    moderate: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "text-amber-500" },
  };

  const style = levelStyles[alert.alert_level] || levelStyles.moderate;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      style.bg, style.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", style.bg)}>
          <AlertTriangle className={cn("w-4 h-4", style.icon)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-white truncate">{alert.zone_name}</h4>
            <span className={cn("text-xs font-semibold uppercase px-2 py-0.5 rounded-full", style.bg, style.text)}>
              {alert.alert_level}
            </span>
          </div>
          
          <p className="text-sm text-slate-400 line-clamp-2 mb-2">{alert.message}</p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(alert.created_date), 'MMM d, h:mm a')}
            </span>
            {alert.status === 'sent' && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3 h-3" />
                {alert.recipients_notified} notified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}