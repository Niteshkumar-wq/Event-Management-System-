'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Crown, Mic2, Newspaper, Wand2, Plus, X, Search,
  GripVertical, Check, AlertCircle, ChevronRight
} from 'lucide-react';
import { demoGuests } from '@/lib/demo-data';
import { cn, getInitials } from '@/lib/utils';

// ─── Seating data ───
interface TableData {
  id: string;
  name: string;
  capacity: number;
  guests: typeof demoGuests;
  x: number;
  y: number;
}

const initialTables: TableData[] = [
  { id: 'table-1', name: 'Table 1', capacity: 8, guests: [demoGuests[0], demoGuests[1], demoGuests[7]], x: 20, y: 20 },
  { id: 'table-2', name: 'Table 2', capacity: 8, guests: [demoGuests[2], demoGuests[5]], x: 50, y: 20 },
  { id: 'table-3', name: 'Table 3', capacity: 6, guests: [demoGuests[3], demoGuests[8]], x: 80, y: 20 },
  { id: 'table-4', name: 'Table 4', capacity: 8, guests: [demoGuests[4]], x: 20, y: 55 },
  { id: 'table-5', name: 'Table 5', capacity: 10, guests: [demoGuests[6], demoGuests[9]], x: 50, y: 55 },
  { id: 'table-6', name: 'Table 6', capacity: 6, guests: [], x: 80, y: 55 },
];

function getCategoryDot(category: string) {
  switch (category) {
    case 'VIP': return 'bg-amber-400';
    case 'Speaker': return 'bg-purple-400';
    case 'Media': return 'bg-cyan-400';
    default: return 'bg-slate-400';
  }
}

function getCategoryBgColor(category: string) {
  switch (category) {
    case 'VIP': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
    case 'Speaker': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    case 'Media': return 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30';
    default: return 'bg-slate-700/50 text-slate-700 border-slate-600/30';
  }
}

