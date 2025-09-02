
import React, { useState, useEffect } from 'react';
import { Program, Creator, Conversion } from "@/api/entities";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 rounded-lg text-white">
        <p className="label font-bold">{label}</p>
        <p className="intro text-sm">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [conversions, setConversions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [convData, creatorData] = await Promise.all([
        Conversion.list('-created_date'),
        Creator.list(),
      ]);
      setConversions(convData);
      setCreators(creatorData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalRevenue = conversions.reduce((acc, c) => acc + (c.revenue_amount || 0), 0) / 100;
  const conversionRate = creators.length > 0 ? ((conversions.filter(c=>c.conversion_type === "paid").length / creators.length) * 100).toFixed(1) : 0;
  
  const conversionsByDay = conversions.reduce((acc, c) => {
    const date = new Date(c.created_date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const conversionChartData = Object.entries(conversionsByDay)
    .map(([date, count]) => ({ date, conversions: count }))
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  const revenueByCreator = creators.map(creator => {
    const creatorConversions = conversions.filter(c => c.creator_id === creator.id);
    const revenue = creatorConversions.reduce((acc, c) => acc + (c.revenue_amount || 0), 0) / 100;
    return { name: creator.name, revenue };
  }).sort((a,b) => b.revenue - a.revenue).slice(0, 10);

  if (loading) return <div className="text-white p-8">Loading analytics...</div>;

  return (
    <div className="p-8 text-white">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-white/70">Performance insights for your programs.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <DollarSign className="w-6 h-6 text-green-400 mb-2"/>
            <p className="text-white/70">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-blue-400 mb-2"/>
            <p className="text-white/70">Total Conversions</p>
            <p className="text-3xl font-bold">{conversions.length}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <Users className="w-6 h-6 text-purple-400 mb-2"/>
            <p className="text-white/70">Active Creators</p>
            <p className="text-3xl font-bold">{creators.length}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <Target className="w-6 h-6 text-pink-400 mb-2"/>
            <p className="text-white/70">Conversion Rate</p>
            <p className="text-3xl font-bold">{conversionRate}%</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Conversions Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#8884d8" strokeWidth={2} dot={{r:4}} activeDot={{r:8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Top Creators by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCreator} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis type="number" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis type="category" dataKey="name" stroke="rgba(255, 255, 255, 0.7)" width={80} tick={{ fontSize: 12 }}/>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="url(#colorUv)" />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
