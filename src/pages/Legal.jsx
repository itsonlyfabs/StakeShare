import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, FileText, Scale, Users, Building2, CheckCircle } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Legal Disclaimer Banner */}
      <div className="bg-red-900/90 border-b border-red-700 text-white text-center py-3 px-4">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-200" />
          <span className="font-medium">LEGAL DISCLAIMER:</span>
          <span>This platform provides contract templates for informational purposes only. We strongly recommend consulting with qualified legal counsel before using any legal documents.</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Legal Protections & Disclaimers</h1>
            <p className="text-xl text-white/80">Comprehensive legal safeguards for all platform users</p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Platform Disclaimer */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Platform Legal Status</h2>
              </div>
              <div className="space-y-4 text-white/90">
                <p><strong>StakeShare is NOT a law firm</strong> and does not provide legal advice, legal services, or legal representation.</p>
                <p>Our platform provides contract templates and tools for informational and educational purposes only. These templates are designed to help users understand common contract structures but should not be considered as legal advice.</p>
                <p><strong>We strongly recommend that all users consult with qualified legal counsel</strong> before entering into any legally binding agreements.</p>
              </div>
            </div>

            {/* Founder Protections */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Founder Legal Protections</h2>
              </div>
              <div className="space-y-4 text-white/90">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-300">Contract Templates</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Professionally structured agreements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Industry-standard legal language
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Customizable terms and conditions
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-300">Legal Safeguards</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Comprehensive liability disclaimers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Platform indemnification clauses
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Severability and enforcement provisions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Protections */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Creator Legal Protections</h2>
              </div>
              <div className="space-y-4 text-white/90">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-300">Transparent Terms</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Clear compensation structures
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Explicit posting requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Defined termination conditions
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-300">Legal Rights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Independent legal review rights
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Dispute resolution procedures
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Intellectual property protections
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimers */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Scale className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Comprehensive Legal Disclaimers</h2>
              </div>
              <div className="space-y-6 text-white/90">
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
                  <h3 className="font-semibold text-red-300 mb-3">No Legal Advice</h3>
                  <p className="text-sm">The information provided on this platform is for general informational purposes only and should not be construed as legal advice. Users should not rely on this information as a substitute for professional legal counsel.</p>
                </div>
                
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-6">
                  <h3 className="font-semibold text-orange-300 mb-3">Independent Legal Review</h3>
                  <p className="text-sm">All parties are strongly encouraged to seek independent legal advice before entering into any agreements. StakeShare assumes no responsibility for the legal adequacy or enforceability of any contracts created using our templates.</p>
                </div>
                
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-300 mb-3">Limitation of Liability</h3>
                  <p className="text-sm">StakeShare shall not be liable for any damages, losses, or legal consequences arising from the use of our contract templates or platform services. Users agree to hold StakeShare harmless from any claims related to contract outcomes.</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Legal Best Practices</h2>
              </div>
              <div className="space-y-4 text-white/90">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-3">For Founders</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Consult with business attorneys familiar with creator economy</li>
                      <li>• Ensure compliance with local employment and contract laws</li>
                      <li>• Consider intellectual property and confidentiality protections</li>
                      <li>• Review tax implications of compensation structures</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-300 mb-3">For Creators</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Seek legal counsel specializing in entertainment law</li>
                      <li>• Understand your rights regarding content ownership</li>
                      <li>• Review compensation and payment terms carefully</li>
                      <li>• Ensure termination clauses are fair and reasonable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Need Legal Assistance?</h2>
              </div>
              <p className="text-white/80 mb-6">
                While we cannot provide legal advice, we recommend consulting with qualified attorneys who specialize in:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Business Law</h3>
                  <p className="text-sm text-white/70">Contract formation and business agreements</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Entertainment Law</h3>
                  <p className="text-sm text-white/70">Creator rights and content licensing</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Employment Law</h3>
                  <p className="text-sm text-white/70">Worker classification and labor compliance</p>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                <p className="text-sm text-yellow-100">
                  <strong>Remember:</strong> The cost of legal consultation is minimal compared to the potential risks of unenforceable or problematic contracts.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <Link 
              to="/home" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
