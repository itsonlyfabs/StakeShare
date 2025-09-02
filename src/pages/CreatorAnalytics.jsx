
import React, { useState, useEffect } from 'react';
import { User, Creator, Application, Conversion, Payout, Program, CreatorLink } from '@/api/entities';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, MousePointerClick, Target, Percent, Gift, Crown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { BarChart3 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
            <p className="text-white/70">{title}</p>
            <Icon className="w-6 h-6 text-white/50" />
        </div>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-lg text-white">
        <p className="label font-bold">{format(new Date(label), "MMM d, yyyy")}</p>
        {payload.map((pld, index) => (
           <p key={index} style={{ color: pld.color }}>
             {`${pld.name}: ${pld.dataKey.includes('revenue') ? '$' : ''}${pld.value.toLocaleString()}`}
           </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CreatorAnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        clicks: 0,
        conversions: 0,
        revenue: 0,
        earnings: 0,
        conversionRate: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [programPerformance, setProgramPerformance] = useState([]);
    const [payouts, setPayouts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // For demo purposes, we will fetch all data regardless of the specific creator.
                // In a production app, you would filter these by a specific creator_id.
                const [
                    links, 
                    conversions, 
                    payoutsData,
                    applications,
                    allPrograms
                ] = await Promise.all([
                    CreatorLink.list(),
                    Conversion.list(),
                    Payout.list(),
                    Application.filter({ status: 'approved' }),
                    Program.list()
                ]);

                // --- STATS CALCULATION (Aggregated) ---
                const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
                const totalConversions = conversions.length;
                const totalRevenue = conversions.reduce((acc, c) => acc + (c.revenue_amount || 0), 0);
                
                const programMap = new Map(allPrograms.map(p => [p.id, p]));

                const totalEarnings = conversions.reduce((acc, c) => {
                    const program = programMap.get(c.program_id);
                    if (program && program.revenue_share_enabled) {
                        return acc + (c.revenue_amount * (program.revenue_share_percent / 100));
                    }
                    return acc;
                }, 0);

                setStats({
                    clicks: totalClicks,
                    conversions: totalConversions,
                    revenue: totalRevenue / 100,
                    earnings: totalEarnings / 100,
                    conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0,
                });
                
                // --- PROGRAM PERFORMANCE (Aggregated) ---
                const approvedProgramIds = new Set(applications.map(a => a.program_id));
                const creatorPrograms = allPrograms.filter(p => approvedProgramIds.has(p.id));

                const performanceData = creatorPrograms.map(prog => {
                    const progLinks = links.filter(l => l.program_id === prog.id);
                    const progConversions = conversions.filter(c => c.program_id === prog.id);
                    
                    const progClicks = progLinks.reduce((acc, link) => acc + (link.clicks || 0), 0);
                    const progRevenue = progConversions.reduce((acc, conv) => acc + (conv.revenue_amount || 0), 0);
                    const progEarnings = prog.revenue_share_enabled ? (progRevenue * (prog.revenue_share_percent / 100)) : 0;
                    
                    return {
                        id: prog.id,
                        name: prog.name,
                        clicks: progClicks,
                        conversions: progConversions.length,
                        revenue: progRevenue / 100,
                        earnings: progEarnings / 100
                    };
                });
                setProgramPerformance(performanceData);
                
                // --- CHART DATA (Aggregated) ---
                const dataByDate = conversions.reduce((acc, c) => {
                    const date = format(new Date(c.created_date), 'yyyy-MM-dd');
                    if (!acc[date]) {
                        acc[date] = { conversions: 0, revenue: 0 };
                    }
                    acc[date].conversions += 1;
                    acc[date].revenue += (c.revenue_amount || 0) / 100;
                    return acc;
                }, {});

                const sortedChartData = Object.entries(dataByDate)
                    .map(([date, values]) => ({ date, ...values }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setChartData(sortedChartData);

                // --- PAYOUTS (Aggregated) ---
                setPayouts(payoutsData);

            } catch (error) {
                console.error("Error fetching creator analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div className="text-white text-center p-12">Loading your analytics...</div>;
    }

    if (!isLoading && stats.clicks === 0 && stats.conversions === 0) {
        return (
            <div className="glass-card p-12 rounded-2xl text-center">
                <BarChart3 className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">No Analytics Data Yet</h2>
                <p className="text-white/70 mt-4">Once you start sharing your links and getting conversions, your data will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">My Analytics</h1>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Clicks" value={stats.clicks.toLocaleString()} icon={MousePointerClick} />
                <StatCard title="Total Conversions" value={stats.conversions.toLocaleString()} icon={Target} />
                <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={Percent} />
                <StatCard title="Revenue Generated" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} />
                <StatCard title="My Earnings" value={`$${stats.earnings.toLocaleString()}`} icon={Gift} />
                <StatCard title="Approved Programs" value={programPerformance.length} icon={Crown} />
            </div>

            {/* Charts */}
            <div className="glass-card p-6 rounded-2xl">
                 <h2 className="text-2xl font-bold mb-6">Performance Over Time</h2>
                 <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" tickFormatter={(str) => format(new Date(str), "MMM d")} />
                        <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Conversions', angle: -90, position: 'insideLeft', fill: '#8884d8' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Revenue ($)', angle: -90, position: 'insideRight', fill: '#82ca9d' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#8884d8" name="Conversions" />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Program Performance */}
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Program Performance</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/10 hover:bg-transparent">
                                <TableHead className="text-white/80">Program</TableHead>
                                <TableHead className="text-white/80">Clicks</TableHead>
                                <TableHead className="text-white/80">Conversions</TableHead>
                                <TableHead className="text-white/80">Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programPerformance.map(p => (
                                <TableRow key={p.id} className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{p.name}</TableCell>
                                    <TableCell>{p.clicks}</TableCell>
                                    <TableCell>{p.conversions}</TableCell>
                                    <TableCell>${p.earnings.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Payout History */}
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Payout History</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/10 hover:bg-transparent">
                                <TableHead className="text-white/80">Date</TableHead>
                                <TableHead className="text-white/80">Amount</TableHead>
                                <TableHead className="text-white/80">Type</TableHead>
                                <TableHead className="text-white/80">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map(p => (
                                <TableRow key={p.id} className="border-b-white/10 hover:bg-white/5">
                                    <TableCell>{format(new Date(p.created_date), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>${(p.amount_cents / 100).toLocaleString()}</TableCell>
                                    <TableCell className="capitalize">{p.payout_type.replace('_', ' ')}</TableCell>
                                    <TableCell>
                                        <Badge className="capitalize">{p.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {payouts.length === 0 && (
                                <TableRow><TableCell colSpan="4" className="text-center py-8 text-white/70">No payouts yet.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
