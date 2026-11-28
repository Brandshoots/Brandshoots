import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Image as ImageIcon,
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
import { CloudinaryUploader, isDurableMediaUrl } from './CloudinaryUploader';

const PortfolioUploader = CloudinaryUploader;

type ReelField = Exclude<keyof CMSProjectReel, 'id'>;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const createStableId = (prefix: 'project' | 'reel') => {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${suffix}`;
};

const normalizeReelIds = (reels: CMSProjectReel[]) => {
  const usedIds = new Set<string>();
  return reels.map((reel) => {
    let reelId = typeof reel.id === 'string' && reel.id.trim() ? reel.id : createStableId('reel');
    while (usedIds.has(reelId)) reelId = createStableId('reel');
    usedIds.add(reelId);
    return { ...reel, id: reelId };
  });
};

const validateAssetUrl = (value: string, label: string, required = true): string | null => {
  const cleanValue = value.trim();
  if (!cleanValue) return required ? `${label} is required.` : null;
  return isDurableMediaUrl(cleanValue)
    ? null
    : `${label} must use a durable HTTPS URL or site-relative path. data:, blob:, http://, protocol-relative, and credential-bearing URLs are not allowed.`;
};

const PRESET_LOGOS = [
  { label: 'Santhi Pipes', url: '/clients/optimized/Shanti Pipes.webp' },
  { label: 'Viswatuff Glass', url: '/clients/optimized/Viswatuff Glass Logo.webp' },
  { label: 'Bags World', url: '/clients/optimized/Bags World Logo.webp' },
  { label: 'Aabharan Jewellers', url: '/clients/optimized/Aabharan Logo.webp' },
  { label: 'Fresh & Fresh', url: '/clients/optimized/Fresh and Fresh Logo.webp' },
  { label: 'Dayanidhi Creations', url: '/clients/optimized/Dayanidhi Logo.webp' },
  { label: 'Jain Beauty Studio', url: '/clients/optimized/Jain Beauty Logo.webp' },
  { label: 'RK Home Living', url: '/clients/optimized/Rk home.webp' },
  { label: 'SB Ventures', url: '/clients/optimized/SB Ventures Logo.webp' },
  { label: 'KC Overseas', url: '/clients/optimized/KC Overseas Logo.webp' },
  { label: 'SRK Doors World', url: '/clients/optimized/SRK Doors World Logo.webp' },
  { label: 'Jain Enterprises', url: '/clients/optimized/Jain Enterprises Logo.webp' },
  { label: 'Nirmala', url: '/clients/optimized/Nirmala logo.webp' },
  { label: 'Rudra', url: '/clients/optimized/Rudra logo.webp' },
  { label: 'Sahana', url: '/clients/optimized/Sahana Logo.webp' },
  { label: 'T3 Studio', url: '/clients/optimized/T3 Logo.webp' },
];

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mutationKey, setMutationKey] = useState<string | null>(null);
  const mutationLock = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [draftProjectId, setDraftProjectId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

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

  // Upload State
  const [activeUploads, setActiveUploads] = useState<Set<string>>(() => new Set());
  const hasActiveUploads = activeUploads.size > 0;
  const isSaving = mutationKey === 'save';
  const isFormBusy = hasActiveUploads || isSaving;
  const isBusy = mutationKey !== null;

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
      .catch((error) => {
        console.warn('Failed to load portfolio projects:', error);
        if (mounted) {
          setListError(getErrorMessage(error, 'Portfolio projects could not be loaded.'));
          setIsLoading(false);
        }
      });

    const handleSync = (event: Event) => {
      if (mutationLock.current) return;
      const customEvent = event as CustomEvent<CMSProject[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setProjects(customEvent.detail);
      }
    };

    window.addEventListener('brandshoots_projects_updated', handleSync);
    return () => {
      mounted = false;
      window.removeEventListener('brandshoots_projects_updated', handleSync);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setSaveToast(message);
    toastTimerRef.current = setTimeout(() => setSaveToast(null), 3500);
  };

  const beginMutation = (key: string) => {
    if (mutationLock.current) return false;
    mutationLock.current = true;
    setMutationKey(key);
    setListError(null);
    return true;
  };

  const endMutation = () => {
    mutationLock.current = false;
    setMutationKey(null);
  };

  const recordUndo = (description: string, previousState: CMSProject[]) => {
    try {
      pushProjectsUndoAction(description, previousState);
    } catch (error) {
      console.warn('Portfolio change was saved, but undo history could not be recorded:', error);
      setListError('The change was saved, but it could not be added to Undo history.');
    }
  };

  const handleUploadingChange = (key: string, uploading: boolean) => {
    setActiveUploads((current) => {
      const next = new Set(current);
      if (uploading) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  // Open Edit Modal
  const openEditModal = (projectId: string) => {
    if (mutationLock.current) return;
    const projectIndex = projects.findIndex((project) => project.id === projectId);
    const project = projects[projectIndex];
    if (projectIndex < 0 || !project) {
      setListError('That portfolio project no longer exists. Refresh and try again.');
      return;
    }

    setEditingProjectId(project.id);
    setDraftProjectId(project.id);
    setFormError(null);
    setActiveUploads(new Set());
    setFormName(project.name || '');
    setFormHeadline(project.headline || '');
    setFormCategory(project.category || 'Commercial Production');
    setFormYear(project.year || '2026');
    setFormVisible(project.visible !== false);
    setFormVideoUrl(project.videoUrl || '');
    setFormPosterUrl(project.posterUrl || '');
    setFormLogoUrl(project.logoUrl || '');

    const viewsObj = project.metrics?.find((metric) => metric.label.toLowerCase() === 'views');
    const followersObj = project.metrics?.find((metric) => metric.label.toLowerCase() === 'followers');
    const likesObj = project.metrics?.find((metric) => metric.label.toLowerCase() === 'likes');
    setFormViews(viewsObj?.value || '250K+');
    setFormFollowers(followersObj?.value || '18K+');
    setFormLikes(likesObj?.value || '34K+');

    setFormStory(project.story || '');
    setFormDeliverables(
      project.deliverables && project.deliverables.length > 0
        ? [...project.deliverables]
        : ['High-Speed Extrusion Lines & Heavy Machinery', 'Large-Scale Warehouse & Logistics', 'High-Retention Commercial Cut']
    );
    setFormReels(
      project.reels && project.reels.length > 0
        ? normalizeReelIds(project.reels)
        : []
    );
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    if (mutationLock.current) return;
    let newDraftProjectId = createStableId('project');
    while (projects.some((project) => project.id === newDraftProjectId)) {
      newDraftProjectId = createStableId('project');
    }
    setEditingProjectId(null);
    setDraftProjectId(newDraftProjectId);
    setFormError(null);
    setActiveUploads(new Set());
    setFormName('');
    setFormHeadline('');
    setFormCategory('Commercial Production');
    setFormYear('2026');
    setFormVisible(true);
    setFormVideoUrl('');
    setFormPosterUrl('');
    setFormLogoUrl('/clients/optimized/Shanti Pipes.webp');
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
    if (mutationLock.current || hasActiveUploads) return;
    setIsModalOpen(false);
    setEditingProjectId(null);
    setDraftProjectId('');
    setFormError(null);
  };

  // Save Project (Create or Edit)
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (hasActiveUploads) {
      setFormError('Wait for every media upload to finish before saving.');
      return;
    }

    const nameClean = formName.trim();
    const headlineClean = formHeadline.trim();
    if (!nameClean) {
      setFormError('Please enter a project title / client name.');
      return;
    }
    if (!headlineClean) {
      setFormError('Please enter the short project description.');
      return;
    }
    if (!editingProjectId && !draftProjectId) {
      setFormError('This project draft has no stable ID. Close the editor and create it again.');
      return;
    }
    if (!editingProjectId && projects.some((project) => project.id === draftProjectId)) {
      setFormError('This project draft conflicts with an existing project. Close the editor and create it again.');
      return;
    }

    const assetErrors = [
      validateAssetUrl(formLogoUrl, 'Client logo', false),
      validateAssetUrl(formVideoUrl, 'Main reel video'),
      validateAssetUrl(formPosterUrl, 'Main reel poster'),
      ...formReels.flatMap((reel, index) => [
        validateAssetUrl(reel.videoUrl, `Reel ${index + 1} video`),
        validateAssetUrl(reel.posterUrl, `Reel ${index + 1} poster`),
      ]),
    ].filter((message): message is string => Boolean(message));

    if (assetErrors.length > 0) {
      setFormError(assetErrors[0]);
      return;
    }
    if (!beginMutation('save')) return;

    const previousState = [...projects];
    const cleanDeliverables = formDeliverables
      .map((deliverable) => deliverable.trim())
      .filter((deliverable) => deliverable.length > 0);
    const cleanReels = formReels.map((reel) => ({
      ...reel,
      title: reel.title.trim(),
      category: reel.category.trim(),
      duration: reel.duration.trim(),
      videoUrl: reel.videoUrl.trim(),
      posterUrl: reel.posterUrl.trim(),
    }));
    const metrics = [
      { label: 'Views', value: formViews.trim() || '250K+' },
      { label: 'Followers', value: formFollowers.trim() || '18K+' },
      { label: 'Likes', value: formLikes.trim() || '34K+' },
    ];

    try {
      let updatedList: CMSProject[];
      let undoDescription: string;
      let successMessage: string;

      if (editingProjectId) {
        const fullListIndex = projects.findIndex((project) => project.id === editingProjectId);
        const currentProject = projects[fullListIndex];
        if (fullListIndex < 0 || !currentProject) {
          throw new Error('This project no longer exists. Close the editor and try again.');
        }

        const updatedProject: CMSProject = {
          ...currentProject,
          name: nameClean,
          headline: headlineClean,
          category: formCategory.trim() || 'Commercial Production',
          year: formYear.trim() || '2026',
          videoUrl: formVideoUrl.trim(),
          posterUrl: formPosterUrl.trim(),
          logoUrl: formLogoUrl.trim() || undefined,
          story: formStory.trim(),
          deliverables: cleanDeliverables,
          metrics,
          reels: cleanReels,
          visible: formVisible,
          updatedAt: Date.now(),
        };

        updatedList = projects.map((project) =>
          project.id === editingProjectId ? updatedProject : project
        );
        undoDescription = `Updated portfolio project: ${nameClean}`;
        successMessage = `Project "${nameClean}" updated.`;
      } else {
        const cleanSlug = nameClean.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        const newProject: CMSProject = {
          id: draftProjectId,
          slug: cleanSlug,
          name: nameClean,
          headline: headlineClean,
          category: formCategory.trim() || 'Commercial Production',
          year: formYear.trim() || '2026',
          videoUrl: formVideoUrl.trim(),
          posterUrl: formPosterUrl.trim(),
          logoUrl: formLogoUrl.trim() || undefined,
          story: formStory.trim(),
          deliverables: cleanDeliverables,
          metrics,
          reels: cleanReels,
          order: projects.length,
          visible: formVisible,
          updatedAt: Date.now(),
        };

        updatedList = [...projects, newProject];
        undoDescription = `Added portfolio project: ${nameClean}`;
        successMessage = `Project "${nameClean}" added.`;
      }

      const normalizedList = updatedList.map((project, index) => ({ ...project, order: index }));
      await saveAllProjects(normalizedList);
      setProjects(normalizedList);
      recordUndo(undoDescription, previousState);
      setIsModalOpen(false);
      setEditingProjectId(null);
      setDraftProjectId('');
      setFormError(null);
      showToast(successMessage);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Firebase could not save this portfolio project. No success was recorded.'));
    } finally {
      endMutation();
    }
  };

  // Quick Visibility Toggle
  const toggleVisibility = async (projectId: string) => {
    if (!beginMutation(`visibility:${projectId}`)) return;
    const fullListIndex = projects.findIndex((project) => project.id === projectId);
    const project = projects[fullListIndex];
    if (fullListIndex < 0 || !project) {
      setListError('That portfolio project no longer exists. Refresh and try again.');
      endMutation();
      return;
    }

    const previousState = [...projects];
    const newVisible = !(project.visible !== false);
    const updated = projects.map((item) =>
      item.id === projectId ? { ...item, visible: newVisible, updatedAt: Date.now() } : item
    );

    try {
      await saveAllProjects(updated);
      setProjects(updated);
      recordUndo(`${newVisible ? 'Shown' : 'Hidden'} portfolio project: ${project.name}`, previousState);
      showToast(`"${project.name}" is now ${newVisible ? 'Visible' : 'Hidden'} on Portfolio.`);
    } catch (error) {
      setListError(getErrorMessage(error, `Firebase could not update visibility for "${project.name}".`));
    } finally {
      endMutation();
    }
  };

  const moveProject = async (projectId: string, direction: -1 | 1) => {
    if (searchQuery.trim() || !beginMutation(`move:${projectId}`)) return;
    const fullListIndex = projects.findIndex((project) => project.id === projectId);
    const targetIndex = fullListIndex + direction;
    const project = projects[fullListIndex];
    if (!project || fullListIndex < 0 || targetIndex < 0 || targetIndex >= projects.length) {
      endMutation();
      return;
    }

    const previousState = [...projects];
    const updated = [...projects];
    [updated[fullListIndex], updated[targetIndex]] = [updated[targetIndex], updated[fullListIndex]];
    const normalized = updated.map((item, index) => ({ ...item, order: index }));

    try {
      await saveAllProjects(normalized);
      setProjects(normalized);
      recordUndo(`Moved "${project.name}" ${direction < 0 ? 'up' : 'down'}`, previousState);
      showToast(`Reordered "${project.name}" to position #${targetIndex + 1}.`);
    } catch (error) {
      setListError(getErrorMessage(error, `Firebase could not reorder "${project.name}".`));
    } finally {
      endMutation();
    }
  };

  // Delete Project
  const handleDelete = async (projectId: string) => {
    const fullListIndex = projects.findIndex((project) => project.id === projectId);
    const project = projects[fullListIndex];
    if (fullListIndex < 0 || !project || mutationLock.current) return;
    if (!window.confirm(`Are you sure you want to delete "${project.name}" from the portfolio?`)) return;
    if (!beginMutation(`delete:${projectId}`)) return;

    const previousState = [...projects];
    const updated = projects
      .filter((item) => item.id !== projectId)
      .map((item, index) => ({ ...item, order: index }));

    try {
      await saveAllProjects(updated);
      setProjects(updated);
      recordUndo(`Deleted portfolio project: ${project.name}`, previousState);
      showToast(`Project "${project.name}" deleted.`);
    } catch (error) {
      setListError(getErrorMessage(error, `Firebase could not delete "${project.name}".`));
    } finally {
      endMutation();
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (mutationLock.current) return;
    if (
      !window.confirm(
        'Reset all portfolio projects to original default production showcase? Any custom projects will be replaced.'
      )
    ) {
      return;
    }
    if (!beginMutation('reset')) return;

    const previousState = [...projects];
    try {
      const defaults = await resetProjectsToDefaults();
      setProjects(defaults);
      recordUndo('Reset all portfolio projects to default showcase', previousState);
      showToast('Portfolio projects restored to defaults.');
    } catch (error) {
      setListError(getErrorMessage(error, 'Firebase could not restore the default portfolio projects.'));
    } finally {
      endMutation();
    }
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
    if (isFormBusy) return;
    let newReelId = createStableId('reel');
    while (formReels.some((reel) => reel.id === newReelId)) {
      newReelId = createStableId('reel');
    }
    const newReel: CMSProjectReel = {
      id: newReelId,
      title: `Reel 0${formReels.length + 2}`,
      category: 'Commercial Cut',
      duration: '0:30',
      videoUrl: formVideoUrl || '',
      posterUrl: formPosterUrl || '',
    };
    setFormReels((current) => [...current, newReel]);
    setFormError(null);
  };

  const handleUpdateReel = (reelId: string, field: ReelField, value: string) => {
    setFormReels((current) =>
      current.map((reel) => (reel.id === reelId ? { ...reel, [field]: value } : reel))
    );
    setFormError(null);
  };

  const handleRemoveReel = (reelId: string) => {
    if (isFormBusy) return;
    setFormReels((current) => current.filter((reel) => reel.id !== reelId));
    setFormError(null);
  };

  // Filtered projects
  const hasActiveFilter = Boolean(searchQuery.trim());
  const filteredProjects = projects.filter((project) => {
    if (!hasActiveFilter) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.name?.toLowerCase().includes(query) ||
      project.headline?.toLowerCase().includes(query) ||
      project.category?.toLowerCase().includes(query)
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
            disabled={isBusy}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono transition-colors border border-white/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            title="Reset to default showcase"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={isBusy}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white text-xs font-sans font-bold tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(0,140,255,0.35)] cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {listError && (
        <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {listError}
        </div>
      )}

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
          {filteredProjects.map((project) => {
            const fullListIndex = projects.findIndex((candidate) => candidate.id === project.id);
            const views = project.metrics?.find((m) => m.label.toLowerCase() === 'views')?.value || '250K+';
            const followers = project.metrics?.find((m) => m.label.toLowerCase() === 'followers')?.value || '18K+';
            const likes = project.metrics?.find((m) => m.label.toLowerCase() === 'likes')?.value || '34K+';
            const isVisible = project.visible !== false;

            return (
              <div
                key={project.id}
                className={`group relative rounded-2xl bg-[#070b14] border transition-all duration-200 flex flex-col overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_4px_24px_rgba(0,140,255,0.08)] ${
                  isVisible ? 'border-white/10' : 'border-white/5 opacity-60'
                }`}
              >
                {/* Card Header: Badge & Controls */}
                <div className="flex items-center justify-between p-3.5 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      #{String(fullListIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-sans font-medium text-white/50 uppercase tracking-wider">
                      {project.category || 'Commercial'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={hasActiveFilter || isBusy || fullListIndex <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        void moveProject(project.id, -1);
                      }}
                      title={hasActiveFilter ? 'Clear the search filter to reorder projects' : 'Move Up'}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={hasActiveFilter || isBusy || fullListIndex >= projects.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        void moveProject(project.id, 1);
                      }}
                      title={hasActiveFilter ? 'Clear the search filter to reorder projects' : 'Move Down'}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleVisibility(project.id);
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
                  onClick={() => openEditModal(project.id)}
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
                      disabled={isBusy}
                      onClick={() => openEditModal(project.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-sans text-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-white" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleDelete(project.id)}
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
                  <span>{editingProjectId !== null ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}</span>
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
                disabled={isFormBusy}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
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
                      onClick={() => {
                        setFormLogoUrl('');
                        setFormError(null);
                      }}
                      disabled={isFormBusy}
                      className="text-xs text-rose-400 hover:text-rose-300 font-sans cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-3">
                    <PortfolioUploader
                      label="Client Logo"
                      value={formLogoUrl}
                      accept="image"
                      helpText="Optional. Upload a signed image or enter a durable HTTPS URL/site path."
                      onChange={(url) => {
                        setFormLogoUrl(url);
                        setFormError(null);
                      }}
                      onUploadingChange={(uploading) =>
                        handleUploadingChange('project:logo', uploading)
                      }
                    />

                    {/* Preset Logos Dropdown */}
                    <select
                      value=""
                      disabled={isFormBusy}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormLogoUrl(e.target.value);
                          setFormError(null);
                        }
                      }}
                      className="bg-[#030509] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <option value="">Or choose from existing clients...</option>
                      {PRESET_LOGOS.map((preset) => (
                        <option key={preset.url} value={preset.url}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
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
                  <PortfolioUploader
                    label="Main Reel Video"
                    value={formVideoUrl}
                    accept="video"
                    helpText="Required. Device files use signed Cloudinary uploads."
                    onChange={(url) => {
                      setFormVideoUrl(url);
                      setFormError(null);
                    }}
                    onUploadingChange={(uploading) =>
                      handleUploadingChange('project:video', uploading)
                    }
                  />

                  <PortfolioUploader
                    label="Main Reel Poster"
                    value={formPosterUrl}
                    accept="image"
                    helpText="Required. Use a durable poster image for instant loading."
                    onChange={(url) => {
                      setFormPosterUrl(url);
                      setFormError(null);
                    }}
                    onUploadingChange={(uploading) =>
                      handleUploadingChange('project:poster', uploading)
                    }
                  />
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
                      disabled={isFormBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-sans cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
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
                          key={reel.id}
                          className="p-3 rounded-xl bg-[#030509] border border-white/10 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-cyan-400 font-semibold">
                              Reel Cut #{rIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveReel(reel.id)}
                              disabled={isFormBusy}
                              className="text-xs text-rose-400 hover:text-rose-300 font-sans cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
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
                                onChange={(e) => handleUpdateReel(reel.id, 'title', e.target.value)}
                                placeholder="e.g. Automated Extrusion Robotics Cut"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-white/60 mb-1">Category / Tag</label>
                              <input
                                type="text"
                                value={reel.category}
                                onChange={(e) => handleUpdateReel(reel.id, 'category', e.target.value)}
                                placeholder="e.g. Precision Motion"
                                className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <PortfolioUploader
                              label={`Reel Cut #${rIdx + 1} Video`}
                              value={reel.videoUrl}
                              accept="video"
                              helpText="Required. Device files use signed Cloudinary uploads."
                              onChange={(url) => handleUpdateReel(reel.id, 'videoUrl', url)}
                              onUploadingChange={(uploading) =>
                                handleUploadingChange(`reel:${reel.id}:video`, uploading)
                              }
                            />
                            <PortfolioUploader
                              label={`Reel Cut #${rIdx + 1} Poster`}
                              value={reel.posterUrl}
                              accept="image"
                              helpText="Required. Upload or enter a durable poster URL."
                              onChange={(url) => handleUpdateReel(reel.id, 'posterUrl', url)}
                              onUploadingChange={(uploading) =>
                                handleUploadingChange(`reel:${reel.id}:poster`, uploading)
                              }
                            />
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

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                >
                  {formError}
                </div>
              )}

              {/* Sticky Action Footer */}
              <div className="sticky bottom-0 -mx-6 -mb-6 p-4 sm:p-5 bg-[#070b14]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-end gap-3 z-20">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isFormBusy}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-sans text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isFormBusy}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(0,140,255,0.4)] cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>
                    {hasActiveUploads ? 'Uploading Media...' : isSaving ? 'Saving...' : 'Save Project'}
                  </span>
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
