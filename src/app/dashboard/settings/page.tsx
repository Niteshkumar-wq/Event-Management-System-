"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database, Mail, Save, Check, Eye, EyeOff } from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "data", label: "Data & Export", icon: Database },
  { id: "email", label: "Email Settings", icon: Mail },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    emailNotifs: true, smsNotifs: false, pushNotifs: true,
    newLead: true, taskAssigned: true, eventUpdate: true, invoicePaid: true, guestRSVP: false,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-900">Settings</h1><p className="text-sm text-slate-500 mt-0.5">Manage your account and preferences</p></div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 shrink-0 space-y-1">
          {settingsSections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left", activeSection === s.id ? "bg-teal-600/15 text-teal-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-800")}>
              <s.icon className="w-4 h-4" />{s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === "profile" && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-base font-semibold text-slate-800">Profile Settings</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">JS</div>
                <div><button className="text-sm text-teal-600 hover:text-teal-700">Change Avatar</button><p className="text-xs text-slate-500 mt-0.5">JPG, PNG, max 2MB</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "First Name", value: "John", type: "text" },
                  { label: "Last Name", value: "Smith", type: "text" },
                  { label: "Email", value: "john@eventpro.com", type: "email" },
                  { label: "Phone", value: "+1 (555) 123-4567", type: "tel" },
                  { label: "Job Title", value: "Event Director", type: "text" },
                  { label: "Company", value: "EventPro Solutions", type: "text" },
                ].map((f) => (
                  <div key={f.label}><label className="text-xs text-slate-500 block mb-1">{f.label}</label>
                    <input type={f.type} defaultValue={f.value} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
                ))}
              </div>
              <div><label className="text-xs text-slate-500 block mb-1">Bio</label>
                <textarea rows={3} defaultValue="Experienced event director with 10+ years in corporate events and luxury gatherings." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-base font-semibold text-slate-800">Notification Preferences</h3>
              <div className="space-y-4">
                <h4 className="text-sm text-slate-400 uppercase tracking-wider">Channels</h4>
                {[
                  { key: "emailNotifs" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "smsNotifs" as const, label: "SMS Notifications", desc: "Receive SMS for urgent updates" },
                  { key: "pushNotifs" as const, label: "Push Notifications", desc: "Browser push notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div><p className="text-sm text-slate-800">{item.label}</p><p className="text-xs text-slate-500">{item.desc}</p></div>
                    <button onClick={() => setNotifSettings((p) => ({ ...p, [item.key]: !p[item.key] }))}
                      className={cn("w-10 h-5 rounded-full transition-colors relative", notifSettings[item.key] ? "bg-teal-600" : "bg-slate-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform", notifSettings[item.key] ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-sm text-slate-400 uppercase tracking-wider">Events</h4>
                {[
                  { key: "newLead" as const, label: "New Lead Received" },
                  { key: "taskAssigned" as const, label: "Task Assigned" },
                  { key: "eventUpdate" as const, label: "Event Status Change" },
                  { key: "invoicePaid" as const, label: "Invoice Paid" },
                  { key: "guestRSVP" as const, label: "Guest RSVP" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-800">{item.label}</span>
                    <button onClick={() => setNotifSettings((p) => ({ ...p, [item.key]: !p[item.key] }))}
                      className={cn("w-10 h-5 rounded-full transition-colors relative", notifSettings[item.key] ? "bg-teal-600" : "bg-slate-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform", notifSettings[item.key] ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
              </button>
            </div>
          )}

          {activeSection === "security" && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-base font-semibold text-slate-800">Security Settings</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Current Password</label>
                  <div className="relative"><input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                <div><label className="text-xs text-slate-500 block mb-1">New Password</label><input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Confirm New Password</label><input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between"><div><p className="text-sm text-slate-800">Two-Factor Authentication</p><p className="text-xs text-slate-500">Add an extra layer of security</p></div>
                  <button className="px-3 py-1.5 bg-teal-600/10 text-teal-600 border border-violet-500/20 text-xs rounded-lg hover:bg-teal-600/20">Enable 2FA</button></div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Update Password</>}
              </button>
            </div>
          )}

          {!["profile", "notifications", "security"].includes(activeSection) && (
            <div className="glass-card p-10 text-center">
              <SettingsIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700 capitalize">{activeSection} Settings</h3>
              <p className="text-sm text-slate-500 mt-2">Configure your {activeSection} preferences</p>
              <button className="mt-4 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg">Configure</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
