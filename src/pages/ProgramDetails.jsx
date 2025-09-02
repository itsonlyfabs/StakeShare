
import React, { useState, useEffect } from 'react';
import { Program, Application, Creator } from '@/api/entities';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // This badge is no longer used in this file but might be in other components if it's a shared component. Keeping it here as per instruction "preserving all other features, elements and functionality".
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // This avatar is no longer used in this file but might be in other components. Keeping it.
import { ArrowLeft, Users, BarChart3, Settings, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // These table components are no longer used in this file but might be in other components. Keeping them.

import ProgramDashboard from '../components/programs/ProgramDashboard';
import ProgramSettings from '../components/programs/ProgramSettings';
import ApplicantsTable from '../components/programs/ApplicantsTable';
import ShareDialog from '../components/programs/ShareDialog'; // Import ShareDialog

const statusColors = {
  applied: "bg-blue-100/20 text-blue-300 border-blue-300/20",
  under_review: "bg-yellow-100/20 text-yellow-300 border-yellow-300/20",
  approved: "bg-emerald-100/20 text-emerald-300 border-emerald-300/20",
  rejected: "bg-red-100/20 text-red-300 border-red-300/20"
};

export default function ProgramDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('id');

  const [program, setProgram] = useState(null);
  const [applications, setApplications] = useState([]);
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false); // State for share dialog

  const loadProgramData = async () => {
    setIsLoading(true);
    try {
      const [prog, apps, creats] = await Promise.all([
        Program.get(programId),
        Application.filter({ program_id: programId }),
        Creator.list()
      ]);
      setProgram(prog);
      setApplications(apps);
      setCreators(creats);
    } catch (err) {
      console.error("Failed to fetch program details:", err);
      setProgram(null); // Ensure program is null if fetching fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (programId) {
      loadProgramData();
    } else {
      setIsLoading(false);
    }
  }, [programId]);

  const handleApplicationUpdate = () => {
    // Re-fetch data when an application status is changed
    loadProgramData();
  };

  if (isLoading) return <div className="p-8 text-white text-center">Loading program details...</div>;
  if (!program) return <div className="p-8 text-white text-center">Program not found.</div>;

  const approvedApplications = applications.filter(a => a.status === 'approved');
  const pendingApplications = applications.filter(a => a.status === 'applied' || a.status === 'under_review');
  
  // Map creators to applications
  const enrichedPendingApps = pendingApplications.map(app => ({
    ...app,
    creator: creators.find(c => c.id === app.creator_id)
  })).filter(app => app.creator); // Filter out apps where creator is not found

  const enrichedApprovedApps = approvedApplications.map(app => ({
    ...app,
    creator: creators.find(c => c.id === app.creator_id)
  })).filter(app => app.creator); // Filter out apps where creator is not found

  return (
    <>
      <div className="p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("Programs"))}
                className="glass border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{program.name}</h1>
                <p className="text-white/70">Manage your program and view applicants.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="glass" onClick={() => setShowShareDialog(true)}>
                <Share2 className="w-4 h-4 mr-2" /> Share Program
              </Button>
              <Link to={createPageUrl(`CreateProgram?id=${programId}`)}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 glow">
                  <Settings className="w-4 h-4 mr-2" /> Edit Program
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-card p-1 h-auto mb-6">
              <TabsTrigger value="dashboard" className="py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"><BarChart3 className="w-4 h-4 mr-2"/>Dashboard</TabsTrigger>
              <TabsTrigger value="pending_applicants" className="py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2"/>Pending ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="approved_creators" className="py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2"/>Approved ({approvedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"><Settings className="w-4 h-4 mr-2"/>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <ProgramDashboard program={program} applications={applications} />
            </TabsContent>
            <TabsContent value="pending_applicants">
              <ApplicantsTable 
                applications={enrichedPendingApps} 
                onUpdate={handleApplicationUpdate} 
                title="Pending Applicants"
              />
            </TabsContent>
            <TabsContent value="approved_creators">
              <ApplicantsTable 
                applications={enrichedApprovedApps} 
                onUpdate={handleApplicationUpdate} 
                title="Approved Creators"
              />
            </TabsContent>
            <TabsContent value="settings">
              <ProgramSettings program={program} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ShareDialog 
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
        programName={program.name}
        programDescription={program.description}
        pageUrl={window.location.href.replace('/ProgramDetails', '/CreatorProgramDetails')}
      />
    </>
  );
}
