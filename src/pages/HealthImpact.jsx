import React from 'react';
import { Heart, Wind, Activity, AlertTriangle, Users, Shield, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HealthImpact() {
  const healthEffects = [
    { 
      icon: Wind, 
      title: "Respiratory Issues", 
      desc: "Smoke inhalation can cause coughing, shortness of breath, and aggravate asthma/COPD",
      severity: "high"
    },
    { 
      icon: Eye, 
      title: "Eye Irritation", 
      desc: "Burning, redness, and watering eyes from smoke particles and ash",
      severity: "moderate"
    },
    { 
      icon: Heart, 
      title: "Cardiovascular Stress", 
      desc: "Fine particles can enter bloodstream, increasing heart attack and stroke risk",
      severity: "high"
    },
    { 
      icon: Activity, 
      title: "Fatigue & Headaches", 
      desc: "Carbon monoxide exposure causes dizziness, weakness, and persistent headaches",
      severity: "moderate"
    },
  ];

  const vulnerable = [
    "Children and infants (developing lungs)",
    "Elderly individuals (65+)",
    "People with heart or lung conditions",
    "Pregnant women",
    "Outdoor workers and firefighters",
  ];

  const protectionTips = [
    { icon: Wind, title: "Monitor Air Quality", desc: "Check AQI daily via weather apps or government sites" },
    { icon: Shield, title: "Stay Indoors", desc: "Keep windows/doors closed, use HEPA air purifiers" },
    { icon: Users, title: "Limit Outdoor Activity", desc: "Avoid exercise outdoors when AQI is poor" },
    { icon: Activity, title: "Use N95 Masks", desc: "Wear properly fitted N95/P100 respirators if you must go outside" },
  ];

  const aqiLevels = [
    { range: "0-50", level: "Good", color: "bg-green-500", textColor: "text-green-400", desc: "Air quality is satisfactory" },
    { range: "51-100", level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-400", desc: "Acceptable for most, sensitive groups may experience minor issues" },
    { range: "101-150", level: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-orange-400", desc: "Children, elderly, and those with respiratory issues should limit outdoor exposure" },
    { range: "151-200", level: "Unhealthy", color: "bg-red-500", textColor: "text-red-400", desc: "Everyone may experience health effects" },
    { range: "201-300", level: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-400", desc: "Health alert - everyone may experience serious effects" },
    { range: "301+", level: "Hazardous", color: "bg-red-900", textColor: "text-red-300", desc: "Emergency conditions - entire population affected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-red-500/10">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Health Impact of Wildfires</h1>
          <p className="text-slate-400">Understanding smoke exposure and protecting yourself</p>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Primary Health Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {healthEffects.map((effect, idx) => {
              const Icon = effect.icon;
              return (
                <div key={idx} className="flex gap-3 p-4 bg-slate-900/50 rounded-lg border border-white/5">
                  <div className={`p-2 rounded-lg h-fit ${effect.severity === 'high' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <Icon className={`w-5 h-5 ${effect.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{effect.title}</h4>
                    <p className="text-sm text-slate-400">{effect.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Vulnerable Populations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {vulnerable.map((group, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span className="text-slate-300">{group}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">How to Protect Yourself</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {protectionTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="flex gap-3 p-4 bg-slate-900/50 rounded-lg">
                  <div className="p-2 rounded-lg bg-blue-500/10 h-fit">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-400">{tip.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Air Quality Index (AQI) Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aqiLevels.map((aqi, idx) => (
            <div key={idx} className="flex gap-4 items-center p-3 bg-slate-900/50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${aqi.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-white">{aqi.range}</span>
                  <span className={`text-sm font-medium ${aqi.textColor}`}>{aqi.level}</span>
                </div>
                <p className="text-xs text-slate-400">{aqi.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Long-Term Exposure Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">
            Prolonged exposure to wildfire smoke can lead to:
          </p>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex gap-2">
              <span className="text-red-400">•</span>
              Chronic respiratory diseases and reduced lung function
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">•</span>
              Increased risk of cardiovascular disease
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">•</span>
              Weakened immune system response
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">•</span>
              Mental health impacts including anxiety and PTSD
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}