import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Plus, Loader2 } from 'lucide-react';
import { CreatorLink } from '@/api/entities';

// IMPORTANT: This frontend calls backend functions.
// Make sure you have created `generateCreatorLinks` in your backend.
async function generateLinkOnBackend(creatorId, programId, baseUrl, campaignName) {
    // This is a placeholder for your backend API call.
    // In a real base44 app, you would use the SDK to invoke the function.
    const response = await fetch('/api/functions/generateCreatorLinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            creatorId,
            programId,
            baseUrl,
            campaignName: campaignName || undefined
        })
    });
    return response.json();
}

export default function CreatorLinksDialog({ creator, program, isOpen, onOpenChange }) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://yourcompany.com/signup');
  const [campaignName, setCampaignName] = useState('');

  const loadCreatorLinks = async () => {
    if (!creator || !program) return;
    setIsLoading(true);
    try {
      const creatorLinks = await CreatorLink.filter({
        creator_id: creator.id,
        program_id: program.id
      });
      setLinks(creatorLinks);
    } catch (error) {
      console.error('Failed to load creator links:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCreatorLinks();
    }
  }, [isOpen, creator, program]);

  const generateNewLink = async () => {
    if (!baseUrl.trim()) {
      alert('Please enter a base URL');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateLinkOnBackend(creator.id, program.id, baseUrl.trim(), campaignName.trim());

      if (result.success) {
        await loadCreatorLinks(); // Refresh the list
        setCampaignName(''); // Reset for next link
        alert('Link generated successfully!');
      } else {
        alert(`Failed to generate link: ${result.error}`);
      }
    } catch (error) {
      console.error('Link generation error:', error);
      alert('Failed to generate link. Please try again.');
    }
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tracking Links for {creator?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-1">
          {/* Generate New Link Section */}
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Generate New Tracking Link</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseUrl">Destination URL *</Label>
                <Input
                  id="baseUrl"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://yourcompany.com/signup"
                  className="glass border-white/20"
                />
              </div>
              <div>
                <Label htmlFor="campaignName">Campaign Name (Optional)</Label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., spring_promo"
                  className="glass border-white/20"
                />
              </div>
              <Button 
                onClick={generateNewLink} 
                disabled={isGenerating || !baseUrl.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {isGenerating ? 'Generating...' : 'Generate Link'}
              </Button>
            </div>
          </div>

          {/* Existing Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Existing Tracking Links</h3>
            {isLoading ? (
              <div className="text-center py-8">Loading links...</div>
            ) : links.length > 0 ? (
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="glass border-white/20">
                          {link.referral_code}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(link.tracking_url)}
                          className="text-white/70 hover:text-white"
                        >
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="text-white/70 hover:text-white"
                        >
                          <a href={link.tracking_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" /> Test
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded p-2 mb-3 font-mono text-sm break-all">
                      {link.tracking_url}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Clicks:</span>
                        <span className="ml-2 font-semibold">{link.clicks || 0}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Conversions:</span>
                        <span className="ml-2 font-semibold">{link.conversions || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                No tracking links generated for this program yet.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}