import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Company } from '@/api/entities';

export default function StripeConnectHandler({ company, onStatusUpdate }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const initiateStripeConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Mock Stripe account creation - in production this would call your backend
      const mockAccount = {
        id: `acct_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        charges_enabled: false,
        payouts_enabled: false,
        details_submitted: false,
      };

      // Update company with mock Stripe account ID
      await Company.update(company.id, {
        stripe_account_id: mockAccount.id,
        stripe_account_status: {
          charges_enabled: false,
          payouts_enabled: false,
          details_submitted: false,
        }
      });

      // Mock account link - in production this would redirect to real Stripe onboarding
      setSuccess('Stripe Connect setup initiated! In production, you would be redirected to Stripe onboarding.');
      
      // Simulate completion after a few seconds
      setTimeout(async () => {
        const updatedStatus = {
          charges_enabled: true,
          payouts_enabled: true,
          details_submitted: true,
        };
        
        await Company.update(company.id, {
          stripe_account_status: updatedStatus
        });
        
        onStatusUpdate(updatedStatus);
        setSuccess('Stripe account successfully connected and verified!');
      }, 3000);

    } catch (err) {
      console.error('Stripe Connect error:', err);
      setError(err.message || 'Failed to connect to Stripe. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const checkStripeStatus = async (accountId) => {
    try {
      // Mock status check - in production this would call your backend
      const mockStatus = {
        charges_enabled: true,
        payouts_enabled: true,
        details_submitted: true,
      };

      // Update company record
      await Company.update(company.id, {
        stripe_account_status: mockStatus
      });

      onStatusUpdate(mockStatus);
      return mockStatus;

    } catch (err) {
      console.error('Failed to check Stripe status:', err);
      setError('Failed to verify Stripe account status.');
      return null;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/50 border-green-500/50 text-white">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={initiateStripeConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow"
      >
        {isConnecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isConnecting ? 'Connecting...' : 'Connect to Stripe'}
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      <div className="text-sm text-white/70">
        <p>• Stripe will securely collect your business details</p>
        <p>• You'll be redirected back here after setup</p>
        <p>• Enable payouts and revenue sharing features</p>
        <p className="text-amber-400 mt-2">🚧 Demo Mode: This will simulate Stripe onboarding</p>
      </div>
    </div>
  );
}