
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Flame, 
  LayoutDashboard, 
  Map, 
  MapPin, 
  Bell, 
  Shield,
  Building2,
  Heart
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Risk Map', icon: Map, page: 'RiskMap' },
    { name: 'Zones', icon: MapPin, page: 'Zones' },
    { name: 'Alerts', icon: Bell, page: 'Alerts' },
    { name: 'Safety', icon: Shield, page: 'FireSafety' },
    { name: 'Fire Depts', icon: Building2, page: 'FireDepartments' },
    { name: 'Health', icon: Heart, page: 'HealthImpact' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <style>{`
        :root {
          --background: 240 10% 6%;
          --foreground: 0 0% 98%;
          --card: 240 10% 10%;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 10%;
          --popover-foreground: 0 0% 98%;
          --primary: 32 95% 44%;
          --primary-foreground: 0 0% 100%;
          --secondary: 240 10% 15%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 10% 20%;
          --muted-foreground: 240 5% 60%;
          --accent: 32 95% 44%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 240 10% 20%;
          --input: 240 10% 20%;
          --ring: 32 95% 44%;
        }
      `}</style>
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f1a] animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">FireWatch AI</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Early Threat Radar</p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-amber-500/10 text-amber-500" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">System Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-white/5 px-2 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "text-slate-400"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 md:pt-20 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
