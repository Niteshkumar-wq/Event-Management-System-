'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, Eye, MousePointerClick, CheckCircle2, Clock, XCircle,
  Search, Filter, X, ChevronDown, ChevronUp, Users, MailOpen,
  CalendarDays, ArrowRight, Sparkles
} from 'lucide-react';
import { demoGuests, demoEvents } from '@/lib/demo-data';
import { cn, formatDate, formatDateTime, getStatusColor } from '@/lib/utils';

// ─── Demo invitation data ───
const demoInvitations = [
  { id: 'inv-1', guestId: 'guest-1', guestName: 'Robert Anderson', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', sentDate: '2026-06-15T10:00:00', status: 'Opened', rsvpStatus: 'Accepted', template: 'VIP Gala Invite' },
  { id: 'inv-2', guestId: 'guest-2', guestName: 'Jennifer Liu', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', sentDate: '2026-06-15T10:00:00', status: 'Clicked', rsvpStatus: 'Accepted', template: 'VIP Gala Invite' },
  { id: 'inv-3', guestId: 'guest-3', guestName: "Michael O'Brien", eventId: 'evt-5', eventName: 'Elite Awards Night 2026', sentDate: '2026-06-15T10:05:00', status: 'Delivered', rsvpStatus: 'Declined', template: 'General Invite' },
  { id: 'inv-4', guestId: 'guest-4', guestName: 'Priya Sharma', eventId: 'evt-1', eventName: 'NexGen Series X Launch', sentDate: '2026-07-01T09:00:00', status: 'Opened', rsvpStatus: 'Accepted', template: 'Speaker Invitation' },
  { id: 'inv-5', guestId: 'guest-5', guestName: 'Carlos Mendez', eventId: 'evt-1', eventName: 'NexGen Series X Launch', sentDate: '2026-07-01T09:00:00', status: 'Sent', rsvpStatus: 'No Response', template: 'Media Pass' },
  { id: 'inv-6', guestId: 'guest-6', guestName: 'Aisha Patel', eventId: 'evt-3', eventName: 'Summer Music Festival', sentDate: '2026-06-20T14:00:00', status: 'Clicked', rsvpStatus: 'Accepted', template: 'Festival Pass' },
  { id: 'inv-7', guestId: 'guest-7', guestName: 'Thomas Wagner', eventId: 'evt-1', eventName: 'NexGen Series X Launch', sentDate: '2026-07-01T09:05:00', status: 'Opened', rsvpStatus: 'Maybe', template: 'VIP Gala Invite' },
  { id: 'inv-8', guestId: 'guest-8', guestName: 'Sophie Martin', eventId: 'evt-5', eventName: 'Elite Awards Night 2026', sentDate: '2026-06-15T10:00:00', status: 'Clicked', rsvpStatus: 'Accepted', template: 'VIP Gala Invite' },
  { id: 'inv-9', guestId: 'guest-9', guestName: 'Kenji Tanaka', eventId: 'evt-1', eventName: 'NexGen Series X Launch', sentDate: '2026-07-01T09:00:00', status: 'Delivered', rsvpStatus: 'No Response', template: 'Speaker Invitation' },
  { id: 'inv-10', guestId: 'guest-10', guestName: 'Emma Wilson', eventId: 'evt-3', eventName: 'Summer Music Festival', sentDate: '2026-06-20T14:00:00', status: 'Sent', rsvpStatus: 'No Response', template: 'General Invite' },
  { id: 'inv-11', guestId: 'guest-1', guestName: 'Robert Anderson', eventId: 'evt-1', eventName: 'NexGen Series X Launch', sentDate: '2026-07-01T09:00:00', status: 'Clicked', rsvpStatus: 'Accepted', template: 'VIP Gala Invite' },
  { id: 'inv-12', guestId: 'guest-2', guestName: 'Jennifer Liu', eventId: 'evt-4', eventName: 'Green Energy Conference', sentDate: '2026-07-05T11:00:00', status: 'Delivered', rsvpStatus: 'No Response', template: 'Conference Pass' },
];

const TEMPLATES = ['VIP Gala Invite', 'General Invite', 'Speaker Invitation', 'Media Pass', 'Festival Pass', 'Conference Pass'];

function getDeliveryStatusIcon(status: string) {
  switch (status) {
    case 'Sent': return <Mail className="w-3.5 h-3.5" />;
    case 'Delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'Opened': return <Eye className="w-3.5 h-3.5" />;
    case 'Clicked': return <MousePointerClick className="w-3.5 h-3.5" />;
    default: return <Mail className="w-3.5 h-3.5" />;
  }
}

function getDeliveryStatusColor(status: string) {
  switch (status) {
    case 'Sent': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    case 'Delivered': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    case 'Opened': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    case 'Clicked': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
    default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  }
}

function getRsvpColor(status: string) {
  switch (status) {
    case 'Accepted': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    case 'Declined': return 'bg-red-500/10 text-red-700 border-red-500/20';
    case 'Maybe': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  }
}

type SortField = 'guestName' | 'eventName' | 'sentDate' | 'status';

export default function InvitationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('sentDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendStep, setSendStep] = useState(0); // 0: select event, 1: select guests, 2: template, 3: preview
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());

  const stats = useMemo(() => {
    const total = demoInvitations.length;
    const delivered = demoInvitations.filter(i => i.status !== 'Sent').length;
    const opened = demoInvitations.filter(i => i.status === 'Opened' || i.status === 'Clicked').length;
    const rsvped = demoInvitations.filter(i => i.rsvpStatus !== 'No Response').length;
    return {
      total, delivered, opened, rsvped,
      deliveryRate: Math.round((delivered / total) * 100),
      openRate: Math.round((opened / total) * 100),
      rsvpRate: Math.round((rsvped / total) * 100),
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...demoInvitations];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.guestName.toLowerCase().includes(q) || i.eventName.toLowerCase().includes(q));
    }
    if (statusFilter !== 'All') list = list.filter(i => i.status === statusFilter);
    if (eventFilter !== 'All') list = list.filter(i => i.eventName === eventFilter);

    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [search, statusFilter, eventFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const eventNames = useMemo(() => {
    const names = new Set(demoInvitations.map(i => i.eventName));
    return ['All', ...Array.from(names)];
  }, []);

  const openSendModal = () => {
    setShowSendModal(true);
    setSendStep(0);
    setSelectedEvent('');
    setSelectedTemplate('');
    setSelectedGuestIds(new Set());
  };

  const toggleGuestSelection = (id: string) => {
    const next = new Set(selectedGuestIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedGuestIds(next);
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
          <h1 className="page-title">Invitation Management</h1>
          <p className="page-subtitle">Track and manage all guest invitations</p>
        </div>
        <button
          onClick={openSendModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-600 text-white transition-colors text-sm font-medium"
        >
          <Send className="w-4 h-4" /> Send Invitations
        </button>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: stats.total, sub: 'invitations', icon: Send, gradient: 'kpi-gradient-1', iconColor: 'text-teal-600' },
          { label: 'Delivered Rate', value: `${stats.deliveryRate}%`, sub: `${stats.delivered} delivered`, icon: CheckCircle2, gradient: 'kpi-gradient-2', iconColor: 'text-emerald-600' },
          { label: 'Open Rate', value: `${stats.openRate}%`, sub: `${stats.opened} opened`, icon: MailOpen, gradient: 'kpi-gradient-3', iconColor: 'text-amber-600' },
          { label: 'RSVP Rate', value: `${stats.rsvpRate}%`, sub: `${stats.rsvped} responded`, icon: Users, gradient: 'kpi-gradient-4', iconColor: 'text-pink-600' },
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
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
              </div>
              <div className={cn('p-2.5 rounded-xl bg-teal-50', s.iconColor)}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Search + Filters ─── */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by guest or event name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-violet-500/50"
          >
            <option value="All">All Statuses</option>
            {['Sent', 'Delivered', 'Opened', 'Clicked'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-violet-500/50"
          >
            {eventNames.map(e => <option key={e} value={e}>{e === 'All' ? 'All Events' : e}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Invitations Table ─── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                {[
                  { key: 'guestName' as SortField, label: 'Guest' },
                  { key: 'eventName' as SortField, label: 'Event' },
                  { key: 'sentDate' as SortField, label: 'Sent Date' },
                  { key: 'status' as SortField, label: 'Delivery Status' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {sortField === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-teal-600" /> : <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">RSVP Status</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Template</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-200 table-row-hover"
                >
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-900">{inv.guestName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-700">{inv.eventName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-600 font-mono">{formatDateTime(inv.sentDate)}</p>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      getDeliveryStatusColor(inv.status)
                    )}>
                      {getDeliveryStatusIcon(inv.status)}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                      getRsvpColor(inv.rsvpStatus)
                    )}>
                      {inv.rsvpStatus === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.rsvpStatus === 'Declined' && <XCircle className="w-3 h-3" />}
                      {inv.rsvpStatus === 'Maybe' && <Clock className="w-3 h-3" />}
                      {inv.rsvpStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-slate-500">{inv.template}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Mail className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No invitations found</p>
            <p className="text-sm text-slate-600 mt-1">Try adjusting your filters</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-200/50">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-700">{filtered.length}</span> invitations
          </p>
        </div>
      </div>

      {/* ─── Send Invitations Modal (Multi-step) ─── */}
      <AnimatePresence>
        {showSendModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSendModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                {/* Steps indicator */}
                <div className="p-6 border-b border-slate-200/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Send Invitations</h3>
                    <button onClick={() => setShowSendModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {['Select Event', 'Select Guests', 'Choose Template', 'Preview & Send'].map((step, idx) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                          idx <= sendStep ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                        )}>
                          {idx + 1}
                        </div>
                        <span className={cn('text-xs hidden sm:inline', idx <= sendStep ? 'text-slate-900' : 'text-slate-500')}>{step}</span>
                        {idx < 3 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6 min-h-[280px]">
                  {sendStep === 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 mb-4">Choose the event for which to send invitations:</p>
                      {demoEvents.filter(e => e.status !== 'completed').map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event.id)}
                          className={cn(
                            'w-full p-4 rounded-xl border text-left transition-all',
                            selectedEvent === event.id
                              ? 'border-violet-500/50 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-600 bg-slate-100'
                          )}
                        >
                          <p className="text-sm font-medium text-slate-900">{event.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{event.type} · {formatDate(event.startDate)} · {event.expectedGuests} guests</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {sendStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 mb-4">Select guests to invite ({selectedGuestIds.size} selected):</p>
                      <div className="space-y-2 max-h-[280px] overflow-y-auto">
                        {demoGuests.map(guest => (
                          <label
                            key={guest.id}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                              selectedGuestIds.has(guest.id)
                                ? 'border-violet-500/50 bg-teal-50'
                                : 'border-slate-200 hover:border-slate-600 bg-slate-100'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selectedGuestIds.has(guest.id)}
                              onChange={() => toggleGuestSelection(guest.id)}
                              className="rounded border-slate-600 bg-slate-100 text-teal-600 focus:ring-violet-500/20 focus:ring-offset-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-slate-900">{guest.firstName} {guest.lastName}</p>
                              <p className="text-xs text-slate-500">{guest.email} · {guest.company}</p>
                            </div>
                            <span className="text-xs text-slate-500">{guest.category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {sendStep === 2 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 mb-4">Choose an invitation template:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {TEMPLATES.map(tmpl => (
                          <button
                            key={tmpl}
                            onClick={() => setSelectedTemplate(tmpl)}
                            className={cn(
                              'p-4 rounded-xl border text-left transition-all',
                              selectedTemplate === tmpl
                                ? 'border-violet-500/50 bg-teal-50'
                                : 'border-slate-200 hover:border-slate-600 bg-slate-100'
                            )}
                          >
                            <Mail className="w-5 h-5 text-teal-600 mb-2" />
                            <p className="text-sm font-medium text-slate-900">{tmpl}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {sendStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">Review and send your invitations:</p>
                      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Event</span>
                          <span className="text-sm text-slate-900">{demoEvents.find(e => e.id === selectedEvent)?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Recipients</span>
                          <span className="text-sm text-slate-900">{selectedGuestIds.size} guests</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Template</span>
                          <span className="text-sm text-slate-900">{selectedTemplate || 'Not selected'}</span>
                        </div>
                      </div>

                      {/* Preview card */}
                      <div className="p-5 rounded-xl bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-violet-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          <span className="text-xs font-medium text-teal-700 uppercase tracking-wider">Email Preview</span>
                        </div>
                        <p className="text-slate-900 font-medium text-sm">You&apos;re Invited! 🎉</p>
                        <p className="text-sm text-slate-600 mt-2">
                          Dear Guest, you are cordially invited to{' '}
                          <span className="text-slate-900">{demoEvents.find(e => e.id === selectedEvent)?.name || '[Event Name]'}</span>.
                          Please RSVP at your earliest convenience.
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-600/20 text-teal-700 text-xs font-medium">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {demoEvents.find(e => e.id === selectedEvent)?.startDate ? formatDate(demoEvents.find(e => e.id === selectedEvent)!.startDate) : 'TBD'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200/50 flex gap-3 justify-end">
                  {sendStep > 0 && (
                    <button
                      onClick={() => setSendStep(s => s - 1)}
                      className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                    >
                      Back
                    </button>
                  )}
                  {sendStep < 3 ? (
                    <button
                      onClick={() => setSendStep(s => s + 1)}
                      className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-600 text-white transition-colors text-sm font-medium"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSendModal(false)}
                      className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-600 text-white transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send {selectedGuestIds.size} Invitations
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
