import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { Creator } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { createPageUrl } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InviteCreatorDialog({ isOpen, onOpenChange, onInviteSent }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSendInvite = async () => {
    if (!name || !email) {
      setError('Please fill out both name and email.');
      return;
    }
    setError(null);
    setIsSending(true);

    try {
      const creatorData = {
        name,
        email,
        verification_status: 'pending',
      };

      if (platform && handle) {
        creatorData.primary_platform = platform;
        creatorData.social_links = { [platform]: handle };
        creatorData.total_followers = 0; // Default followers
      }

      await Creator.create(creatorData);

      const inviteLink = window.location.origin + createPageUrl('home');
      const emailBody = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #5e2ca5;">You're Invited!</h1>
          <p>Hello ${name},</p>
          <p>You have been invited to join StakeShare to partner with exciting companies as a micro-investor.</p>
          <p>StakeShare allows you to earn equity and revenue share by advocating for brands you believe in.</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #7c3aed; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Accept Invitation</a>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">If you did not expect this invitation, you can safely ignore this email.</p>
        </div>
      `;

      await SendEmail({
        to: email,
        subject: 'Invitation to join StakeShare',
        body: emailBody,
      });

      alert('Invitation sent successfully!');
      onInviteSent();
    } catch (err) {
      console.error("Failed to send invite:", err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsSending(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPlatform('');
    setHandle('');
    setError(null);
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
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 text-white max-w-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invite a New Creator</DialogTitle>
          <DialogDescription className="text-slate-300">
            They will receive an email to join the platform. Their status will be "pending" until they sign up.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Creator's Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="glass border-white/20" placeholder="e.g., Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Creator's Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass border-white/20" placeholder="e.g., jane.doe@example.com" />
          </div>

          <div className="border-t border-slate-700/50 pt-4 space-y-2">
             <Label>Social Profile (Optional)</Label>
             <p className="text-sm text-slate-400">Add their primary social profile to help identify them.</p>
             <div className="flex gap-2">
                <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-[180px] glass border-white/20">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="glass-card bg-slate-800/90 text-white border-slate-700">
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                </Select>
                <Input value={handle} onChange={(e) => setHandle(e.target.value)} className="glass border-white/20 flex-1" placeholder="Profile URL or handle" />
             </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSendInvite} disabled={isSending} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSending ? 'Sending...' : 'Send Invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}