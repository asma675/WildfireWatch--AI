import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import RiskMap from "./pages/RiskMap";
import Zones from "./pages/Zones";
import Alerts from "./pages/Alerts";
import FireSafety from "./pages/FireSafety";
import FireDepartments from "./pages/FireDepartments";
import HealthImpact from "./pages/HealthImpact";

function usePageName(pathname) {
  const p = pathname.toLowerCase();
  if (p.includes("riskmap")) return "RiskMap";
  if (p.includes("zones")) return "Zones";
  if (p.includes("alerts")) return "Alerts";
  if (p.includes("firesafety")) return "FireSafety";
  if (p.includes("firedepartments")) return "FireDepartments";
  if (p.includes("healthimpact")) return "HealthImpact";
  return "Dashboard";
}

export default function App() {
  const { pathname } = useLocation();
  const page = usePageName(pathname);

  return (
    <Layout currentPageName={page}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/RiskMap" element={<RiskMap />} />
        <Route path="/Zones" element={<Zones />} />
        <Route path="/Alerts" element={<Alerts />} />
        <Route path="/FireSafety" element={<FireSafety />} />
        <Route path="/FireDepartments" element={<FireDepartments />} />
        <Route path="/HealthImpact" element={<HealthImpact />} />
      </Routes>
    </Layout>
  );
}
