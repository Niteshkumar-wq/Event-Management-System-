'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  CheckCircle2, XCircle, HelpCircle, Clock, Search, Users,
  UtensilsCrossed, CalendarDays, UserPlus, Filter
} from 'lucide-react';
import { demoGuests, demoEvents } from '@/lib/demo-data';
import { cn, formatDate } from '@/lib/utils';

// ─── Demo RSVP data ───
const demoRsvps = [
  { id: 'rsvp-1', guestId: 'guest-1', guestName: 'Robert Anderson', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Accepted', plusOnes: 1, mealChoice: 'Filet Mignon', responseDate: '2026-06-20' },
  { id: 'rsvp-2', guestId: 'guest-2', guestName: 'Jennifer Liu', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Accepted', plusOnes: 0, mealChoice: 'Grilled Salmon', responseDate: '2026-06-18' },
  { id: 'rsvp-3', guestId: 'guest-3', guestName: "Michael O'Brien", eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Declined', plusOnes: 0, mealChoice: '', responseDate: '2026-06-22' },
  { id: 'rsvp-4', guestId: 'guest-4', guestName: 'Priya Sharma', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'Accepted', plusOnes: 1, mealChoice: 'Vegan Risotto', responseDate: '2026-07-03' },
  { id: 'rsvp-5', guestId: 'guest-5', guestName: 'Carlos Mendez', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'No Response', plusOnes: 0, mealChoice: '', responseDate: '' },
  { id: 'rsvp-6', guestId: 'guest-6', guestName: 'Aisha Patel', eventId: 'evt-3', eventName: 'Summer Music Festival', rsvpStatus: 'Accepted', plusOnes: 2, mealChoice: 'Halal Platter', responseDate: '2026-06-25' },
  { id: 'rsvp-7', guestId: 'guest-7', guestName: 'Thomas Wagner', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'Maybe', plusOnes: 1, mealChoice: '', responseDate: '2026-07-04' },
  { id: 'rsvp-8', guestId: 'guest-8', guestName: 'Sophie Martin', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Accepted', plusOnes: 1, mealChoice: 'Truffle Pasta', responseDate: '2026-06-17' },
  { id: 'rsvp-9', guestId: 'guest-9', guestName: 'Kenji Tanaka', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'Accepted', plusOnes: 0, mealChoice: 'Sushi Selection', responseDate: '2026-07-02' },
  { id: 'rsvp-10', guestId: 'guest-10', guestName: 'Emma Wilson', eventId: 'evt-3', eventName: 'Summer Music Festival', rsvpStatus: 'No Response', plusOnes: 0, mealChoice: '', responseDate: '' },
  { id: 'rsvp-11', guestId: 'guest-1', guestName: 'Robert Anderson', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'Accepted', plusOnes: 0, mealChoice: 'Filet Mignon', responseDate: '2026-07-02' },
  { id: 'rsvp-12', guestId: 'guest-8', guestName: 'Sophie Martin', eventId: 'evt-1', eventName: 'NexGen Series X Launch', rsvpStatus: 'Declined', plusOnes: 0, mealChoice: '', responseDate: '2026-07-05' },
  { id: 'rsvp-13', guestId: 'guest-6', guestName: 'Aisha Patel', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Maybe', plusOnes: 0, mealChoice: '', responseDate: '2026-06-28' },
  { id: 'rsvp-14', guestId: 'guest-9', guestName: 'Kenji Tanaka', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', rsvpStatus: 'Accepted', plusOnes: 1, mealChoice: 'Sushi Selection', responseDate: '2026-06-19' },
];

const CHART_COLORS = {
  Accepted: '#10b981',
  Declined: '#ef4444',
  Maybe: '#f59e0b',
  'No Response': '#475569',
};

function getRsvpIcon(status: string) {
  switch (status) {
    case 'Accepted': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'Declined': return <XCircle className="w-3.5 h-3.5" />;
    case 'Maybe': return <HelpCircle className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
}

function getRsvpColor(status: string) {
  switch (status) {
    case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Declined': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Maybe': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

// Custom tooltip component
function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-white font-medium">{payload[0].name}: {payload[0].value}</p>
    </div>
  );
}

export default function RsvpTrackingPage() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const eventNames = useMemo(() => {
    const names = new Set(demoRsvps.map(r => r.eventName));
    return ['All', ...Array.from(names)];
  }, []);

  const filtered = useMemo(() => {
    let list = [...demoRsvps];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.guestName.toLowerCase().includes(q));
    }
    if (eventFilter !== 'All') list = list.filter(r => r.eventName === eventFilter);
    if (statusFilter !== 'All') list = list.filter(r => r.rsvpStatus === statusFilter);
    return list;
  }, [search, eventFilter, statusFilter]);

  const stats = useMemo(() => {
    const data = eventFilter !== 'All' ? demoRsvps.filter(r => r.eventName === eventFilter) : demoRsvps;
    return {
      total: data.length,
      accepted: data.filter(r => r.rsvpStatus === 'Accepted').length,
      declined: data.filter(r => r.rsvpStatus === 'Declined').length,
      maybe: data.filter(r => r.rsvpStatus === 'Maybe').length,
      noResponse: data.filter(r => r.rsvpStatus === 'No Response').length,
      totalPlusOnes: data.reduce((sum, r) => sum + r.plusOnes, 0),
    };
  }, [eventFilter]);

  const chartData = [
    { name: 'Accepted', value: stats.accepted },
    { name: 'Declined', value: stats.declined },
    { name: 'Maybe', value: stats.maybe },
    { name: 'No Response', value: stats.noResponse },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 animate-fade-in"
    >
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-white">RSVP Tracking</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor guest responses across all events</p>
      </div>

      {/* ─── Stats + Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="glass-card p-6 lg:col-span-1"
        >
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Response Breakdown</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {chartData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[d.name as keyof typeof CHART_COLORS] }}
                />
                <span className="text-xs text-slate-400">{d.name}</span>
                <span className="text-xs font-medium text-white ml-auto font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Invited', value: stats.total, icon: Users, color: 'text-teal-600', gradient: 'kpi-gradient-1' },
            { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-400', gradient: 'kpi-gradient-2' },
            { label: 'Declined', value: stats.declined, icon: XCircle, color: 'text-red-400', gradient: 'from-red-500/10 to-red-500/5' },
            { label: 'Maybe', value: stats.maybe, icon: HelpCircle, color: 'text-amber-400', gradient: 'kpi-gradient-3' },
            { label: 'Pending', value: stats.noResponse, icon: Clock, color: 'text-slate-400', gradient: '' },
            { label: 'Plus-Ones', value: stats.totalPlusOnes, icon: UserPlus, color: 'text-pink-400', gradient: 'kpi-gradient-4' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              className={cn('glass-card p-5', s.gradient)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-2xl font-bold text-white mt-1 font-mono">{s.value}</p>
                </div>
                <div className={cn('p-2 rounded-xl bg-slate-800/60', s.color)}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Filters ─── */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by guest name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
            />
          </div>
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
          >
            {eventNames.map(e => <option key={e} value={e}>{e === 'All' ? 'All Events' : e}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
          >
            <option value="All">All Statuses</option>
            {['Accepted', 'Declined', 'Maybe', 'No Response'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ─── RSVP Table ─── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Event</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">RSVP Status</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Plus-Ones</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Meal Choice</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rsvp, i) => (
                <motion.tr
                  key={rsvp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-200 table-row-hover"
                >
                  <td className="p-4">
                    <p className="text-sm font-medium text-white">{rsvp.guestName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-700">{rsvp.eventName}</p>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      getRsvpColor(rsvp.rsvpStatus)
                    )}>
                      {getRsvpIcon(rsvp.rsvpStatus)}
                      {rsvp.rsvpStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {rsvp.plusOnes > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm text-white font-mono">
                        <UserPlus className="w-3.5 h-3.5 text-pink-400" /> +{rsvp.plusOnes}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {rsvp.mealChoice ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" /> {rsvp.mealChoice}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {rsvp.responseDate ? (
                      <span className="text-sm text-slate-400 font-mono flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(rsvp.responseDate)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600 italic">Awaiting response</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No RSVP data found</p>
            <p className="text-sm text-slate-600 mt-1">Try adjusting your filters</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-200/50">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-700">{filtered.length}</span> of{' '}
            <span className="font-medium text-slate-700">{demoRsvps.length}</span> responses
          </p>
        </div>
      </div>
    </motion.div>
  );
}
