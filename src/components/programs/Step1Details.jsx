
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Step1Details({ data, onDataChange }) {
  const handleChange = (key, value) => {
    onDataChange({ [key]: value });
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Program Name</Label>
          <Input 
            id="name" 
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Q3 Growth Cohort"
            className="glass border-white/20 focus:bg-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_creators">Max Creators</Label>
          <Input 
            id="max_creators"
            type="number"
            value={data.max_creators}
            onChange={(e) => handleChange('max_creators', parseInt(e.target.value) || 0)}
            placeholder="e.g., 20"
            className="glass border-white/20 focus:bg-white/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Briefly describe the goals of this program"
          className="glass border-white/20 focus:bg-white/10 min-h-[100px]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label>Total Equity Pool: {data.pool_percent_total}%</Label>
          <Slider
            value={[data.pool_percent_total]}
            onValueChange={(value) => handleChange('pool_percent_total', value[0])}
            max={10} step={0.1}
          />
        </div>
        <div className="space-y-4">
          <Label>Default Allocation per Creator: {data.default_allocation_percent}%</Label>
          <Slider
            value={[data.default_allocation_percent]}
            onValueChange={(value) => handleChange('default_allocation_percent', value[0])}
            max={1} step={0.05}
          />
        </div>
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="application_deadline">Application Deadline (Optional)</Label>
          <Input 
            id="application_deadline" 
            type="date"
            value={data.application_deadline || ''}
            onChange={(e) => handleChange('application_deadline', e.target.value)}
            className="glass border-white/20 focus:bg-white/10"
          />
      </div>

      <div className="flex items-center justify-between glass rounded-lg p-4">
        <div className="space-y-1">
          <Label>Enable Revenue Share Bonus</Label>
          <p className="text-sm text-white/60">Reward creators with a percentage of the revenue they generate.</p>
        </div>
        <Switch
          checked={data.revenue_share_enabled}
          onCheckedChange={(checked) => handleChange('revenue_share_enabled', checked)}
        />
      </div>

      {data.revenue_share_enabled && (
        <div className="space-y-4 glass rounded-lg p-4">
          <Label>Revenue Share Percentage: {data.revenue_share_percent}%</Label>
          <Slider
            value={[data.revenue_share_percent]}
            onValueChange={(value) => handleChange('revenue_share_percent', value[0])}
            max={50} step={1}
          />
        </div>
      )}
    </div>
  );
}
