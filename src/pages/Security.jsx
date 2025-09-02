
import React from 'react';
import { ShieldCheck, Lock, DatabaseZap, Users } from 'lucide-react';
import PublicNavigation from '../components/PublicNavigation';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Security at StakeShare</h1>
            <p className="text-lg text-white/70 mt-2">Your trust and data security are our top priority.</p>
          </div>
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-2xl flex items-start gap-6">
              <Lock className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Data Encryption</h2>
                <p className="text-white/80 leading-relaxed">All data transmitted between your browser and our servers is encrypted in transit using industry-standard TLS (Transport Layer Security). Sensitive data, such as API keys and personal information, is also encrypted at rest in our databases.</p>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl flex items-start gap-6">
              <DatabaseZap className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Secure Infrastructure</h2>
                <p className="text-white/80 leading-relaxed">Our platform is built on industry-leading cloud infrastructure that provides robust security features, including network firewalls, DDoS mitigation, and regular security assessments. We follow the principle of least privilege for all internal access to our systems.</p>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl flex items-start gap-6">
              <Users className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Responsible Disclosure</h2>
                <p className="text-white/80 leading-relaxed">If you believe you have found a security vulnerability in our platform, please let us know. We are committed to working with security researchers to verify and address any potential issues. Please contact us at security@stakeshare.app.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
