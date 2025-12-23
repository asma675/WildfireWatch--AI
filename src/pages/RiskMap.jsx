import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Loader2, X, Flame, Sparkles, Wind, Satellite, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import RiskMapView from '@/components/map/RiskMapView';
import AnalysisPanel from '@/components/zones/AnalysisPanel';
import { cn } from "@/lib/utils";

export default function RiskMap() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showHistoricalFires, setShowHistoricalFires] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [showSatelliteNDVI, setShowSatelliteNDVI] = useState(false);
  const [showFireHotspots, setShowFireHotspots] = useState(false);
  const [heatMapData, setHeatMapData] = useState([]);
  const [isGeneratingHeatMap, setIsGeneratingHeatMap] = useState(false);

  const { data: zones = [], isLoading, refetch } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.entities.MonitoredZone.list('-risk_score', 100),
  });

  const { data: historicalFires = [] } = useQuery({
    queryKey: ['historicalFires'],
    queryFn: () => apiClient.entities.HistoricalFire.list('-date', 100),
  });

  const { data: airQuality = [] } = useQuery({
    queryKey: ['airQuality'],
    queryFn: () => apiClient.entities.AirQuality.list('-last_updated', 50),
  });

  // Check URL for zone parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const zoneId = urlParams.get('zone');
    if (zoneId && zones.length > 0) {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        setSelectedZone(zone);
        setPanelOpen(true);
      }
    }
  }, [zones]);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    setPanelOpen(true);
  };

  const generateHeatMap = async () => {
    setIsGeneratingHeatMap(true);
    try {
      const result = await apiClient.ai.invokeLLM({
        prompt: `Based on the following monitored zones in Canada, predict 15-20 additional high-risk wildfire areas using AI analysis:

Existing zones: ${zones.map(z => `${z.name} (${z.latitude}, ${z.longitude})`).join(', ')}

Consider:
- Proximity to existing high-risk zones
- Typical Canadian wildfire-prone regions (BC, Alberta, Saskatchewan forests)
- Seasonal fire patterns
- Vegetation and climate zones

Generate realistic coordinates for potential fire risk hotspots across Canada.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                  risk_score: { type: "number" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setHeatMapData(result.predictions || []);
    } catch (error) {
      console.error('Heat map generation failed:', error);
    } finally {
      setIsGeneratingHeatMap(false);
    }
  };

  const handleAnalyze = async (zone) => {
    setIsAnalyzing(true);
    
    try {
      // Use AI to analyze the zone
      const analysis = await apiClient.ai.invokeLLM({
        prompt: `Analyze wildfire risk for the following location and provide a comprehensive risk assessment:

Location: ${zone.name}
Coordinates: ${zone.latitude}°N, ${zone.longitude}°W
Monitoring Radius: ${zone.radius_km} km

Based on typical conditions for this geographic area, simulate realistic data for:
1. Current weather conditions (temperature, wind speed, humidity)
2. Vegetation dryness index (NDVI scale 0-1, where lower is drier)
3. Historical fire frequency in the area
4. Current risk score (0-100)

Consider factors like:
- Time of year and seasonal patterns
- Geographic terrain and vegetation type
- Typical weather patterns for the region
- Historical wildfire data for similar areas

Provide a detailed risk analysis summary explaining the key risk factors and recommendations.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            risk_score: { type: "number" },
            risk_level: { type: "string", enum: ["low", "moderate", "high", "extreme"] },
            vegetation_index: { type: "number" },
            historical_fires: { type: "number" },
            weather_conditions: {
              type: "object",
              properties: {
                temp: { type: "number" },
                wind: { type: "number" },
                humidity: { type: "number" }
              }
            },
            analysis_summary: { type: "string" }
          }
        }
      });

      // Update the zone with analysis results
      await apiClient.entities.MonitoredZone.update(zone.id, {
        ...analysis,
        last_analysis: new Date().toISOString(),
      });

      // Check if we need to create an alert
      if (analysis.risk_level === 'extreme' || analysis.risk_level === 'high') {
        await apiClient.entities.AlertHistory.create({
          zone_id: zone.id,
          zone_name: zone.name,
          alert_level: analysis.risk_level,
          risk_score: analysis.risk_score,
          message: `${analysis.risk_level.toUpperCase()} RISK: ${zone.name} has a risk score of ${analysis.risk_score}. ${analysis.analysis_summary?.substring(0, 200)}...`,
          status: 'sent',
          recipients_notified: 0,
        });
      }

      await refetch();
      
      // Update selected zone with new data
      setSelectedZone({
        ...zone,
        ...analysis,
        last_analysis: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const mapCenter = selectedZone 
    ? [selectedZone.latitude, selectedZone.longitude] 
    : zones.length > 0 
      ? [zones[0].latitude, zones[0].longitude]
      : [56.1304, -106.3468]; // Canada center as fallback

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Risk Heat Map</h1>
          <p className="text-slate-500 text-sm">{zones.length} zones monitored</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <Switch
              checked={showHeatMap}
              onCheckedChange={setShowHeatMap}
            />
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-300">AI Predictions</span>
          </div>
          
          {showHeatMap && heatMapData.length === 0 && (
            <Button
              onClick={generateHeatMap}
              disabled={isGeneratingHeatMap}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isGeneratingHeatMap ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Heat Map</>
              )}
            </Button>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <Switch
              checked={showHistoricalFires}
              onCheckedChange={setShowHistoricalFires}
            />
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-300">Past Fires</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <Switch
              checked={showAirQuality}
              onCheckedChange={setShowAirQuality}
            />
            <Wind className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Air Quality</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <Switch
              checked={showSatelliteNDVI}
              onCheckedChange={setShowSatelliteNDVI}
            />
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">NDVI Imagery</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <Switch
              checked={showFireHotspots}
              onCheckedChange={setShowFireHotspots}
            />
            <Satellite className="w-4 h-4 text-red-400" />
            <span className="text-sm text-slate-300">Fire Hotspots</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1 lg:flex-[2]">
          <RiskMapView
            zones={zones}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            center={mapCenter}
            zoom={selectedZone ? 8 : 4}
            historicalFires={showHistoricalFires ? historicalFires : []}
            heatMapData={showHeatMap ? heatMapData : []}
            airQuality={showAirQuality ? airQuality : []}
            showSatelliteNDVI={showSatelliteNDVI}
            showFireHotspots={showFireHotspots}
          />
        </div>

        {/* Analysis Panel */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 w-full h-[70vh] sm:w-96 sm:inset-y-0 sm:left-auto lg:relative lg:w-96 xl:w-[400px] bg-slate-900/95 backdrop-blur-xl border-t sm:border-l sm:border-t-0 border-white/5 p-6 transition-all duration-300 rounded-t-3xl sm:rounded-none lg:rounded-2xl overflow-auto",
          panelOpen ? "translate-y-0 sm:translate-x-0 z-50" : "translate-y-full sm:translate-x-full lg:translate-y-0 lg:translate-x-0"
        )}>
          {/* Drag Handle for Mobile */}
          <div className="flex justify-center lg:hidden mb-4">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPanelOpen(false);
              setSelectedZone(null);
            }}
            className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <AnalysisPanel
            zone={selectedZone}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}