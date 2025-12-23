import React from "react";
import { Shield, AlertTriangle, Home, Users, Phone, MapPin, ExternalLink } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
      <h2 className="text-white font-semibold text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function FireSafety() {
  const beforeSteps = [
    { icon: Home, title: "Create Defensible Space", desc: "Clear vegetation ~30m from your home where possible" },
    { icon: MapPin, title: "Know Evacuation Routes", desc: "Plan multiple routes and meeting locations" },
    { icon: Users, title: "Prepare Emergency Kit", desc: "Water, food, meds, documents for 72 hours" },
    { icon: Phone, title: "Emergency Contacts", desc: "Keep local emergency numbers and family contacts" },
  ];

  const duringSteps = [
    "Monitor official alerts and local emergency updates",
    "Close windows/doors/vents to reduce ember intrusion",
    "Turn on exterior lights for visibility in smoke",
    "Move flammable items away from windows",
    "Fill sinks/bathtubs with water if time permits",
    "Evacuate immediately when ordered — don’t delay",
  ];

  const afterSteps = [
    "Wait for official clearance before returning",
    "Watch for hot spots and smoldering materials",
    "Document damage with photos for insurance",
    "Wear protective gear when cleaning ash/debris",
    "Check air quality before extended outdoor exposure",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-red-500/10">
          <Shield className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Wildfire Safety Guide</h1>
          <p className="text-slate-400">Critical information to protect yourself and your family</p>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-5">
        <div className="flex items-center gap-2 mb-3 text-red-300 font-semibold">
          <AlertTriangle className="w-5 h-5" />
          Emergency Contacts
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg ring-1 ring-white/10">
            <span className="text-slate-300">Emergency Services</span>
            <a href="tel:911" className="text-2xl font-bold text-red-400">911</a>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg ring-1 ring-white/10">
            <span className="text-slate-300">Fire Information Line</span>
            <span className="font-semibold text-slate-200">1-888-336-7378</span>
          </div>
        </div>
      </div>

      <Section title="Before a Wildfire">
        <div className="grid sm:grid-cols-2 gap-4">
          {beforeSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex gap-3 p-4 bg-black/20 rounded-lg ring-1 ring-white/10">
                <div className="p-2 rounded-lg bg-amber-500/10 h-fit">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="During a Wildfire">
        <ul className="space-y-3">
          {duringSteps.map((step, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="After a Wildfire">
        <ul className="space-y-3">
          {afterSteps.map((step, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Additional Resources">
        <div className="space-y-3">
          <a
            href="https://www.canada.ca/en/services/environment/weather/wildfire.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-black/20 rounded-lg ring-1 ring-white/10 hover:bg-black/30 transition"
          >
            <span className="text-slate-300">Government of Canada — Wildfires</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>

          <a
            href="https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/wildfires"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-black/20 rounded-lg ring-1 ring-white/10 hover:bg-black/30 transition"
          >
            <span className="text-slate-300">Canadian Red Cross — Wildfire Safety</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>
      </Section>
    </div>
  );
}
