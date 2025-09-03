import React, { useState, useEffect } from "react";
import { Program, Application, Conversion, User, Creator } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BarChart3 } from "lucide-react";

import StatsGrid from "@/components/dashboard/StatsGrid";
import ProgramList from "@/components/dashboard/ProgramList";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [programsData, applicationsData, conversionsData, userData, creatorsData] = await Promise.all([
        Program.list("-created_date"),
        Application.list("-created_date", 10),
        Conversion.list("-created_date", 50),
        User.me(),
        Creator.list(),
      ]);
      
      setPrograms(programsData);
      setApplications(applicationsData);
      setConversions(conversionsData);
      setUser(userData);
      setCreators(creatorsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handleRoleSwitch = async () => {
    try {
      const stored = localStorage.getItem('stakeshare_user');
      const current = stored ? JSON.parse(stored) : null;
      if (current) {
        current.role = 'creator';
        localStorage.setItem('stakeshare_user', JSON.stringify(current));
      }
      window.location.href = createPageUrl('CreatorDashboard');
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Failed to switch to creator mode. Please try again.");
    }
  };

  const stats = {
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.status === 'active').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'applied').length,
    totalRevenue: conversions.reduce((sum, c) => sum + (c.revenue_amount || 0), 0) / 100,
    totalConversions: conversions.length
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-white/70">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, Founder 👋
              </h1>
              <p className="text-white/70 text-base md:text-lg">
                {programs.length === 0 
                  ? "Ready to launch your first micro-investor program?"
                  : `You have ${stats.activePrograms} active programs.`
                }
              </p>
            </div>
            <Button onClick={handleRoleSwitch} variant="outline" className="glass border-white/20 text-white hover:bg-white/10 whitespace-nowrap">
              Switch to Creator
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl("Analytics")}>
              <Button variant="outline" className="w-full sm:w-auto glass border-white/20 text-white hover:bg-white/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <QuickActions />
          </div>
        </div>
        
        <StatsGrid stats={stats} isLoading={isLoading} />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProgramList programs={programs.slice(0, 5)} />
          </div>
          <div>
            <RecentActivity applications={applications} conversions={conversions} creators={creators} />
          </div>
        </div>
      </div>
    </div>
  );
}