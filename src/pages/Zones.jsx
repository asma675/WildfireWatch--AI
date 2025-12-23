import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, 
  Loader2, 
  MapPin, 
  Trash2, 
  Edit2, 
  Eye,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ZoneForm from '@/components/zones/ZoneForm';
import ZoneCard from '@/components/dashboard/ZoneCard';

export default function Zones() {
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [deleteZone, setDeleteZone] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: zones = [], isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: () => apiClient.entities.MonitoredZone.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.MonitoredZone.create({
      ...data,
      status: 'active',
      risk_level: 'unknown',
      risk_score: 0,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.MonitoredZone.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      setShowForm(false);
      setEditingZone(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.MonitoredZone.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      setDeleteZone(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitored Zones</h1>
          <p className="text-slate-500 text-sm mt-1">Add and manage geographic areas for wildfire monitoring</p>
        </div>
        <Button 
          onClick={() => {
            setEditingZone(null);
            setShowForm(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Zones Grid */}
      {zones.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="relative group">
              <ZoneCard zone={zone} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 hover:bg-slate-800"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={createPageUrl(`RiskMap?zone=${zone.id}`)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      View on Map
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleEdit(zone)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteZone(zone)}
                    className="flex items-center gap-2 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No zones yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Start monitoring wildfire risk by adding geographic zones. Each zone will be analyzed for fire threats using satellite data and AI.
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Zone
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingZone ? 'Edit Zone' : 'Add New Zone'}
            </DialogTitle>
          </DialogHeader>
          <ZoneForm
            initialData={editingZone}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingZone(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteZone} onOpenChange={() => setDeleteZone(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Zone</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete "{deleteZone?.name}"? This action cannot be undone and all historical data for this zone will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteZone.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}