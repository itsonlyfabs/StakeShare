
import React from 'react';
import { Landmark } from 'lucide-react';
import PublicNavigation from '../components/PublicNavigation';
import PublicFooter from '@/components/PublicFooter';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Landmark className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Compliance</h1>
            <p className="text-lg text-white/70 mt-2">Our commitment to regulatory standards.</p>
          </div>
          <div className="glass-card p-8 md:p-12 rounded-2xl space-y-6 text-white/80 leading-relaxed">
            <h2 className="text-2xl font-bold text-white">Payment Processing</h2>
            <p>All creator payouts and payment processing are handled by Stripe, a PCI Service Provider Level 1 certified platform. This is the most stringent level of certification available in the payments industry. We do not store or process your sensitive cardholder data on our servers.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">Data Privacy</h2>
            <p>We are compliant with major data privacy regulations, including the General Data Protection Regulation (GDPR) for users in the European Union and the California Consumer Privacy Act (CCPA). Our Privacy Policy outlines your rights and how we handle your data.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">Financial Regulations</h2>
            <p>StakeShare facilitates phantom equity and revenue sharing agreements, not the direct sale of securities. We operate in compliance with regulations concerning marketing, service agreements, and creator compensation. We advise all users to consult with their own legal and financial advisors.</p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
