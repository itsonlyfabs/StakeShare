
import React, { useState, useEffect } from 'react';
import { Company } from '@/api/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Puzzle, KeyRound, Settings as SettingsIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ConversionSnippet from '../components/integration/ConversionSnippet';

const ProfileSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-medium text-white">Company Profile</h3>
      <p className="text-sm text-white/60">Update your company's profile information.</p>
    </div>
    <div className="space-y-4 max-w-lg">
       <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" defaultValue="TechFlow SaaS" className="glass border-white/20"/>
       </div>
       <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" defaultValue="https://techflow.com" className="glass border-white/20"/>
       </div>
    </div>
    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">Save Changes</Button>
  </div>
);

const BillingSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-medium text-white">Billing</h3>
      <p className="text-sm text-white/60">Manage your subscription and payment methods.</p>
    </div>
    <div className="border border-white/10 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-2xl">
        <div>
            <p className="font-semibold text-white">Growth Plan</p>
            <p className="text-sm text-white/70">$199 per month. Next payment on Sep 1, 2024.</p>
        </div>
        <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 flex-shrink-0">Manage Subscription</Button>
    </div>
  </div>
);

const IntegrationsSettings = () => {
  const [company, setCompany] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [stripeStatus, setStripeStatus] = useState(null); // Local state for Stripe detailed status
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  const checkStripeStatus = async (accountId) => {
    try {
      const response = await fetch('/api/functions/checkStripeAccountStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId })
      });

      const result = await response.json();
      if (result.success) {
        setStripeStatus(result.account); // Update local status
        
        // Update company record in database and local state with latest status
        if (company && company.id) { // Ensure company is not null
          await Company.update(company.id, {
            stripe_account_status: {
              charges_enabled: result.account.charges_enabled,
              payouts_enabled: result.account.payouts_enabled,
              details_submitted: result.account.details_submitted
            }
          });
          // Update the component's company state to reflect the persisted status
          setCompany(prev => ({
            ...prev,
            stripe_account_status: {
              charges_enabled: result.account.charges_enabled,
              payouts_enabled: result.account.payouts_enabled,
              details_submitted: result.account.details_submitted
            }
          }));
        }
      } else {
        console.error("Failed to check Stripe status:", result.error);
        setStripeStatus(null); // Clear status if check fails
        // If check fails, assume account is not properly connected or state is invalid, reset in DB
        if (company && company.id) {
            await Company.update(company.id, { stripe_account_id: null, stripe_account_status: null });
            setCompany(prev => ({ ...prev, stripe_account_id: null, stripe_account_status: null }));
        }
      }
    } catch (error) {
      console.error('Error checking Stripe status:', error);
      setStripeStatus(null); // Clear status on network error
      // If error, assume account is not properly connected or state is invalid, reset in DB
      if (company && company.id) {
          await Company.update(company.id, { stripe_account_id: null, stripe_account_status: null });
          setCompany(prev => ({ ...prev, stripe_account_id: null, stripe_account_status: null }));
      }
    }
  };

  useEffect(() => {
    const fetchAndHandleStripeStatus = async () => {
      // Always fetch latest company data first
      const companies = await Company.list();
      let currentCompany = null;
      if (companies.length > 0) {
        currentCompany = companies[0];
        setCompany(currentCompany); // Set the company state
      }

      // Handle Stripe return/refresh from query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const stripeReturn = urlParams.get('stripe_return');
      const stripeRefresh = urlParams.get('stripe_refresh');

      // If returning from Stripe, re-fetch company data to ensure we have the latest stripe_account_id
      // Then check its status.
      if (stripeReturn === 'true' || stripeRefresh === 'true') {
        const updatedCompanies = await Company.list(); // Re-fetch to ensure latest data from DB
        const updatedCompany = updatedCompanies.length > 0 ? updatedCompanies[0] : null;

        if (updatedCompany) {
          setCompany(updatedCompany); // Update local state with latest company data
          if (updatedCompany.stripe_account_id) {
            await checkStripeStatus(updatedCompany.stripe_account_id);
          } else {
             // If after return, stripe_account_id is still null, it means connection failed or wasn't completed.
             setStripeStatus(null);
          }
        }

        // Clean up URL parameters to prevent re-triggering on refresh
        urlParams.delete('stripe_return');
        urlParams.delete('stripe_refresh');
        const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
        window.history.replaceState({}, document.title, newUrl);
      } else if (currentCompany && currentCompany.stripe_account_id) {
        // If not returning from Stripe, but company already has a stripe_account_id, check its status
        await checkStripeStatus(currentCompany.stripe_account_id);
      }
    };
    fetchAndHandleStripeStatus();
  }, []); // Empty dependency array means this runs once on mount

  const handleConnectStripe = async () => {
    setIsConnecting(true);

    try {
      const returnUrl = `${window.location.origin}/settings?stripe_return=true`;
      const refreshUrl = `${window.location.origin}/settings?stripe_refresh=true`;

      // Ensure company data is available before proceeding
      if (!company || !company.id) {
        alert("Company data not loaded. Please try again.");
        setIsConnecting(false);
        return;
      }

      const response = await fetch('/api/functions/initiateStripeConnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: company.id,
          returnUrl,
          refreshUrl
        })
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Redirect to Stripe onboarding
        window.location.href = result.url;
      } else {
        alert(`Failed to connect to Stripe: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
      alert('Failed to connect to Stripe. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveStripeKeys = async () => {
    alert("In a real application, these keys would be saved securely to a backend vault, not the database. This is a placeholder action.");
    // In a real scenario:
    // await saveApiKeysToSecureVault({ companyId: company.id, stripeSecretKey, stripeWebhookSecret });
  };
  
  const isConnected = !!company?.stripe_account_id;
  // Prefer the status stored in `company` state, as it's persisted and represents the source of truth
  const currentStripeStatus = company?.stripe_account_status;
  const isFullySetup = currentStripeStatus?.payouts_enabled && currentStripeStatus?.details_submitted;
  const webhookUrl = `https://api.stakeshare.app/webhooks/stripe?companyId=${company?.id}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-white">Integrations</h3>
        <p className="text-sm text-white/60">Connect StakeShare to your payment and social platforms.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Stripe Payouts (Connect) */}
        <div className="border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 1: Enable Creator Payouts</h3>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">S</div>
              <div>
                <p className="font-semibold text-white">Stripe Connect</p>
                <p className="text-sm text-white/60">Required for creator payouts</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10 disabled:opacity-70"
              onClick={handleConnectStripe}
              disabled={isConnecting || (isConnected && isFullySetup)}
            >
              {isConnecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isConnecting ? 'Connecting...' : (isConnected ? (isFullySetup ? 'Connected' : 'Continue Setup') : 'Connect')}
            </Button>
          </div>

          {isConnected && currentStripeStatus && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Account Status</span>
                <Badge variant={isFullySetup ? "default" : "secondary"} className="glass">
                  {isFullySetup ? "Active" : "Setup Required"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {currentStripeStatus.charges_enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-white/70">Charges Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentStripeStatus.payouts_enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-white/70">Payouts Enabled</span>
                </div>
              </div>

              {!isFullySetup && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">
                    Complete your Stripe setup to enable automatic creator payouts. Click "Continue Setup" to proceed.
                  </p>
                </div>
              )}
            </div>
          )}
           {isConnected && !currentStripeStatus && !isConnecting && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-300 text-sm flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching Stripe status...
                </p>
              </div>
           )}
           {!isConnected && !isConnecting && (
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                Connect your Stripe account to enable payments and payouts.
              </p>
            </div>
           )}
        </div>

        {/* Stripe API for Conversion Tracking */}
        <div className="border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Step 2: Automate Conversion Tracking (for SaaS)</h3>
            <p className="text-sm text-white/60">
              For SaaS using Stripe Checkout, connect your API keys to enable fully automated conversion tracking without needing any code on your site.
            </p>
            <div className="space-y-2">
                <Label htmlFor="stripe-key">Stripe Secret Key</Label>
                <Input id="stripe-key" type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} className="glass border-white/20" placeholder="sk_live_..."/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="webhook-secret">Stripe Webhook Signing Secret</Label>
                <Input id="webhook-secret" type="password" value={stripeWebhookSecret} onChange={(e) => setStripeWebhookSecret(e.target.value)} className="glass border-white/20" placeholder="whsec_..."/>
            </div>
            <div className="space-y-2">
                <Label>Your Unique Webhook URL</Label>
                 <div className="flex items-center gap-2">
                    <Input readOnly value={webhookUrl} className="glass border-white/20 text-white/70"/>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(webhookUrl)}>Copy</Button>
                </div>
                <p className="text-xs text-white/60">Add this URL in your Stripe Dashboard under Developers &gt; Webhooks. Subscribe to the `checkout.session.completed` event.</p>
            </div>
            <Button onClick={handleSaveStripeKeys} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">Save Stripe Keys</Button>
        </div>


        {/* Website Tracking Snippet for E-commerce / Custom Sites */}
        <div className="border border-white/10 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Step 2 (Alternative): Manual Tracking Snippet</h3>
          <p className="text-sm text-white/60">
            If you're not using Stripe Checkout (e.g., Shopify, custom site), use a snippet.
            Choose your platform below to get the correct code.
          </p>
          {company?.id ? (
            <ConversionSnippet companyId={company.id} />
          ) : (
            <div className="text-center p-4 glass rounded-lg">
                <p className="text-white/70">Company ID not found. Please ensure your company profile is saved.</p>
            </div>
          )}
        </div>

        {/* Social Media Integrations */}
        <div className="border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-sky-500 flex items-center justify-center text-white font-bold">X</div>
            <p className="font-semibold text-white">X (Twitter)</p>
          </div>
          <Button disabled variant="outline" className="glass border-white/20 text-white/50">Coming Soon</Button>
        </div>

        <div className="border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-pink-500 flex items-center justify-center text-white font-bold">I</div>
            <p className="font-semibold text-white">Instagram</p>
          </div>
          <Button disabled variant="outline" className="glass border-white/20 text-white/50">Coming Soon</Button>
        </div>
      </div>
    </div>
  );
};

