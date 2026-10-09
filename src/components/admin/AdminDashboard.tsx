import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { firebaseAuth, firebaseDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import {
  CMSProject,
  CMSClientLogo,
  CMSHero,
  CMSService,
  CMSTestimonial,
  CMSSiteSettings,
  CMSLead,
  CMSProjectReel,
} from '../../types/cms';
import {
  seedDatabase,
  saveProject,
  deleteProject,
  saveClient,
  deleteClient,
  saveHero,
  saveService,
  saveSiteSettings,
  updateLeadStatus,
  deleteLead,
} from '../../lib/cms/cmsService';
import { CloudinaryUploader } from './CloudinaryUploader';
import {
  LayoutDashboard,
  Film,
  Image as ImageIcon,
  Sliders,
  Briefcase,
  MessageSquare,
  Users,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Download,
  AlertCircle,
  Database,
  Eye,
  Phone,
  Mail,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { AdminUserSession } from './AdminAuthGuard';

interface AdminDashboardProps {
  user: User | AdminUserSession;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'clientele' | 'hero' | 'services' | 'testimonials' | 'leads' | 'settings'
  >('overview');

  // Live state from Firebase
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [clients, setClients] = useState<CMSClientLogo[]>([]);
  const [hero, setHero] = useState<CMSHero | null>(null);
  const [services, setServices] = useState<CMSService[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<CMSSiteSettings | null>(null);
  const [leads, setLeads] = useState<CMSLead[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Status feedback
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form state for Projects
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Modal / Form state for Clients
  const [editingClient, setEditingClient] = useState<CMSClientLogo | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Modal / Form state for Services
  const [editingService, setEditingService] = useState<CMSService | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Lead filters
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  // Cloudinary settings state
  const [cloudNameInput, setCloudNameInput] = useState(() => {
    return localStorage.getItem('bs_cloudinary_cloud_name') || '';
  });

  // Listen to Firebase RTDB nodes in real-time
  useEffect(() => {
    const publishedRef = ref(firebaseDb, 'published');
    const unsubPublished = onValue(publishedRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val.projects) {
          const list: CMSProject[] = Object.values(val.projects);
          setProjects(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        } else {
          setProjects([]);
        }

        if (val.clients) {
          const list: CMSClientLogo[] = Object.values(val.clients);
          setClients(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        } else {
          setClients([]);
        }

        if (val.hero) setHero(val.hero);
        if (val.services) {
          const list: CMSService[] = Object.values(val.services);
          setServices(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        }
        if (val.testimonials) {
          const list: CMSTestimonial[] = Object.values(val.testimonials);
          setTestimonials(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        }
        if (val.siteSettings) {
          setSiteSettings(val.siteSettings);
          if (val.siteSettings.cloudinaryCloudName && !cloudNameInput) {
            setCloudNameInput(val.siteSettings.cloudinaryCloudName);
            localStorage.setItem('bs_cloudinary_cloud_name', val.siteSettings.cloudinaryCloudName);
          }
        }
      } else {
        setProjects([]);
        setClients([]);
      }
      setDbLoading(false);
    });

    const leadsRef = ref(firebaseDb, 'leads');
    const unsubLeads = onValue(leadsRef, (snapshot) => {
      if (snapshot.exists()) {
        const list: CMSLead[] = Object.values(snapshot.val());
        setLeads(list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
      } else {
        setLeads([]);
      }
    });

    return () => {
      unsubPublished();
      unsubLeads();
    };
  }, []);

  const triggerNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSeed = async (force = false) => {
    const res = await seedDatabase(force);
    if (res.success) {
      triggerNotice(res.message, 'success');
    } else {
      triggerNotice(res.message, 'error');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('bs_admin_auth_fallback');
    window.dispatchEvent(new Event('bs-auth-change'));
    signOut(firebaseAuth).catch(() => {});
  };

  const handleSaveCloudName = () => {
    localStorage.setItem('bs_cloudinary_cloud_name', cloudNameInput.trim());
    if (siteSettings) {
      saveSiteSettings({ ...siteSettings, cloudinaryCloudName: cloudNameInput.trim() });
    }
    triggerNotice('Cloudinary Cloud Name saved!', 'success');
  };

  // CSV Export for Leads
  const handleExportLeadsCSV = () => {
    if (leads.length === 0) {
      triggerNotice('No leads available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Name', 'Phone', 'Email', 'Brand', 'Service', 'Budget', 'Timeline', 'Status', 'Message', 'Notes'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.type}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.brandName || '').replace(/"/g, '""')}"`,
      `"${(l.serviceType || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brandshoots_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotice('CSV Export downloaded successfully.', 'success');
  };

  return (
    <div className="w-full min-h-screen bg-[#030508] text-white flex flex-col md:flex-row font-sans selection:bg-[#008CFF] selection:text-white">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION                                */}
      {/* ========================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#06090F] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Identity */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 font-display font-black text-xl uppercase tracking-wider">
                <span className="text-[#008CFF]">BRAND</span>
                <span className="text-white">SHOOTS</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400 font-semibold">
                  RTDB LIVE SYNC
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">{projects.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('clientele')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'clientele'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Clientele</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">{clients.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Inbound Leads</span>
              </div>
              {leads.filter((l) => l.status === 'new').length > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-black font-bold">
                  {leads.filter((l) => l.status === 'new').length} NEW
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">{leads.length}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'hero'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Hero & Media</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'services'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>What We Do</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings & Cloud</span>
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="truncate pr-2">
              <p className="text-[11px] font-mono text-white/90 truncate">{user.email}</p>
              <span className="text-[9px] font-mono uppercase text-white/40">Superadmin</span>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA                                      */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto max-h-screen p-6 sm:p-8 lg:p-10">
        {/* Top Notification Toast */}
        {actionNotice && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl font-mono text-xs shadow-2xl flex items-center gap-3 transition-all ${
              actionNotice.type === 'success'
                ? 'bg-emerald-500/90 text-black font-bold'
                : 'bg-red-500/90 text-white font-bold'
            }`}
          >
            {actionNotice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{actionNotice.text}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
                  CMS Operations Overview
                </h1>
                <p className="text-xs sm:text-sm text-white/50 font-mono mt-1">
                  Connected to Realtime Database:{' '}
                  <span className="text-[#008CFF]">brandshoots-admin-default-rtdb.firebaseio.com</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSeed(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Sync / Seed Defaults</span>
                </button>
                <a
                  href="/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,140,255,0.4)] transition-all"
                >
                  <span>Open Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* If DB is empty, show callout */}
            {projects.length === 0 && !dbLoading && (
              <div className="p-6 rounded-2xl bg-[#008CFF]/10 border border-[#008CFF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-[#008CFF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-mono text-sm uppercase font-bold text-white">
                      Initialize Database with Production Data
                    </h3>
                    <p className="text-xs text-white/70 font-mono mt-1">
                      Populate your Firebase Realtime Database with all 10 projects (with playable 2-3 reels), 16 client logos, services, testimonials, and site settings.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSeed(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider shrink-0 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.5)]"
                >
                  Seed Now
                </button>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Active Projects</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-3xl text-white">{projects.length}</span>
                  <Film className="w-5 h-5 text-[#008CFF]" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {projects.filter((p) => p.visible).length} Published to Live
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Client Logos</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-3xl text-white">{clients.length}</span>
                  <ImageIcon className="w-5 h-5 text-[#008CFF]" />
                </div>
                <span className="text-[10px] font-mono text-white/50">In Clientele Section</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Inbound Leads</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-3xl text-white">{leads.length}</span>
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {leads.filter((l) => l.status === 'new').length} Awaiting Response
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Database State</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-xl text-emerald-400">SYNCED</span>
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-white/50">Zero-latency live push</span>
              </div>
            </div>

            {/* Recent Leads Sneak Peek */}
            <div className="p-6 rounded-2xl bg-[#070B12] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
                  Recent Inbound Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-mono text-[#008CFF] hover:underline flex items-center gap-1"
                >
                  <span>View All Leads</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {leads.length === 0 ? (
                <p className="text-xs font-mono text-white/40 py-4 text-center">
                  No customer inquiries received yet. Submit a test form on the Contact page.
                </p>
              ) : (
                <div className="divide-y divide-white/5">
                  {leads.slice(0, 5).map((l) => (
                    <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-mono font-bold text-white truncate">{l.name}</p>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                              l.status === 'new'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/10 text-white/60'
                            }`}
                          >
                            {l.status}
                          </span>
                          <span className="text-[9px] font-mono text-white/40">
                            {l.type === 'site_visit' ? '📍 Site Visit' : '✉️ Inquiry'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/50 truncate mt-0.5">
                          {l.phone} • {l.brandName || l.serviceType || 'Brand Inquirer'}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-white/30 shrink-0">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Portfolio Projects ({projects.length})
                </h1>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Live synced with the 3D Wormhole corridor, mobile showcase, and project modal reels.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject({
                    id: '',
                    slug: '',
                    name: '',
                    category: 'Commercial Production',
                    year: new Date().getFullYear().toString(),
                    videoUrl: '',
                    posterUrl: '',
                    logoUrl: '',
                    headline: '',
                    story: '',
                    challenge: '',
                    solution: '',
                    deliverables: ['Brand Commercial', 'Reels Package'],
                    metrics: [{ label: 'Retention Rate', value: '85%' }],
                    reels: [],
                    order: projects.length,
                    visible: true,
                  });
                  setIsProjectModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,140,255,0.4)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-[#070B12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Video / Poster thumbnail */}
                        <div className="w-16 h-20 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0 relative">
                          {proj.posterUrl ? (
                            <img src={proj.posterUrl} alt={proj.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <Film className="w-6 h-6" />
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#008CFF]">
                            {proj.reels?.length || 0} reels
                          </div>
                        </div>

                        <div>
                          <h3 className="font-editorial text-lg font-bold text-white">{proj.name}</h3>
                          <p className="text-xs text-[#008CFF] font-mono">{proj.category}</p>
                          <p className="text-[10px] text-white/40 font-mono mt-0.5">Slug: /{proj.slug}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          proj.visible
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {proj.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {proj.headline || proj.story}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-white/50 hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsProjectModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#008CFF]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete project "${proj.name}"?`)) {
                            await deleteProject(proj.id);
                            triggerNotice(`Project "${proj.name}" deleted.`, 'success');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLIENTELE LOGOS */}
        {activeTab === 'clientele' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Clientele Logos ({clients.length})
                </h1>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Logos shown in both the Portfolio Clientele and Homepage Our Clients sections.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingClient({
                    id: '',
                    name: '',
                    logoUrl: '',
                    slug: '',
                    order: clients.length,
                    visible: true,
                  });
                  setIsClientModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,140,255,0.4)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client Logo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#070B12] border border-white/10 hover:border-white/20 transition-all flex flex-col items-center text-center justify-between"
                >
                  <div className="w-full flex justify-end">
                    <span
                      className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        c.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {c.visible ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  <div className="w-24 h-20 my-2 flex items-center justify-center p-2 rounded-xl bg-black/40 border border-white/5">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/20" />
                    )}
                  </div>

                  <div className="w-full">
                    <p className="font-editorial text-sm font-bold text-white truncate">{c.name}</p>
                    {c.slug && <p className="text-[10px] font-mono text-[#008CFF] truncate">→ {c.slug}</p>}
                  </div>

                  <div className="mt-3 pt-2 w-full border-t border-white/5 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingClient(c);
                        setIsClientModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete client logo "${c.name}"?`)) {
                          await deleteClient(c.id);
                          triggerNotice(`Deleted "${c.name}".`, 'success');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INBOUND LEADS (MINI-CRM) */}
        {activeTab === 'leads' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Inbound Inquiries & Leads ({leads.length})
                </h1>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Direct submissions from the Contact form and Site visit booking requests.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportLeadsCSV}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['all', 'new', 'contacted', 'in_discussion', 'closed', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setLeadStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    leadStatusFilter === status
                      ? 'bg-[#008CFF] text-white font-bold'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {status} (
                  {status === 'all' ? leads.length : leads.filter((l) => l.status === status).length}
                  )
                </button>
              ))}
            </div>

            {/* Leads List */}
            <div className="space-y-3">
              {leads
                .filter((l) => leadStatusFilter === 'all' || l.status === leadStatusFilter)
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl bg-[#070B12] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-editorial text-lg font-bold text-white">{lead.name}</span>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                            lead.status === 'new'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : lead.status === 'contacted'
                              ? 'bg-blue-500/20 text-[#008CFF]'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/50">
                          {lead.type === 'site_visit' ? '📍 Site Visit Booking (₹2,000)' : '✉️ General Inquiry'}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {new Date(lead.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-white/70 flex-wrap">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1.5 hover:text-[#008CFF] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#008CFF]" />
                          <span>{lead.phone}</span>
                        </a>

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 hover:text-[#008CFF] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#008CFF]" />
                            <span>{lead.email}</span>
                          </a>
                        )}

                        {lead.brandName && (
                          <span className="text-white/50">
                            Brand: <strong className="text-white">{lead.brandName}</strong>
                          </span>
                        )}

                        {lead.budget && (
                          <span className="text-white/50">
                            Budget: <strong className="text-white">{lead.budget}</strong>
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="text-xs text-white/60 leading-relaxed font-sans bg-black/30 p-2.5 rounded-lg border border-white/5 mt-2">
                          "{lead.message}"
                        </p>
                      )}
                    </div>

                    {/* Status updater & Quick Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <select
                        value={lead.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as CMSLead['status'];
                          await updateLeadStatus(lead.id, newStatus);
                          triggerNotice(`Lead marked as ${newStatus}.`, 'success');
                        }}
                        className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#008CFF]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_discussion">In Discussion</option>
                        <option value="closed">Closed / Converted</option>
                        <option value="archived">Archived</option>
                      </select>

                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${lead.name}, this is Durgarao from BrandShoots regarding your inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-mono text-xs uppercase flex items-center gap-1.5 transition-colors"
                      >
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={async () => {
                          if (confirm(`Delete lead from "${lead.name}"?`)) {
                            await deleteLead(lead.id);
                            triggerNotice('Lead deleted.', 'success');
                          }
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: HERO & MEDIA */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                Homepage Hero & Media
              </h1>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Customize the cinematic headline, tagline, and background media.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (hero) {
                  await saveHero(hero);
                  triggerNotice('Hero section updated successfully!', 'success');
                }
              }}
              className="p-6 rounded-2xl bg-[#070B12] border border-white/10 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                    Title First Word (Electric Blue)
                  </label>
                  <input
                    type="text"
                    value={hero?.brandTitle || 'BRAND'}
                    onChange={(e) => setHero({ ...hero!, brandTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                    Title Second Word (Pure White)
                  </label>
                  <input
                    type="text"
                    value={hero?.shootsTitle || 'SHOOTS'}
                    onChange={(e) => setHero({ ...hero!, shootsTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#008CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Tagline Prefix</label>
                  <input
                    type="text"
                    value={hero?.taglinePrefix || 'CREATE. '}
                    onChange={(e) => setHero({ ...hero!, taglinePrefix: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                    Tagline Accent (Blue Glow)
                  </label>
                  <input
                    type="text"
                    value={hero?.taglineAccent || 'SHOOT.'}
                    onChange={(e) => setHero({ ...hero!, taglineAccent: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Tagline Suffix</label>
                  <input
                    type="text"
                    value={hero?.taglineSuffix || ' GROW.'}
                    onChange={(e) => setHero({ ...hero!, taglineSuffix: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#008CFF] focus:outline-none"
                  />
                </div>
              </div>

              <CloudinaryUploader
                label="Desktop Featured Reel / Background MP4"
                value={hero?.desktopVideoUrl || ''}
                onChange={(url) => setHero({ ...hero!, desktopVideoUrl: url })}
                accept="video"
                helpText="Optional custom video for the hero environment"
              />

              <CloudinaryUploader
                label="Mobile Cinematic Reel MP4"
                value={hero?.mobileVideoUrl || ''}
                onChange={(url) => setHero({ ...hero!, mobileVideoUrl: url })}
                accept="video"
                helpText="Reel played on mobile viewports"
              />

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider shadow-[0_0_24px_rgba(0,140,255,0.4)] cursor-pointer"
                >
                  Save Hero Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: SERVICES / WHAT WE DO */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  What We Do — Capabilities ({services.length})
                </h1>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  The six flagship visual disciplines featured in the homepage pinned section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#008CFF] font-bold">{s.number}</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">{s.category}</span>
                  </div>

                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                    {s.titleLines.join(' ')}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">{s.description}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400">✓ {s.tag}</span>
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setIsServiceModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                Client Testimonials ({testimonials.length})
              </h1>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Editorial quotes displayed in the homepage 3D Testimonials carousel.
              </p>
            </div>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-[#070B12] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-base font-bold text-white">{t.client}</span>
                    <span className="text-xs font-mono text-[#008CFF]">
                      {t.author} • {t.role}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 italic leading-relaxed">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & CLOUD */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                Settings & Cloud Integration
              </h1>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Configure contact channels, Cloudinary media storage, and Firebase Realtime Database rules.
              </p>
            </div>

            {/* Cloudinary Configuration */}
            <div className="p-6 rounded-2xl bg-[#070B12] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#008CFF]" />
                  <h3 className="font-mono text-sm uppercase font-bold text-white">Cloudinary Media Storage</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Signed Endpoint Ready
                </span>
              </div>

              <p className="text-xs text-white/60 font-mono leading-relaxed">
                BrandShoots Cloudinary API Key (<code className="text-white">281566125612949</code>) and Secret are pre-configured. Enter your Cloudinary Cloud Name below to enable direct drag-and-drop media uploading:
              </p>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={cloudNameInput}
                  onChange={(e) => setCloudNameInput(e.target.value)}
                  placeholder="e.g. brandshoots or your Cloud Name"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveCloudName}
                  className="px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.4)]"
                >
                  Save Cloud Name
                </button>
              </div>
            </div>

            {/* Site Contact Channels */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (siteSettings) {
                  await saveSiteSettings(siteSettings);
                  triggerNotice('Contact settings updated!', 'success');
                }
              }}
              className="p-6 rounded-2xl bg-[#070B12] border border-white/10 space-y-4"
            >
              <h3 className="font-mono text-sm uppercase font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#008CFF]" />
                <span>Contact & Communication Channels</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={siteSettings?.contactPhone || '+91 70759 60672'}
                    onChange={(e) => setSiteSettings({ ...siteSettings!, contactPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">WhatsApp Number (e.g. 917075960672)</label>
                  <input
                    type="text"
                    value={siteSettings?.whatsappPhone || '917075960672'}
                    onChange={(e) => setSiteSettings({ ...siteSettings!, whatsappPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={siteSettings?.contactEmail || 'contact@brandshoots.com'}
                    onChange={(e) => setSiteSettings({ ...siteSettings!, contactEmail: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Instagram URL</label>
                  <input
                    type="text"
                    value={siteSettings?.instagramUrl || 'https://www.instagram.com/wearebrandshoots'}
                    onChange={(e) => setSiteSettings({ ...siteSettings!, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Save Contact Settings
                </button>
              </div>
            </form>

            {/* Firebase Database Security Rules Reference */}
            <div className="p-6 rounded-2xl bg-[#070B12] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm uppercase font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#008CFF]" />
                  <span>Firebase Realtime Database Security Rules</span>
                </h3>
                <button
                  onClick={() => {
                    const rules = `{\n  "rules": {\n    "published": {\n      ".read": true,\n      ".write": "auth != null"\n    },\n    "drafts": {\n      ".read": "auth != null",\n      ".write": "auth != null"\n    },\n    "leads": {\n      ".read": "auth != null",\n      "$leadId": {\n        ".write": "!data.exists() || auth != null"\n      }\n    }\n  }\n}`;
                    navigator.clipboard.writeText(rules);
                    triggerNotice('Security rules copied to clipboard!', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Rules</span>
                </button>
              </div>
              <p className="text-xs text-white/60 font-mono">
                Paste these into your Firebase Console under Realtime Database → Rules tab to ensure public visitors can read published content and write inquiries, while only authorized admins can edit content.
              </p>
              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`{
  "rules": {
    "published": {
      ".read": true,
      ".write": "auth != null"
    },
    "drafts": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "leads": {
      ".read": "auth != null",
      "$leadId": {
        ".write": "!data.exists() || auth != null"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MODAL: EDIT / CREATE PROJECT (WITH 2-3 REELS MANAGER)  */}
        {/* ========================================================= */}
        {isProjectModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#080C14] border border-white/15 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-white">
                    {editingProject.id ? `Edit Project: ${editingProject.name}` : 'Create New Portfolio Project'}
                  </h2>
                  <p className="text-xs font-mono text-white/50">
                    Changes immediately reflect on the live 3D corridor and project showcase modal.
                  </p>
                </div>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveProject(editingProject);
                  setIsProjectModalOpen(false);
                  triggerNotice(`Project "${editingProject.name}" saved!`, 'success');
                }}
                className="space-y-6"
              >
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingProject({
                          ...editingProject,
                          name,
                          slug: editingProject.slug || slug,
                          id: editingProject.id || slug,
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">Category</label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="text-xs font-mono uppercase text-white/70">Published Visibility:</label>
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, visible: !editingProject.visible })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                        editingProject.visible
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {editingProject.visible ? '✓ Visible on Live Site' : 'Hidden from Live'}
                    </button>
                  </div>
                </div>

                {/* Primary Media (Corridor Video & Poster) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#008CFF]">
                    Main Corridor Showcase Media (3D Reel)
                  </h3>
                  <CloudinaryUploader
                    label="Showcase Video (MP4)"
                    value={editingProject.videoUrl}
                    onChange={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                    accept="video"
                    helpText="Played on the central 3D corridor mesh and modal theater"
                  />

                  <CloudinaryUploader
                    label="Showcase Poster Image"
                    value={editingProject.posterUrl}
                    onChange={(url) => setEditingProject({ ...editingProject, posterUrl: url })}
                    accept="image"
                    helpText="Video thumbnail poster"
                  />

                  <CloudinaryUploader
                    label="Client Logo (PNG)"
                    value={editingProject.logoUrl || ''}
                    onChange={(url) => setEditingProject({ ...editingProject, logoUrl: url })}
                    accept="image"
                    helpText="Transparent logo shown in project view"
                  />
                </div>

                {/* Editorial Story & Case Study */}
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Cinematic Headline</label>
                  <input
                    type="text"
                    value={editingProject.headline}
                    onChange={(e) => setEditingProject({ ...editingProject, headline: e.target.value })}
                    placeholder="e.g. High-Velocity Industrial Cinematography"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Narrative Story</label>
                  <textarea
                    rows={3}
                    value={editingProject.story}
                    onChange={(e) => setEditingProject({ ...editingProject, story: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-xs focus:border-[#008CFF] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">The Challenge</label>
                    <textarea
                      rows={2}
                      value={editingProject.challenge || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-2">The Solution</label>
                    <textarea
                      rows={2}
                      value={editingProject.solution || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-xs focus:border-[#008CFF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2-3 REELS MANAGER */}
                <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#008CFF]" />
                        <span>Project Reels Stream ({editingProject.reels?.length || 0} Reels)</span>
                      </h3>
                      <p className="text-[11px] font-mono text-white/40 mt-0.5">
                        These are the 2-3 playable reels revealed in the Project Detail Modal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newReel: CMSProjectReel = {
                          id: `reel-${Date.now()}`,
                          title: `Reel ${(editingProject.reels?.length || 0) + 1}`,
                          category: 'Commercial Cut',
                          duration: '0:30',
                          videoUrl: editingProject.videoUrl || '',
                          posterUrl: editingProject.posterUrl || '',
                        };
                        setEditingProject({
                          ...editingProject,
                          reels: [...(editingProject.reels || []), newReel],
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#008CFF]/20 hover:bg-[#008CFF]/30 text-[#008CFF] font-mono text-xs uppercase flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Reel</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingProject.reels || []).map((reel, rIdx) => (
                      <div
                        key={reel.id || rIdx}
                        className="p-4 rounded-xl bg-[#090D15] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#008CFF] font-bold">
                            Reel #{rIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.reels.filter((_, idx) => idx !== rIdx);
                              setEditingProject({ ...editingProject, reels: updated });
                            }}
                            className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Title</label>
                            <input
                              type="text"
                              value={reel.title}
                              onChange={(e) => {
                                const copy = [...editingProject.reels];
                                copy[rIdx].title = e.target.value;
                                setEditingProject({ ...editingProject, reels: copy });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Tag / Category</label>
                            <input
                              type="text"
                              value={reel.category}
                              onChange={(e) => {
                                const copy = [...editingProject.reels];
                                copy[rIdx].category = e.target.value;
                                setEditingProject({ ...editingProject, reels: copy });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Duration</label>
                            <input
                              type="text"
                              value={reel.duration}
                              onChange={(e) => {
                                const copy = [...editingProject.reels];
                                copy[rIdx].duration = e.target.value;
                                setEditingProject({ ...editingProject, reels: copy });
                              }}
                              placeholder="0:30"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-xs"
                            />
                          </div>
                        </div>

                        <CloudinaryUploader
                          label={`Reel #${rIdx + 1} Video URL`}
                          value={reel.videoUrl}
                          onChange={(url) => {
                            const copy = [...editingProject.reels];
                            copy[rIdx].videoUrl = url;
                            setEditingProject({ ...editingProject, reels: copy });
                          }}
                          accept="video"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider shadow-[0_0_20px_rgba(0,140,255,0.4)] cursor-pointer"
                  >
                    Save Project to Live Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. MODAL: EDIT / CREATE CLIENT LOGO                       */}
        {/* ========================================================= */}
        {isClientModalOpen && editingClient && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#080C14] border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-white">
                  {editingClient.id ? `Edit Client: ${editingClient.name}` : 'Add New Client Logo'}
                </h2>
                <button
                  onClick={() => setIsClientModalOpen(false)}
                  className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveClient(editingClient);
                  setIsClientModalOpen(false);
                  triggerNotice(`Client logo "${editingClient.name}" saved!`, 'success');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Client Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingClient.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingClient({
                        ...editingClient,
                        name,
                        id: editingClient.id || slug,
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">
                    Linked Portfolio Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingClient.slug || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, slug: e.target.value })}
                    placeholder="e.g. santhi-pipes (if project exists)"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                  />
                </div>

                <CloudinaryUploader
                  label="Logo Image (PNG or SVG)"
                  value={editingClient.logoUrl}
                  onChange={(url) => setEditingClient({ ...editingClient, logoUrl: url })}
                  accept="image"
                  helpText="Transparent logo with clear background"
                />

                <div className="flex items-center gap-3 pt-2">
                  <label className="text-xs font-mono uppercase text-white/70">Visibility:</label>
                  <button
                    type="button"
                    onClick={() => setEditingClient({ ...editingClient, visible: !editingClient.visible })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                      editingClient.visible
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {editingClient.visible ? '✓ Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsClientModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.4)]"
                  >
                    Save Logo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. MODAL: EDIT SERVICE                                    */}
        {/* ========================================================= */}
        {isServiceModalOpen && editingService && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#080C14] border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                <h2 className="font-display font-black text-lg uppercase tracking-wider text-white">
                  Edit Service: {editingService.titleLines.join(' ')}
                </h2>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveService(editingService);
                  setIsServiceModalOpen(false);
                  triggerNotice('Service updated!', 'success');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Category</label>
                  <input
                    type="text"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Tag</label>
                  <input
                    type="text"
                    value={editingService.tag}
                    onChange={(e) => setEditingService({ ...editingService, tag: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-xs leading-relaxed"
                  />
                </div>

                <CloudinaryUploader
                  label="Poster Image"
                  value={editingService.imageUrl}
                  onChange={(url) => setEditingService({ ...editingService, imageUrl: url })}
                  accept="image"
                />

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
