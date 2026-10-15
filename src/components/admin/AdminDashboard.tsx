import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';
import { AdminUserSession } from './AdminAuthGuard';
import {
  ExternalLink,
  LogOut,
  Clock,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  Home,
  Film,
  Mail,
  Sparkles,
  Briefcase,
  Megaphone,
  Users,
  MessageSquare,
  Menu,
  X,
  Undo2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSectionCMS } from './HeroSectionCMS';
import { WhatWeDoCMS } from './WhatWeDoCMS';
import { AnnouncementsCMS } from './AnnouncementsCMS';
import { ClienteleCMS } from './ClienteleCMS';
import { TestimonialsCMS } from './TestimonialsCMS';
import { PortfolioCMS } from './PortfolioCMS';
import { ContactCMS } from './ContactCMS';
import { canUndo, getLastActionDescription, undoLastAction } from '../../lib/cms/cmsHistory';

interface AdminDashboardProps {
  user: User | AdminUserSession;
}

type MainSection = 'home' | 'portfolio' | 'contact';
type HomeSubSection = 'hero' | 'whatwedo' | 'announcements' | 'clientele' | 'testimonials';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  // Navigation State
  const [activeMain, setActiveMain] = useState<MainSection>('home');
  const [activeHomeSub, setActiveHomeSub] = useState<HomeSubSection>('hero');
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Formatted Login Time
  const [loggedTime, setLoggedTime] = useState<string>('');

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('bs_admin_auth_fallback');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.authenticatedAt) {
          const d = new Date(parsed.authenticatedAt);
          setLoggedTime(
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
          return;
        }
      }
    } catch {}
    setLoggedTime(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  // Undo & Flash Notification State
  const [canUndoState, setCanUndoState] = useState<boolean>(() => canUndo());
  const [lastActionDesc, setLastActionDesc] = useState<string | null>(() => getLastActionDescription());
  const [flashMessage, setFlashMessage] = useState<{
    message: string;
    type: 'action' | 'undo' | 'info';
    id: number;
  } | null>(null);

  useEffect(() => {
    // Listen to history updates to enable/disable Undo button
    const handleHistoryChange = () => {
      setCanUndoState(canUndo());
      setLastActionDesc(getLastActionDescription());
    };

    // Listen to flash notifications ("flash text then gone")
    let flashTimer: any = null;
    const handleNavFlash = (e: any) => {
      if (e?.detail?.message) {
        setFlashMessage({
          message: e.detail.message,
          type: e.detail.type || 'action',
          id: Date.now(),
        });
        if (flashTimer) clearTimeout(flashTimer);
        flashTimer = setTimeout(() => {
          setFlashMessage(null);
        }, 3800);
      }
    };

    window.addEventListener('brandshoots_cms_history_change', handleHistoryChange);
    window.addEventListener('brandshoots_nav_flash', handleNavFlash);

    return () => {
      window.removeEventListener('brandshoots_cms_history_change', handleHistoryChange);
      window.removeEventListener('brandshoots_nav_flash', handleNavFlash);
      if (flashTimer) clearTimeout(flashTimer);
    };
  }, []);

  const handleUndoClick = async () => {
    if (!canUndoState) return;
    await undoLastAction();
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch {
      // ignore
    }
    localStorage.removeItem('bs_admin_auth_fallback');
    window.dispatchEvent(new Event('bs-auth-change'));
  };

  // User display name
  const displayName =
    user.displayName ||
    (user.email ? user.email.split('@')[0] : 'Admin');

  return (
    <div className="relative w-full min-h-screen bg-[#04060A] text-white flex flex-col selection:bg-[#008CFF] selection:text-white">
      {/* Background Volumetric Glow & Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-radial from-[#008CFF]/10 via-transparent to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* =================================================================== */}
      {/* 1. TOP NAVIGATION BAR                                               */}
      {/* Contains: Logo, Flash Bar, Undo, Logged Time, Name, Live Site, Logout */}
      {/* =================================================================== */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-3.5 bg-[#04060A]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5 group">
            <img
              src="/Logo Official.svg"
              alt="BrandShoots"
              className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
            />
            <div className="flex items-center gap-1 font-display font-black text-base sm:text-lg tracking-wider">
              <span className="text-[#008CFF]">BRAND</span>
              <span className="text-white">SHOOTS</span>
            </div>
          </Link>
        </div>

        {/* Center: Flash Scroll / Notification Marquee ("likt flash text then gone") */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 min-w-0 max-w-xl mx-auto overflow-hidden">
          {flashMessage ? (
            <div
              key={flashMessage.id}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs font-mono transition-all duration-300 shadow-lg min-w-0 max-w-full shrink-0 ${
                flashMessage.type === 'undo'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    flashMessage.type === 'undo' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    flashMessage.type === 'undo' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="truncate min-w-0 max-w-[200px] sm:max-w-[340px] font-semibold text-white">
                {flashMessage.message}
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 shrink-0">
                {flashMessage.type === 'undo' ? 'Restored' : 'Live Synced'}
              </span>
            </div>
          ) : null}
        </div>

        {/* Right: Undo, Logged Time, Name, Live Site (_blank), Logout */}
        <div className="flex items-center gap-2 sm:gap-3.5 font-mono text-xs shrink-0">
          {/* Undo Button in Nav Bar */}
          <button
            type="button"
            onClick={handleUndoClick}
            disabled={!canUndoState}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              canUndoState
                ? 'bg-white/10 hover:bg-white text-white hover:text-black border-white/20 cursor-pointer shadow-md hover:scale-105 active:scale-95'
                : 'bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed opacity-60'
            }`}
            title={canUndoState ? `Undo: ${lastActionDesc || 'last change'}` : 'No actions to undo'}
            aria-label="Undo CMS change"
          >
            <Undo2 className="w-3.5 h-3.5 text-current" />
            <span>Undo</span>
          </button>

          {/* Logged in Time */}
          {loggedTime && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/60">
              <Clock className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px]">Logged in at {loggedTime}</span>
            </div>
          )}

          {/* User Name */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/85">
            <UserIcon className="w-3.5 h-3.5 text-white/70" />
            <span className="font-semibold text-xs capitalize truncate max-w-[120px] sm:max-w-none">
              {displayName}
            </span>
          </div>

          {/* Live Site Link (_blank) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#008CFF]/10 hover:bg-[#008CFF]/20 border border-[#008CFF]/30 text-[#008CFF] hover:text-white transition-all shadow-[0_0_15px_rgba(0,140,255,0.2)]"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. BODY LAYOUT (RESPONSIVE SIDEBAR + MAIN CONTENT AREA)             */}
      {/* =================================================================== */}
      <div className="relative z-20 flex-1 flex w-full">
        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ================================================================= */}
        {/* RESPONSIVE LEFT SIDEBAR MENU                                      */}
        {/* ================================================================= */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 bg-[#06080E]/95 lg:bg-[#06080E]/70 backdrop-blur-2xl border-r border-white/10 flex flex-col p-5 sm:p-6 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Mobile Sidebar Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 lg:hidden">
            <span className="font-mono text-sm uppercase tracking-wider text-white/70 font-semibold">
              Admin Navigation
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80 hover:text-white"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
            {/* 1. HOME PAGE (DROPDOWN) */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => {
                  setActiveMain('home');
                  setIsHomeDropdownOpen(!isHomeDropdownOpen);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeMain === 'home'
                    ? 'bg-[#008CFF]/20 text-white font-bold border border-[#008CFF]/30'
                    : 'text-white/85 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-white" />
                  <span className="font-sans text-base font-bold tracking-wide">Home Page</span>
                </div>
                {isHomeDropdownOpen ? (
                  <ChevronDown className="w-4 h-4 text-white/80" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/80" />
                )}
              </button>

              {/* Home Subsections Dropdown */}
              {isHomeDropdownOpen && (
                <div className="pl-5 pr-2 py-2 space-y-1 bg-black/25 border-t border-white/5">
                  {[
                    { id: 'hero', label: 'Hero Section', icon: Sparkles },
                    { id: 'whatwedo', label: 'What We Do Section', icon: Briefcase },
                    { id: 'announcements', label: 'Announcements Section', icon: Megaphone },
                    { id: 'clientele', label: 'Clientele Section', icon: Users },
                    { id: 'testimonials', label: 'Testimonials Section', icon: MessageSquare },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isSubActive = activeMain === 'home' && activeHomeSub === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveMain('home');
                          setActiveHomeSub(item.id as HomeSubSection);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold transition-all text-left cursor-pointer ${
                          isSubActive
                            ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                            : 'text-white/75 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. PORTFOLIO */}
            <button
              type="button"
              onClick={() => {
                setActiveMain('portfolio');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                activeMain === 'portfolio'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/85 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Film className="w-5 h-5 text-white" />
              <span className="font-sans text-base font-bold tracking-wide">Portfolio</span>
            </button>

            {/* 4. CONTACT */}
            <button
              type="button"
              onClick={() => {
                setActiveMain('contact');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                activeMain === 'contact'
                  ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)]'
                  : 'text-white/85 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5 text-white" />
              <span className="font-sans text-base font-bold tracking-wide">Contact</span>
            </button>
          </div>

          {/* Sidebar Footer Info */}
          <div className="pt-4 border-t border-white/10 text-xs font-mono text-white/50 flex flex-col gap-1">
            <span className="text-white font-semibold">BrandShoots Admin</span>
            <span>Production Management Console</span>
          </div>
        </aside>

        {/* ================================================================= */}
        {/* 3. MAIN CONTENT WORKSPACE                                         */}
        {/* ================================================================= */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col w-full max-w-[1700px] mx-auto overflow-y-auto">
          {/* Breadcrumb / Section Header for other sections (Hero, What We Do, Announcements, Clientele, & Testimonials have their own unified header) */}
          {!(activeMain === 'home' && (activeHomeSub === 'hero' || activeHomeSub === 'whatwedo' || activeHomeSub === 'announcements' || activeHomeSub === 'clientele' || activeHomeSub === 'testimonials')) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/40 mb-2">
                <span className="capitalize">{activeMain}</span>
                {activeMain === 'home' && (
                  <>
                    <span>/</span>
                    <span className="text-white font-semibold capitalize">{activeHomeSub}</span>
                  </>
                )}
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white flex items-center gap-3">
                {activeMain === 'home' && `Home Page — ${activeHomeSub.toUpperCase()} SECTION`}
                {activeMain === 'portfolio' && 'Portfolio — Project Reels Showcase'}
                {activeMain === 'contact' && 'Contact — Inquiries & Lead Channels'}
              </h1>
            </div>
          )}

          {/* =============================================================== */}
          {/* 1. HOME: HERO, WHAT WE DO, ANNOUNCEMENTS, CLIENTELE, TESTIMONIALS (CMS 1.5) */}
          {/* =============================================================== */}
          {activeMain === 'home' && activeHomeSub === 'hero' ? (
            <HeroSectionCMS />
          ) : activeMain === 'home' && activeHomeSub === 'whatwedo' ? (
            <WhatWeDoCMS />
          ) : activeMain === 'home' && activeHomeSub === 'announcements' ? (
            <AnnouncementsCMS />
          ) : activeMain === 'home' && activeHomeSub === 'clientele' ? (
            <ClienteleCMS />
          ) : activeMain === 'home' && activeHomeSub === 'testimonials' ? (
            <TestimonialsCMS />
          ) : activeMain === 'portfolio' ? (
            <PortfolioCMS />
          ) : activeMain === 'contact' ? (
            <ContactCMS />
          ) : (
            /* =============================================================== */
            /* OTHER SECTIONS: PHASE 1.1 CLEAN STATUS CARD                    */
            /* =============================================================== */
            <div className="bg-[#070B12]/95 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#008CFF]/10 border border-[#008CFF]/30 flex items-center justify-center p-3 mb-5 shadow-[0_0_30px_rgba(0,140,255,0.2)]">
                <img
                  src="/Logo Official.svg"
                  alt="BrandShoots"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 text-[#008CFF] font-mono text-xs uppercase tracking-wider font-semibold mb-4">
                <span>CMS Phase 1.1 Active</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white mb-2">
                Home / {activeHomeSub.toUpperCase()} SECTION
              </h2>

              <p className="text-sm font-sans font-light text-white/60 max-w-md leading-relaxed mb-6">
                Section registered in CMS Phase 1.1 architecture. Ready to connect custom fields in Phase 1.2.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-white/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Ready for Phase 1.2 individual configuration schema</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
