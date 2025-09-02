import React, { useState, useEffect } from 'react';
import { User, Company } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Building, Rocket } from 'lucide-react';
import { EmailTemplates } from '../services/EmailTemplates';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const steps = [
  { id: 1, title: 'Company Profile', icon: Building },
  { id: 2, title: 'Get Started', icon: Rocket }
];

export default function FounderOnboardingFlow({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    User.me().then(setUser).catch(console.error);
  }, []);

  const handleCompanyDataChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate company data
      if (!companyData.name || !companyData.industry) {
        alert('Please fill out company name and industry.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Create company record
      const company = await Company.create(companyData);
      
      // Send welcome email
      if (user) {
        await EmailTemplates.sendFounderWelcome({
          founderName: user.full_name,
          founderEmail: user.email,
          companyName: companyData.name,
          dashboardLink: `${window.location.origin}${createPageUrl('Dashboard')}`
        });
      }

      onComplete();
      navigate(createPageUrl('Dashboard'));
      
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to StakeShare!</h1>
          <p className="text-white/70">Let's set up your company profile to get started</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2 bg-white/10" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id ? 'bg-purple-500 border-purple-500' : 'border-white/20'
                }`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <p className={`mt-2 text-sm ${currentStep >= step.id ? 'text-white' : 'text-white/60'}`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Tell us about your company</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input 
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => handleCompanyDataChange('name', e.target.value)}
                    className="glass border-white/20"
                    placeholder="e.g., Acme SaaS Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={companyData.industry} onValueChange={(value) => handleCompanyDataChange('industry', value)}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="glass-card bg-slate-800/90 text-white border-slate-700">
                      <SelectItem value="saas">SaaS / Software</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="healthtech">Healthtech</SelectItem>
                      <SelectItem value="edtech">Edtech</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    type="url"
                    value={companyData.website}
                    onChange={(e) => handleCompanyDataChange('website', e.target.value)}
                    className="glass border-white/20"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description"
                    value={companyData.description}
                    onChange={(e) => handleCompanyDataChange('description', e.target.value)}
                    className="glass border-white/20 h-24"
                    placeholder="Brief description of what your company does..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white">You're all set!</h2>
              
              <div className="text-left bg-white/5 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-white mb-3">🎯 Next steps:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                    <p className="text-white/80 text-sm">Create your first micro-investor program</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                    <p className="text-white/80 text-sm">Set up payment processing for creator payouts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                    <p className="text-white/80 text-sm">Invite creators to join your program</p>
                  </div>
                </div>
              </div>

              <p className="text-white/70">
                We've sent a welcome email with helpful resources to get you started!
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            className="glass border-white/20 text-white hover:bg-white/10"
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 glow"
          >
            {isSubmitting ? 'Setting up...' : currentStep === steps.length ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}