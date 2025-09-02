import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';
import { format } from "date-fns";

export default function Step3Review({ programData, eligibilityRules }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Review Your Program</h2>
        <p className="text-white/70">Please review the details below before launching your program. You can go back to previous steps to make changes.</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Program Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><strong className="text-white/70">Name:</strong> {programData.name}</p>
          <p><strong className="text-white/70">Equity Pool:</strong> {programData.pool_percent_total}%</p>
          <p><strong className="text-white/70">Default Allocation:</strong> {programData.default_allocation_percent}%</p>
          <p><strong className="text-white/70">Application Deadline:</strong> {programData.application_deadline ? format(new Date(programData.application_deadline), 'PPP') : 'Not set'}</p>
        </div>
        <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400"/>
            <p>
              <strong className="text-white/70">Revenue Share:</strong> 
              {programData.revenue_share_enabled ? ` Enabled at ${programData.revenue_share_percent}%` : ' Disabled'}
            </p>
        </div>
        <div>
          <strong className="text-white/70">Description:</strong>
          <p className="text-white/90 mt-1">{programData.description}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Eligibility Rules</h3>
        <div className="space-y-3">
          {eligibilityRules.map((rule, index) => (
            <div key={index} className="glass rounded-lg p-3">
              <div className="font-semibold text-white mb-2 capitalize">{rule.platform}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Badge variant="secondary" className="glass border-white/20">Min Followers: {rule.min_followers || 'Any'}</Badge>
                <Badge variant="secondary" className="glass border-white/20">Min Engagement: {rule.min_engagement_rate || 'Any'}%</Badge>
                {rule.verified_only && <Badge variant="secondary" className="glass border-white/20">Verified Only</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}