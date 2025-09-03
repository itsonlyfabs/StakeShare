import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Users as UsersIcon, Target, AlertTriangle, Eye, Camera, Hash, AtSign, Plus, X, CheckCircle, ArrowRight, FileSignature } from "lucide-react";
import { contractTemplates, renderTemplate } from "@/api/contracts";
import { createContractDraft, addContractParty, addContractVersion, addContractEvent, testSupabaseConnection } from "@/api/contractsSupabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Step3Requirements({ data, onDataChange }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('550e8400-e29b-41d4-a716-446655440000');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [terminationNoticeDays, setTerminationNoticeDays] = useState('30');
  const [disputeResolutionMethod, setDisputeResolutionMethod] = useState('mediation');

  const templates = [
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Founder-Creator Participation Agreement' },
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Mutual NDA' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Termination & Amendment Addendum' }
  ];

  const contentTypeIcons = {
    post: <FileText className="w-4 h-4" />,
    story: <Camera className="w-4 h-4" />,
    video: <FileText className="w-4 h-4" />,
    reel: <FileText className="w-4 h-4" />,
    shoutout: <FileText className="w-4 h-4" />,
    podcast: <FileText className="w-4 h-4" />,
    blog: <FileText className="w-4 h-4" />,
    newsletter: <FileText className="w-4 h-4" />
  };

  useEffect(() => {
    updatePreview();
  }, [selectedTemplateId, data]);

  const updatePreview = () => {
    const template = contractTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      // For founder preview, show placeholder. For actual creator application, this will be filled
      // TODO: When creator applies, this will be populated with their actual name from the application
      const creatorName = data.creator?.name || data.creator_name || '[CREATOR_NAME]';
      
      const variables = {
        company_name: data.company?.name || 'Your Company',
        creator_name: creatorName,
        program_name: data.name || 'Program',
        equity_pct: data.default_allocation_percent || 0,
        rev_share_pct: data.revenue_share_enabled ? data.revenue_share_percent : 0,
        min_posts: data.posting_requirements?.min_posts_per_month || 0,
        branded_content_required: data.posting_requirements?.branded_content_required ? 'Required' : 'Not required',
        required_content_types: data.posting_requirements?.required_content_types?.join(', ') || 'None specified',
        hashtag_requirements: data.posting_requirements?.hashtag_requirements?.length > 0 ? data.posting_requirements.hashtag_requirements.join(', ') : 'None specified',
        mention_requirements: data.posting_requirements?.mention_requirements?.length > 0 ? data.posting_requirements.mention_requirements.join(', ') : 'None specified',
        tracking_enabled: data.posting_requirements?.tracking_enabled ? 'Yes' : 'No',
        terms_required: data.legal_requirements?.terms_required ? 'Required' : 'Not required',
        nda_required: data.legal_requirements?.nda_required ? 'Required' : 'Not required',
        custom_agreement: data.legal_requirements?.custom_agreement || 'None',
        governing_law: data.legal_requirements?.compliance_jurisdiction?.toUpperCase() || 'US',
        venue: 'Courts of ' + (data.legal_requirements?.compliance_jurisdiction || 'US').toUpperCase(),
        termination_notice_days: terminationNoticeDays,
        dispute_resolution_method: disputeResolutionMethod === 'mediation' ? 'mediation with a neutral third party' : disputeResolutionMethod === 'arbitration' ? 'binding arbitration' : 'direct negotiation',
        effective_date: new Date().toISOString().slice(0, 10)
      };
      
      const merged = renderTemplate(selectedTemplateId, variables);
      setPreviewHtml(merged);
    }
  };

  const handleLegalChange = (field, value) => {
    onDataChange({
      legal_requirements: {
        ...data.legal_requirements,
        [field]: value
      }
    });
  };

  const handlePostingChange = (field, value) => {
    onDataChange({
      posting_requirements: {
        ...data.posting_requirements,
        [field]: value
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

  const handleIssueContract = async () => {
    setIsLoading(true);
    try {
      // First test the connection
      console.log('Testing Supabase connection...');
      const connectionTest = await testSupabaseConnection();
      setConnectionStatus(connectionTest);
      
      if (!connectionTest.success) {
        throw new Error(`Connection test failed: ${connectionTest.error}`);
      }

      const encoder = new TextEncoder();
      const bytes = encoder.encode(previewHtml);
      // Simple hash polyfill for demo
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const hashArray = Array.from(new Uint8Array(digest));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // For founder preview, show placeholder. For actual creator application, this will be filled
      // TODO: When creator applies, this will be populated with their actual name from the application
      const creatorName = data.creator?.name || data.creator_name || '[CREATOR_NAME]';
      
      const variables = {
        company_name: data.company?.name || 'Your Company',
        creator_name: creatorName,
        program_name: data.name || 'Program',
        equity_pct: data.default_allocation_percent || 0,
        rev_share_pct: data.revenue_share_enabled ? data.revenue_share_percent : 0,
        min_posts: data.posting_requirements?.min_posts_per_month || 0,
        branded_content_required: data.posting_requirements?.branded_content_required ? 'Required' : 'Not required',
        required_content_types: data.posting_requirements?.required_content_types?.join(', ') || 'None specified',
        hashtag_requirements: data.posting_requirements?.hashtag_requirements?.length > 0 ? data.posting_requirements.hashtag_requirements.join(', ') : 'None specified',
        mention_requirements: data.posting_requirements?.mention_requirements?.length > 0 ? data.posting_requirements.mention_requirements.join(', ') : 'None specified',
        tracking_enabled: data.posting_requirements?.tracking_enabled ? 'Yes' : 'No',
        terms_required: data.legal_requirements?.terms_required ? 'Required' : 'Not required',
        nda_required: data.legal_requirements?.nda_required ? 'Required' : 'Not required',
        custom_agreement: data.legal_requirements?.custom_agreement || 'None',
        governing_law: data.legal_requirements?.compliance_jurisdiction?.toUpperCase() || 'US',
        venue: 'Courts of ' + (data.legal_requirements?.compliance_jurisdiction || 'US').toUpperCase(),
        termination_notice_days: terminationNoticeDays,
        dispute_resolution_method: disputeResolutionMethod === 'mediation' ? 'mediation with a neutral third party' : disputeResolutionMethod === 'arbitration' ? 'binding arbitration' : 'direct negotiation',
        effective_date: new Date().toISOString().slice(0, 10)
      };

      console.log('Creating contract draft...');
      const draft = await createContractDraft({
        templateId: selectedTemplateId,
        variables,
        contentHtml: previewHtml,
        contentHash: hashHex
      });

      console.log('Adding contract parties...');
      const founderEmail = 'founder@example.com';
      const creatorEmail = 'creator@example.com';
      await addContractParty({ contractId: draft.id, role: 'founder', email: founderEmail, fullName: 'Founder' });
      await addContractParty({ contractId: draft.id, role: 'creator', email: creatorEmail, fullName: 'Creator' });
      
      console.log('Adding contract version...');
      await addContractVersion({ contractId: draft.id, version: 1, contentHtml: previewHtml, contentHash: hashHex });
      
      console.log('Adding contract event...');
      await addContractEvent({ contractId: draft.id, eventType: 'issued', payload: { templateId: selectedTemplateId } });
      
      setContractId(draft.id);
      setShowSuccessModal(true);
    } catch (e) {
      console.error('Issue contract failed', e);
      console.error('Full error details:', {
        message: e?.message,
        stack: e?.stack,
        name: e?.name,
        cause: e?.cause
      });
      alert(`Failed to issue contract: ${e?.message || 'Unknown error'}. Check console for details. Ensure you are logged in and Supabase RLS/policies allow inserts.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Posting Requirements & Legal Terms</h2>
        <p className="text-white/70">First define posting requirements, then set legal terms that will be included in the contract.</p>
      </div>

      {/* Posting Requirements Section - MOVED TO TOP */}
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

      {/* Legal Requirements Section - MOVED BELOW POSTING */}
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

        {/* Termination Settings */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Termination & Dispute Resolution</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Termination Notice Period (Days)</Label>
              <Input
                type="number"
                value={terminationNoticeDays}
                onChange={(e) => setTerminationNoticeDays(e.target.value)}
                min="7"
                max="90"
                className="glass border-white/20"
              />
              <p className="text-sm text-white/60">How many days notice required before termination</p>
            </div>

            <div className="space-y-2">
              <Label>Dispute Resolution Method</Label>
              <Select 
                value={disputeResolutionMethod}
                onValueChange={(value) => setDisputeResolutionMethod(value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 text-white">
                  <SelectItem value="mediation">Mediation</SelectItem>
                  <SelectItem value="arbitration">Arbitration</SelectItem>
                  <SelectItem value="negotiation">Direct Negotiation</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-white/60">How to resolve termination disputes</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h5 className="font-semibold text-blue-300 mb-2">Phantom Equity Protection</h5>
            <p className="text-sm text-white/80">
              When contracts are terminated, creators will receive fair compensation for earned phantom equity based on time served and performance metrics. 
              This ensures both parties are protected during the termination process.
            </p>
          </div>
        </div>
      </div>

                    {/* Contract Preview Section - NOW AT THE BOTTOM */}
              <div className="glass-card rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Contract Preview & Issue
                </h3>
                
                {/* Legal Disclaimer Alert */}
                <Alert className="border-red-500/50 bg-red-900/20 text-red-100">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>IMPORTANT LEGAL NOTICE:</strong> The contract templates provided are for informational purposes only and should not be considered legal advice. 
                    We strongly recommend that both parties consult with qualified legal counsel before signing any agreement. 
                    StakeShare is not a law firm and does not provide legal services. By proceeding, you acknowledge that you understand 
                    the importance of independent legal review and that StakeShare assumes no liability for the use of these templates.
                  </AlertDescription>
                </Alert>
        
                        <div className="space-y-2">
                  <Label>Contract Preview</Label>
                  <div className="glass-card rounded-lg p-6 text-sm max-w-none overflow-auto" style={{ maxHeight: '500px' }}>
                    <div className="bg-white rounded-lg p-8 shadow-lg" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleIssueContract} 
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? 'Creating Contract...' : 'Issue Contract Draft'}
          </Button>
        </div>
      </div>

             <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
         <DialogContent className="max-w-md bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white border-purple-600">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-center justify-center">
               <CheckCircle className="w-6 h-6 text-green-400" />
               <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                 Contract Created Successfully!
               </span>
             </DialogTitle>
           </DialogHeader>
           
           <div className="flex flex-col items-center justify-center py-6">
             <div className="relative mb-6">
               <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                 <FileSignature className="w-10 h-10 text-white" />
               </div>
               <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                 <CheckCircle className="w-5 h-5 text-white" />
               </div>
             </div>
             
             <h3 className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
               Contract Template Ready
             </h3>
             
             <div className="bg-purple-800/50 rounded-lg p-4 mb-6 w-full">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                 <span className="text-sm font-medium">Contract ID: {contractId?.slice(0, 8)}...</span>
               </div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                 <span className="text-sm">Status: Template Created</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                 <span className="text-sm">Next: Program Launch</span>
               </div>
             </div>
             
                                              <p className="text-white/90 mb-6 text-center text-sm leading-relaxed">
                      Your contract template has been successfully created and stored securely.
                      When creators apply to your program, they'll automatically receive this contract for e-signature.
                    </p>
                    
                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-100">
                          <p className="font-medium mb-2">Legal Protection Notice:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Contract templates are for informational purposes only</li>
                            <li>• Both parties should consult independent legal counsel</li>
                            <li>• StakeShare assumes no liability for contract outcomes</li>
                            <li>• This disclaimer is legally binding and protects all parties</li>
                          </ul>
                        </div>
                      </div>
                    </div>
             
             <div className="flex flex-col gap-3 w-full">
               <Button 
                 onClick={() => {
                   // Create a blob and download the contract
                   const blob = new Blob([previewHtml], { type: 'text/html' });
                   const url = window.URL.createObjectURL(blob);
                   const a = document.createElement('a');
                   a.href = url;
                   a.download = `contract-${data.name || 'program'}-${new Date().toISOString().slice(0, 10)}.html`;
                   document.body.appendChild(a);
                   a.click();
                   document.body.removeChild(a);
                   window.URL.revokeObjectURL(url);
                 }}
                 className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium"
               >
                 <FileText className="w-4 h-4 mr-2" />
                 Download Contract Document
               </Button>
               
               <div className="flex gap-3 w-full">
                 <Button 
                   onClick={() => setShowSuccessModal(false)} 
                   variant="outline"
                   className="flex-1 border-purple-400 text-purple-200 hover:bg-purple-800 hover:text-white"
                 >
                   Close
                 </Button>
                 <Button 
                   onClick={() => {
                     setShowSuccessModal(false);
                     // TODO: Navigate to next program creation step or show program summary
                   }} 
                   className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
                 >
                   <ArrowRight className="w-4 h-4 mr-2" />
                   Continue Program Setup
                 </Button>
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
}