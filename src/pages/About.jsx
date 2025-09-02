
import React from 'react';
import { Sparkles, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import PublicNavigation from '../components/PublicNavigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-4 rounded-full mb-6">
              <img 
                src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                alt="StakeShare Logo" 
                className="w-16 h-16 object-cover opacity-80"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About StakeShare</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              We're on a mission to democratize startup investing and create a new, more aligned creator economy.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-12 space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <Target className="w-10 h-10 text-purple-400" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-white/70 leading-relaxed">
                  We believe the most passionate users and advocates should be able to share in the success of the companies they love. Traditional funding models are closed off, and influencer marketing lacks long-term alignment. StakeShare bridges this gap, turning creators from advertisers into true partners.
                </p>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-900/80 to-blue-900/80 rounded-xl flex items-center justify-center p-6">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop" alt="Team collaborating" className="rounded-lg object-cover w-full h-full shadow-2xl" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 order-2 md:order-1">
                <Users className="w-10 h-10 text-cyan-400" />
                <h2 className="text-3xl font-bold">For Founders & Creators</h2>
                <p className="text-white/70 leading-relaxed">
                  For founders, we provide a powerful new channel for growth, driven by authentic advocates who are invested in your success. For creators, we offer a way to build a portfolio of equity in exciting startups, monetizing influence in a way that provides long-term value beyond a single paid post.
                </p>
              </div>
              <div className="h-64 bg-gradient-to-br from-cyan-900/80 to-indigo-900/80 rounded-xl flex items-center justify-center p-6 order-1 md:order-2">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop" alt="People working together" className="rounded-lg object-cover w-full h-full shadow-2xl" />
              </div>
            </div>
          </div>

          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl text-white/70 mb-8">Become part of the new creator economy.</p>
            <div className="flex gap-4 justify-center">
              <Link to={createPageUrl("home")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">
                  I'm a Founder
                </Button>
              </Link>
              <Link to={createPageUrl("home")}>
                <Button size="lg" variant="outline" className="glass border-white/20 text-white hover:bg-white/10">
                  I'm a Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
