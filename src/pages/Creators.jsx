
import React, { useState, useEffect } from 'react';
import { Creator } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search, Twitter, Instagram, Youtube, Music, Linkedin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatorDetailsDialog from '../components/creators/CreatorDetailsDialog';
import InviteCreatorDialog from '../components/creators/InviteCreatorDialog';

const platformIcons = {
  twitter: <Twitter className="w-4 h-4 text-sky-400" />,
  instagram: <Instagram className="w-4 h-4 text-pink-500" />,
  youtube: <Youtube className="w-4 h-4 text-red-500" />,
  tiktok: <Music className="w-4 h-4 text-white" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-500" />,
};

const statusColors = {
  pending: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
  verified: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
  failed: "bg-red-100/20 text-red-300 border-red-300/20"
};

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const loadCreators = () => {
    setIsLoading(true);
    Creator.list('-created_date').then(data => {
      setCreators(data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load creators:", err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadCreators();
  }, []);

  const filteredCreators = creators.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-8 h-8"/> Creators
            </h1>
            <p className="text-white/70 text-lg">Manage your network of micro-investors.</p>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 glow">
            <Plus className="w-4 h-4 mr-2" />
            Invite Creator
          </Button>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input 
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass border-white/20 pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-white/10 hover:bg-transparent">
                  <TableHead className="text-white/80">Creator</TableHead>
                  <TableHead className="text-white/80">Primary Platform</TableHead>
                  <TableHead className="text-white/80">Total Followers</TableHead>
                  <TableHead className="text-white/80">Status</TableHead>
                  <TableHead className="text-white/80 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan="5" className="text-center py-12 text-white/70">Loading creators...</TableCell></TableRow>
                ) : filteredCreators.map(creator => (
                  <TableRow key={creator.id} className="border-b-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={creator.avatar_url} />
                          <AvatarFallback>{(creator.name || 'C').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{creator.name}</p>
                          <p className="text-sm text-white/60">{creator.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {creator.primary_platform && (
                        <div className="flex items-center gap-2 capitalize text-white/90">
                          {platformIcons[creator.primary_platform]}
                          {creator.primary_platform}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white/90">
                      {(creator.total_followers || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[creator.verification_status]} border text-xs`}>
                        {creator.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedCreator(creator)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredCreators.length === 0 && !isLoading && (
              <div className="text-center py-12 text-white/70">No creators found.</div>
            )}
          </div>
        </div>
      </div>
      {selectedCreator && (
        <CreatorDetailsDialog 
          creator={selectedCreator}
          isOpen={!!selectedCreator}
          onOpenChange={() => setSelectedCreator(null)}
        />
      )}
      <InviteCreatorDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInviteSent={() => {
          setIsInviteDialogOpen(false);
          loadCreators();
        }}
      />
    </div>
  );
}
