import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function PortalRouter() {
    useEffect(() => {
        const routeUser = async () => {
            try {
                // Always fetch fresh user data to get the latest preferred_dashboard
                const user = await User.me();
                const preferredDashboard = user.preferred_dashboard || 'founder';
                
                let destinationUrl;
                if (preferredDashboard === 'creator') {
                    destinationUrl = createPageUrl('CreatorDashboard');
                } else {
                    destinationUrl = createPageUrl('Dashboard');
                }

                // **CRITICAL FIX**: Use window.location.href for a full page reload.
                // This forces the Layout component to remount and fetch the new user state correctly.
                window.location.href = destinationUrl;

            } catch (error) {
                // Not logged in, go to home with a full page reload as well.
                window.location.href = createPageUrl('home');
            }
        };

        routeUser();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p>Routing to your dashboard...</p>
            </div>
        </div>
    );
}