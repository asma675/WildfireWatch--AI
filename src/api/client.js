/**
 * Lightweight local data + AI shim so this project can run anywhere (Vite/StackBlitz),
 * without any platform-specific SDKs.
 *
 * Data is stored in localStorage for demo purposes.
 */

const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function uuidv4() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoreKey(entityName) {
  return `wwai:${entityName}`;
}

function readStore(entityName, seed = []) {
  if (typeof localStorage === "undefined") return seed;
  const key = getStoreKey(entityName);
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
}

function writeStore(entityName, rows) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(getStoreKey(entityName), JSON.stringify(rows));
}

function sortRows(rows, sort) {
  if (!sort || typeof sort !== "string") return rows;
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;

  // If field doesn't exist, skip sorting
  if (!rows.length || !(field in rows[0])) return rows;

  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return desc ? 1 : -1;
    if (bv == null) return desc ? -1 : 1;
    if (av > bv) return desc ? -1 : 1;
    if (av < bv) return desc ? 1 : -1;
    return 0;
  });
}

class Entity {
  constructor(name, seed = []) {
    this.name = name;
    this.seed = seed;
  }

  async list(sort, limit = 100) {
    await sleep();
    const rows = readStore(this.name, this.seed);
    const sorted = sortRows(rows, sort);
    return (limit ? sorted.slice(0, limit) : sorted);
  }

  async create(data) {
    await sleep();
    const rows = readStore(this.name, this.seed);
    const now = new Date().toISOString();
    const row = {
      id: uuidv4(),
      created_date: now,
      updated_date: now,
      ...data,
    };
    rows.unshift(row);
    writeStore(this.name, rows);
    return row;
  }

  async update(id, patch) {
    await sleep();
    const rows = readStore(this.name, this.seed);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`${this.name}: record not found`);
    rows[idx] = {
      ...rows[idx],
      ...patch,
      updated_date: new Date().toISOString(),
    };
    writeStore(this.name, rows);
    return rows[idx];
  }

  async delete(id) {
    await sleep();
    const rows = readStore(this.name, this.seed);
    const next = rows.filter((r) => r.id !== id);
    writeStore(this.name, next);
    return { success: true };
  }
}

