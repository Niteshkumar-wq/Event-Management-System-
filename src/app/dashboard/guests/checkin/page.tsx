'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Search, UserCheck, Users, Clock, TrendingUp,
  CheckCircle2, ArrowRight, Scan, Wifi, AlertCircle,
  UserPlus, Zap, Timer, RefreshCw
} from 'lucide-react';
import { demoGuests } from '@/lib/demo-data';
import { cn, getInitials, formatRelativeTime } from '@/lib/utils';

// ─── Demo check-in data ───
interface CheckInRecord {
  id: string;
  guestId: string;
  guestName: string;
  category: string;
  company: string;
  checkedInAt: string;
  method: 'QR Code' | 'Manual';
}

const initialCheckins: CheckInRecord[] = [
  { id: 'ci-1', guestId: 'guest-1', guestName: 'Robert Anderson', category: 'VIP', company: 'TechCorp', checkedInAt: '2026-07-07T17:45:00', method: 'QR Code' },
  { id: 'ci-2', guestId: 'guest-2', guestName: 'Jennifer Liu', category: 'VIP', company: 'Innovate.io', checkedInAt: '2026-07-07T17:48:00', method: 'QR Code' },
  { id: 'ci-3', guestId: 'guest-8', guestName: 'Sophie Martin', category: 'VIP', company: 'Luxury Events Paris', checkedInAt: '2026-07-07T17:50:00', method: 'Manual' },
  { id: 'ci-4', guestId: 'guest-4', guestName: 'Priya Sharma', category: 'Speaker', company: 'Enterprise Solutions', checkedInAt: '2026-07-07T17:52:00', method: 'QR Code' },
  { id: 'ci-5', guestId: 'guest-7', guestName: 'Thomas Wagner', category: 'VIP', company: 'Deutsche Finance', checkedInAt: '2026-07-07T17:55:00', method: 'QR Code' },
  { id: 'ci-6', guestId: 'guest-9', guestName: 'Kenji Tanaka', category: 'Speaker', company: 'TechJapan', checkedInAt: '2026-07-07T17:58:00', method: 'QR Code' },
  { id: 'ci-7', guestId: 'guest-6', guestName: 'Aisha Patel', category: 'Regular', company: 'DesignCo', checkedInAt: '2026-07-07T18:02:00', method: 'Manual' },
];

function getCategoryColor(category: string) {
  switch (category) {
    case 'VIP': return 'bg-amber-500/20 text-amber-600';
    case 'Speaker': return 'bg-purple-500/20 text-purple-600';
    case 'Media': return 'bg-cyan-500/20 text-cyan-600';
    default: return 'bg-slate-700/50 text-slate-700';
  }
}

