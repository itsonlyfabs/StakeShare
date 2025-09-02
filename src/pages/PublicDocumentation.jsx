import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Rocket, 
  Users, 
  DollarSign, 
  Link2, 
  Shield, 
  BarChart3,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Copy,
  CheckCircle,
  MessageSquare,
  ToggleLeft
} from 'lucide-react';
import PublicNavigation from '../components/PublicNavigation';

export default function PublicDocumentation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const sections = [
    { id: 'overview', title: 'Overview', icon: Target },
    { id: 'founder-setup', title: 'Founder Setup', icon: Rocket },
    { id: 'creator-setup', title: 'Creator Setup', icon: Users },
    { id: 'messaging', title: 'Messaging System', icon: MessageSquare },
    { id: 'portals', title: 'Dual Portal System', icon: ToggleLeft },
    { id: 'tracking', title: 'Link Tracking', icon: Link2 },
    { id: 'payouts', title: 'Automated Payouts', icon: DollarSign },
    { id: 'contracts', title: 'Contract Enforcement', icon: Shield },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
    { id: 'fraud', title: 'Fraud Prevention', icon: AlertTriangle },
    { id: 'support', title: 'Support', icon: HelpCircle }
  ];

  const copySnippet = () => {
    const snippet = `<!-- StakeShare Conversion Tracking -->
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || localStorage.getItem('stakeshare_ref');
  
  if (refCode) {
    fetch('https://api.stakeshare.app/track/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode: refCode,
        customerEmail: 'REPLACE_WITH_CUSTOMER_EMAIL',
        conversionType: 'paid',
        revenueAmount: 0, // Replace with actual amount
        timestamp: new Date().toISOString()
      })
    });
  }
})();
</script>`;
    
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">StakeShare - Micro-Investor Platform</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                StakeShare transforms your best users into micro-investors by giving them tiny equity stakes (0.05-0.1% each) 
                in exchange for advocacy. Instead of traditional influencer marketing, creators become actual stakeholders in your company's success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Problems We Solve
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Complex contracts and manual tracking</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Disputes over attribution and payments</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-white/70">No long-term alignment between creators and companies</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Our Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Automated tracking and attribution</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Transparent real-time dashboards</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Equity alignment with seamless payouts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Built-in messaging and communication tools</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70">Dual portal system for founders and creators</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: "Create Program", desc: "Set equity pool and eligibility rules" },
                    { step: 2, title: "Recruit Creators", desc: "Invite or accept applications" },
                    { step: 3, title: "Generate Links", desc: "Automatic tracking URLs created" },
                    { step: 4, title: "Earn Together", desc: "Automated payouts based on performance" }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                        {item.step}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'messaging':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Built-in Messaging System</h2>
            
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Real-Time Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/80">
                  StakeShare includes a comprehensive messaging system that enables direct communication between founders and creators without leaving the platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">For Founders:</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Message creators directly from their profile</li>
                      <li>• Send program updates and announcements</li>
                      <li>• Coordinate campaign strategies</li>
                      <li>• Provide feedback on content performance</li>
                      <li>• Share exclusive company updates</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">For Creators:</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Ask questions about program requirements</li>
                      <li>• Request promotional materials</li>
                      <li>• Share content ideas for approval</li>
                      <li>• Report tracking or payout issues</li>
                      <li>• Build relationships with founders</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• Real-time messaging with instant notifications</li>
                    <li>• Conversation history and search functionality</li>
                    <li>• Unread message counters</li>
                    <li>• Message timestamps and delivery status</li>
                    <li>• Program-specific conversation threads</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'portals':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Dual Portal System</h2>
            
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Customized Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/80">
                  StakeShare features two distinct portal experiences designed specifically for founders and creators, with seamless role switching capabilities.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Founder Portal:</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Program management dashboard</li>
                      <li>• Creator recruitment and approval</li>
                      <li>• Analytics and performance tracking</li>
                      <li>• Payout management and history</li>
                      <li>• Company settings and integrations</li>
                      <li>• Bulk messaging to creators</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Creator Portal:</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Browse and apply to programs</li>
                      <li>• Track application status</li>
                      <li>• View earnings and equity stakes</li>
                      <li>• Generate tracking links</li>
                      <li>• Monitor click and conversion data</li>
                      <li>• Manage profile and social connections</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Role Switching:</h4>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• Instant switching between founder and creator views</li>
                    <li>• Maintains separate preferences for each role</li>
                    <li>• No need to log out and back in</li>
                    <li>• Perfect for users who are both founders and creators</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'founder-setup':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Founder Setup Guide</h2>
            
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Account Setup",
                  content: [
                    "Click 'Founder Login' and sign in with Google",
                    "Complete your company profile with basic information",
                    "Add company logo and description",
                    "Set up your founder profile and preferences"
                  ]
                },
                {
                  step: 2,
                  title: "Create Your First Program",
                  content: [
                    "Go to Dashboard → Programs → Create New Program",
                    "Set equity pool percentage (recommended: 1-3%)",
                    "Define creator eligibility rules and follower thresholds",
                    "Configure posting requirements and content guidelines",
                    "Set up legal requirements and compliance settings"
                  ]
                },
                {
                  step: 3,
                  title: "Setup Conversion Tracking",
                  content: [
                    "Option A (SaaS): Enter Stripe API keys for automatic tracking",
                    "Option B (E-commerce): Add tracking snippet to thank you pages",
                    "Test conversion tracking with a sample transaction",
                    "Configure UTM parameters and attribution settings"
                  ]
                },
                {
                  step: 4,
                  title: "Connect Payment Processing",
                  content: [
                    "Go to Settings → Integrations",
                    "Click 'Connect' under 'Enable Creator Payouts'",
                    "Complete Stripe Connect onboarding",
                    "Verify payout capabilities are enabled"
                  ]
                },
                {
                  step: 5,
                  title: "Recruit Creators",
                  content: [
                    "Go to Creators → Invite Creator",
                    "Send invitations to specific creators via email",
                    "Or make program public for open applications",
                    "Review applications and approve qualified creators",
                    "Use the messaging system to communicate with applicants"
                  ]
                }
              ].map((section, index) => (
                <Card key={index} className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {section.step}
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'creator-setup':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Creator Setup Guide</h2>
            
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Account Setup",
                  content: [
                    "Click 'Creator Login' and sign in with Google",
                    "Complete your creator profile with social stats",
                    "Connect your social media accounts for verification",
                    "Add bio and profile picture to increase approval chances"
                  ]
                },
                {
                  step: 2,
                  title: "Find and Apply to Programs",
                  content: [
                    "Browse available programs in Creator Portal",
                    "Check eligibility requirements (followers, engagement, etc.)",
                    "Read program details and terms carefully",
                    "Submit applications with compelling messages",
                    "Track application status in your dashboard"
                  ]
                },
                {
                  step: 3,
                  title: "Get Approved and Start Promoting",
                  content: [
                    "Once approved, access your program dashboard",
                    "Get your unique tracking URLs and referral codes",
                    "Download promotional materials and brand assets",
                    "Start creating content and sharing your links",
                    "Meet posting requirements to maintain good standing"
                  ]
                },
                {
                  step: 4,
                  title: "Track Performance and Earnings",
                  content: [
                    "Monitor clicks, conversions, and earnings in real-time",
                    "Use analytics to optimize your promotional strategy",
                    "Communicate with founders via the messaging system",
                    "Receive automated payouts based on performance",
                    "Build long-term relationships with multiple companies"
                  ]
                }
              ].map((section, index) => (
                <Card key={index} className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {section.step}
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Link Tracking System</h2>
            
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">How Link Tracking Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-300">Original URL:</div>
                  <div className="text-white/80 mb-2">https://yourcompany.com/signup</div>
                  <div className="text-green-300">Becomes:</div>
                  <div className="text-white/80">https://stakeshare.app/track?ref=XYZ123&utm_source=twitter&utm_campaign=growth_q1</div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Attribution Process:</h4>
                  {[
                    "Creator shares unique tracking link on social media",
                    "Customer clicks link → StakeShare records the click instantly",
                    "Customer gets redirected to your website seamlessly",
                    "Customer converts → Your website notifies StakeShare",
                    "Revenue and equity bonuses calculated automatically"
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-white/70">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Conversion Tracking Snippet
                  <Button
                    onClick={copySnippet}
                    size="sm"
                    variant="outline"
                    className="glass border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedSnippet ? 'Copied!' : 'Copy'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Add this snippet to your website's "Thank You" or confirmation pages:
                </p>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-green-300">{`<!-- StakeShare Conversion Tracking -->
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || localStorage.getItem('stakeshare_ref');
  
  if (refCode) {
    fetch('https://api.stakeshare.app/track/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode: refCode,
        customerEmail: 'REPLACE_WITH_CUSTOMER_EMAIL',
        conversionType: 'paid',
        revenueAmount: 0, // Replace with actual amount
        timestamp: new Date().toISOString()
      })
    });
  }
})();
</script>`}</pre>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-300/20">
                  Replace placeholder values with actual customer data
                </Badge>
              </CardContent>
            </Card>
          </div>
        );

      case 'payouts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Automated Payouts</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Sharing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-sm text-white/70">Example:</div>
                    <div className="text-white">Creator generates $1,000 revenue</div>
                    <div className="text-white">5% revenue share = $50 bonus</div>
                    <div className="text-green-400">Paid automatically via Stripe</div>
                  </div>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>• Paid within 24 hours of conversion</li>
                    <li>• Minimum payout: $10</li>
                    <li>• Full transaction transparency</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Equity Bonuses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-sm text-white/70">Example:</div>
                    <div className="text-white">0.1% equity stake allocated</div>
                    <div className="text-white">Company valued at $1M</div>
                    <div className="text-green-400">$1,000 phantom equity value</div>
                  </div>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>• Paid monthly based on milestones</li>
                    <li>• Cash equivalent of equity value</li>
                    <li>• Performance-based bonuses</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payout Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Automated Triggers:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-300">Revenue Share</Badge>
                      <p className="text-white/70 text-sm">Triggered immediately upon conversion verification</p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-purple-500/20 text-purple-300">Equity Bonus</Badge>
                      <p className="text-white/70 text-sm">Monthly payouts based on performance milestones</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="font-semibold text-white mb-2">Transparency Features:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Real-time payout calculations</li>
                      <li>• Complete transaction history</li>
                      <li>• Tax documentation (1099 forms)</li>
                      <li>• Dispute resolution system</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'contracts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Contract Enforcement</h2>
            
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Automated Legal Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Agreement Generation:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Auto-generated legal terms per program</li>
                      <li>• Digital signatures with timestamps</li>
                      <li>• Equity allocation specifications</li>
                      <li>• Revenue sharing calculations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Legal Protections:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Phantom equity (no actual shares)</li>
                      <li>• Revenue sharing caps</li>
                      <li>• Termination clauses</li>
                      <li>• Dispute resolution procedures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold text-white">Posting Requirements:</h4>
                <div className="bg-slate-900 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Minimum posts per month tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Required hashtags verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Branded content compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Automatic non-compliance warnings</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-white">Revenue Verification:</h4>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>• All conversions logged with customer emails</li>
                  <li>• Revenue amounts verified against payments</li>
                  <li>• Fraud detection for invalid conversions</li>
                  <li>• Full audit trails for disputes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics & Reporting</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Founder Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Badge className="bg-blue-500/20 text-blue-300">Program Performance</Badge>
                    <p className="text-white/70 text-sm">Conversion rates by creator and program</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-green-500/20 text-green-300">Revenue Attribution</Badge>
                    <p className="text-white/70 text-sm">Total revenue generated by each creator</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-purple-500/20 text-purple-300">ROI Analysis</Badge>
                    <p className="text-white/70 text-sm">Cost per acquisition vs. creator payouts</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-orange-500/20 text-orange-300">Creator Rankings</Badge>
                    <p className="text-white/70 text-sm">Top performers by revenue and engagement</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Creator Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300">Click Performance</Badge>
                    <p className="text-white/70 text-sm">Link clicks and click-through rates</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-indigo-500/20 text-indigo-300">Conversion Tracking</Badge>
                    <p className="text-white/70 text-sm">Customers acquired and conversion rates</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-emerald-500/20 text-emerald-300">Earnings Summary</Badge>
                    <p className="text-white/70 text-sm">Revenue share and equity bonuses earned</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-rose-500/20 text-rose-300">Performance Trends</Badge>
                    <p className="text-white/70 text-sm">Month-over-month growth analytics</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Key Metrics Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">Click-Through Rate</div>
                    <p className="text-white/70 text-sm">Percentage of clicks that convert</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">Customer LTV</div>
                    <p className="text-white/70 text-sm">Lifetime value of referred customers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">Creator ROI</div>
                    <p className="text-white/70 text-sm">Return on investment per creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'fraud':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Fraud Prevention</h2>
            
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Anti-Fraud Measures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Detection Systems:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">IP Monitoring</div>
                          <p className="text-white/70 text-sm">Detect suspicious click patterns and bot traffic</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Conversion Verification</div>
                          <p className="text-white/70 text-sm">Cross-reference with actual payment data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Email Validation</div>
                          <p className="text-white/70 text-sm">Verify customer emails against known databases</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Quality Assurance:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Link Validation</div>
                          <p className="text-white/70 text-sm">Ensure all tracking links are functional</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Attribution Accuracy</div>
                          <p className="text-white/70 text-sm">Regular audits of conversion attribution</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Creator Vetting</div>
                          <p className="text-white/70 text-sm">Verification of social media metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Risk Mitigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Automatic Flags:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Unusual click patterns from same IP address</li>
                      <li>• Conversions without corresponding payment data</li>
                      <li>• Suspicious email domains or formats</li>
                      <li>• High-value payouts requiring manual review</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Manual Review Process:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Flagged transactions reviewed within 24 hours</li>
                      <li>• Creators notified of any issues or disputes</li>
                      <li>• Appeal process for disputed transactions</li>
                      <li>• Account suspension for repeated violations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Support & Resources</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Get Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Founder Support</div>
                        <p className="text-white/70 text-sm">help@stakeshare.app</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Creator Support</div>
                        <p className="text-white/70 text-sm">creators@stakeshare.app</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Technical Issues</div>
                        <p className="text-white/70 text-sm">Use the feedback button in-app</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Founders:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• 30-50% reduction in customer acquisition cost</li>
                      <li>• 80%+ creator retention after first payout</li>
                      <li>• 2-5x faster growth through creator advocacy</li>
                      <li>• Authentic promotion from invested creators</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">For Creators:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• $100-$5,000+ monthly passive income</li>
                      <li>• Equity stakes in multiple companies</li>
                      <li>• Audience monetization without ads</li>
                      <li>• Long-term value from company growth</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Technical Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Minimum Requirements:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                      <li>• JavaScript enabled for tracking functionality</li>
                      <li>• Stripe account for payment processing (founders)</li>
                      <li>• Social media accounts for creator verification</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Supported Integrations:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Payment: Stripe, PayPal (coming soon)</li>
                      <li>• E-commerce: Shopify, WooCommerce snippets</li>
                      <li>• Analytics: Google Analytics, UTM support</li>
                      <li>• Social: Twitter, Instagram, YouTube, TikTok, LinkedIn</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center p-12">
            <h3 className="text-xl font-bold text-white mb-4">Section Coming Soon</h3>
            <p className="text-white/70">This documentation section is being developed. Check back soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Card className="glass-card sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Documentation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            activeSection === section.id
                              ? 'bg-white/10 text-white border-r-2 border-blue-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Card className="glass-card">
                <CardContent className="p-8">
                  {renderContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}