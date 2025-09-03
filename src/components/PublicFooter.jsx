import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertTriangle } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png"
                alt="StakeShare Logo"
                className="w-8 h-8 rounded-lg object-cover opacity-80"
                style={{ opacity: 0.8, filter: 'opacity(80%)' }}
              />
              <span className="font-bold text-white">StakeShare</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The micro-investor platform for modern startups and creators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link to={createPageUrl("PublicDocumentation")} className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><Link to={createPageUrl("About")} className="hover:text-white transition-colors">About</Link></li>
              <li><Link to={createPageUrl("Blog")} className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to={createPageUrl("Contact")} className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <a
                  href={createPageUrl('PublicDocumentation') + '?section=legal-disclaimers'}
                  className="hover:text-white transition-colors"
                >
                  Legal & Disclaimers
                </a>
              </li>
              <li><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to={createPageUrl("TermsOfService")} className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to={createPageUrl("Security")} className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to={createPageUrl("Compliance")} className="hover:text-white transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-sm">
          © 2024 StakeShare. All rights reserved.
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-white/70 text-xs">
              <strong>Legal Notice:</strong> Contract templates are for informational purposes only. We recommend consulting qualified legal counsel before use.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


