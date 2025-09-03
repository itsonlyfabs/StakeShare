
import React from 'react';
import { Shield } from 'lucide-react';
import PublicNavigation from '../components/PublicNavigation';
import PublicFooter from '@/components/PublicFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            <p className="text-lg text-white/70 mt-2">Last Updated: August 24, 2025</p>
          </div>
          <div className="glass-card p-8 md:p-12 rounded-2xl space-y-6 text-white/80 leading-relaxed">
            <p>Welcome to StakeShare. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at legal@stakeshare.app.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">1. What Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and services, when you participate in activities on the Services, or otherwise when you contact us.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">2. How We Use Your Information</h2>
            <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">3. Will Your Information Be Shared?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, or Legal Obligations.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">4. How We Keep Your Information Safe</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
