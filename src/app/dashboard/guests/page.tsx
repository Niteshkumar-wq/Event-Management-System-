'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Crown, Mic2, Newspaper, Search, Plus, Upload, Download,
  Trash2, Send, Filter, X, ChevronDown, ChevronUp, Mail, Phone,
  Building2, Tag, UtensilsCrossed, CheckCircle2, AlertCircle
} from 'lucide-react';
import { demoGuests } from '@/lib/demo-data';
import { cn, getInitials } from '@/lib/utils';

// ─── Extended demo data for a richer table ───
const extendedGuests = [
  ...demoGuests,
  { id: 'guest-11', firstName: 'Liam', lastName: 'Crawford', email: 'l.crawford@venturelab.com', phone: '+1 555-1011', company: 'VentureLab', title: 'Mr.', category: 'Regular', dietaryReqs: 'Kosher', tags: ['Attendee', 'Startup'] },
  { id: 'guest-12', firstName: 'Natasha', lastName: 'Ivanova', email: 'n.ivanova@globex.ru', phone: '+7 555-1012', company: 'Globex Corp', title: 'Ms.', category: 'VIP', dietaryReqs: 'None', tags: ['VIP', 'International'] },
  { id: 'guest-13', firstName: 'Daniel', lastName: 'Brooks', email: 'd.brooks@mediahub.com', phone: '+1 555-1013', company: 'MediaHub', title: 'Mr.', category: 'Media', dietaryReqs: 'Vegetarian', tags: ['Press', 'Blogger'] },
  { id: 'guest-14', firstName: 'Fatima', lastName: 'Al-Rashid', email: 'f.alrashid@greentech.ae', phone: '+971 555-1014', company: 'GreenTech UAE', title: 'Dr.', category: 'Speaker', dietaryReqs: 'Halal', tags: ['Speaker', 'Keynote', 'International'] },
  { id: 'guest-15', firstName: 'Oliver', lastName: 'Hayes', email: 'o.hayes@cloudnine.io', phone: '+1 555-1015', company: 'CloudNine', title: 'Mr.', category: 'Regular', dietaryReqs: 'Gluten-free', tags: ['Attendee'] },
];

const CATEGORIES = ['All', 'VIP', 'Regular', 'Speaker', 'Media'] as const;
const DIETARY_OPTIONS = ['All', 'None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Lactose-free'] as const;

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    VIP: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Regular: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Speaker: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Media: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
  return colors[category] || colors.Regular;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'VIP': return <Crown className="w-3 h-3" />;
    case 'Speaker': return <Mic2 className="w-3 h-3" />;
    case 'Media': return <Newspaper className="w-3 h-3" />;
    default: return null;
  }
}

type SortField = 'name' | 'email' | 'company' | 'category';
type SortDir = 'asc' | 'desc';

