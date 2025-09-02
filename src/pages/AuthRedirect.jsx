import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth } from '@/lib/supabase';
import { createPageUrl } from '@/utils';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AuthRedirectPage() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Preparing your secure login...");

    useEffect(() => {
        const role = searchParams.get('role');
        
        if (!role) {
            setMessage("Error: Login role is missing.");
            return;
        }

        try {
            setMessage(`Redirecting to Google login as ${role}...`);
            // Store the role in localStorage for the callback
            localStorage.setItem('stakeshare_role', role);
            // Initiate Google OAuth through Supabase
            auth.signInWithGoogle(role);
        } catch (e) {
            console.error("Login redirect failed:", e);
            setMessage("Could not initiate login process. Please try again.");
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
            <div className="text-center glass-card p-12 rounded-2xl">
                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <img 
                    src="https://tcmkyzcbndmaqxfjvpfs.supabase.co/storage/v1/object/public/images/StakeShare%20logo.png" 
                    alt="StakeShare Logo" 
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-4">StakeShare Login</h1>
                <div className="flex items-center justify-center gap-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-white/80">{message}</p>
                </div>
            </div>
        </div>
    );
}