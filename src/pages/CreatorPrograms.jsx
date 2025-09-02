
import React, { useState, useEffect } from 'react';
import { Program, EligibilityRule, Creator, Application, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { createPageUrl } from '@/utils';

const ProgramCard = ({ program, rules, creator, onViewDetails, existingApplication, isLoadingCreator }) => {
    const checkEligibility = () => {
        if (isLoadingCreator) return { eligible: false, reasons: ['Checking eligibility...'] };
        if (!creator) return { eligible: false, reasons: ['Create a profile to check eligibility.'] };
        let isEligible = true;
        const reasons = [];

        rules.forEach(rule => {
            if (rule.min_followers && creator.total_followers < rule.min_followers) {
                isEligible = false;
                reasons.push(`Requires ${rule.min_followers.toLocaleString()} followers (you have ${creator.total_followers.toLocaleString()}).`);
            }
            // Add more rule checks here (engagement, etc.)
        });
        return { eligible: isEligible, reasons };
    };

    const { eligible, reasons } = checkEligibility();
    const hasApplied = !!existingApplication;
    const applicationStatus = existingApplication?.status;

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                <p className="text-white/70 mb-4 h-12 line-clamp-2">{program.description}</p>
                <div className="flex items-center gap-4 text-sm border-t border-white/10 pt-4 mb-4">
                    <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-blue-400" /> {program.max_creators} Slots</div>
                    <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-green-400" /> {program.pool_percent_total}% Pool</div>
                </div>
                <div className="space-y-2 text-sm">
                    {isLoadingCreator && (
                        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Checking eligibility...</div>
                    )}
                    {!isLoadingCreator && eligible && (
                        <div className="flex items-center gap-2 text-emerald-400"><CheckCircle className="w-4 h-4" /> You are eligible to apply.</div>
                    )}
                    {!isLoadingCreator && !eligible && (
                        reasons.map((reason, i) => (
                           <div key={i} className="flex items-center gap-2 text-red-400"><XCircle className="w-4 h-4" /> {reason}</div>
                        ))
                    )}
                </div>
            </div>
            <div className="mt-6">
                 {hasApplied ? (
                    <Button disabled className="w-full capitalize" variant="outline">{applicationStatus}</Button>
                 ) : (
                    <Button onClick={() => onViewDetails(program.id)} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white glow">
                        {isLoadingCreator ? <Loader2 className="w-4 h-4 animate-spin" /> : 'View Details'}
                    </Button>
                 )}
            </div>
        </div>
    );
};

export default function CreatorProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [rules, setRules] = useState([]);
    const [creator, setCreator] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();

                // Robustly find the creator profile
                let foundCreator = null;
                const creatorsByEmail = await Creator.filter({ email: user.email });
                if (creatorsByEmail.length > 0) {
                    foundCreator = creatorsByEmail[0];
                } else {
                    // Fallback in case filter by email isn't perfectly supported or indexed
                    const allCreators = await Creator.list();
                    foundCreator = allCreators.find(c => c.email === user.email);
                }
                setCreator(foundCreator);

                // Fetch other data
                const [progs, allRules, appsData] = await Promise.all([
                    Program.filter({ status: 'active' }),
                    EligibilityRule.list(),
                    Application.filter({ created_by: user.email })
                ]);
                setPrograms(progs);
                setRules(allRules);
                setApplications(appsData);

            } catch (error) {
                console.error("Error fetching data for programs page:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    // This handleApply function is no longer called directly from ProgramCard's button
    // It remains in case another part of the page or a future details page uses it
    const handleApply = async (programId) => {
        if (!creator) return;
        await Application.create({
            program_id: programId,
            creator_id: creator.id,
        });
        // Re-fetch applications to update the UI
        const appsData = await Application.filter({ created_by: creator.email });
        setApplications(appsData);
    };

    const handleViewDetails = (programId) => {
        // Use createPageUrl for navigation
        navigate(createPageUrl(`CreatorProgramDetails?id=${programId}`)); 
    };

    if (isLoading) {
        return <div className="text-white text-center p-12">Loading programs...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-2">Browse Programs</h1>
            <p className="text-white/70 text-lg mb-8">Find the next company you want to invest in.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map(prog => (
                    <ProgramCard 
                        key={prog.id} 
                        program={prog}
                        rules={rules.filter(r => r.program_id === prog.id)}
                        creator={creator}
                        onViewDetails={handleViewDetails} // Changed from onApply to onViewDetails
                        existingApplication={applications.find(a => a.program_id === prog.id)}
                        isLoadingCreator={isLoading}
                    />
                ))}
            </div>
        </div>
    );
}
