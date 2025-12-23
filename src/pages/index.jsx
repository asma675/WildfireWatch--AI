import Layout from "./Layout.jsx";

import Alerts from "./Alerts";

import Dashboard from "./Dashboard";

import FireDepartments from "./FireDepartments";

import FireSafety from "./FireSafety";

import HealthImpact from "./HealthImpact";

import RiskMap from "./RiskMap";

import Zones from "./Zones";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Keep Dashboard first so "default page" logic lands there.
const PAGES = {
    
    Dashboard: Dashboard,
    
    Alerts: Alerts,
    
    FireDepartments: FireDepartments,
    
    FireSafety: FireSafety,
    
    HealthImpact: HealthImpact,
    
    RiskMap: RiskMap,
    
    Zones: Zones,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                {/* Default landing page */}
                <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Alerts" element={<Alerts />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/FireDepartments" element={<FireDepartments />} />
                
                <Route path="/FireSafety" element={<FireSafety />} />
                
                <Route path="/HealthImpact" element={<HealthImpact />} />
                
                <Route path="/RiskMap" element={<RiskMap />} />
                
                <Route path="/Zones" element={<Zones />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}