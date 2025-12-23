import React, { useMemo, useState } from "react";

const DATA = [
  { province: "Alberta", name: "Calgary Fire Department", city: "Calgary, Alberta", emergency: "911", nonEmergency: "403-268-1010", tags: ["Emergency Response", "Fire Prevention", "Hazmat"] },
  { province: "Alberta", name: "Edmonton Fire Rescue Services", city: "Edmonton, Alberta", emergency: "911", nonEmergency: "780-442-5000", tags: ["Emergency Response", "Fire Prevention"] },
  { province: "British Columbia", name: "Vancouver Fire Rescue Services", city: "Vancouver, British Columbia", emergency: "911", nonEmergency: "604-665-6000", tags: ["Emergency Response", "Wildfire Support"] },
  { province: "Manitoba", name: "Winnipeg Fire Paramedic Service", city: "Winnipeg, Manitoba", emergency: "911", nonEmergency: "204-986-6630", tags: ["Emergency Response", "Paramedic Services"] },
  { province: "Ontario", name: "Toronto Fire Services", city: "Toronto, Ontario", emergency: "911", nonEmergency: "416-338-9050", tags: ["Emergency Response", "Fire Prevention", "Hazmat"] },
  { province: "Ontario", name: "Ottawa Fire Services", city: "Ottawa, Ontario", emergency: "911", nonEmergency: "613-580-2857", tags: ["Emergency Response", "Wildfire Support"] },
  { province: "Ontario", name: "Hamilton Fire Department", city: "Hamilton, Ontario", emergency: "911", nonEmergency: "905-546-4925", tags: ["Emergency Response"] },
  { province: "Ontario", name: "London Fire Department", city: "London, Ontario", emergency: "911", nonEmergency: "519-661-2489", tags: ["Emergency Response"] },
];

// phone helper: keeps only digits for tel:
const toTel = (s) => "tel:" + String(s).replace(/[^\d+]/g, "");

export default function FireDepartments() {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("All Provinces");

  const provinces = useMemo(
    () => ["All Provinces", ...Array.from(new Set(DATA.map((d) => d.province)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((d) => {
      const matchesQ = !q || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
      const matchesP = province === "All Provinces" || d.province === province;
      return matchesQ && matchesP;
    });
  }, [query, province]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of filtered) {
      if (!map.has(item.province)) map.set(item.province, []);
      map.get(item.province).push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Fire Departments</h2>
        <p className="text-slate-400 text-sm mt-1">Emergency contacts by province</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or city..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
        />

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          {provinces.map((p) => (
            <option key={p} value={p} className="bg-slate-900 text-white">
              {p}
            </option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center">
          <div className="text-white font-semibold">No results</div>
          <div className="text-slate-400 text-sm mt-1">Try a different search or select “All Provinces”.</div>
        </div>
      ) : (
        grouped.map(([prov, items]) => (
          <div key={prov} className="space-y-3">
            <div className="text-lg font-semibold text-amber-300">{prov}</div>

            <div className="grid md:grid-cols-2 gap-4">
              {items.map((d) => (
                <div key={d.name} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="text-sm font-semibold text-white">{d.name}</div>
                  <div className="text-xs text-slate-400 mt-2">📍 {d.city}</div>

                  <a
                    href="tel:911"
                    className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 flex items-center justify-between hover:bg-red-500/15 transition"
                  >
                    <div className="text-xs text-red-300">EMERGENCY</div>
                    <div className="text-red-200 font-semibold">{d.emergency}</div>
                  </a>

                  <div className="mt-3 text-sm text-slate-200">☎ Non-Emergency</div>
                  <a
                    href={toTel(d.nonEmergency)}
                    className="text-slate-300 text-sm hover:text-white underline decoration-white/20 hover:decoration-white/50"
                  >
                    {d.nonEmergency}
                  </a>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