const APISettings = () => (
    <div className="space-y-6">
    <div>
      <h3 className="text-xl font-medium text-white">API Keys</h3>
      <p className="text-sm text-white/60">Manage API keys for custom integrations.</p>
    </div>
    <div className="space-y-4 max-w-lg">
        <div className="border border-white/10 rounded-lg p-4 flex justify-between items-center">
            <p className="font-mono text-sm text-white/80">pk_live_******************</p>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/50">Revoke</Button>
        </div>
    </div>
    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 glow">Generate New Key</Button>
  </div>
);

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8"/> Settings
            </h1>
            <p className="text-white/70 text-lg">Manage your account and company settings.</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 md:gap-8">
          <TabsList className="grid grid-cols-4 md:grid-cols-1 gap-1 md:gap-2 p-1 bg-white/5 rounded-lg md:w-48 md:h-fit flex-shrink-0">
              <TabsTrigger value="profile" className="flex items-center justify-center md:justify-start gap-2 data-[state=active]:bg-white/15 data-[state=active]:text-white p-3 rounded-md text-white/70 text-xs md:text-sm whitespace-nowrap">
                  <User className="w-4 h-4"/>
                  <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center justify-center md:justify-start gap-2 data-[state=active]:bg-white/15 data-[state=active]:text-white p-3 rounded-md text-white/70 text-xs md:text-sm whitespace-nowrap">
                  <CreditCard className="w-4 h-4"/>
                  <span className="hidden md:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center justify-center md:justify-start gap-2 data-[state=active]:bg-white/15 data-[state=active]:text-white p-3 rounded-md text-white/70 text-xs md:text-sm whitespace-nowrap">
                  <Puzzle className="w-4 h-4"/>
                  <span className="hidden md:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center justify-center md:justify-start gap-2 data-[state=active]:bg-white/15 data-[state=active]:text-white p-3 rounded-md text-white/70 text-xs md:text-sm whitespace-nowrap">
                  <KeyRound className="w-4 h-4"/>
                  <span className="hidden md:inline">API</span>
              </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
              <TabsContent value="profile"><ProfileSettings /></TabsContent>
              <TabsContent value="billing"><BillingSettings /></TabsContent>
              <TabsContent value="integrations"><IntegrationsSettings /></TabsContent>
              <TabsContent value="api"><APISettings /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
