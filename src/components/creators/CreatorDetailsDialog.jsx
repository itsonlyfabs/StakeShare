
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  Music, 
  Linkedin, 
  Globe, 
  Users, 
  TrendingUp,
  Link as LinkIcon,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import PayoutDialog from './PayoutDialog';
import CreatorLinksDialog from './CreatorLinksDialog';
import { User, Conversation } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const platformIcons = {
  twitter: <Twitter className="w-4 h-4 text-sky-400" />,
  instagram: <Instagram className="w-4 h-4 text-pink-500" />,
  youtube: <Youtube className="w-4 h-4 text-red-500" />,
  tiktok: <Music className="w-4 h-4 text-white" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-500" />,
  website: <Globe className="w-4 h-4 text-gray-400" />
};

const statusColors = {
  pending: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
  verified: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
  failed: "bg-red-100/20 text-red-300 border-red-300/20"
};

export default function CreatorDetailsDialog({ creator, isOpen, onOpenChange }) {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [showLinksDialog, setShowLinksDialog] = useState(false);
  const navigate = useNavigate();

  const handleMessageCreator = async () => {
    try {
      const founder = await User.me();
      
      const existingConvs = await Conversation.filter({ 
        creator_id: creator.id, 
        founder_email: founder.email 
      });

      let conversation = existingConvs.find(c => !c.program_id); // Prefer a direct message thread

      if (!conversation) {
        conversation = await Conversation.create({
            creator_id: creator.id,
            founder_email: founder.email,
            creator_email: creator.email,
            creator_name: creator.name,
            founder_name: founder.full_name,
            program_id: null, // Explicitly null for direct messages
            program_name: 'Direct Message' // Placeholder for UI
        });
      }
      
      onOpenChange(false); // Close the dialog
      navigate(createPageUrl(`Messages?conversationId=${conversation.id}`));

    } catch(error) {
      console.error("Failed to start conversation:", error);
      alert("Could not start conversation. Please try again.");
    }
  };

  if (!creator) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Creator Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Creator Header */}
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={creator.avatar_url} />
                <AvatarFallback className="text-xl">{creator.name?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{creator.name}</h3>
                <p className="text-white/70">{creator.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${statusColors[creator.verification_status]} border`}>
                    {creator.verification_status}
                  </Badge>
                  {creator.primary_platform && (
                    <Badge variant="outline" className="glass border-white/20 flex items-center gap-1">
                      {platformIcons[creator.primary_platform]}
                      {creator.primary_platform}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">{(creator.total_followers || 0).toLocaleString()}</p>
                <p className="text-sm text-white/60">Total Followers</p>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-white/60">Engagement Rate</p>
              </div>
            </div>

            {/* Bio */}
            {creator.bio && (
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-white/80">{creator.bio}</p>
              </div>
            )}

            {/* Social Links */}
            {creator.social_links && Object.keys(creator.social_links).some(key => creator.social_links[key]) && (
              <div>
                <h4 className="font-semibold mb-3">Social Profiles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(creator.social_links).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {platformIcons[platform]}
                        <span className="capitalize text-sm">{platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={handleMessageCreator}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Creator
              </Button>
              <Button
                onClick={() => setShowLinksDialog(true)}
                variant="outline"
                className="flex-1 glass border-white/20 text-white hover:bg-white/10"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Manage Links
              </Button>
              <Button
                onClick={() => setShowPayoutDialog(true)}
                variant="outline"
                className="flex-1 glass border-white/20 text-white hover:bg-white/10"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Send Payout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PayoutDialog
        creator={creator}
        isOpen={showPayoutDialog}
        onOpenChange={setShowPayoutDialog}
      />

      <CreatorLinksDialog
        creator={creator}
        program={{ id: 'default', name: 'Default Program' }} // You might want to pass actual program
        isOpen={showLinksDialog}
        onOpenChange={setShowLinksDialog}
      />
    </>
  );
}
