import React, { useMemo, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, FileText, Camera, Video, Mic, MessageSquare, Hash, AtSign, Eye } from "lucide-react";
import { listTemplates, renderTemplate } from "@/api/contracts";

const contentTypeIcons = {
  post: <MessageSquare className="w-4 h-4" />,
  story: <Camera className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  reel: <Video className="w-4 h-4" />,
  shoutout: <MessageSquare className="w-4 h-4" />,
  podcast: <Mic className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  newsletter: <FileText className="w-4 h-4" />
};

export default function Step3Requirements({ data, onDataChange }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('participation_agreement_v1');
  const templates = useMemo(() => listTemplates(), []);

  const handleLegalChange = (key, value) => {
    onDataChange({
      legal_requirements: {
        ...data.legal_requirements,
        [key]: value
      }
    });
  };

  const handlePostingChange = (key, value) => {
    onDataChange({
      posting_requirements: {
        ...data.posting_requirements,
        [key]: value
      }
    });
  };

  const addContentType = (type) => {
    const current = data.posting_requirements.required_content_types || [];
    if (!current.includes(type)) {
      handlePostingChange('required_content_types', [...current, type]);
    }
  };

  const removeContentType = (type) => {
    const current = data.posting_requirements.required_content_types || [];
    handlePostingChange('required_content_types', current.filter(t => t !== type));
  };

  const addHashtag = (hashtag) => {
    if (hashtag.trim()) {
      const current = data.posting_requirements.hashtag_requirements || [];
      const cleanHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
      if (!current.includes(cleanHashtag)) {
        handlePostingChange('hashtag_requirements', [...current, cleanHashtag]);
      }
    }
  };

  const removeHashtag = (hashtag) => {
    const current = data.posting_requirements.hashtag_requirements || [];
    handlePostingChange('hashtag_requirements', current.filter(h => h !== hashtag));
  };

  const addMention = (mention) => {
    if (mention.trim()) {
      const current = data.posting_requirements.mention_requirements || [];
      const cleanMention = mention.startsWith('@') ? mention : `@${mention}`;
      if (!current.includes(cleanMention)) {
        handlePostingChange('mention_requirements', [...current, cleanMention]);
      }
    }
  };

  const removeMention = (mention) => {
    const current = data.posting_requirements.mention_requirements || [];
    handlePostingChange('mention_requirements', current.filter(m => m !== mention));
  };

  const previewHtml = useMemo(() => {
    const vars = {
      company_name: 'Your Company',
      creator_name: 'Creator Name',
      program_name: data.name || 'Program',
      equity_pct: data.default_allocation_percent,
      rev_share_pct: data.revenue_share_enabled ? data.revenue_share_percent : 0,
      min_posts: data.posting_requirements.min_posts_per_month,
      governing_law: data.legal_requirements.compliance_jurisdiction?.toUpperCase(),
      venue: 'Courts of ' + (data.legal_requirements.compliance_jurisdiction || 'US').toUpperCase(),
      effective_date: new Date().toISOString().slice(0, 10),
      change_summary: 'N/A'
    };
    return renderTemplate(selectedTemplateId, vars);
  }, [selectedTemplateId, data]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Legal Requirements & Posting Obligations</h2>
        <p className="text-white/70">Set the legal terms creators must agree to and define posting requirements for tracking.</p>
      </div>

      {/* Legal Requirements Section */}
      <div className="glass-card rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Legal Requirements
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between glass rounded-lg p-4">
            <div>
              <Label>Terms & Conditions Agreement</Label>
              <p className="text-sm text-white/60">Require creators to agree to program terms</p>
            </div>
            <Switch
              checked={data.legal_requirements.terms_required}
              onCheckedChange={(checked) => handleLegalChange('terms_required', checked)}
            />
          </div>

          <div className="flex items-center justify-between glass rounded-lg p-4">
            <div>
              <Label>Non-Disclosure Agreement</Label>
              <p className="text-sm text-white/60">Require NDA signature</p>
            </div>
            <Switch
              checked={data.legal_requirements.nda_required}
              onCheckedChange={(checked) => handleLegalChange('nda_required', checked)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Legal Jurisdiction</Label>
            <Select 
              value={data.legal_requirements.compliance_jurisdiction} 
              onValueChange={(value) => handleLegalChange('compliance_jurisdiction', value)}
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 text-white">
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="eu">European Union</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contract Template</Label>
            <Select 
              value={selectedTemplateId}
              onValueChange={(value) => setSelectedTemplateId(value)}
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 text-white">
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Custom Agreement (Optional)</Label>
          <Textarea
            value={data.legal_requirements.custom_agreement}
            onChange={(e) => handleLegalChange('custom_agreement', e.target.value)}
            placeholder="Add any custom legal terms or requirements..."
            className="glass border-white/20 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Eye className="w-4 h-4" /> Contract Preview</Label>
          <div className="glass-card rounded-lg p-4 text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>

      {/* Posting Requirements Section */}
      <div className="glass-card rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Posting Requirements
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Minimum Posts Per Month</Label>
            <Input
              type="number"
              value={data.posting_requirements.min_posts_per_month}
              onChange={(e) => handlePostingChange('min_posts_per_month', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="glass border-white/20"
            />
          </div>

          <div className="flex items-center justify-between glass rounded-lg p-4">
            <div>
              <Label>Branded Content Disclosure</Label>
              <p className="text-sm text-white/60">Require #ad or #sponsored disclosure</p>
            </div>
            <Switch
              checked={data.posting_requirements.branded_content_required}
              onCheckedChange={(checked) => handlePostingChange('branded_content_required', checked)}
            />
          </div>
        </div>

        {/* Content Types */}
        <div className="space-y-4">
          <Label>Required Content Types</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(contentTypeIcons).map(([type, icon]) => (
              <Button
                key={type}
                variant={data.posting_requirements.required_content_types?.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => data.posting_requirements.required_content_types?.includes(type) ? removeContentType(type) : addContentType(type)}
                className={`flex items-center gap-2 ${
                  data.posting_requirements.required_content_types?.includes(type) 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'glass border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {icon}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Hashtag Requirements */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Required Hashtags
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.posting_requirements.hashtag_requirements?.map((hashtag, index) => (
              <Badge key={index} variant="secondary" className="glass border-white/20 flex items-center gap-1">
                {hashtag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => removeHashtag(hashtag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add hashtag (e.g., #yourcompany)"
              className="glass border-white/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addHashtag(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                addHashtag(input.value);
                input.value = '';
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mention Requirements */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <AtSign className="w-4 h-4" />
            Required Mentions
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.posting_requirements.mention_requirements?.map((mention, index) => (
              <Badge key={index} variant="secondary" className="glass border-white/20 flex items-center gap-1">
                {mention}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => removeMention(mention)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add mention (e.g., @yourcompany)"
              className="glass border-white/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addMention(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                addMention(input.value);
                input.value = '';
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between glass rounded-lg p-4">
          <div>
            <Label>Enable Automatic Tracking</Label>
            <p className="text-sm text-white/60">Generate unique links and UTM codes for each creator</p>
          </div>
          <Switch
            checked={data.posting_requirements.tracking_enabled}
            onCheckedChange={(checked) => handlePostingChange('tracking_enabled', checked)}
          />
        </div>
      </div>
    </div>
  );
}