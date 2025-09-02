import React from 'react';
import { Mail, HelpCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicNavigation from '../components/PublicNavigation';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6">We'd love to hear from you. Here's how you can reach us.</p>
            
            <div className="flex justify-center items-center gap-4">
              <a 
                href="https://x.com/coachfabs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>@coachfabs</span>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl space-y-4">
              <Mail className="w-10 h-10 text-cyan-400" />
              <h2 className="text-2xl font-bold">General Inquiries</h2>
              <p className="text-white/70">For general questions, partnerships, or media inquiries, please email us.</p>
              <Button asChild variant="link" className="text-cyan-400 p-0 text-lg">
                <a href="mailto:hello@stakeshare.app">hello@stakeshare.app</a>
              </Button>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-4">
              <HelpCircle className="w-10 h-10 text-purple-400" />
              <h2 className="text-2xl font-bold">Founder Support</h2>
              <p className="text-white/70">Need help setting up your program or have a technical question? Reach out to our founder support team.</p>
              <Button asChild variant="link" className="text-purple-400 p-0 text-lg">
                <a href="mailto:founders@stakeshare.app">founders@stakeshare.app</a>
              </Button>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-4 md:col-span-2">
              <Users className="w-10 h-10 text-pink-400" />
              <h2 className="text-2xl font-bold">Creator Support</h2>
              <p className="text-white/70">If you're a creator with questions about applying to programs or getting paid, our creator success team is here for you.</p>
              <Button asChild variant="link" className="text-pink-400 p-0 text-lg">
                <a href="mailto:creators@stakeshare.app">creators@stakeshare.app</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}