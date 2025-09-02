
import React, { useState, useEffect } from 'react';
import { Creator, Application, Conversion, User, Program } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, DollarSign, FileText, Trash2, XCircle } from 'lucide-react';

const statusColors = {
    applied: "bg-blue-100/20 text-blue-300 border-blue-300/20",
    under_review: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
    approved: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
    rejected: "bg-red-100/20 text-red-300 border-red-300/20"
};

export default function CreatorDashboard() {
    const [creator, setCreator] = useState(null);
    const [applications, setApplications] = useState([]);
    const [appliedPrograms, setAppliedPrograms] = useState([]);
    const [conversions, setConversions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null); // Added user state

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const user = await User.me();
            setUser(user); // Set user state
            
            let existingCreator = null;
            const creatorsByEmail = await Creator.filter({ email: user.email });
            if (creatorsByEmail.length > 0) {
                existingCreator = creatorsByEmail[0];
            } else {
                const allCreators = await Creator.list();
                existingCreator = allCreators.find(c => c.email === user.email);
            }

            if (existingCreator) {
                setCreator(existingCreator);
                
                const [apps, convs, progs] = await Promise.all([
                    Application.filter({ creator_id: existingCreator.id }),
                    Conversion.filter({ creator_id: existingCreator.id }),
                    Program.list()
                ]);

                const programMap = new Map(progs.map(p => [p.id, p]));
                const enrichedApplications = apps.map(app => ({
                    ...app,
                    programName: programMap.get(app.program_id)?.name || 'Unknown Program'
                })).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

                setApplications(apps);
                setAppliedPrograms(enrichedApplications);
                setConversions(convs);
            } else {
                setCreator(null);
            }
        } catch (error) {
            console.error("Dashboard - Error fetching creator data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleSwitch = async () => {
        try {
            const stored = localStorage.getItem('stakeshare_user');
            const current = stored ? JSON.parse(stored) : null;
            if (current) {
                current.role = 'founder';
                localStorage.setItem('stakeshare_user', JSON.stringify(current));
            }
            window.location.href = createPageUrl('Dashboard');
        } catch (error) {
            console.error("Error switching role:", error);
            alert("Failed to switch to founder mode. Please try again.");
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelApplication = async (applicationId) => {
        if (window.confirm("Are you sure you want to withdraw your application? This cannot be undone.")) {
            try {
                await Application.delete(applicationId);
                alert("Application withdrawn successfully.");
                fetchData(); // Re-fetch data to update the list
            } catch (error) {
                console.error("Error cancelling application:", error);
                alert("Failed to withdraw application.");
            }
        }
    };
    
    const handleRemoveListing = (applicationId) => {
        // This hides the application from the view without deleting it from the database
        setAppliedPrograms(currentPrograms => currentPrograms.filter(p => p.id !== applicationId));
    };

    if (isLoading) return <div className="text-center p-12 text-white">Loading Creator Dashboard...</div>;

    if (!creator) {
        return (
            <div className="text-center p-12 glass-card rounded-2xl">
                <h1 className="text-2xl font-bold mb-4">Welcome, Creator!</h1>
                <p className="text-white/80 mb-6">It looks like you don't have a creator profile yet. Create one to get started!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to={createPageUrl('CreatorProfile')}>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white glow">Create My Profile</Button>
                    </Link>
                    <Button onClick={handleRoleSwitch} variant="outline" className="border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white">
                        Switch to Founder
                    </Button>
                </div>
            </div>
        );
    }
    
    const totalRevenue = conversions.reduce((sum, c) => sum + (c.revenue_amount || 0), 0) / 100;
    const approvedApplicationsCount = applications.filter(a => a.status === 'approved').length;

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Hello, {creator.name} 👋</h1>
                    <p className="text-white/70 text-base md:text-lg">Here's a summary of your activity on StakeShare.</p>
                </div>
                <Button onClick={handleRoleSwitch} variant="outline" className="border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white whitespace-nowrap">
                    Switch to Founder
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-6 text-center shadow-lg hover:bg-white/15 transition-all duration-300">
                    <FileText className="w-5 h-5 md:w-8 md:h-8 text-blue-400 mb-1 md:mb-2 mx-auto" />
                    <p className="text-xl md:text-4xl font-bold text-white">{applications.length}</p>
                    <p className="text-white/70 text-xs md:text-sm">Applications</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-6 text-center shadow-lg hover:bg-white/15 transition-all duration-300">
                    <Crown className="w-5 h-5 md:w-8 md:h-8 text-purple-400 mb-1 md:mb-2 mx-auto" />
                    <p className="text-xl md:text-4xl font-bold text-white">{approvedApplicationsCount}</p>
                    <p className="text-white/70 text-xs md:text-sm">Approved</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-6 text-center shadow-lg hover:bg-white/15 transition-all duration-300">
                    <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-emerald-400 mb-1 md:mb-2 mx-auto" />
                    <p className="text-xl md:text-4xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    <p className="text-white/70 text-xs md:text-sm">Revenue</p>
                </div>
            </div>

            {/* My Applications Section */}
            <div className="glass-card p-6 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold mb-6">My Applications</h2>
                <div className="space-y-4">
                    {appliedPrograms.length > 0 ? appliedPrograms.map(app => (
                        <div key={app.id} className="glass rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all flex-wrap">
                            <div className="min-w-0 flex-grow pr-2 py-1">
                                <p className="font-semibold text-lg">{app.programName}</p>
                                <p className="text-sm text-white/60">Applied on {new Date(app.created_date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
                                <Badge className={`${statusColors[app.status]} border capitalize whitespace-nowrap`}>
                                    {app.status.replace('_', ' ')}
                                </Badge>
                                {['applied', 'under_review'].includes(app.status) && (
                                    <Button size="sm" variant="destructive" onClick={() => handleCancelApplication(app.id)} className="whitespace-nowrap">
                                        <XCircle className="w-4 h-4 mr-1 sm:mr-2" />
                                        Withdraw
                                    </Button>
                                )}
                                {['approved', 'rejected'].includes(app.status) && (
                                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white whitespace-nowrap" onClick={() => handleRemoveListing(app.id)}>
                                        <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-white/70 py-4">You haven't applied to any programs yet.</p>
                    )}
                </div>
            </div>

            <div className="glass-card p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to find your next partnership?</h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">Browse active programs and apply to become a micro-investor for exciting new companies.</p>
                <Link to={createPageUrl('CreatorPrograms')}>
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white glow">
                        Browse Programs <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
