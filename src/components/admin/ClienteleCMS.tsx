import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Heart,
  Building2,
} from 'lucide-react';
import { CMSClientLogo } from '../../types/cms';
import {
  fetchPublishedClients,
  saveAllClients,
  resetClientsToDefaults,
} from '../../lib/cms/cmsService';
import { pushClientsUndoAction } from '../../lib/cms/cmsHistory';

export const ClienteleCMS: React.FC = () => {
  const [clients, setClients] = useState<CMSClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<CMSClientLogo | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form Inputs
  const [formName, setFormName] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formViews, setFormViews] = useState('');
  const [formLikes, setFormLikes] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load clients on mount
  useEffect(() => {
    let mounted = true;
    fetchPublishedClients()
      .then((items) => {
        if (mounted) {
          setClients(items);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load clientele logos:', err);
        if (mounted) setIsLoading(false);
      });

    // Listen for storage or undo restore events
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CMSClientLogo[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setClients(customEvent.detail);
      }
    };

    window.addEventListener('brandshoots_clients_updated', handleSync);
    return () => {
      mounted = false;
      window.removeEventListener('brandshoots_clients_updated', handleSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Open Edit Modal
  const openEditModal = (client: CMSClientLogo, index: number) => {
    setEditingClient(client);
    setEditingIndex(index);
    setFormName(client.name || '');
    setFormLogoUrl(client.logoUrl || '');
    setFormViews(client.views || '');
    setFormLikes(client.likes || '');
    setFormVisible(client.visible !== false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingClient(null);
    setEditingIndex(null);
    setFormName('');
    setFormLogoUrl('/clients/trimmed/Aabharan Logo.png');
    setFormViews('');
    setFormLikes('');
    setFormVisible(true);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setEditingIndex(null);
  };

  // Handle Logo File Select
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // Instant local object URL preview
    const localUrl = URL.createObjectURL(file);
    setFormLogoUrl(localUrl);

    // Persist as base64 data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormLogoUrl(reader.result);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Save Client Logo (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameClean = formName.trim();
    if (!nameClean) return;

    const previousState = [...clients];
    let updatedList: CMSClientLogo[];

    if (editingClient && editingIndex !== null) {
      // Edit existing
      pushClientsUndoAction(`Updated client logo: ${nameClean}`, previousState);

      const updatedClient: CMSClientLogo = {
        ...editingClient,
        name: nameClean,
        logoUrl: formLogoUrl.trim(),
        views: formViews.trim() || undefined,
        likes: formLikes.trim() || undefined,
        visible: formVisible,
        updatedAt: Date.now(),
      };

      updatedList = clients.map((c, idx) => (idx === editingIndex ? updatedClient : c));
      showToast(`Client "${nameClean}" updated & live synced!`);
    } else {
      // Create new
      pushClientsUndoAction(`Added client logo: ${nameClean}`, previousState);

      const cleanSlug = nameClean.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      const newClient: CMSClientLogo = {
        id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: nameClean,
        logoUrl: formLogoUrl.trim(),
        slug: cleanSlug,
        views: formViews.trim() || undefined,
        likes: formLikes.trim() || undefined,
        order: clients.length,
        visible: formVisible,
        updatedAt: Date.now(),
      };

      updatedList = [...clients, newClient];
      showToast(`Client "${nameClean}" added & live synced!`);
    }

    setClients(updatedList);
    await saveAllClients(updatedList);
    closeModal();
  };

  // Delete Client
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete client "${name}"? This can be undone anytime with the navbar Undo button.`)) {
      return;
    }

    const previousState = [...clients];
    pushClientsUndoAction(`Deleted client: ${name}`, previousState);

    const updatedList = clients.filter((c) => c.id !== id);
    setClients(updatedList);
    await saveAllClients(updatedList);
    showToast(`Client "${name}" removed. Click Undo in navbar to restore.`);
  };

  // Toggle Visibility
  const handleToggleVisible = async (client: CMSClientLogo, index: number) => {
    const previousState = [...clients];
    const newStatus = !client.visible;
    pushClientsUndoAction(
      `${newStatus ? 'Showed' : 'Hidden'} client: ${client.name}`,
      previousState
    );

    const updated = clients.map((c, idx) =>
      idx === index ? { ...c, visible: newStatus, updatedAt: Date.now() } : c
    );

    setClients(updated);
    await saveAllClients(updated);
    showToast(`Client "${client.name}" is now ${newStatus ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset client logos to BrandShoots official defaults? This can be undone with the navbar Undo button.')) {
      return;
    }

    const previousState = [...clients];
    pushClientsUndoAction('Reset client logos to defaults', previousState);

    const defaults = await resetClientsToDefaults();
    setClients(defaults);
    showToast('Client logos reset to defaults!');
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-white" />
          <span>Loading Our Clients Logos...</span>
        </div>
      </div>
    );
  }

  const activeCount = clients.filter((c) => c.visible !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#008CFF] text-white font-mono text-xs font-bold shadow-[0_10px_40px_rgba(0,140,255,0.4)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-[#070B12]/95 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
              OUR CLIENTS & BRAND PARTNERS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs font-bold">
              {activeCount} Active / {clients.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
            Manage partner logos, client brands, and visual tile assets featured on the homepage carousel.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 flex items-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
            title="Reset to default client logos"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white hover:bg-white/90 text-black flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Client Logo</span>
          </button>
        </div>
      </div>

      {/* Client Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
        {clients.map((client, index) => {
          const itemNum = String(index + 1).padStart(2, '0');
          const isVisible = client.visible !== false;

          return (
            <div
              key={client.id || index}
              className={`group relative bg-[#070B12]/95 border rounded-2xl p-3.5 sm:p-4 transition-all duration-300 flex flex-col justify-between shadow-lg ${
                isVisible
                  ? 'border-white/15 hover:border-white/40 shadow-black/60 hover:-translate-y-0.5'
                  : 'border-white/5 opacity-50 bg-black/40'
              }`}
            >
              {/* Card Top Actions: Number, Status Toggle, Edit & Delete */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                <span className="font-mono text-[11px] font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
                  #{itemNum}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Visibility Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisible(client, index)}
                    className={`p-1 rounded-md text-white/70 hover:text-white transition-colors cursor-pointer ${
                      isVisible ? 'hover:bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/10 text-white/40'
                    }`}
                    title={isVisible ? 'Visible on homepage (Click to hide)' : 'Hidden (Click to show)'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5 text-current" /> : <EyeOff className="w-3.5 h-3.5 text-current" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(client, index)}
                    className="p-1 rounded-md bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                    title={`Edit ${client.name}`}
                  >
                    <Edit3 className="w-3 h-3 text-current" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(client.id, client.name)}
                    className="p-1 rounded-md bg-white/10 hover:bg-red-500 text-white hover:text-white transition-colors cursor-pointer"
                    title={`Delete ${client.name}`}
                  >
                    <Trash2 className="w-3 h-3 text-current" />
                  </button>
                </div>
              </div>

              {/* White Square Logo Tile (Identical to Live Homepage) */}
              <div className="relative w-full aspect-square bg-white rounded-xl p-3 flex items-center justify-center border border-white/20 shadow-inner group/tile overflow-hidden">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover/tile:scale-105"
                  />
                ) : (
                  <div className="text-black/40 flex flex-col items-center gap-1 text-[10px] font-mono">
                    <ImageIcon className="w-5 h-5 text-black/30" />
                    <span>No Logo</span>
                  </div>
                )}

                {/* Quick Replace Button Hover Overlay */}
                <button
                  type="button"
                  onClick={() => openEditModal(client, index)}
                  className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/80 hover:bg-black text-white border border-white/30 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Replace this logo"
                  aria-label="Replace this logo"
                >
                  <RefreshCw className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* Client Name Below Tile */}
              <div className="mt-3 text-center">
                <p className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight truncate" title={client.name}>
                  {client.name}
                </p>
                <span className="text-[10px] font-mono text-white/40 block mt-0.5 truncate">
                  {client.slug || client.id}
                </span>

                {/* Subtle Circular Stats Indicators */}
                {(client.views || client.likes) ? (
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {client.views && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9.5px] font-mono text-white/80"
                        title={`Views: ${client.views}`}
                      >
                        <Eye className="w-2.5 h-2.5 text-[#008CFF]" />
                        <span>{client.views}</span>
                      </span>
                    )}
                    {client.likes && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9.5px] font-mono text-white/80"
                        title={`Likes: ${client.likes}`}
                      >
                        <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/30" />
                        <span>{client.likes}</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[9.5px] font-mono text-white/25 block mt-2">No stats</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* ADD / EDIT / REPLACE CLIENT MODAL                                   */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[94vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-display">
                    {editingClient ? 'Edit Client Logo' : 'Add New Client Logo'}
                  </h2>
                  <p className="text-xs font-mono text-white/50">
                    Partner tile asset for homepage clients carousel
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* 1. Client Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                  <span>Client Brand Name</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Santhi Pipes, Viswatuff Glass, Bags World"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans font-bold placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* 2. Client Logo Image */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="block text-xs font-mono uppercase text-white/70 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-white" />
                  <span>Client Logo (PNG, SVG, JPG, WebP)</span>
                </label>

                {/* Paste URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder="e.g. /clients/trimmed/Shanti Pipes.png or https://..."
                    required
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* File Upload Trigger */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] flex items-center justify-center gap-3"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono text-white/70">
                    {isUploading ? 'Processing logo file...' : 'Click or drop logo image to upload'}
                  </span>
                </div>

                {uploadError && (
                  <p className="text-xs font-mono text-red-400">{uploadError}</p>
                )}

                {/* Live Preview Container with Real White Tile */}
                {formLogoUrl && (
                  <div className="p-3 bg-black/50 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center border border-white/20 shrink-0 shadow-md">
                      <img
                        src={formLogoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase text-white/50 block">Live Homepage Tile Preview</span>
                      <p className="text-xs font-mono text-white truncate">{formLogoUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Client Stats (Views & Likes) */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-white/70 font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#008CFF]" />
                    <span>Client Stats (Views & Likes)</span>
                  </label>
                  <span className="text-[10px] font-mono text-white/40">Optional · Empty = Hidden</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/50 mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#008CFF]" />
                      <span>Views</span>
                    </label>
                    <input
                      type="text"
                      value={formViews}
                      onChange={(e) => setFormViews(e.target.value)}
                      placeholder="e.g. 250K+ or 1.2M"
                      className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-mono placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/50 mb-1 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>Likes</span>
                    </label>
                    <input
                      type="text"
                      value={formLikes}
                      onChange={(e) => setFormLikes(e.target.value)}
                      placeholder="e.g. 34K+ or 85K"
                      className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-mono placeholder:text-white/30 focus:outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Visibility Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-black/50 border border-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase block">
                    Homepage Visibility
                  </span>
                  <span className="text-[11px] font-sans text-white/50">
                    Display inside the client logo carousel
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormVisible(!formVisible)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    formVisible
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/10 border border-white/20 text-white/50'
                  }`}
                >
                  {formVisible ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>

              {/* Sticky Action Buttons */}
              <div className="sticky -bottom-6 sm:-bottom-8 pt-4 pb-1 bg-[#0A0E17]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>{editingClient ? 'Save Client Logo' : 'Add Client Logo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteleCMS;
