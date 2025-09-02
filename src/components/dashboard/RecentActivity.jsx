import React, { useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ applications = [], conversions = [], creators = [] }) {
    
    const creatorMap = useMemo(() => {
        if (!creators || creators.length === 0) return {};
        return creators.reduce((acc, creator) => {
            acc[creator.id] = creator;
            return acc;
        }, {});
    }, [creators]);

    const safeApplications = Array.isArray(applications) ? applications : [];
    const safeConversions = Array.isArray(conversions) ? conversions : [];

    const recentActivity = useMemo(() => [
        ...safeApplications.map(app => ({
            type: 'application',
            data: app,
            timestamp: app.created_date
        })),
        ...safeConversions.map(conv => ({
            type: 'conversion',
            data: conv,
            timestamp: conv.created_date
        }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8), [safeApplications, safeConversions]);

    const getCreatorName = (creatorId) => {
        return creatorMap[creatorId]?.name || 'a creator';
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3" />
                Recent Activity
            </h2>

            <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                activity.type === 'application'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                                {activity.type === 'application' ? <Users className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="text-white font-medium">
                                    {activity.type === 'application'
                                        ? `New application from ${getCreatorName(activity.data.creator_id)}`
                                        : `Conversion from ${getCreatorName(activity.data.creator_id)}`
                                    }
                                </p>
                                <p className="text-white/60 text-sm">
                                    {activity.type === 'application' && `Status: ${activity.data.status}`}
                                    {activity.type === 'conversion' && `+ $${((activity.data.revenue_amount || 0) / 100).toFixed(2)}`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                             {activity.timestamp && (
                                <Badge variant="outline" className="glass border-white/20 text-white/70">
                                    {format(new Date(activity.timestamp), 'MMM d')}
                                </Badge>
                             )}
                        </div>
                    </div>
                ))}

                {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-white/30 mx-auto mb-3" />
                        <p className="text-white/60">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
}