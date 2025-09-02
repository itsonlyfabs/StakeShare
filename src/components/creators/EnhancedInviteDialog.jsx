import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from 'lucide-react';
import { Creator, User } from '@/api/entities';
import { EmailTemplates } from '../services/EmailTemplates';
import { createPageUrl } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function EnhancedInviteDialog({ isOpen, onOpenChange, onInviteSent, program }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    handle: '',
    customMessage: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvite = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill out both name and email.');
      setStatus('error');
      return;
    }

    setError(null);
    setStatus('idle');
    setIsSending(true);

    try {
      // Get current user info
      const founder = await User.me();

      // Create creator record
      const creatorData = {
        name: formData.name,
        email: formData.email,
        verification_status: 'pending',
      };

      if (formData.platform && formData.handle) {
        creatorData.primary_platform = formData.platform;
        creatorData.social_links = { [formData.platform]: formData.handle };
        creatorData.total_followers = 0;
      }

      const creator = await Creator.create(creatorData);

      // Send personalized invitation email
      const inviteLink = window.location.origin + createPageUrl('home');
      
      await EmailTemplates.sendCreatorInvitation({
        creatorName: formData.name,
        creatorEmail: formData.email,
        founderName: founder.full_name,
        companyName: program?.company_name || 'Your Company',
        programName: program?.name || 'Micro-Investor Program',
        inviteLink,
        customMessage: formData.customMessage
      });

      setStatus('success');
      setTimeout(() => {
        onInviteSent();
        resetForm();
      }, 2000);

    } catch (err) {
      console.error("Failed to send invite:", err);
      setError(err.message || 'Failed to send invitation. Please try again.');
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      platform: '',
      handle: '',
      customMessage: ''
    });
    setError(null);
    setStatus('idle');
    setIsSending(false);
  };
  
  const handleOpenChange = (open) => {
    if (open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 text-white max-w-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Send className="w-6 h-6 text-purple-400" />
            Invite Creator to {program?.name || 'Program'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Send a personalized invitation with all the program details. The creator will receive a professional email with next steps.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6 max-h-96 overflow-y-auto">
          {status === 'success' && (
            <Alert className="bg-green-900/50 border-green-500/50 text-white">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Invitation Sent!</AlertTitle>
              <AlertDescription>
                {formData.name} will receive a personalized email with program details and next steps.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to Send</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Creator's Full Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)} 
                className="glass border-white/20" 
                placeholder="e.g., Sarah Johnson" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange('email', e.target.value)} 
                className="glass border-white/20" 
                placeholder="e.g., sarah@example.com" 
              />
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6 space-y-4">
             <Label className="text-base font-medium">Social Profile (Optional)</Label>
             <p className="text-sm text-slate-400">Adding their social profile helps with verification and provides context.</p>
             <div className="grid md:grid-cols-2 gap-4">
                <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent className="glass-card bg-slate-800/90 text-white border-slate-700">
                        <SelectItem value="twitter">Twitter / X</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                </Select>
                <Input 
                  value={formData.handle} 
                  onChange={(e) => handleInputChange('handle', e.target.value)} 
                  className="glass border-white/20" 
                  placeholder="Profile URL or @handle" 
                />
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customMessage">Personal Message (Optional)</Label>
            <Textarea 
              id="customMessage"
              value={formData.customMessage}
              onChange={(e) => handleInputChange('customMessage', e.target.value)}
              className="glass border-white/20 h-20" 
              placeholder="Add a personal note about why you'd like them to join your program..."
            />
            <p className="text-xs text-slate-400">This will be included in the invitation email along with program details.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            className="glass border-white/20 text-white hover:bg-white/10" 
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvite} 
            disabled={isSending || status === 'success'} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow"
          >
            {isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSending ? 'Sending Invitation...' : status === 'success' ? 'Sent!' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}