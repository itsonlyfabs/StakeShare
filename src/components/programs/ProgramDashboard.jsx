import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Calendar, Target } from 'lucide-react';

export default function ProgramDashboard({ program, applications }) {
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(a => a.status === 'approved').length;
  const pendingApplications = applications.filter(a => a.status === 'applied' || a.status === 'under_review').length;
  const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

  const approvalRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pending Review</CardTitle>
            <Calendar className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingApplications}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Approved</CardTitle>
            <Target className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{approvedApplications}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Approval Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{approvalRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Program Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-white/70 mb-2">Description</h4>
              <p className="text-white">{program.description || 'No description available'}</p>
            </div>
            <div>
              <h4 className="font-medium text-white/70 mb-2">Status</h4>
              <Badge 
                variant={program.status === 'active' ? 'default' : 'secondary'}
                className={program.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
              >
                {program.status}
              </Badge>
            </div>
          </div>
          
          {program.requirements && (
            <div>
              <h4 className="font-medium text-white/70 mb-2">Requirements</h4>
              <p className="text-white">{program.requirements}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
