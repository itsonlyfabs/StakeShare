import React, { useState, useEffect } from 'react';
import { Program } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Crown, Users, TrendingUp, Search } from 'lucide-react';

const statusColors = {
  draft: "bg-gray-100/20 text-gray-300 border-gray-300/20",
  active: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
  paused: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
  closed: "bg-red-100/20 text-red-300 border-red-300/20"
};

const ProgramCard = ({ program }) => (
  <Link to={createPageUrl(`ProgramDetails?id=${program.id}`)} className="block glass-card rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">{program.name}</h3>
      <Badge className={`${statusColors[program.status]} border text-xs`}>{program.status}</Badge>
    </div>
    <p className="text-white/70 mb-6 h-10 line-clamp-2">{program.description}</p>
    <div className="grid grid-cols-3 gap-4 text-sm border-t border-white/10 pt-4">
      <div className="flex items-center text-white/80">
        <Users className="w-4 h-4 mr-2 text-blue-400" />
        <span>{program.max_creators || 0} creators</span>
      </div>
      <div className="flex items-center text-white/80">
        <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
        <span>{program.pool_percent_total}% pool</span>
      </div>
      <div className="text-white/80">
        {program.revenue_share_enabled ? `${program.revenue_share_percent}% rev-share` : 'No rev-share'}
      </div>
    </div>
  </Link>
);

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      const data = await Program.list('-created_date');
      setPrograms(data);
      setIsLoading(false);
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Crown className="w-8 h-8"/> Programs
            </h1>
            <p className="text-white/70 text-lg">Manage your micro-investor cohorts.</p>
          </div>
          <Link to={createPageUrl("CreateProgram")}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 glow">
              <Plus className="w-4 h-4 mr-2" />
              New Program
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input 
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/20 pl-10 w-full md:w-1/3"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/70">Loading programs...</p>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-2xl">
            <Crown className="w-16 h-16 mx-auto text-white/20 mb-4"/>
            <h3 className="text-2xl font-bold text-white mb-2">No programs found</h3>
            <p className="text-white/60 mb-6">Create your first program to get started.</p>
            <Link to={createPageUrl("CreateProgram")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">
                Create Program
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}