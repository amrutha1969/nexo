import React from 'react';
import { Card, Badge } from './ui';
import { Bell, Clock, Navigation, Zap } from 'lucide-react';
import { format } from 'date-fns';

export const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'leave_now',
      title: 'Time to Leave!',
      message: 'Leave now for City General Hospital to arrive exactly at your turn.',
      time: 'Just now',
      icon: Navigation,
      color: 'bg-indigo-600',
    },
    {
      id: 2,
      type: 'queue_update',
      title: 'Queue Moving Faster',
      message: '3 people ahead of you have completed their service.',
      time: '15 mins ago',
      icon: Zap,
      color: 'bg-amber-500',
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: 'Your token #28 is estimated to be called at 04:25 PM.',
      time: '1 hour ago',
      icon: Clock,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Alerts</h2>
        <p className="text-zinc-500">Stay updated with your queue progress.</p>
      </section>

      <div className="space-y-4">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className="p-5 flex gap-4 items-start border-none bg-white shadow-sm">
              <div className={`p-3 ${n.color} rounded-2xl text-white`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-indigo-950">{n.title}</h4>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{n.time}</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{n.message}</p>
                {n.type === 'leave_now' && (
                  <div className="pt-2">
                    <Badge variant="success">Recommended Action</Badge>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
