
import React, { useState, useEffect } from 'react';
import { Program, EligibilityRule, Company, Creator, User, Application, Conversation } from '@/api/entities';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, TrendingUp, Crown, Building, CheckCircle, XCircle, Calendar, MessageSquare, Share2 } from 'lucide-react';
import CreatorLinksDialog from '../components/creators/CreatorLinksDialog';
import ShareDialog from '../components/programs/ShareDialog'; // Import ShareDialog

export default function CreatorProgramDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const programId = searchParams.get('id');

    const [program, setProgram] = useState(null);
    const [company, setCompany] = useState(null);
    const [eligibility, setEligibility] = useState({ eligible: false, reasons: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [showLinksDialog, setShowLinksDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false); // State for share dialog

    useEffect(() => {
        const fetchData = async () => {
            if (!programId) {
                setIsLoading(false);
                return;
            }
            try {
                const prog = await Program.get(programId);
                const comp = prog.company_id ? await Company.get(prog.company_id) : null;
                setProgram(prog);
                setCompany(comp);

                const user = await User.me();
                
                // Robustly find the creator profile - same logic as other pages
                let creator = null;
                const creatorsByEmail = await Creator.filter({ email: user.email });
                if (creatorsByEmail.length > 0) {
                    creator = creatorsByEmail[0];
                } else {
                    // Fallback in case filter by email isn't perfectly supported or indexed
                    const allCreators = await Creator.list();
                    creator = allCreators.find(c => c.email === user.email);
                }

                const rules = await EligibilityRule.filter({ program_id: prog.id });
                checkEligibility(creator, rules);

                const apps = await Application.filter({ program_id: prog.id, created_by: user.email });
                setApplication(apps.length > 0 ? apps[0] : null);

            } catch (error) {
                console.error("Failed to fetch program details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [programId]);

    const checkEligibility = (creator, rules) => {
        if (!creator) {
            setEligibility({ eligible: false, reasons: ["Create a profile to check eligibility."] });
            return;
        }
        let isEligible = true;
        const reasons = [];
        rules.forEach(rule => {
            if (rule.min_followers && creator.total_followers < rule.min_followers) {
                isEligible = false;
                reasons.push(`Requires ${rule.min_followers.toLocaleString()} followers.`);
            }
        });
        setEligibility({ eligible: isEligible, reasons });
    };

    const handleApply = async () => {
        setIsApplying(true);
        try {
            const user = await User.me();
            // Use same robust creator lookup
            let creator = null;
            const creatorsByEmail = await Creator.filter({ email: user.email });
            if (creatorsByEmail.length > 0) {
                creator = creatorsByEmail[0];
            } else {
                const allCreators = await Creator.list();
                creator = allCreators.find(c => c.email === user.email);
            }
            
            if (!creator) {
                alert("Please create a creator profile before applying.");
                return;
            }
            const app = await Application.create({
                program_id: program.id,
                creator_id: creator.id
            });
            setApplication(app);
            alert("Application submitted successfully!");
        } catch (error) {
            console.error("Application failed:", error);
            alert("Failed to submit application.");
        } finally {
            setIsApplying(false);
        }
    };
    
    const handleMessageFounder = async () => {
        try {
            const user = await User.me();
            // Use same robust creator lookup
            let creator = null;
            const creatorsByEmail = await Creator.filter({ email: user.email });
            if (creatorsByEmail.length > 0) {
                creator = creatorsByEmail[0];
            } else {
                const allCreators = await Creator.list();
                creator = allCreators.find(c => c.email === user.email);
            }
            
            if (!creator) {
                alert("Please create a creator profile first.");
                return;
            }
            
            const existingConvs = await Conversation.filter({ program_id: program.id, creator_id: creator.id });
            let conversation;
            if (existingConvs.length > 0) {
                conversation = existingConvs[0];
            } else {
                // Fix: use created_by instead of created_by_user_id
                const programOwner = await User.filter({ email: program.created_by });
                const founderEmail = programOwner.length > 0 ? programOwner[0].email : program.created_by;
                
                conversation = await Conversation.create({
                    program_id: program.id,
                    creator_id: creator.id,
                    founder_email: founderEmail,
                    creator_email: user.email,
                    program_name: program.name,
                    creator_name: creator.name
                });
            }
            navigate(createPageUrl(`Messages?conversationId=${conversation.id}`));
        } catch (error) {
            console.error("Error starting conversation:", error);
            alert("Failed to start conversation. Please try again.");
        }
    };


    if (isLoading) return <div className="text-center p-12 text-white">Loading Program...</div>;
    if (!program) return <div className="text-center p-12 text-white">Program not found.</div>;

    const isApplied = !!application;
    const isApproved = application?.status === 'approved';

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate(createPageUrl('CreatorPrograms'))} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Programs
                </Button>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold">{program.name}</h1>
                        <p className="text-white/70 text-lg flex items-center gap-2 mt-1">
                            <Building className="w-5 h-5" />
                            {company?.name || "A Company"}
                        </p>
                    </div>
                     <Button variant="outline" className="glass" onClick={() => setShowShareDialog(true)}>
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                </div>


                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="glass-card p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-4">About This Program</h2>
                            <p className="text-white/80 mb-6">{program.description}</p>
                            <div className="grid grid-cols-3 gap-4 text-center border-y border-white/10 py-4">
                                <div>
                                    <Users className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                                    <p className="text-2xl font-bold">{program.max_creators}</p>
                                    <p className="text-sm text-white/60">Total Slots</p>
                                </div>
                                <div>
                                    <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-400" />
                                    <p className="text-2xl font-bold">{program.pool_percent_total}%</p>
                                    <p className="text-sm text-white/60">Equity Pool</p>
                                </div>
                                <div>
                                    <Crown className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                                    <p className="text-2xl font-bold">{program.default_allocation_percent}%</p>
                                    <p className="text-sm text-white/60">Per Creator</p>
                                </div>
                            </div>
                            {program.revenue_share_enabled && (
                                <div className="mt-4 bg-emerald-500/10 p-4 rounded-lg text-center">
                                    <p className="font-bold text-emerald-300">Revenue Share Bonus</p>
                                    <p>Earn an additional {program.revenue_share_percent}% of revenue you generate!</p>
                                </div>
                            )}
                            {program.application_deadline && (
                                <div className="flex items-center gap-2 mt-4 text-sm text-white/70">
                                    <Calendar className="w-4 h-4" />
                                    Applications close: {new Date(program.application_deadline).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        {company && (
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                                <p className="text-white/80 mb-4">{company.description}</p>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-300">
                                    Visit Website &rarr;
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-3">Eligibility Requirements</h3>
                            {eligibility.eligible ? (
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <CheckCircle className="w-5 h-5" />
                                    <p>You meet all requirements!</p>
                                </div>
                            ) : (
                                eligibility.reasons.map((reason, i) => (
                                    <div key={i} className="flex items-center gap-2 text-red-400">
                                        <XCircle className="w-5 h-5" />
                                        <p>{reason}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="glass-card p-6 rounded-2xl">
                             <h3 className="text-lg font-bold mb-4">Application</h3>
                            {isApplied ? (
                                <div>
                                    <Badge className="capitalize w-full justify-center py-2 text-base">{application.status.replace('_', ' ')}</Badge>
                                    {isApproved && (
                                        <Button onClick={() => setShowLinksDialog(true)} className="w-full mt-4">Manage Links</Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Button onClick={handleApply} disabled={!eligibility.eligible || isApplying} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 glow">
                                        {isApplying ? "Submitting..." : "Apply Now"}
                                    </Button>
                                    <Button onClick={handleMessageFounder} variant="outline" disabled={!eligibility.eligible} className="w-full glass">
                                        <MessageSquare className="w-4 h-4 mr-2"/>
                                        Message Founder
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {isApproved && (
                <CreatorLinksDialog
                    isOpen={showLinksDialog}
                    onOpenChange={setShowLinksDialog}
                    program={program}
                />
            )}
            <ShareDialog 
                isOpen={showShareDialog}
                onOpenChange={setShowShareDialog}
                programName={program.name}
                programDescription={program.description}
                pageUrl={window.location.href}
            />
        </>
    );
}
