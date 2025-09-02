
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Twitter, Instagram, Youtube, Linkedin, Music } from "lucide-react";

const platformOptions = [
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'tiktok', label: 'TikTok', icon: Music },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
];

export default function Step2Eligibility({ rules, onRulesChange }) {
  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    onRulesChange(newRules);
  };

  const addRule = () => {
    onRulesChange([...rules, { platform: 'instagram', min_followers: 1000, min_engagement_rate: 1, min_account_age_days: 30, verified_only: false }]);
  };

  const removeRule = (index) => {
    onRulesChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {rules.map((rule, index) => (
        <div key={index} className="glass rounded-xl p-6 border border-white/10 space-y-6 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Rule for {platformOptions.find(p => p.value === rule.platform)?.label || '...'}</h3>
            <Button variant="ghost" size="icon" onClick={() => removeRule(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={rule.platform} onValueChange={(value) => updateRule(index, 'platform', value)}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 text-white">
                  {platformOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Followers</Label>
              <Input
                type="number"
                value={rule.min_followers || ''}
                onChange={(e) => updateRule(index, 'min_followers', parseInt(e.target.value) || 0)}
                placeholder="e.g., 1000"
                className="glass border-white/20"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Minimum Engagement Rate (%)</Label>
              <Input
                type="number"
                value={rule.min_engagement_rate || ''}
                onChange={(e) => updateRule(index, 'min_engagement_rate', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 2.5"
                step="0.1"
                className="glass border-white/20"
              />
            </div>
             <div className="space-y-2">
              <Label>Minimum Account Age (days)</Label>
              <Input
                type="number"
                value={rule.min_account_age_days || ''}
                onChange={(e) => updateRule(index, 'min_account_age_days', parseInt(e.target.value) || 0)}
                placeholder="e.g., 90"
                className="glass border-white/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between glass rounded-lg p-4">
            <Label>Verified Account Only</Label>
            <Switch
              checked={rule.verified_only || false}
              onCheckedChange={(checked) => updateRule(index, 'verified_only', checked)}
            />
          </div>
        </div>
      ))}
      <Button onClick={addRule} variant="outline" className="glass border-white/20 text-white hover:bg-white/10 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Platform Rule
      </Button>
    </div>
  );
}