export default function GuestDatabasePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [guestsList, setGuestsList] = useState(extendedGuests);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', title: '',
    category: 'Regular', dietaryReqs: 'None', tags: '',
  });

  const handleAddGuest = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast('Please fill in First Name, Last Name, and Email', 'error');
      return;
    }
    const newGuest = {
      id: `guest-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.company || '',
      title: formData.title || '',
      category: formData.category,
      dietaryReqs: formData.dietaryReqs,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    setGuestsList(prev => [newGuest, ...prev]);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '', category: 'Regular', dietaryReqs: 'None', tags: '' });
    setShowAddPanel(false);
    showToast(`${newGuest.firstName} ${newGuest.lastName} added successfully!`);
  };

  const handleDeleteSelected = () => {
    setGuestsList(prev => prev.filter(g => !selectedIds.has(g.id)));
    const count = selectedIds.size;
    setSelectedIds(new Set());
    showToast(`${count} guest(s) deleted`);
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    guestsList.forEach(g => g.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = [...guestsList];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.company.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') list = list.filter(g => g.category === categoryFilter);
    if (dietaryFilter !== 'All') list = list.filter(g => g.dietaryReqs === dietaryFilter);
    if (tagFilter) list = list.filter(g => g.tags.includes(tagFilter));

    list.sort((a, b) => {
      let aVal = '', bVal = '';
      if (sortField === 'name') { aVal = `${a.firstName} ${a.lastName}`; bVal = `${b.firstName} ${b.lastName}`; }
      else if (sortField === 'email') { aVal = a.email; bVal = b.email; }
      else if (sortField === 'company') { aVal = a.company; bVal = b.company; }
      else { aVal = a.category; bVal = b.category; }
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return list;
  }, [search, categoryFilter, dietaryFilter, tagFilter, sortField, sortDir]);

  const stats = useMemo(() => ({
    total: guestsList.length,
    vips: guestsList.filter(g => g.category === 'VIP').length,
    speakers: guestsList.filter(g => g.category === 'Speaker').length,
    withDietary: guestsList.filter(g => g.dietaryReqs !== 'None').length,
  }), []);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(g => g.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-violet-400" />
      : <ChevronDown className="w-3.5 h-3.5 text-violet-400" />;
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
          <h1 className="text-2xl font-bold text-white">Guest Database</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all your event guests in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={() => setShowAddPanel(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Guest
          </button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Guests', value: stats.total, icon: Users, gradient: 'kpi-gradient-1', iconColor: 'text-violet-400' },
          { label: 'VIP Guests', value: stats.vips, icon: Crown, gradient: 'kpi-gradient-3', iconColor: 'text-amber-400' },
          { label: 'Speakers', value: stats.speakers, icon: Mic2, gradient: 'kpi-gradient-4', iconColor: 'text-pink-400' },
          { label: 'Dietary Requirements', value: stats.withDietary, icon: UtensilsCrossed, gradient: 'kpi-gradient-2', iconColor: 'text-emerald-400' },
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
                <p className="text-sm text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1 font-mono">{s.value}</p>
              </div>
              <div className={cn('p-2.5 rounded-xl bg-slate-800/60', s.iconColor)}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Search + Filters ─── */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors',
              showFilters
                ? 'border-violet-500/50 text-violet-400 bg-violet-500/10'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            )}
          >
            <Filter className="w-4 h-4" /> Filters
            {(categoryFilter !== 'All' || dietaryFilter !== 'All' || tagFilter) && (
              <span className="ml-1 w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-medium">
                {[categoryFilter !== 'All', dietaryFilter !== 'All', !!tagFilter].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/50">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Dietary Requirements</label>
                  <select
                    value={dietaryFilter}
                    onChange={e => setDietaryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    {DIETARY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags</label>
                  <select
                    value={tagFilter}
                    onChange={e => setTagFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-violet-500/10 border border-violet-500/20"
            >
              <span className="text-sm text-violet-300 font-medium">{selectedIds.size} selected</span>
              <div className="h-4 w-px bg-violet-500/30" />
              <button className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-violet-400 transition-colors">
                <Send className="w-3.5 h-3.5" /> Send Invitation
              </button>
              <button className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-emerald-400 transition-colors">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Data Table ─── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                  />
                </th>
                {[
                  { key: 'name' as SortField, label: 'Guest' },
                  { key: 'email' as SortField, label: 'Contact' },
                  { key: 'company' as SortField, label: 'Company' },
                  { key: 'category' as SortField, label: 'Category' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon field={col.key} />
                    </div>
                  </th>
                ))}
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Dietary</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest, i) => (
                <motion.tr
                  key={guest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-800/30 table-row-hover"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(guest.id)}
                      onChange={() => toggleOne(guest.id)}
                      className="rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold',
                        guest.category === 'VIP' ? 'bg-amber-500/20 text-amber-400' :
                        guest.category === 'Speaker' ? 'bg-purple-500/20 text-purple-400' :
                        guest.category === 'Media' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-slate-700/50 text-slate-300'
                      )}>
                        {getInitials(`${guest.firstName} ${guest.lastName}`)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{guest.title} {guest.firstName} {guest.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {guest.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3" /> {guest.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> {guest.company}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      getCategoryColor(guest.category)
                    )}>
                      {getCategoryIcon(guest.category)}
                      {guest.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {guest.dietaryReqs !== 'None' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                        <UtensilsCrossed className="w-3 h-3" /> {guest.dietaryReqs}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {guest.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700/50">
                          {tag}
                        </span>
                      ))}
                      {guest.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 text-xs">+{guest.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No guests found</p>
            <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-800/50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-300">{filtered.length}</span> of{' '}
            <span className="font-medium text-slate-300">{extendedGuests.length}</span> guests
          </p>
        </div>
      </div>

      {/* ─── Add Guest Slide-Over ─── */}
      <AnimatePresence>
        {showAddPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPanel(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Add New Guest</h2>
                  <button onClick={() => setShowAddPanel(false)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name *</label>
                      <input
                        type="text" value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                        placeholder="Robert"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name *</label>
                      <input
                        type="text" value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                        placeholder="Anderson"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
                    <input
                      type="email" value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                      placeholder="robert@company.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                      <input
                        type="tel" value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                        placeholder="+1 555-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
                      <select
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                      >
                        <option value="">Select</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
                    <input
                      type="text" value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                      placeholder="TechCorp Industries"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                      >
                        {['Regular', 'VIP', 'Speaker', 'Media'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Dietary Requirements</label>
                      <select
                        value={formData.dietaryReqs}
                        onChange={e => setFormData({ ...formData, dietaryReqs: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white focus:outline-none focus:border-violet-500/50"
                      >
                        {['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Lactose-free'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags (comma-separated)</label>
                    <input
                      type="text" value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                      placeholder="VIP, Speaker, Keynote"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setShowAddPanel(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGuest}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save Guest</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Import CSV Modal ─── */}
      <AnimatePresence>
        {showImportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Import Guests from CSV</h3>
                  <button onClick={() => setShowImportModal(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-medium">Drop your CSV file here or click to browse</p>
                  <p className="text-xs text-slate-500 mt-1">Supports .csv files up to 10MB</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs text-slate-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    CSV must contain headers: firstName, lastName, email. Optional: phone, company, category, dietaryReqs, tags
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm">
                    Cancel
                  </button>
                  <button onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-medium">
                    <span className="flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Import</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={cn(
              'fixed bottom-6 left-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2',
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-200'
                : 'bg-red-900/90 border-red-500/30 text-red-200'
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
