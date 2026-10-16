import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Info,
  ListPlus,
  MinusCircle,
} from 'lucide-react';
import { CMSProject, CMSProjectReel } from '../../types/cms';
import {
  fetchPublishedProjects,
  saveAllProjects,
  resetProjectsToDefaults,
} from '../../lib/cms/cmsService';
import { pushProjectsUndoAction } from '../../lib/cms/cmsHistory';

const PRESET_LOGOS = [
  { label: 'Santhi Pipes', url: '/clients/Shanti Pipes.png' },
  { label: 'Viswatuff Glass', url: '/clients/Viswatuff Glass Logo.png' },
  { label: 'Bags World', url: '/clients/Bags World Logo.PNG' },
  { label: 'Aabharan Jewellers', url: '/clients/Aabharan Logo.png' },
  { label: 'Fresh & Fresh', url: '/clients/Fresh and Fresh Logo.png' },
  { label: 'Dayanidhi Creations', url: '/clients/Dayanidhi Logo.png' },
  { label: 'Jain Beauty Studio', url: '/clients/Jain Beauty Logo.png' },
  { label: 'RK Home Living', url: '/clients/Rk home.png' },
  { label: 'SB Ventures', url: '/clients/SB Ventures Logo.png' },
  { label: 'KC Overseas', url: '/clients/KC Overseas Logo.PNG' },
  { label: 'SRK Doors World', url: '/clients/SRK Doors World Logo.png' },
  { label: 'Jain Enterprises', url: '/clients/Jain Enterprises Logo.png' },
  { label: 'Nirmala', url: '/clients/Nirmala logo.png' },
  { label: 'Rudra', url: '/clients/Rudra logo.png' },
  { label: 'Sahana', url: '/clients/Sahana Logo.PNG' },
  { label: 'T3 Studio', url: '/clients/T3 Logo.png' },
];

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State: Basic Info
  const [formName, setFormName] = useState('');
  const [formHeadline, setFormHeadline] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formVisible, setFormVisible] = useState(true);

  // Form State: Media
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');

  // Form State: Stats
  const [formViews, setFormViews] = useState('250K+');
  const [formFollowers, setFormFollowers] = useState('18K+');
  const [formLikes, setFormLikes] = useState('34K+');

  // Form State: More Info Experience
  const [formStory, setFormStory] = useState('');
  const [formDeliverables, setFormDeliverables] = useState<string[]>(['', '', '']);
  const [formReels, setFormReels] = useState<CMSProjectReel[]>([]);

  // File Upload State
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  // Load published projects on mount & listen for undo updates
  useEffect(() => {
    let mounted = true;
    fetchPublishedProjects()
      .then((items) => {
        if (mounted) {
          setProjects(items);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load portfolio projects:', err);
        if (mounted) setIsLoading(false);
      });

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CMSProject[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setProjects(customEvent.detail);
      }
    };

    window.addEventListener('brandshoots_projects_updated', handleSync);
    return () => {
      mounted = false;
      window.removeEventListener('brandshoots_projects_updated', handleSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Open Edit Modal
  const openEditModal = (project: CMSProject, index: number) => {
    setEditingProject(project);
    setEditingIndex(index);
    setFormName(project.name || '');
    setFormHeadline(project.headline || '');
    setFormCategory(project.category || 'Commercial Production');
    setFormYear(project.year || '2026');
    setFormVisible(project.visible !== false);
    setFormVideoUrl(project.videoUrl || '');
    setFormPosterUrl(project.posterUrl || '');
    setFormLogoUrl(project.logoUrl || '');

    // Extract metrics
    const viewsObj = project.metrics?.find((m) => m.label.toLowerCase() === 'views');
    const followersObj = project.metrics?.find((m) => m.label.toLowerCase() === 'followers');
    const likesObj = project.metrics?.find((m) => m.label.toLowerCase() === 'likes');
    setFormViews(viewsObj?.value || '250K+');
    setFormFollowers(followersObj?.value || '18K+');
    setFormLikes(likesObj?.value || '34K+');

    // More Info content
    setFormStory(project.story || '');
    setFormDeliverables(
      project.deliverables && project.deliverables.length > 0
        ? [...project.deliverables]
        : ['High-Speed Extrusion Lines & Heavy Machinery', 'Large-Scale Warehouse & Logistics', 'High-Retention Commercial Cut']
    );
    setFormReels(project.reels && project.reels.length > 0 ? [...project.reels] : []);

    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProject(null);
    setEditingIndex(null);
    setFormName('');
    setFormHeadline('');
    setFormCategory('Commercial Production');
    setFormYear('2026');
    setFormVisible(true);
    setFormVideoUrl('/reels/santhi.pipes_rjy/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.mp4');
    setFormPosterUrl('/reels/thumbnails/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.jpg');
    setFormLogoUrl('/clients/Shanti Pipes.png');
    setFormViews('250K+');
    setFormFollowers('18K+');
    setFormLikes('34K+');
    setFormStory('Cinematic commercial filmmaking capturing industrial excellence and brand identity.');
    setFormDeliverables([
      'Kinetic Camera Movement & Direction',
      'High-Impact Cinematic Commercial',
      'High-Retention Social Reels',
    ]);
    setFormReels([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setEditingIndex(null);
  };

  // Handle Logo File Upload
  const handleLogoFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    setIsUploadingLogo(true);
    const localUrl = URL.createObjectURL(file);
    setFormLogoUrl(localUrl);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormLogoUrl(reader.result);
      }
      setIsUploadingLogo(false);
    };
    reader.onerror = () => setIsUploadingLogo(false);
    reader.readAsDataURL(file);
  };

  // Handle Poster File Upload
  const handlePosterFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file for the poster.');
      return;
    }
    setIsUploadingPoster(true);
    const localUrl = URL.createObjectURL(file);
    setFormPosterUrl(localUrl);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormPosterUrl(reader.result);
      }
      setIsUploadingPoster(false);
    };
    reader.onerror = () => setIsUploadingPoster(false);
    reader.readAsDataURL(file);
  };

  // Handle Video File Upload
  const handleVideoFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid MP4/MOV/WebM video file.');
      return;
    }
    setIsUploadingVideo(true);
    const localUrl = URL.createObjectURL(file);
    setFormVideoUrl(localUrl);

    // Optional Cloudinary direct upload if available
    const cloudName =
      (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem('bs_cloudinary_cloud_name') ||
      '';

    if (cloudName.trim()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'brandshoots_unsigned');
      formData.append('folder', 'brandshoots_portfolio');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName.trim()}/video/upload`);
      xhr.onload = () => {
        setIsUploadingVideo(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.secure_url) setFormVideoUrl(res.secure_url);
          } catch {}
        }
      };
      xhr.onerror = () => setIsUploadingVideo(false);
      xhr.send(formData);
    } else {
      setIsUploadingVideo(false);
    }
  };

  // Save Project (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameClean = formName.trim();
    if (!nameClean) {
      alert('Please enter a project title / client name.');
      return;
    }

    const previousState = [...projects];
    const cleanDeliverables = formDeliverables
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const metrics = [
      { label: 'Views', value: formViews.trim() || '250K+' },
      { label: 'Followers', value: formFollowers.trim() || '18K+' },
      { label: 'Likes', value: formLikes.trim() || '34K+' },
    ];

    let updatedList: CMSProject[];

    if (editingProject && editingIndex !== null) {
      // Edit existing
      pushProjectsUndoAction(`Updated portfolio project: ${nameClean}`, previousState);

      const updatedProject: CMSProject = {
        ...editingProject,
        name: nameClean,
        headline: formHeadline.trim(),
        category: formCategory.trim() || 'Commercial Production',
        year: formYear.trim() || '2026',
        videoUrl: formVideoUrl.trim(),
        posterUrl: formPosterUrl.trim(),
        logoUrl: formLogoUrl.trim() || undefined,
        story: formStory.trim(),
        deliverables: cleanDeliverables,
        metrics,
        reels: formReels,
        visible: formVisible,
        updatedAt: Date.now(),
      };

      updatedList = projects.map((p, idx) => (idx === editingIndex ? updatedProject : p));
      showToast(`Project "${nameClean}" updated & live synced!`);
    } else {
      // Create new
      pushProjectsUndoAction(`Added portfolio project: ${nameClean}`, previousState);

      const cleanSlug = nameClean.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      const newProject: CMSProject = {
        id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        slug: cleanSlug,
        name: nameClean,
        headline: formHeadline.trim(),
        category: formCategory.trim() || 'Commercial Production',
        year: formYear.trim() || '2026',
        videoUrl: formVideoUrl.trim(),
        posterUrl: formPosterUrl.trim(),
        logoUrl: formLogoUrl.trim() || undefined,
        story: formStory.trim(),
        deliverables: cleanDeliverables,
        metrics,
        reels: formReels,
        order: projects.length,
        visible: formVisible,
        updatedAt: Date.now(),
      };

      updatedList = [...projects, newProject];
      showToast(`Project "${nameClean}" added & live synced!`);
    }

    setProjects(updatedList);
    await saveAllProjects(updatedList);
    closeModal();
  };

  // Quick Visibility Toggle
  const toggleVisibility = async (index: number) => {
    const project = projects[index];
    if (!project) return;

    const previousState = [...projects];
    const newVisible = !project.visible;
    pushProjectsUndoAction(
      `${newVisible ? 'Shown' : 'Hidden'} portfolio project: ${project.name}`,
      previousState
    );

    const updated = projects.map((p, idx) =>
      idx === index ? { ...p, visible: newVisible, updatedAt: Date.now() } : p
    );
    setProjects(updated);
    await saveAllProjects(updated);
    showToast(`"${project.name}" is now ${newVisible ? 'Visible' : 'Hidden'} on Portfolio.`);
  };

  // Reorder: Move Up
  const moveUp = async (index: number) => {
    if (index <= 0) return;
    const previousState = [...projects];
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    pushProjectsUndoAction(`Moved "${temp.name}" up`, previousState);
    setProjects(updated);
    await saveAllProjects(updated);
    showToast(`Reordered "${temp.name}" to position #${index}.`);
  };

  // Reorder: Move Down
  const moveDown = async (index: number) => {
    if (index >= projects.length - 1) return;
    const previousState = [...projects];
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    pushProjectsUndoAction(`Moved "${temp.name}" down`, previousState);
    setProjects(updated);
    await saveAllProjects(updated);
    showToast(`Reordered "${temp.name}" to position #${index + 2}.`);
  };

  // Delete Project
  const handleDelete = async (index: number) => {
    const project = projects[index];
    if (!project) return;
    if (!window.confirm(`Are you sure you want to delete "${project.name}" from the portfolio?`)) {
      return;
    }

    const previousState = [...projects];
    pushProjectsUndoAction(`Deleted portfolio project: ${project.name}`, previousState);

    const updated = projects.filter((_, idx) => idx !== index);
    setProjects(updated);
    await saveAllProjects(updated);
    showToast(`Project "${project.name}" deleted.`);
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Reset all portfolio projects to original default production showcase? Any custom projects will be replaced.'
      )
    ) {
      return;
    }
    const previousState = [...projects];
    pushProjectsUndoAction('Reset all portfolio projects to default showcase', previousState);
    const defaults = await resetProjectsToDefaults();
    setProjects(defaults);
    showToast('Portfolio projects restored to defaults & live synced!');
  };

  // Deliverables list helpers
  const handleAddDeliverable = () => {
    if (formDeliverables.length >= 6) return;
    setFormDeliverables([...formDeliverables, '']);
  };

  const handleUpdateDeliverable = (idx: number, val: string) => {
    const updated = [...formDeliverables];
    updated[idx] = val;
    setFormDeliverables(updated);
  };

  const handleRemoveDeliverable = (idx: number) => {
    setFormDeliverables(formDeliverables.filter((_, i) => i !== idx));
  };

  // Additional reels helpers
  const handleAddReel = () => {
    const newReel: CMSProjectReel = {
      id: `reel_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: `Reel 0${formReels.length + 2}`,
      category: 'Commercial Cut',
      duration: '0:30',
      videoUrl: formVideoUrl || '',
      posterUrl: formPosterUrl || '',
    };
    setFormReels([...formReels, newReel]);
  };

  const handleUpdateReel = (idx: number, field: keyof CMSProjectReel, val: string) => {
    const updated = [...formReels];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormReels(updated);
  };

  const handleRemoveReel = (idx: number) => {
    setFormReels(formReels.filter((_, i) => i !== idx));
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.headline?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Save / Feedback Toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#070b14] border border-cyan-500/40 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="font-sans text-sm font-medium">{saveToast}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-sans font-bold text-white tracking-tight">
              Portfolio Projects
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs border border-cyan-500/20">
              {projects.length} Total
            </span>
          </div>
          <p className="text-xs text-white/60 font-sans font-light mt-1">
            Manage 3D reels, center logos, editorial headlines, metrics, and More Info case studies.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono transition-colors border border-white/10 cursor-pointer"
            title="Reset to default showcase"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white text-xs font-sans font-bold tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(0,140,255,0.35)] cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Search / Filter Input */}
      {projects.length > 4 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, headline, or category..."
            className="w-full bg-[#070b14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      )}

      {/* Projects List / Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-white/50 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-white mb-3" />
          <span>Loading portfolio projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-white/60 font-sans text-sm mb-4">
            {searchQuery ? 'No projects match your search.' : 'No portfolio projects found.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008CFF] text-white text-xs font-bold uppercase cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => {
            const views = project.metrics?.find((m) => m.label.toLowerCase() === 'views')?.value || '250K+';
            const followers = project.metrics?.find((m) => m.label.toLowerCase() === 'followers')?.value || '18K+';
            const likes = project.metrics?.find((m) => m.label.toLowerCase() === 'likes')?.value || '34K+';
            const isVisible = project.visible !== false;

            return (
              <div
                key={project.id || index}
                className={`group relative rounded-2xl bg-[#070b14] border transition-all duration-200 flex flex-col overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_4px_24px_rgba(0,140,255,0.08)] ${
                  isVisible ? 'border-white/10' : 'border-white/5 opacity-60'
                }`}
              >
                {/* Card Header: Badge & Controls */}
                <div className="flex items-center justify-between p-3.5 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-sans font-medium text-white/50 uppercase tracking-wider">
                      {project.category || 'Commercial'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveUp(index);
                      }}
                      title="Move Up"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === projects.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDown(index);
                      }}
                      title="Move Down"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(index);
                      }}
                      title={isVisible ? 'Hide Project' : 'Show Project'}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
                    >
                      {isVisible ? (
                        <Eye className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Body: Logo Preview + Title & Description */}
                <div
                  onClick={() => openEditModal(project, index)}
                  className="p-4 flex-1 flex flex-col cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    {/* Center 3D Logo Contrast Box */}
                    <div className="w-14 h-14 rounded-xl bg-[#030509] border border-white/10 flex items-center justify-center p-2 shrink-0 group-hover:border-cyan-500/30 transition-colors">
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt={project.name}
                          className="max-h-10 max-w-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-white/20" />
                      )}
                    </div>

                    {/* Title & Headline */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-sans font-bold text-base text-white tracking-tight leading-snug truncate group-hover:text-cyan-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs text-white/60 font-sans line-clamp-2 leading-relaxed">
                        {project.headline || 'No description entered.'}
                      </p>
                    </div>
                  </div>

                  {/* Stats Badges */}
                  <div className="mt-auto pt-3 border-t border-white/5 grid grid-cols-3 gap-1.5 text-center">
                    <div className="py-1 px-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-xs font-mono font-semibold text-white">{views}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/40">Views</div>
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-xs font-mono font-semibold text-white">{followers}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/40">Followers</div>
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-xs font-mono font-semibold text-white">{likes}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/40">Likes</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Quick Actions */}
                <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-white/40 truncate max-w-[140px]">
                    {project.reels?.length ? `${project.reels.length} Reels` : '1 Reel'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(project, index)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-sans text-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-white" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1 rounded-lg hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PORTFOLIO PROJECT EDITOR MODAL                                            */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Modal Chassis */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#070b14] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div>
                <h3 className="text-lg font-sans font-bold text-white tracking-tight flex items-center gap-2.5">
                  <span>{editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}</span>
                  {formName && (
                    <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      {formName}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/50 font-sans font-light mt-0.5">
                  Update project reel, center 3D logo, editorial text, metrics, and More Info experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* 1. Real-time Live Card & Editorial Preview */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Live Frontend Preview
                  </span>
                  <span className="text-[10px] font-sans text-white/40">
                    Exact representation of public portfolio layout
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-[#030509] border border-white/10">
                  {/* Center Logo Preview */}
                  <div className="w-24 h-24 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-3 shrink-0 shadow-lg">
                    {formLogoUrl ? (
                      <img
                        src={formLogoUrl}
                        alt="Logo Preview"
                        className="max-h-16 max-w-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-[10px] font-mono text-white/30 text-center">No Logo</div>
                    )}
                  </div>

                  {/* Editorial Text Preview */}
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xl sm:text-2xl font-sans font-black text-white uppercase tracking-tight truncate">
                      {formName.trim() || 'PROJECT TITLE'}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-white/70 font-sans font-light line-clamp-2">
                      {formHeadline.trim() || 'High-Velocity Cinematic Commercial Showcase'}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <span className="text-xs font-mono font-semibold text-white">{formViews || '250K+'}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 ml-1">Views</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <span className="text-xs font-mono font-semibold text-white">{formFollowers || '18K+'}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 ml-1">Followers</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <span className="text-xs font-mono font-semibold text-white">{formLikes || '34K+'}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 ml-1">Likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Basic Info (Title, Category, Year, Headline) */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Basic Project Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans text-white/70 mb-1.5">
                      Client / Project Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. SANTHI PIPES"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-white/70 mb-1.5">Category</label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="e.g. Commercial Production"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans text-white/70 mb-1.5">
                    Short Matter / Subtitle Description <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formHeadline}
                    onChange={(e) => setFormHeadline(e.target.value)}
                    placeholder="e.g. High-Velocity Industrial Cinematography"
                    className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                  />
                  <p className="text-[11px] text-white/40 font-sans mt-1">
                    Displayed prominently next to the 3D reel on the public portfolio page.
                  </p>
                </div>
              </div>

              {/* 3. Client Logo (Visual Logo in Middle of Experience) */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Center Client Logo
                  </h4>
                  {formLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormLogoUrl('')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-sans cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs font-sans text-white/70 mb-1.5">Logo URL or Path</label>
                      <input
                        type="text"
                        value={formLogoUrl}
                        onChange={(e) => setFormLogoUrl(e.target.value)}
                        placeholder="e.g. /clients/Shanti Pipes.png"
                        className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoFileSelect(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-sans font-medium transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                      </button>

                      {/* Preset Logos Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) setFormLogoUrl(e.target.value);
                        }}
                        className="bg-[#030509] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none cursor-pointer"
                      >
                        <option value="">Or choose from existing clients...</option>
                        {PRESET_LOGOS.map((preset) => (
                          <option key={preset.url} value={preset.url}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Logo Preview Box */}
                  <div className="h-28 rounded-xl bg-[#030509] border border-white/10 flex flex-col items-center justify-center p-3 text-center">
                    {formLogoUrl ? (
                      <img
                        src={formLogoUrl}
                        alt="Logo"
                        className="max-h-20 max-w-full object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                      />
                    ) : (
                      <span className="text-xs text-white/30 font-sans">No logo selected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Main 3D Reel Video & Poster */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Main 3D Reel & Poster
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Video URL */}
                  <div className="space-y-2">
                    <label className="block text-xs font-sans text-white/70">
                      Reel Video (MP4 / WebM / CDN URL) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="/reels/.../video.mp4"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoFileSelect(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-white" />
                        <span>{isUploadingVideo ? 'Uploading...' : 'Upload Video'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Poster Thumbnail */}
                  <div className="space-y-2">
                    <label className="block text-xs font-sans text-white/70">
                      Poster Image (Instant frame loading) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formPosterUrl}
                      onChange={(e) => setFormPosterUrl(e.target.value)}
                      placeholder="/reels/thumbnails/...jpg"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        ref={posterInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePosterFileSelect(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => posterInputRef.current?.click()}
                        disabled={isUploadingPoster}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                        <span>{isUploadingPoster ? 'Uploading...' : 'Upload Poster'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Preview */}
                {formVideoUrl && (
                  <div className="relative aspect-[16/9] max-h-48 w-full rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                    <video
                      key={formVideoUrl}
                      src={formVideoUrl}
                      poster={formPosterUrl}
                      controls
                      playsInline
                      muted
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* 5. Stats / Metrics */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Key Performance Metrics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-sans text-white/70 mb-1.5">Views Metric</label>
                    <input
                      type="text"
                      value={formViews}
                      onChange={(e) => setFormViews(e.target.value)}
                      placeholder="e.g. 250K+"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-white/70 mb-1.5">Followers Metric</label>
                    <input
                      type="text"
                      value={formFollowers}
                      onChange={(e) => setFormFollowers(e.target.value)}
                      placeholder="e.g. 18K+"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-white/70 mb-1.5">Likes Metric</label>
                    <input
                      type="text"
                      value={formLikes}
                      onChange={(e) => setFormLikes(e.target.value)}
                      placeholder="e.g. 34K+"
                      className="w-full bg-[#030509] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* 6. More Info Experience (Modal Case Study) */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    "More Info" Case Study Experience
                  </h4>
                  <span className="text-[11px] font-sans text-white/50">
                    Controls the existing "MORE INFO" popup on click
                  </span>
                </div>

                {/* HOW WE WORKED WITH THEM */}
                <div>
                  <label className="block text-xs font-sans text-white/70 mb-1.5">
                    "HOW WE WORKED WITH THEM" Case Story Matter
                  </label>
                  <textarea
                    rows={4}
                    value={formStory}
                    onChange={(e) => setFormStory(e.target.value)}
                    placeholder="Describe how BrandShoots engineered commercial filmmaking, camera work, lighting, and results for this client..."
                    className="w-full bg-[#030509] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 leading-relaxed custom-scrollbar"
                  />
                </div>

                {/* Bullet Points / Deliverables */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-sans text-white/70">
                      Deliverables / Bullet Points (Up to 6)
                    </label>
                    {formDeliverables.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddDeliverable}
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-sans cursor-pointer"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    )}
                  </div>

                  {formDeliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                        placeholder={`Bullet point 0${idx + 1}`}
                        className="flex-1 bg-[#030509] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                      />
                      {formDeliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(idx)}
                          className="p-1 rounded text-white/40 hover:text-rose-400 cursor-pointer"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Reels Strip */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-sans text-white/70">
                        Additional Reels ("MORE REELS" Strip in More Info)
                      </label>
                      <p className="text-[11px] text-white/40 font-sans">
                        Reels displayed in the thumbnail strip inside the More Info popup.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddReel}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-sans cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Reel</span>
                    </button>
                  </div>

                  {formReels.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/40 font-sans">
                      Only the main reel will be shown in the More Info viewer. Click "+ Add Reel" to add secondary cuts or thumbnails.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formReels.map((reel, rIdx) => (
                        <div
                          key={reel.id || rIdx}
                          className="p-3 rounded-xl bg-[#030509] border border-white/10 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-cyan-400 font-semibold">
                              Reel Cut #{rIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveReel(rIdx)}
                              className="text-xs text-rose-400 hover:text-rose-300 font-sans cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] text-white/60 mb-1">Reel Title</label>
                              <input
                                type="text"
                                value={reel.title}
                                onChange={(e) => handleUpdateReel(rIdx, 'title', e.target.value)}
                                placeholder="e.g. Automated Extrusion Robotics Cut"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-white/60 mb-1">Category / Tag</label>
                              <input
                                type="text"
                                value={reel.category}
                                onChange={(e) => handleUpdateReel(rIdx, 'category', e.target.value)}
                                placeholder="e.g. Precision Motion"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] text-white/60 mb-1">Video URL</label>
                              <input
                                type="text"
                                value={reel.videoUrl}
                                onChange={(e) => handleUpdateReel(rIdx, 'videoUrl', e.target.value)}
                                placeholder="/reels/...mp4"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-white/60 mb-1">Poster / Thumbnail URL</label>
                              <input
                                type="text"
                                value={reel.posterUrl}
                                onChange={(e) => handleUpdateReel(rIdx, 'posterUrl', e.target.value)}
                                placeholder="/reels/thumbnails/...jpg"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Visibility Toggle */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-sans font-medium text-white block">
                    Public Visibility
                  </span>
                  <span className="text-xs text-white/50 font-sans">
                    When active, this project appears in the 3D scroll corridor.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008CFF]" />
                </label>
              </div>

              {/* Sticky Action Footer */}
              <div className="sticky bottom-0 -mx-6 -mb-6 p-4 sm:p-5 bg-[#070b14]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-end gap-3 z-20">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-sans text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(0,140,255,0.4)] cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Save Project</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCMS;
