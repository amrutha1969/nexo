import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { Users, Clock, TrendingUp, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { time: '9AM', count: 12 },
  { time: '10AM', count: 18 },
  { time: '11AM', count: 25 },
  { time: '12PM', count: 30 },
  { time: '1PM', count: 22 },
  { time: '2PM', count: 15 },
  { time: '3PM', count: 28 },
  { time: '4PM', count: 35 },
];

interface AdminDashboardProps {
  currentToken: number;
  onUpdateToken: (token: number) => void;
}

export const AdminDashboard = ({ currentToken, onUpdateToken }: AdminDashboardProps) => {
  const [isCalling, setIsCalling] = useState(false);

  const handleNext = () => {
    setIsCalling(true);
    setTimeout(() => {
      onUpdateToken(currentToken + 1);
      setIsCalling(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Admin Console</h2>
        <p className="text-zinc-500">Managing: City General Hospital</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <Users className="w-5 h-5 text-indigo-600" />
            <Badge variant="success">+12%</Badge>
          </div>
          <p className="text-2xl font-bold text-indigo-950">45</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Tokens</p>
        </Card>
        <Card className="p-4 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <Clock className="w-5 h-5 text-emerald-600" />
            <Badge variant="warning">High</Badge>
          </div>
          <p className="text-2xl font-bold text-indigo-950">14m</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avg Wait Time</p>
        </Card>
      </div>

      {/* Queue Control */}
      <Card className="p-8 bg-indigo-950 text-white space-y-6">
        <div className="text-center space-y-1">
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Now Serving</p>
          <h3 className="text-7xl font-black">#{currentToken}</h3>
        </div>
        
        <div className="flex gap-4">
          <Button 
            className="flex-1 bg-white text-indigo-950 hover:bg-indigo-50 h-16 text-lg"
            onClick={handleNext}
            isLoading={isCalling}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Call Next
          </Button>
          <Button variant="outline" className="h-16 w-16 border-white/20 text-white hover:bg-white/10">
            <CheckCircle2 className="w-6 h-6" />
          </Button>
        </div>
      </Card>

      {/* Analytics Chart */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Peak Hour Analysis
        </h3>
        <Card className="p-6 h-64 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-indigo-950">Recent Check-ins</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-600">
                  {i + 20}
                </div>
                <div>
                  <p className="font-bold text-sm text-indigo-950">Customer #{i + 20}</p>
                  <p className="text-xs text-zinc-400">Arrived 2 mins ago</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
