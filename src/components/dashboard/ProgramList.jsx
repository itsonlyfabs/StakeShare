import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, TrendingUp, Settings, Eye, AlertTriangle } from "lucide-react";
import TerminationRequestButton from "@/components/programs/TerminationRequestButton";

const statusColors = {
  draft: "bg-gray-100/20 text-gray-300 border-gray-300/20",
  active: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
  paused: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
  closed: "bg-red-100/20 text-red-300 border-red-300/20"
};

export default function ProgramList({ programs }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Crown className="w-6 h-6 mr-3" />
          Your Programs
        </h2>
        <Link to={createPageUrl("Programs")}>
          <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {programs.map((program) => (
          <div key={program.id} className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                  {program.name}
                </h3>
                <Badge className={`${statusColors[program.status]} border text-xs`}>
                  {program.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link to={createPageUrl(`ProgramDetails?id=${program.id}`)}>
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={createPageUrl(`ProgramDetails?id=${program.id}`)}>
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                    <Settings className="w-4 h-4" />
                    </Button>
                </Link>
                <TerminationRequestButton
                  contract={{
                    id: program.id,
                    program_name: program.name,
                    equity_pct: program.default_allocation_percent,
                    status: program.status,
                    termination_notice_days: 30,
                    company_valuation: 1000000
                  }}
                  userRole="founder"
                  isFounder={true}
                  programCreators={[
                    // Mock data - in production this would come from API
                    { id: 1, name: 'John Creator', email: 'john@example.com', status: 'active' },
                    { id: 2, name: 'Sarah Influencer', email: 'sarah@example.com', status: 'active' },
                    { id: 3, name: 'Mike Content', email: 'mike@example.com', status: 'active' }
                  ]}
                  className="text-orange-500 hover:text-orange-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center text-white/70">
                <Users className="w-4 h-4 mr-2" />
                {program.max_creators || 0} creators
              </div>
              <div className="flex items-center text-white/70">
                <TrendingUp className="w-4 h-4 mr-2" />
                {program.pool_percent_total}% equity pool
              </div>
              <div className="text-white/70">
                {program.default_allocation_percent}% per creator
              </div>
            </div>

            {program.description && (
              <p className="text-white/60 text-sm mt-3 line-clamp-2">
                {program.description}
              </p>
            )}
          </div>
        ))}

        {programs.length === 0 && (
          <div className="text-center py-8">
            <Crown className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No programs created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}