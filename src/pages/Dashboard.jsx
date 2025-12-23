import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  MapPin, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  ArrowRight,
  Flame,
  Loader2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import StatCard from '@/components/dashboard/StatCard';
import ZoneCard from '@/components/dashboard/ZoneCard';
import AlertItem from '@/components/dashboard/AlertItem';
import RiskGauge from '@/components/dashboard/RiskGauge';

export default function Dashboard() {
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const { data: zones = [], isLoading: zonesLoading, refetch: refetchZones } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.entities.MonitoredZone.list('-risk_score', 50),
  });

  const { data: alerts = [], isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiClient.entities.AlertHistory.list('-created_date', 10),
  });

  const handleRunAnalysis = async () => {
    setIsRunningAnalysis(true);
    toast.loading('Running zone analysis...');
    try {
      await apiClient.jobs.analyzeZones();
      await refetchZones();
      await refetchAlerts();
      toast.dismiss();
      toast.success('Analysis completed successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const { data: alertConfigs = [] } = useQuery({
    queryKey: ['alertConfigs'],
    queryFn: () => apiClient.entities.AlertConfig.list(),
  });

  const isLoading = zonesLoading || alertsLoading;

  // Calculate stats
  const extremeZones = zones.filter(z => z.risk_level === 'extreme').length;
  const highZones = zones.filter(z => z.risk_level === 'high').length;
  const avgRisk = zones.length > 0 
    ? zones.reduce((sum, z) => sum + (z.risk_score || 0), 0) / zones.length 
    : 0;

  const topRiskZones = zones
    .filter(z => z.risk_score > 0)
    .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time wildfire risk monitoring • Automated analysis active</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRunAnalysis}
            disabled={isRunningAnalysis}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {isRunningAnalysis ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><RefreshCw className="w-4 h-4 mr-2" /> Run Analysis</>
            )}
          </Button>
          <Link to={createPageUrl('Zones')}>
            <Button variant="outline" className="border-white/10">
              <MapPin className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Zones"
          value={zones.length}
          icon={MapPin}
          variant="default"
        />
        <StatCard
          title="Extreme Risk"
          value={extremeZones}
          subtitle="Zones requiring immediate attention"
          icon={Flame}
          variant="danger"
        />
        <StatCard
          title="High Risk"
          value={highZones}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Avg Risk Score"
          value={avgRisk.toFixed(0)}
          icon={Activity}
          variant={avgRisk > 60 ? "warning" : "success"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* High Risk Zones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Highest Risk Zones</h2>
            <Link to={createPageUrl('RiskMap')} className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
              View Map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {topRiskZones.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {topRiskZones.map((zone) => (
                <Link key={zone.id} to={createPageUrl(`RiskMap?zone=${zone.id}`)}>
                  <ZoneCard zone={zone} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-8 text-center">
              <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No zones have been analyzed yet</p>
              <Link to={createPageUrl('Zones')}>
                <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-black">
                  Add Your First Zone
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
            <Link to={createPageUrl('Alerts')} className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No alerts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Backend Functions Active</h3>
              <p className="text-sm text-slate-500">
                Auto-analysis • Alert dispatch • Air quality monitoring • Heat map generation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}