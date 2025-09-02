import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, auth } from '@/lib/supabase';
import { createPageUrl } from '@/utils';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the stored role from localStorage
        const role = localStorage.getItem('stakeshare_role');
        
        if (!role) {
          setStatus('error');
          setMessage('No role specified. Please try logging in again.');
          return;
        }

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        if (data.session) {
          // User is authenticated
          const user = data.session.user;
          
          // Store user info and role
          localStorage.setItem('stakeshare_user', JSON.stringify({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url,
            role: role
          }));

          // Clear the role from localStorage
          localStorage.removeItem('stakeshare_role');

          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect based on role
          setTimeout(() => {
            if (role === 'founder') {
              navigate(createPageUrl('dashboard'));
            } else if (role === 'creator') {
              navigate(createPageUrl('CreatorDashboard'));
            } else {
              navigate(createPageUrl('home'));
            }
          }, 2000);

        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in again.');
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="text-center glass-card p-12 rounded-2xl max-w-md">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                alt="StakeShare Logo" 
                className="w-12 h-12 object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mb-4">Processing Login</h1>
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-white/80">{message}</p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-green-400">Success!</h1>
            <p className="text-white/80">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
            <p className="text-white/80 mb-6">{message}</p>
            <button 
              onClick={() => navigate(createPageUrl('home'))}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}