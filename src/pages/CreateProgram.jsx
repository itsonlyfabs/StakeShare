import React, { useState, useEffect } from "react";
import { Program, EligibilityRule, Company, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, BarChart3, CheckCircle, AlertCircle, FileText, Users as UsersIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Step1Details from "../components/programs/Step1Details";
import Step2Eligibility from "../components/programs/Step2Eligibility";
import Step3Requirements from "../components/programs/Step3Requirements";
import Step4Review from "../components/programs/Step4Review";

const steps = [
  { id: 1, name: "Program Details", icon: CheckCircle },
  { id: 2, name: "Eligibility Rules", icon: Target },
  { id: 3, name: "Legal & Posting", icon: FileText },
  { id: 4, name: "Review & Launch", icon: BarChart3 },
];

export default function CreateProgramPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [programData, setProgramData] = useState({
    name: "",
    description: "",
    pool_percent_total: 1,
    default_allocation_percent: 0.1,
    max_creators: 20,
    revenue_share_enabled: false,
    revenue_share_percent: 5,
    application_deadline: null,
    legal_requirements: {
      terms_required: true,
      nda_required: false,
      custom_agreement: "",
      compliance_jurisdiction: "us",
    },
    posting_requirements: {
      min_posts_per_month: 4,
      required_content_types: ["post"],
      branded_content_required: true,
      hashtag_requirements: [],
      mention_requirements: [],
      tracking_enabled: true,
    }
  });
  const [eligibilityRules, setEligibilityRules] = useState([
    { platform: 'twitter', min_followers: 1000, min_engagement_rate: 1, min_account_age_days: 30, verified_only: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const storedUser = localStorage.getItem('stakeshare_user');
        if (!storedUser) {
          setError("User not authenticated. Please log in again.");
          return;
        }
        const user = JSON.parse(storedUser);

        // Prefer company created by this user (Supabase prod), else fall back to any local mock company
        let companies = [];
        try {
          companies = await Company.filter({ created_by: user.email });
        } catch (_) {
          // ignore and try listing all
        }
        if (!companies || companies.length === 0) {
          try {
            companies = await Company.list();
          } catch (_) {
            companies = [];
          }
        }

        if (companies && companies.length > 0) {
          const company = companies[0];
          setCompanyId(company.id);
          // Store company data in programData for use in contracts
          setProgramData(prev => ({
            ...prev,
            company: company
          }));
          setError(null);
          return;
        }

        // If still none found (e.g., fresh local mock), create a lightweight default company for this user
        const emailDomain = (user.email || '').split('@')[1] || 'example.com';
        const defaultName = (emailDomain.split('.')[0] || 'MyCompany') + ' Inc.';
        const created = await Company.create({
          name: defaultName,
          website: `https://${emailDomain}`,
          created_by: user.email
        });
        setCompanyId(created.id);
        // Store company data in programData for use in contracts
        setProgramData(prev => ({
          ...prev,
          company: created
        }));
        setError(null);
      } catch (e) {
        console.error("Error fetching company:", e);
        setError("Could not verify user or company. Please log in again.");
      }
    };
    fetchCompany();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDataChange = (data) => {
    setProgramData((prev) => ({ ...prev, ...data }));
  };

  const handleRulesChange = (rules) => {
    setEligibilityRules(rules);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!companyId) {
      setError("Cannot create a program without an associated company.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newProgram = await Program.create({ ...programData, company_id: companyId, status: 'active' });
      
      const rulesToCreate = eligibilityRules.map(rule => ({
        ...rule,
        program_id: newProgram.id,
      }));

      if (rulesToCreate.length > 0) {
        await EligibilityRule.bulkCreate(rulesToCreate);
      }
      
      navigate(createPageUrl("Programs"));
    } catch (err) {
      console.error("Failed to create program:", err);
      setError(`Failed to create program. ${err.message || ''}`);
    }
    setIsSubmitting(false);
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="glass border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Program</h1>
            <p className="text-white/70">Launch your next micro-investor cohort.</p>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-8">
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progressPercentage} className="h-2 bg-white/10" />
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id ? 'bg-purple-500 border-purple-500' : 'border-white/20'
                  }`}>
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className={`mt-2 text-sm text-center ${currentStep >= step.id ? 'text-white' : 'text-white/60'}`}>
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <Step1Details data={programData} onDataChange={handleDataChange} />
            )}
            {currentStep === 2 && (
              <Step2Eligibility rules={eligibilityRules} onRulesChange={handleRulesChange} />
            )}
            {currentStep === 3 && (
              <Step3Requirements data={programData} onDataChange={handleDataChange} />
            )}
            {currentStep === 4 && (
              <Step4Review programData={programData} eligibilityRules={eligibilityRules} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 glow">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !companyId}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 glow disabled:opacity-50"
              >
                {isSubmitting ? "Launching..." : "Launch Program"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}