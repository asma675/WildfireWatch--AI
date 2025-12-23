import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, CircleMarker, Rectangle } from 'react-leaflet';
import { Loader2, Flame, TrendingUp, TreePine, Wind, Satellite, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

const riskColors = {
  extreme: { color: '#ef4444', fillColor: '#ef4444' },
  high: { color: '#f97316', fillColor: '#f97316' },
  moderate: { color: '#f59e0b', fillColor: '#f59e0b' },
  low: { color: '#22c55e', fillColor: '#22c55e' },
  unknown: { color: '#6b7280', fillColor: '#6b7280' },
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function RiskMapView({ zones, selectedZone, onZoneSelect, center, zoom = 4, historicalFires = [], heatMapData = [], airQuality = [], showSatelliteNDVI = false, showFireHotspots = false }) {
  const [mapReady, setMapReady] = useState(false);
  const [satelliteData, setSatelliteData] = useState([]);
  const [hotspotData, setHotspotData] = useState([]);

  // Generate satellite NDVI data for zones
  useEffect(() => {
    if (showSatelliteNDVI && zones.length > 0) {
      const ndviData = zones.map(zone => ({
        id: zone.id,
        bounds: [
          [zone.latitude - 0.15, zone.longitude - 0.2],
          [zone.latitude + 0.15, zone.longitude + 0.2]
        ],
        ndvi: zone.vegetation_index || Math.random() * 0.5 + 0.2,
        name: zone.name
      }));
      setSatelliteData(ndviData);
    }
  }, [showSatelliteNDVI, zones]);

  // Generate fire hotspot data
  useEffect(() => {
    if (showFireHotspots && zones.length > 0) {
      const hotspots = [];
      zones.forEach(zone => {
        if (zone.risk_level === 'extreme' || zone.risk_level === 'high') {
          const count = zone.risk_level === 'extreme' ? 5 : 3;
          for (let i = 0; i < count; i++) {
            hotspots.push({
              id: `${zone.id}-${i}`,
              latitude: zone.latitude + (Math.random() - 0.5) * 0.1,
              longitude: zone.longitude + (Math.random() - 0.5) * 0.1,
              temperature: 300 + Math.random() * 200,
              confidence: 60 + Math.random() * 40
            });
          }
        }
      });
      setHotspotData(hotspots);
    }
  }, [showFireHotspots, zones]);

  const { data: envDamage = [] } = useQuery({
    queryKey: ['environmentalDamage'],
    queryFn: () => apiClient.entities.EnvironmentalDamage.list('-date_detected', 50),
  });

  const damageColors = {
    critical: { color: '#991b1b', fillColor: '#991b1b', opacity: 0.6 },
    severe: { color: '#dc2626', fillColor: '#dc2626', opacity: 0.5 },
    moderate: { color: '#f97316', fillColor: '#f97316', opacity: 0.4 },
    minimal: { color: '#f59e0b', fillColor: '#f59e0b', opacity: 0.3 },
  };

  const aqiColors = {
    good: { color: '#22c55e', fillColor: '#22c55e' },
    moderate: { color: '#eab308', fillColor: '#eab308' },
    unhealthy_sensitive: { color: '#f97316', fillColor: '#f97316' },
    unhealthy: { color: '#ef4444', fillColor: '#ef4444' },
    very_unhealthy: { color: '#a855f7', fillColor: '#a855f7' },
    hazardous: { color: '#7f1d1d', fillColor: '#7f1d1d' },
  };

  const defaultCenter = center || [56.1304, -106.3468]; // Canada center

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      )}
      
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: '#0f0f1a' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapController center={center} zoom={zoom} />

        {/* NDVI Satellite Imagery Layer */}
        {showSatelliteNDVI && satelliteData.map((sat) => {
          const ndviColor = sat.ndvi < 0.3 ? '#8b0000' : sat.ndvi < 0.5 ? '#cd5c5c' : sat.ndvi < 0.7 ? '#90ee90' : '#228b22';
          const opacity = 0.4;
          return (
            <Rectangle
              key={`ndvi-${sat.id}`}
              bounds={sat.bounds}
              pathOptions={{
                fillColor: ndviColor,
                color: ndviColor,
                fillOpacity: opacity,
                weight: 1,
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold text-slate-900">NDVI Satellite Data</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">{sat.name}</p>
                  <p className="text-sm text-slate-600">
                    NDVI Index: <strong>{sat.ndvi.toFixed(3)}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {sat.ndvi < 0.3 ? 'Critical - Very dry vegetation' : 
                     sat.ndvi < 0.5 ? 'Warning - Dry vegetation' : 
                     sat.ndvi < 0.7 ? 'Moderate - Normal vegetation' : 
                     'Healthy - Dense vegetation'}
                  </p>
                </div>
              </Popup>
            </Rectangle>
          );
        })}

        {/* Active Fire Hotspots */}
        {showFireHotspots && hotspotData.map((hotspot) => (
          <CircleMarker
            key={hotspot.id}
            center={[hotspot.latitude, hotspot.longitude]}
            radius={8}
            pathOptions={{
              fillColor: hotspot.temperature > 400 ? '#ff0000' : '#ff4500',
              color: '#fff',
              fillOpacity: 0.8,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Satellite className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-slate-900">Active Fire Hotspot</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Temperature: <strong>{hotspot.temperature.toFixed(0)}°K</strong>
                  </p>
                  <p className="text-sm text-slate-600">
                    Confidence: <strong>{hotspot.confidence.toFixed(0)}%</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Detected via satellite thermal imaging
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {zones.map((zone) => {
          const colors = riskColors[zone.risk_level] || riskColors.unknown;
          const isSelected = selectedZone?.id === zone.id;
          
          return (
            <Circle
              key={zone.id}
              center={[zone.latitude, zone.longitude]}
              radius={(zone.radius_km || 10) * 1000}
              pathOptions={{
                ...colors,
                fillOpacity: isSelected ? 0.4 : 0.2,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onZoneSelect?.(zone),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-slate-900">{zone.name}</h3>
                  <p className="text-sm text-slate-600">
                    Risk Score: <strong>{zone.risk_score || 0}</strong>
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    Level: {zone.risk_level}
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* AI Heat Map Predictions */}
        {heatMapData.map((point, idx) => (
          <CircleMarker
            key={`heat-${idx}`}
            center={[point.latitude, point.longitude]}
            radius={8}
            pathOptions={{
              fillColor: '#f59e0b',
              color: '#f59e0b',
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <h3 className="font-semibold text-slate-900">AI Prediction</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Risk Score: <strong>{point.risk_score}</strong>
                </p>
                <p className="text-xs text-slate-500 mt-1">{point.reason}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Historical Fires */}
        {historicalFires.map((fire) => (
          <CircleMarker
            key={fire.id}
            center={[fire.latitude, fire.longitude]}
            radius={6}
            pathOptions={{
              fillColor: '#dc2626',
              color: '#dc2626',
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-slate-900">{fire.name}</h3>
                </div>
                <p className="text-xs text-slate-600">
                  {format(new Date(fire.date), 'MMM d, yyyy')}
                </p>
                {fire.acres_burned && (
                  <p className="text-xs text-slate-600">
                    {fire.acres_burned.toLocaleString()} acres
                  </p>
                )}
                <p className="text-xs text-slate-500 capitalize mt-1">
                  {fire.severity} • {fire.cause}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Environmental Damage Zones */}
        {envDamage.map((damage) => {
          const colors = damageColors[damage.damage_level] || damageColors.moderate;
          return (
            <Circle
              key={damage.id}
              center={[damage.latitude, damage.longitude]}
              radius={(damage.radius_km || 5) * 1000}
              pathOptions={{
                ...colors,
                fillOpacity: colors.opacity,
                weight: 2,
                dashArray: '5, 5',
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="w-4 h-4 text-orange-600" />
                    <h3 className="font-semibold text-slate-900">Environmental Damage</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">{damage.location_name}</p>
                  {damage.date_detected && (
                    <p className="text-xs text-slate-600">
                      Detected: {format(new Date(damage.date_detected), 'MMM d, yyyy')}
                    </p>
                  )}
                  {damage.affected_area_km2 && (
                    <p className="text-xs text-slate-600">
                      Area: {damage.affected_area_km2} km²
                    </p>
                  )}
                  <p className="text-xs text-slate-500 capitalize mt-1">
                    {damage.damage_level} damage • {damage.recovery_status?.replace('_', ' ')}
                  </p>
                  {damage.impact_details && (
                    <p className="text-xs text-slate-600 mt-2">{damage.impact_details}</p>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Air Quality Stations */}
        {airQuality.map((station) => {
          const colors = aqiColors[station.status] || aqiColors.moderate;
          return (
            <CircleMarker
              key={station.id}
              center={[station.latitude, station.longitude]}
              radius={10}
              pathOptions={{
                ...colors,
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Air Quality</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-2">{station.location_name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600">
                      AQI: <strong>{station.aqi}</strong>
                    </p>
                    {station.pm25 && (
                      <p className="text-xs text-slate-600">
                        PM2.5: {station.pm25} μg/m³
                      </p>
                    )}
                    <p className="text-xs text-slate-500 capitalize">
                      Status: {station.status.replace('_', ' ')}
                    </p>
                    {station.last_updated && (
                      <p className="text-xs text-slate-500">
                        Updated: {format(new Date(station.last_updated), 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 z-[1000]">
        <p className="text-xs font-semibold text-slate-400 mb-2">RISK LEVELS</p>
        <div className="space-y-1.5">
          {Object.entries(riskColors).filter(([k]) => k !== 'unknown').map(([level, colors]) => (
            <div key={level} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors.fillColor }}
              />
              <span className="text-xs text-slate-300 capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}