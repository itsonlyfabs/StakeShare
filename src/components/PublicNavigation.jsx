import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';
import { Sparkles } from 'lucide-react';

export default function PublicNavigation() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // This is the key change: force the top-level window to navigate.
    // This breaks out of the iframe and avoids the Google login error.
    const authUrl = window.location.origin + createPageUrl(`AuthRedirect?role=${role}`);
    window.top.location.href = authUrl;
  };

  return (
    <nav className="glass-card border-0 border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={createPageUrl('home')} className="flex items-center gap-3">
          <img 
            src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
            alt="StakeShare Logo" 
            className="w-10 h-10 rounded-xl object-cover opacity-80"
            style={{ opacity: 0.8, filter: 'opacity(80%)' }}
          />
          <span className="font-bold text-white text-xl">StakeShare</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleLogin('creator')} variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            Creator Login
          </Button>
          <Button onClick={() => handleLogin('founder')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 glow">
            Founder Login
          </Button>
        </div>
      </div>
    </nav>
  );
}