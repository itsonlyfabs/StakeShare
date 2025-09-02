import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3, Settings } from "lucide-react";

const actions = [
  {
    title: "Create Program",
    description: "Launch a new micro-investor cohort",
    icon: Plus,
    url: "CreateProgram",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "View Creators",
    description: "Manage your creator network",
    icon: Users,
    url: "Creators",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Analytics",
    description: "Track performance metrics",
    icon: BarChart3,
    url: "Analytics",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Settings",
    description: "Configure your account",
    icon: Settings,
    url: "Settings",
gradient: "from-orange-500 to-red-500"
  }
];

export default function QuickActions() {
  return (
    <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Quick Actions</h3>
      
      <div className="space-y-2 md:space-y-3">
        {actions.map((action, index) => (
          <Link key={index} to={createPageUrl(action.url)}>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-3 md:p-4 h-auto hover:bg-white/10 text-left group transition-all duration-200"
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${action.gradient} rounded-lg md:rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-white/90 text-sm md:text-base">
                  {action.title}
                </div>
                <div className="text-white/60 text-xs md:text-sm">
                  {action.description}
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}