
import React from 'react';
import { FileText } from 'lucide-react';
import PublicNavigation from '../components/PublicNavigation';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            <p className="text-lg text-white/70 mt-2">Last Updated: August 24, 2025</p>
          </div>
          <div className="glass-card p-8 md:p-12 rounded-2xl space-y-6 text-white/80 leading-relaxed">
            <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
            <p>By using our Services, you agree to be bound by these Terms. If you do not agree to be bound by these Terms, do not use the Services. These Terms affect your legal rights and obligations, so please read them carefully.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">2. Changes to Terms or Services</h2>
            <p>We may update the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the updated Terms on the Site or through other communications. It’s important that you review the Terms whenever we update them or you use the Services.</p>

            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">3. Who May Use the Services</h2>
            <p>You may use the Services only if you are 18 years or older and capable of forming a binding contract with StakeShare, and not otherwise barred from using the Services under applicable law.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-white/10">4. Disclaimers</h2>
            <p>The Services are provided “AS IS,” without warranty of any kind. Without limiting the foregoing, we explicitly disclaim any implied warranties of merchantability, fitness for a particular purpose, quiet enjoyment, and non-infringement, and any warranties arising out of course of dealing or usage of trade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
