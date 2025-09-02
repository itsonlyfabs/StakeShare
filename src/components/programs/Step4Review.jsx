import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Camera, Hash, AtSign } from 'lucide-react';
import { format } from "date-fns";

export default function Step4Review({ programData, eligibilityRules }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Review Your Program</h2>
        <p className="text-white/70">Please review all details including legal requirements and posting obligations before launching.</p>
      </div>

      {/* Program Details */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Program Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><strong className="text-white/70">Name:</strong> {programData.name}</p>
          <p><strong className="text-white/70">Equity Pool:</strong> {programData.pool_percent_total}%</p>
          <p><strong className="text-white/70">Default Allocation:</strong> {programData.default_allocation_percent}%</p>
          <p><strong className="text-white/70">Max Creators:</strong> {programData.max_creators}</p>
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

      {/* Eligibility Rules */}
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

      {/* Legal Requirements */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Legal Requirements
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${programData.legal_requirements?.terms_required ? 'text-green-400' : 'text-gray-400'}`} />
            <span>Terms & Conditions Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${programData.legal_requirements?.nda_required ? 'text-green-400' : 'text-gray-400'}`} />
            <span>NDA Required</span>
          </div>
        </div>
        <p><strong className="text-white/70">Jurisdiction:</strong> {programData.legal_requirements?.compliance_jurisdiction?.toUpperCase()}</p>
        {programData.legal_requirements?.custom_agreement && (
          <div>
            <strong className="text-white/70">Custom Agreement:</strong>
            <p className="text-white/90 mt-1 text-sm">{programData.legal_requirements.custom_agreement}</p>
          </div>
        )}
      </div>

      {/* Posting Requirements */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Posting Requirements
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <p><strong className="text-white/70">Min Posts/Month:</strong> {programData.posting_requirements?.min_posts_per_month || 0}</p>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${programData.posting_requirements?.branded_content_required ? 'text-green-400' : 'text-gray-400'}`} />
            <span>Branded Content Disclosure</span>
          </div>
        </div>
        
        {programData.posting_requirements?.required_content_types?.length > 0 && (
          <div>
            <strong className="text-white/70">Required Content Types:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {programData.posting_requirements.required_content_types.map((type, index) => (
                <Badge key={index} variant="secondary" className="glass border-white/20 capitalize">{type}</Badge>
              ))}
            </div>
          </div>
        )}

        {programData.posting_requirements?.hashtag_requirements?.length > 0 && (
          <div>
            <strong className="text-white/70 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Required Hashtags:
            </strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {programData.posting_requirements.hashtag_requirements.map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="glass border-white/20">{hashtag}</Badge>
              ))}
            </div>
          </div>
        )}

        {programData.posting_requirements?.mention_requirements?.length > 0 && (
          <div>
            <strong className="text-white/70 flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Required Mentions:
            </strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {programData.posting_requirements.mention_requirements.map((mention, index) => (
                <Badge key={index} variant="secondary" className="glass border-white/20">{mention}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${programData.posting_requirements?.tracking_enabled ? 'text-green-400' : 'text-gray-400'}`} />
          <span>Automatic Tracking Enabled</span>
        </div>
      </div>
    </div>
  );
}