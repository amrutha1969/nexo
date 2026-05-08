import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Bell, User, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: 'Customer' | 'BusinessOwner';
}

export const Layout = ({ children, activeTab, onTabChange, userRole = 'Customer' }: LayoutProps) => {
  const tabs = userRole === 'Customer' ? [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Nearby' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ] : [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Admin' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-zinc-900 font-sans pb-24">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-bottom border-zinc-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-950">NEXO</h1>
        </div>
        <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <LogOut className="w-5 h-5 text-zinc-400" />
        </button>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-zinc-100 px-8 py-4 pb-8">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 transition-all duration-300',
                  isActive ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'
                )}
              >
                <div className={cn(
                  'p-2 rounded-2xl transition-all duration-300',
                  isActive ? 'bg-indigo-50' : 'bg-transparent'
                )}>
                  <Icon className={cn('w-6 h-6', isActive ? 'fill-indigo-600/10' : '')} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