/** Basic demo data (edit freely) */
// Seed zones to match the Base44 demo UI screenshots (Canada-focused).
// NOTE: risk_* fields are updated when the user runs analysis.
const seedZones = [
  {
    id: "zone_okanagan",
    name: "Okanagan Mountain Park, BC",
    latitude: 49.7619,
    longitude: -119.5453,
    radius_km: 40,
    status: "active",
    risk_score: 91,
    risk_level: "extreme",
    temperature_c: 33.3,
    wind_kmh: 51.5,
    humidity_pct: 9,
    ndvi: 0.21,
    historic_fires: 58,
    ai_summary: "EXTREME RISK: Critical fire danger with dry fuels, low humidity, and strong winds. Prepare for rapid escalation and follow local advisories.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
  {
    id: "zone_vancouver",
    name: "Greater Vancouver Area, BC",
    latitude: 49.2827,
    longitude: -123.1207,
    radius_km: 35,
    status: "active",
    risk_score: 68,
    risk_level: "high",
    temperature_c: 34,
    wind_kmh: 28,
    humidity_pct: 22,
    ndvi: 0.34,
    historic_fires: 16,
    ai_summary: "HIGH RISK: Urban-wildland interface conditions with dry spells and gusty winds. Reduce ignition sources and stay alert for warnings.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
  {
    id: "zone_jasper",
    name: "Jasper National Park, AB",
    latitude: 52.8734,
    longitude: -118.0814,
    radius_km: 30,
    status: "active",
    risk_score: 52,
    risk_level: "moderate",
    temperature_c: 26,
    wind_kmh: 24,
    humidity_pct: 38,
    ndvi: 0.48,
    historic_fires: 9,
    ai_summary: "MODERATE RISK: Seasonal conditions typical for the Rockies. Monitor weather changes and practice campfire safety.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
  {
    id: "zone_banff",
    name: "Banff National Park, AB",
    latitude: 51.4968,
    longitude: -115.9281,
    radius_km: 30,
    status: "active",
    risk_score: 47,
    risk_level: "moderate",
    temperature_c: 24,
    wind_kmh: 19,
    humidity_pct: 41,
    ndvi: 0.51,
    historic_fires: 7,
    ai_summary: "MODERATE RISK: Manageable conditions with periodic wind events. Maintain awareness and follow park restrictions.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
  {
    id: "zone_wood_buffalo",
    name: "Wood Buffalo National Park, AB",
    latitude: 59.2600,
    longitude: -112.1830,
    radius_km: 45,
    status: "active",
    risk_score: 76,
    risk_level: "high",
    temperature_c: 30,
    wind_kmh: 29,
    humidity_pct: 19,
    ndvi: 0.31,
    historic_fires: 22,
    ai_summary: "HIGH RISK: Extended dry conditions and active winds increase ignition potential. Restrict burning and prepare contingency plans.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
  {
    id: "zone_algonquin",
    name: "Algonquin Provincial Park, ON",
    latitude: 45.8370,
    longitude: -78.3647,
    radius_km: 30,
    status: "active",
    risk_score: 30,
    risk_level: "low",
    temperature_c: 18,
    wind_kmh: 12,
    humidity_pct: 55,
    ndvi: 0.80,
    historic_fires: 3,
    ai_summary: "LOW RISK: Cooler temperatures and higher humidity reduce fire spread potential. Continue safe outdoor practices.",
    last_analyzed_at: "2025-01-16T11:30:00.000Z",
  },
];

const seedAlertConfig = [
  { name: "High Risk Alerts", is_active: true, threshold: 70, channels: ["email"] },
];

const seedFireDepartments = [
  // British Columbia
  { name: "BC Wildfire Service", province: "BC", city: "Province-wide", emergency: "911", non_emergency: "1-800-663-5555", tags: ["Wildfire Support"] },
  { name: "Vancouver Fire Rescue Services", province: "BC", city: "Vancouver", emergency: "911", non_emergency: "604-665-6000", tags: ["Emergency Response", "Fire Prevention"] },

  // Alberta
  { name: "Alberta Wildfire", province: "AB", city: "Province-wide", emergency: "911", non_emergency: "310-FIRE (3473)", tags: ["Wildfire Support"] },
  { name: "Calgary Fire Department", province: "AB", city: "Calgary", emergency: "911", non_emergency: "403-268-1010", tags: ["Emergency Response", "Fire Prevention", "Hazmat"] },
  { name: "Edmonton Fire Rescue Services", province: "AB", city: "Edmonton", emergency: "911", non_emergency: "780-442-5000", tags: ["Emergency Response", "Fire Prevention"] },

  // Manitoba
  { name: "Winnipeg Fire Paramedic Service", province: "MB", city: "Winnipeg", emergency: "911", non_emergency: "204-986-6630", tags: ["Emergency Response", "Paramedic Services"] },

  // Ontario
  { name: "Ontario Ministry of Natural Resources", province: "ON", city: "Province-wide", emergency: "911", non_emergency: "1-888-777-8888", tags: ["Wildfire Support"] },
  { name: "Toronto Fire Services", province: "ON", city: "Toronto", emergency: "911", non_emergency: "416-338-9050", tags: ["Emergency Response", "Fire Prevention", "Hazmat"] },
  { name: "Ottawa Fire Services", province: "ON", city: "Ottawa", emergency: "911", non_emergency: "613-580-2857", tags: ["Emergency Response", "Wildfire Support"] },
  { name: "Hamilton Fire Department", province: "ON", city: "Hamilton", emergency: "911", non_emergency: "905-546-2424", tags: ["Emergency Response"] },
  { name: "London Fire Department", province: "ON", city: "London", emergency: "911", non_emergency: "519-661-4560", tags: ["Emergency Response"] },
];

const seedEnvironmentalDamage = [];

const seedAlertHistory = [
  {
    zone_id: "zone_okanagan",
    zone_name: "Okanagan Mountain Park, BC",
    risk_level: "extreme",
    risk_score: 91,
    message: "EXTREME RISK: Okanagan Mountain Park has reached critical fire danger levels. Monitor advisories and prepare for evacuation readiness.",
    created_at: new Date().toISOString(),
    notified_count: 4,
  },
  {
    zone_id: "zone_wood_buffalo",
    zone_name: "Wood Buffalo National Park, AB",
    risk_level: "high",
    risk_score: 76,
    message: "HIGH RISK: Wood Buffalo National Park fire danger elevated. Review mitigation steps and avoid open flames.",
    created_at: new Date().toISOString(),
    notified_count: 4,
  },
  {
    zone_id: "zone_vancouver",
    zone_name: "Greater Vancouver Area, BC",
    risk_level: "high",
    risk_score: 68,
    message: "HIGH RISK: Greater Vancouver Area conditions trending upward. Limit ignition sources and stay alert.",
    created_at: new Date().toISOString(),
    notified_count: 4,
  },
];

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function randomInRange(min, max) { return min + Math.random() * (max - min); }

function canadianLatLng() {
  // Rough Canada bounds
  const lat = randomInRange(42, 68);
  const lng = randomInRange(-140, -52);
  return { latitude: +lat.toFixed(5), longitude: +lng.toFixed(5) };
}

async function invokeLLM({ prompt, response_json_schema }) {
  // Deterministic-ish "AI" for demo. Produces the shapes your UI expects.
  await sleep(450);

  const wantsPredictions =
    JSON.stringify(response_json_schema || {}).includes("predictions") ||
    /predict|predictions|hotspots|heat map/i.test(prompt || "");

  if (wantsPredictions) {
    const predictions = Array.from({ length: 16 }).map(() => {
      const { latitude, longitude } = canadianLatLng();
      const risk_score = +randomInRange(55, 92).toFixed(1);
      const reason = risk_score > 80
        ? "High wind + dry vegetation + proximity to recent fire activity"
        : "Elevated seasonal risk based on vegetation and climate patterns";
      return { latitude, longitude, risk_score, reason };
    });
    return { predictions };
  }

  // Zone analysis response
  const risk_score = +randomInRange(25, 95).toFixed(1);
  const risk_level =
    risk_score >= 85 ? "extreme" :
    risk_score >= 70 ? "high" :
    risk_score >= 45 ? "moderate" : "low";

  const temp = +randomInRange(14, 36).toFixed(1);
  const wind = +randomInRange(5, 45).toFixed(1);
  const humidity = +randomInRange(10, 65).toFixed(1);

  const vegetation_index = +randomInRange(0.18, 0.75).toFixed(2);
  const historical_fires = Math.floor(randomInRange(0, 18));

  const analysis_summary =
    `Simulated assessment based on location context. Key drivers: ` +
    `${wind > 25 ? "higher winds, " : ""}` +
    `${humidity < 25 ? "low humidity, " : ""}` +
    `${vegetation_index < 0.35 ? "dry fuels, " : "moderate fuels, "}` +
    `${historical_fires > 8 ? "frequent historical activity." : "some historical activity."} ` +
    `Recommendations: monitor wind shifts, maintain defensible space, and prepare for rapid escalation if conditions worsen.`;

  return {
    risk_score,
    risk_level,
    vegetation_index,
    historical_fires,
    weather_conditions: { temp, wind, humidity },
    analysis_summary,
  };
}

export const apiClient = {
  entities: {
    MonitoredZone: new Entity("MonitoredZone", seedZones),
    AlertConfig: new Entity("AlertConfig", seedAlertConfig),
    AlertHistory: new Entity("AlertHistory", seedAlertHistory),
    FireDepartment: new Entity("FireDepartment", seedFireDepartments),
    EnvironmentalDamage: new Entity("EnvironmentalDamage", seedEnvironmentalDamage),

    // Included for completeness (not all are used in UI)
    HistoricalFire: new Entity("HistoricalFire", []),
    AirQuality: new Entity("AirQuality", []),
  },
  ai: {
    invokeLLM,
  },

  jobs: {
    async analyzeZones() {
      // Recalculate risk for all monitored zones (demo implementation)
      const zones = await apiClient.entities.MonitoredZone.list("-created_date", 200);

      for (const z of zones) {
        const analysis = await apiClient.ai.invokeLLM({ prompt: `Analyze wildfire risk for ${z.name}` });

        await apiClient.entities.MonitoredZone.update(z.id, {
          risk_score: analysis.risk_score,
          risk_level: analysis.risk_level,
          weather_conditions: analysis.weather_conditions,
          vegetation_index: analysis.vegetation_index,
          historical_fires: analysis.historical_fires,
          analysis_summary: analysis.analysis_summary,
          last_analyzed: new Date().toISOString(),
        });

        if (analysis.risk_level === "high" || analysis.risk_level === "extreme") {
          await apiClient.entities.AlertHistory.create({
            zone_id: z.id,
            zone_name: z.name,
            risk_level: analysis.risk_level,
            risk_score: analysis.risk_score,
            message: `${analysis.risk_level.toUpperCase()} RISK: ${z.name} risk score ${analysis.risk_score}.`,
            status: "created",
          });
        }
      }

      return { success: true };
    },
  },
};
