import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Loader2 } from 'lucide-react';

export default function ZoneForm({ onSubmit, onCancel, initialData, isLoading }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    latitude: 37.7749,
    longitude: -122.4194,
    radius_km: 20,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      radius_km: parseFloat(formData.radius_km),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-slate-300">Zone Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Northern California Forest"
          className="mt-1.5 bg-slate-800/50 border-slate-700 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude" className="text-slate-300">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-slate-300">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Monitoring Radius: {formData.radius_km} km</Label>
        <Slider
          value={[formData.radius_km]}
          onValueChange={([value]) => setFormData({ ...formData, radius_km: value })}
          min={5}
          max={100}
          step={5}
          className="mt-3"
        />
        <p className="text-xs text-slate-500 mt-1">Area covered: ~{Math.round(Math.PI * formData.radius_km * formData.radius_km)} km²</p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              {initialData ? 'Update Zone' : 'Add Zone'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}