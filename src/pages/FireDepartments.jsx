import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Phone, MapPin, Building2, Search, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FireDepartments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['fireDepartments'],
    queryFn: () => apiClient.entities.FireDepartment.list('province', 100),
  });

  const provinces = ['all', ...new Set(departments.map(d => d.province))];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvince === 'all' || dept.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  const groupedByProvince = filteredDepartments.reduce((acc, dept) => {
    if (!acc[dept.province]) acc[dept.province] = [];
    acc[dept.province].push(dept);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Fire Departments</h1>
        <p className="text-slate-400">Emergency contacts by province</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-white/10"
            />
          </div>
        </div>
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger className="w-[200px] bg-slate-800 border-white/10">
            <SelectValue placeholder="All Provinces" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map(province => (
              <SelectItem key={province} value={province}>
                {province === 'all' ? 'All Provinces' : province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Departments by Province */}
      {Object.keys(groupedByProvince).length === 0 ? (
        <Card className="bg-slate-800/50 border-white/10">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400">No fire departments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByProvince).map(([province, depts]) => (
            <div key={province}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                {province}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {depts.map((dept) => (
                  <Card key={dept.id} className="bg-slate-800/50 border-white/10 hover:border-amber-500/30 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{dept.city}, {dept.province}</span>
                      </div>
                      
                      {dept.emergency_line && (
                        <a 
                          href={`tel:${dept.emergency_line}`}
                          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-red-400" />
                          <div className="flex-1">
                            <div className="text-xs text-red-400 font-medium">EMERGENCY</div>
                            <div className="text-sm text-white font-semibold">{dept.emergency_line}</div>
                          </div>
                        </a>
                      )}
                      
                      <a 
                        href={`tel:${dept.phone}`}
                        className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <div className="text-xs text-slate-500">Non-Emergency</div>
                          <div className="text-sm text-slate-200">{dept.phone}</div>
                        </div>
                      </a>

                      {dept.services && dept.services.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {dept.services.map((service, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}