export default function CheckInDashboardPage() {
  const [checkins, setCheckins] = useState<CheckInRecord[]>(initialCheckins);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannerActive, setScannerActive] = useState(true);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const totalGuests = demoGuests.length;
  const checkedInCount = checkins.length;
  const checkinPercent = Math.round((checkedInCount / totalGuests) * 100);
  const notCheckedIn = totalGuests - checkedInCount;

  // Simulate arrival rate (guests per minute)
  const arrivalRate = 2.3;

  // Tick the clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const checkedInGuestIds = useMemo(() => new Set(checkins.map(c => c.guestId)), [checkins]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return demoGuests.filter(g =>
      !checkedInGuestIds.has(g.id) && (
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, checkedInGuestIds]);

  const manualCheckIn = (guest: (typeof demoGuests)[0]) => {
    const newCheckin: CheckInRecord = {
      id: `ci-${Date.now()}`,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`,
      category: guest.category,
      company: guest.company,
      checkedInAt: new Date().toISOString(),
      method: 'Manual',
    };
    setCheckins(prev => [newCheckin, ...prev]);
    setSearchQuery('');
    setLastScan(newCheckin.guestName);
    setTimeout(() => setLastScan(null), 3000);
  };

  const simulateQrScan = () => {
    const unchecked = demoGuests.filter(g => !checkedInGuestIds.has(g.id));
    if (unchecked.length === 0) return;
    const guest = unchecked[Math.floor(Math.random() * unchecked.length)];
    const newCheckin: CheckInRecord = {
      id: `ci-${Date.now()}`,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`,
      category: guest.category,
      company: guest.company,
      checkedInAt: new Date().toISOString(),
      method: 'QR Code',
    };
    setCheckins(prev => [newCheckin, ...prev]);
    setLastScan(newCheckin.guestName);
    setTimeout(() => setLastScan(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 animate-fade-in"
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Check-in Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Elite Awards Night 2026 — Live check-in monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live" />
            <span className="text-xs font-medium text-emerald-600">Live</span>
          </div>
        </div>
      </div>

      {/* ─── Big Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Checked In', value: checkedInCount, total: totalGuests, icon: UserCheck, color: 'text-emerald-600', gradient: 'kpi-gradient-2', showTotal: true },
          { label: 'Remaining', value: notCheckedIn, total: totalGuests, icon: Users, color: 'text-teal-600', gradient: 'kpi-gradient-1', showTotal: false },
          { label: 'Arrival Rate', value: `${arrivalRate}`, total: 0, icon: TrendingUp, color: 'text-amber-600', gradient: 'kpi-gradient-3', showTotal: false, suffix: '/min' },
          { label: 'Check-in %', value: `${checkinPercent}`, total: 0, icon: Zap, color: 'text-pink-600', gradient: 'kpi-gradient-4', showTotal: false, suffix: '%' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className={cn('glass-card p-5', s.gradient)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-3xl font-bold text-slate-900 font-mono">{s.value}</p>
                  {s.showTotal && <span className="text-lg text-slate-500 font-mono">/{s.total}</span>}
                  {'suffix' in s && <span className="text-lg text-slate-500">{s.suffix}</span>}
                </div>
              </div>
              <div className={cn('p-3 rounded-xl bg-teal-50', s.color)}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Progress Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Check-in Progress</h3>
          <span className="text-sm font-bold font-mono text-teal-600">{checkinPercent}%</span>
        </div>
        <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${checkinPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-teal-600 via-violet-500 to-emerald-500 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">0</span>
          <span className="text-xs text-slate-500">{totalGuests} guests</span>
        </div>
      </motion.div>

      {/* ─── Main Grid: QR Scanner + Live Feed + Manual Check-in ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Scanner Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-teal-600" /> QR Scanner
            </h3>
            <button
              onClick={() => setScannerActive(!scannerActive)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                scannerActive
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-slate-700/50 text-slate-600 border-slate-600'
              )}
            >
              {scannerActive ? 'Active' : 'Paused'}
            </button>
          </div>

          {/* Scanner visual */}
          <div className={cn(
            'aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-colors',
            scannerActive
              ? 'border-violet-500/40 bg-violet-500/5'
              : 'border-slate-700 bg-slate-100'
          )}>
            {scannerActive && (
              <>
                {/* Animated scan line */}
                <motion.div
                  animate={{ y: [-80, 80] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                />
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-violet-400 rounded-tl-md" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-violet-400 rounded-tr-md" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-violet-400 rounded-bl-md" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-violet-400 rounded-br-md" />
              </>
            )}

            <div className="text-center z-10">
              <Scan className={cn(
                'w-12 h-12 mx-auto mb-2',
                scannerActive ? 'text-teal-600' : 'text-slate-600'
              )} />
              <p className="text-sm text-slate-600">
                {scannerActive ? 'Ready to scan' : 'Scanner paused'}
              </p>
            </div>
          </div>

          <button
            onClick={simulateQrScan}
            disabled={!scannerActive}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              scannerActive
                ? 'bg-teal-600 hover:bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-500 cursor-not-allowed'
            )}
          >
            <QrCode className="w-4 h-4" /> Simulate QR Scan
          </button>

          {/* Last scan notification */}
          <AnimatePresence>
            {lastScan && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-300 font-medium">{lastScan} checked in!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs text-slate-400">Scanner connected · Camera 1</span>
          </div>
        </motion.div>

        {/* Recent Check-ins Live Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Recent Check-ins
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <RefreshCw className="w-3 h-3" /> Auto-refresh
            </div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            <AnimatePresence>
              {checkins.slice(0, 10).map((ci, i) => (
                <motion.div
                  key={ci.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    getCategoryColor(ci.category)
                  )}>
                    {getInitials(ci.guestName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{ci.guestName}</p>
                    <p className="text-[10px] text-slate-500">{ci.company} · {ci.method}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 font-mono">
                      {formatRelativeTime(ci.checkedInAt)}
                    </p>
                    <span className={cn(
                      'inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium',
                      ci.method === 'QR Code'
                        ? 'bg-violet-500/20 text-teal-600'
                        : 'bg-amber-500/20 text-amber-600'
                    )}>
                      {ci.method}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Manual Check-in Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6 space-y-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-600" /> Manual Check-in
          </h3>
          <p className="text-xs text-slate-500">Search for a guest to manually check them in</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
            />
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {searchQuery && searchResults.length === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No matching guests found</p>
              </div>
            )}

            {searchResults.map(guest => (
              <div
                key={guest.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  getCategoryColor(guest.category)
                )}>
                  {getInitials(`${guest.firstName} ${guest.lastName}`)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{guest.firstName} {guest.lastName}</p>
                  <p className="text-[10px] text-slate-500">{guest.email}</p>
                </div>
                <button
                  onClick={() => manualCheckIn(guest)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> Check In
                </button>
              </div>
            ))}

            {!searchQuery && (
              <div className="py-12 text-center">
                <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Start typing to search for guests</p>
                <p className="text-xs text-slate-600 mt-1">{notCheckedIn} guests haven&apos;t checked in yet</p>
              </div>
            )}
          </div>

          {/* Already checked-in count */}
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Already checked in</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">{checkedInCount} guests</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
