import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { 
  Plus, 
  Loader2, 
  Bell, 
  Building2, 
  Phone,
  Mail,
  Trash2,
  Edit2,
  MoreVertical,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AlertItem from '@/components/dashboard/AlertItem';
import { cn } from "@/lib/utils";

export default function Alerts() {
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['alertConfigs'],
    queryFn: () => apiClient.entities.AlertConfig.list('-created_date', 50),
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['alertHistory'],
    queryFn: () => apiClient.entities.AlertHistory.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.AlertConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.AlertConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
      setShowForm(false);
      setEditingConfig(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.AlertConfig.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }) => apiClient.entities.AlertConfig.update(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
    },
  });

  const isLoading = configsLoading || historyLoading;

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
          <h1 className="text-2xl font-bold text-white">Alert Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure SMS alerts for emergency organizations</p>
        </div>
        <Button 
          onClick={() => {
            setEditingConfig(null);
            setShowForm(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      <Tabs defaultValue="recipients" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-white/5">
          <TabsTrigger value="recipients" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Recipients
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Alert History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipients" className="space-y-4">
          {configs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className={cn(
                    "rounded-2xl border p-5 transition-all",
                    config.is_active 
                      ? "bg-slate-800/30 border-white/10" 
                      : "bg-slate-900/50 border-white/5 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        config.is_active ? "bg-amber-500/10" : "bg-slate-800"
                      )}>
                        <Building2 className={cn(
                          "w-5 h-5",
                          config.is_active ? "text-amber-500" : "text-slate-500"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{config.organization_name}</h3>
                        {config.contact_name && (
                          <p className="text-sm text-slate-500">{config.contact_name}</p>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingConfig(config);
                            setShowForm(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMutation.mutate(config.id)}
                          className="text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Phone className="w-4 h-4" />
                      {config.phone_number}
                    </div>
                    {config.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail className="w-4 h-4" />
                        {config.email}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn(
                        "w-4 h-4",
                        config.alert_threshold === 'extreme' ? "text-red-400" :
                        config.alert_threshold === 'high' ? "text-orange-400" : "text-amber-400"
                      )} />
                      <span className="text-sm text-slate-400 capitalize">
                        {config.alert_threshold}+ alerts
                      </span>
                    </div>
                    
                    <Switch
                      checked={config.is_active}
                      onCheckedChange={(checked) => 
                        toggleActiveMutation.mutate({ id: config.id, is_active: checked })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No alert recipients</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Add emergency organizations to receive SMS alerts when wildfire risk levels are elevated.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Recipient
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-12 text-center">
              <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No alerts sent yet</h3>
              <p className="text-slate-400">Alerts will appear here when risk levels trigger notifications.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Recipient' : 'Add Alert Recipient'}
            </DialogTitle>
          </DialogHeader>
          <AlertConfigForm
            initialData={editingConfig}
            onSubmit={(data) => {
              if (editingConfig) {
                updateMutation.mutate({ id: editingConfig.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingConfig(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlertConfigForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialData || {
    organization_name: '',
    contact_name: '',
    phone_number: '',
    email: '',
    alert_threshold: 'high',
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label className="text-slate-300">Organization Name *</Label>
        <Input
          value={formData.organization_name}
          onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
          placeholder="e.g., County Fire Department"
          className="mt-1.5 bg-slate-800/50 border-slate-700"
          required
        />
      </div>

      <div>
        <Label className="text-slate-300">Contact Name</Label>
        <Input
          value={formData.contact_name}
          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
          placeholder="e.g., John Smith"
          className="mt-1.5 bg-slate-800/50 border-slate-700"
        />
      </div>

      <div>
        <Label className="text-slate-300">Phone Number *</Label>
        <Input
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="+1 (555) 123-4567"
          className="mt-1.5 bg-slate-800/50 border-slate-700"
          required
        />
      </div>

      <div>
        <Label className="text-slate-300">Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="alert@department.gov"
          className="mt-1.5 bg-slate-800/50 border-slate-700"
        />
      </div>

      <div>
        <Label className="text-slate-300">Alert Threshold</Label>
        <Select
          value={formData.alert_threshold}
          onValueChange={(value) => setFormData({ ...formData, alert_threshold: value })}
        >
          <SelectTrigger className="mt-1.5 bg-slate-800/50 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="moderate">Moderate & Above</SelectItem>
            <SelectItem value="high">High & Above</SelectItem>
            <SelectItem value="extreme">Extreme Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500 mt-1">
          Receive alerts when risk reaches this level or higher
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Label className="text-slate-300">Active</Label>
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
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
            initialData ? 'Update' : 'Add Recipient'
          )}
        </Button>
      </div>
    </form>
  );
}