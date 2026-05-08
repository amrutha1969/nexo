import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Button, Card, Badge, cn } from './components/ui';
import { AdminDashboard } from './components/AdminDashboard';
import { Notifications } from './components/Notifications';
import { MOCK_BUSINESSES, MOCK_TOKENS } from './services/mockData';
import { calculateSmartArrival, getMockTravelTime } from './lib/engine';
import { Clock, MapPin, Users, ArrowRight, Navigation, Zap, Calendar, Search, ShieldCheck, User, Settings, CreditCard, HelpCircle, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRole, setUserRole] = useState<'Customer' | 'BusinessOwner'>('Customer');
  const [activeTab, setActiveTab] = useState('home');
  const [myToken, setMyToken] = useState<any>(MOCK_TOKENS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shared State for the Demo
  const [currentToken, setCurrentToken] = useState(MOCK_BUSINESSES[0].currentToken);
  const [businesses, setBusinesses] = useState(MOCK_BUSINESSES);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userRole === 'BusinessOwner') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
  }, [userRole]);

  // Simulate some background movement even if admin isn't clicking
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setCurrentToken(prev => prev + 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const business = businesses[0];
  const smartArrival = calculateSmartArrival({
    currentToken: currentToken,
    userToken: myToken.tokenNumber,
    avgServiceTime: business.avgServiceTime,
    travelTimeMinutes: getMockTravelTime(5.2, 'medium'),
    safetyBufferMinutes: 5
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center text-white p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-900/50"
        >
          <span className="text-indigo-600 font-black text-5xl">N</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black tracking-tighter mb-2"
        >
          NEXO
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-indigo-100 font-medium tracking-wide opacity-80"
        >
          Smart AI Queue Planner
        </motion.p>
      </div>
    );
  }

  const renderHome = () => (
    <div className="space-y-8">
      <section className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Hello, Amruthama</h2>
          <p className="text-zinc-500">You have 1 active token today.</p>
        </div>
        <button 
          onClick={() => setUserRole(userRole === 'Customer' ? 'BusinessOwner' : 'Customer')}
          className="p-3 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:bg-zinc-50 transition-colors flex items-center gap-2"
        >
          <ShieldCheck className={cn("w-6 h-6", userRole === 'BusinessOwner' ? "text-indigo-600" : "text-zinc-300")} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Switch Role</span>
        </button>
      </section>

      <section>
        <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-200 p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Current Token</p>
                <h3 className="text-5xl font-black">{currentToken}</h3>
              </div>
              <div className="text-right space-y-1">
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Your Token</p>
                <h3 className="text-5xl font-black">#{myToken.tokenNumber}</h3>
              </div>
            </div>
            <div className="h-px bg-white/20 w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Estimated Turn</p>
                  <p className="font-bold">{format(smartArrival.expectedTokenTime, 'hh:mm a')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">People Ahead</p>
                  <p className="font-bold">{smartArrival.peopleAhead} persons</p>
                </div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none"
              onClick={() => setActiveTab('recommendation')}
            >
              <Zap className="w-4 h-4 mr-2 fill-current" />
              View Smart Departure
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-indigo-950">Nearby Services</h3>
          <button className="text-indigo-600 text-sm font-bold flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search hospitals, banks..." 
            className="w-full bg-white border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid gap-4">
          {businesses.map((b) => (
            <Card key={b.id} className="p-4 flex gap-4 items-center hover:border-indigo-100 transition-colors cursor-pointer group">
              <img src={b.imageUrl} alt={b.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant={b.status === 'Open' ? 'success' : 'danger'}>{b.status}</Badge>
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> 1.2 km</span>
                </div>
                <h4 className="font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">{b.name}</h4>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {b.lastToken - (b.id === 'b1' ? currentToken : b.currentToken)} waiting</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.avgServiceTime}m avg</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-3xl font-bold text-indigo-600">
            AM
          </div>
          <button className="absolute -bottom-1 -right-1 p-2 bg-white border border-zinc-100 rounded-xl shadow-sm">
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-indigo-950">Amruthama</h2>
          <p className="text-zinc-500 text-sm">amruthama1969@gmail.com</p>
        </div>
      </section>

      <div className="grid gap-3">
        {[
          { icon: User, label: 'Personal Information', color: 'text-blue-600' },
          { icon: CreditCard, label: 'Payment Methods', color: 'text-emerald-600' },
          { icon: Bell, label: 'Notification Settings', color: 'text-amber-600' },
          { icon: HelpCircle, label: 'Help & Support', color: 'text-indigo-600' },
        ].map((item, i) => (
          <button key={i} className="w-full p-4 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-xl bg-zinc-50 group-hover:bg-white transition-colors", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-indigo-950 text-sm">{item.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-300" />
          </button>
        ))}
      </div>

      <Button variant="danger" className="w-full py-6">Log Out</Button>
    </div>
  );

  const renderRecommendation = () => (
    <div className="space-y-8">
      <section className="space-y-2">
        <button onClick={() => setActiveTab('home')} className="text-indigo-600 font-bold text-sm flex items-center gap-1 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
        </button>
        <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Smart Departure</h2>
        <p className="text-zinc-500">NEXO AI has calculated your optimal travel time.</p>
      </section>
      <Card className="p-8 space-y-8 bg-white border-2 border-indigo-50">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center"><Navigation className="w-10 h-10 text-indigo-600" /></div>
          <div className="space-y-1">
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Suggested Departure</p>
            <h3 className="text-5xl font-black text-indigo-600">{format(smartArrival.suggestedDepartureTime, 'hh:mm a')}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 p-4 rounded-2xl space-y-1">
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Travel Time</p>
            <p className="text-lg font-bold text-indigo-950">18 mins</p>
            <p className="text-[10px] text-amber-600 font-bold">+3m traffic delay</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl space-y-1">
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Safety Buffer</p>
            <p className="text-lg font-bold text-indigo-950">5 mins</p>
          </div>
        </div>
        <Button className="w-full py-8 text-lg"><Navigation className="w-5 h-5 mr-2" />Start Navigation</Button>
      </Card>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={userRole}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'recommendation' && renderRecommendation()}
      {activeTab === 'dashboard' && <AdminDashboard currentToken={currentToken} onUpdateToken={setCurrentToken} />}
      {activeTab === 'notifications' && <Notifications />}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'map' && renderHome()}
    </Layout>
  );
}