export default function SeatingPlannerPage() {
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [draggedGuest, setDraggedGuest] = useState<(typeof demoGuests)[0] | null>(null);

  const assignedGuestIds = useMemo(() => {
    const ids = new Set<string>();
    tables.forEach(t => t.guests.forEach(g => ids.add(g.id)));
    return ids;
  }, [tables]);

  const unassignedGuests = useMemo(() => {
    let list = demoGuests.filter(g => !assignedGuestIds.has(g.id));
    if (sidebarSearch) {
      const q = sidebarSearch.toLowerCase();
      list = list.filter(g =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assignedGuestIds, sidebarSearch]);

  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const totalAssigned = tables.reduce((s, t) => s + t.guests.length, 0);

  const assignGuest = (tableId: string, guest: (typeof demoGuests)[0]) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId && t.guests.length < t.capacity) {
        return { ...t, guests: [...t.guests, guest] };
      }
      return t;
    }));
  };

  const removeGuest = (tableId: string, guestId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, guests: t.guests.filter(g => g.id !== guestId) };
      }
      return t;
    }));
  };

  const autoAssign = () => {
    const unassigned = demoGuests.filter(g => !assignedGuestIds.has(g.id));
    const newTables = [...tables];
    let guestIdx = 0;

    // Assign VIPs first, then speakers, then rest
    const sorted = [
      ...unassigned.filter(g => g.category === 'VIP'),
      ...unassigned.filter(g => g.category === 'Speaker'),
      ...unassigned.filter(g => g.category === 'Media'),
      ...unassigned.filter(g => g.category === 'Regular'),
    ];

    for (const guest of sorted) {
      // Find table with most space
      const available = newTables
        .filter(t => t.guests.length < t.capacity)
        .sort((a, b) => (b.capacity - b.guests.length) - (a.capacity - a.guests.length));

      if (available.length > 0) {
        available[0].guests.push(guest);
      }
    }

    setTables(newTables);
  };

  const handleDrop = (tableId: string) => {
    if (draggedGuest) {
      assignGuest(tableId, draggedGuest);
      setDraggedGuest(null);
    }
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
          <h1 className="text-2xl font-bold text-slate-900">Seating Planner</h1>
          <p className="text-slate-400 text-sm mt-1">Assign guests to tables for your events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-900 font-mono">{totalAssigned}</span>
            <span className="text-sm text-slate-500">/</span>
            <span className="text-sm text-slate-600 font-mono">{totalSeats}</span>
            <span className="text-xs text-slate-500">seats filled</span>
          </div>
          <button
            onClick={autoAssign}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-600 text-white transition-colors text-sm font-medium"
          >
            <Wand2 className="w-4 h-4" /> Auto Assign
          </button>
        </div>
      </div>

      {/* ─── Legend ─── */}
      <div className="flex items-center gap-6">
        {[
          { label: 'VIP', color: 'bg-amber-400' },
          { label: 'Speaker', color: 'bg-purple-400' },
          { label: 'Media', color: 'bg-cyan-400' },
          { label: 'Regular', color: 'bg-slate-400' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', item.color)} />
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ─── Main Content: Floor Plan + Sidebar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Floor Plan Area */}
        <div className="lg:col-span-3 glass-card p-6 min-h-[600px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {tables.map((table, i) => {
              const isFull = table.guests.length >= table.capacity;
              const fillPercent = Math.round((table.guests.length / table.capacity) * 100);
              const isSelected = selectedTable === table.id;

              return (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  onClick={() => setSelectedTable(isSelected ? null : table.id)}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={() => handleDrop(table.id)}
                  className={cn(
                    'relative p-5 rounded-2xl border-2 cursor-pointer transition-all',
                    isSelected
                      ? 'border-violet-500/60 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                      : isFull
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-slate-200 bg-slate-100 hover:border-slate-600'
                  )}
                >
                  {/* Table visual */}
                  <div className="flex flex-col items-center">
                    {/* Circle table */}
                    <div className={cn(
                      'w-24 h-24 rounded-full border-2 flex items-center justify-center relative',
                      isFull ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-600 bg-teal-50'
                    )}>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-900">{table.name}</p>
                        <p className="text-xs font-mono text-slate-400">{table.guests.length}/{table.capacity}</p>
                      </div>

                      {/* Seat dots around the circle */}
                      {Array.from({ length: table.capacity }).map((_, seatIdx) => {
                        const angle = (seatIdx / table.capacity) * 2 * Math.PI - Math.PI / 2;
                        const radius = 52;
                        const cx = 48 + radius * Math.cos(angle) - 5;
                        const cy = 48 + radius * Math.sin(angle) - 5;
                        const guest = table.guests[seatIdx];

                        return (
                          <div
                            key={seatIdx}
                            className={cn(
                              'absolute w-[10px] h-[10px] rounded-full border transition-colors',
                              guest
                                ? cn(getCategoryDot(guest.category), 'border-transparent')
                                : 'bg-slate-700 border-slate-600'
                            )}
                            style={{ left: cx, top: cy }}
                            title={guest ? `${guest.firstName} ${guest.lastName}` : 'Empty seat'}
                          />
                        );
                      })}
                    </div>

                    {/* Capacity bar */}
                    <div className="w-full mt-4">
                      <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercent}%` }}
                          transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                          className={cn(
                            'h-full rounded-full',
                            isFull ? 'bg-emerald-500' : fillPercent > 50 ? 'bg-amber-500' : 'bg-violet-500'
                          )}
                        />
                      </div>
                    </div>

                    {/* Guest chips */}
                    <div className="flex flex-wrap justify-center gap-1 mt-3">
                      {table.guests.map(guest => (
                        <div
                          key={guest.id}
                          className={cn(
                            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                            getCategoryBgColor(guest.category)
                          )}
                        >
                          {guest.firstName[0]}{guest.lastName[0]}
                          <button
                            onClick={e => { e.stopPropagation(); removeGuest(table.id, guest.id); }}
                            className="ml-0.5 hover:text-red-600 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {isFull && (
                      <div className="flex items-center gap-1 mt-2">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] text-emerald-600 font-medium">Full</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Guest Sidebar */}
        <div className="lg:col-span-1 glass-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Unassigned Guests</h3>
          <p className="text-xs text-slate-500">{unassignedGuests.length} guests remaining</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search guests..."
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-1.5 max-h-[450px] overflow-y-auto">
            {unassignedGuests.map(guest => (
              <div
                key={guest.id}
                draggable
                onDragStart={() => setDraggedGuest(guest)}
                onDragEnd={() => setDraggedGuest(null)}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-teal-50 cursor-grab active:cursor-grabbing transition-colors group"
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                <div className={cn('w-2 h-2 rounded-full shrink-0', getCategoryDot(guest.category))} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{guest.firstName} {guest.lastName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{guest.company}</p>
                </div>
                {selectedTable && (
                  <button
                    onClick={() => assignGuest(selectedTable, guest)}
                    className="p-1 rounded hover:bg-teal-600/20 text-slate-500 hover:text-teal-600 transition-colors"
                    title={`Assign to ${tables.find(t => t.id === selectedTable)?.name}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {unassignedGuests.length === 0 && (
              <div className="py-8 text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">All guests assigned!</p>
              </div>
            )}
          </div>

          {selectedTable && (
            <div className="p-3 rounded-lg bg-teal-50 border border-violet-500/20">
              <p className="text-xs text-teal-700">
                <span className="font-medium">Selected:</span>{' '}
                {tables.find(t => t.id === selectedTable)?.name}
              </p>
              <p className="text-[10px] text-teal-600/70 mt-0.5">Click a guest or drag to assign</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
