import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  FileVideo2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import type { CMSClientLogo, CMSResult } from '../../types/cms';
import {
  archiveResult,
  deleteResultPermanently,
  fetchPublishedClients,
  reorderResults,
  saveResult,
  subscribeAdminResults,
} from '../../lib/cms/cmsService';
import { pushResultsUndoAction } from '../../lib/cms/cmsHistory';
import { INITIAL_RESULTS } from '../../lib/cms/seedData';
import { validateResultVideoUrl } from '../../lib/results/video';
import { CloudinaryUploader } from './CloudinaryUploader';

type ResultStatus = CMSResult['status'];
type StatusFilter = 'all' | ResultStatus;
type FeaturedFilter = 'all' | 'featured' | 'standard';
type OrderField = 'order' | 'homepageOrder';
type Toast = { message: string; tone: 'success' | 'warning' };

interface ResultFormState {
  clientId: string;
  clientName: string;
  clientLogoUrl: string;
  beforeFollowers: string;
  afterFollowers: string;
  beforeViews: string;
  afterViews: string;
  durationMonths: string;
  beforeScreenshotUrl: string;
  afterScreenshotUrl: string;
  testimonial: string;
  videoUrl: string;
  videoPosterUrl: string;
  featured: boolean;
}

const EMPTY_FORM: ResultFormState = {
  clientId: '',
  clientName: '',
  clientLogoUrl: '',
  beforeFollowers: '',
  afterFollowers: '',
  beforeViews: '',
  afterViews: '',
  durationMonths: '',
  beforeScreenshotUrl: '',
  afterScreenshotUrl: '',
  testimonial: '',
  videoUrl: '',
  videoPosterUrl: '',
  featured: false,
};

const inputClass =
  'min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/20 disabled:cursor-not-allowed disabled:opacity-50';
const labelClass = 'mb-2 block text-xs font-mono font-semibold uppercase tracking-[0.12em] text-white/65';

const statusStyles: Record<ResultStatus, string> = {
  draft: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  published: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  archived: 'border-white/15 bg-white/5 text-white/45',
};

const cloneResults = (results: CMSResult[]): CMSResult[] =>
  results.map((result) => ({ ...result }));

const validOrder = (value: number): number =>
  Number.isSafeInteger(value) && value >= 0 ? value : Number.MAX_SAFE_INTEGER;

const sortByOrder = (results: CMSResult[]): CMSResult[] =>
  [...results].sort((a, b) => {
    const difference = validOrder(a.order) - validOrder(b.order);
    if (difference !== 0) return difference;
    return a.createdAt - b.createdAt || a.id.localeCompare(b.id);
  });

const parseOptionalInteger = (
  rawValue: string,
  label: string
): { value: number | null; error?: string } => {
  const value = rawValue.trim();
  if (!value) return { value: null };
  if (!/^\d+$/.test(value)) {
    return { value: null, error: `${label} must be a whole number of 0 or more.` };
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    return { value: null, error: `${label} must be a safe whole number of 0 or more.` };
  }
  return { value: parsed };
};

const errorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

const formatMetric = (value: number | null): string => {
  if (value === null) return 'Not set';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
};

const createResultId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `result_${crypto.randomUUID()}`;
  }
  return `result_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

interface NumberFieldProps {
  id: keyof Pick<
    ResultFormState,
    'beforeFollowers' | 'afterFollowers' | 'beforeViews' | 'afterViews' | 'durationMonths'
  >;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
}

const NumberField = ({
  id,
  label,
  value,
  error,
  onChange,
  disabled,
  placeholder,
}: NumberFieldProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input
      id={id}
      type="number"
      min="0"
      max={Number.MAX_SAFE_INTEGER}
      step="1"
      inputMode="numeric"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClass} ${error ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20' : ''}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300" role="alert">
        {error}
      </p>
    )}
  </div>
);

export const ResultsCMS = () => {
  const [results, setResults] = useState<CMSResult[]>([]);
  const [clients, setClients] = useState<CMSClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<CMSResult | null>(null);
  const [form, setForm] = useState<ResultFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ResultFormState | 'form', string>>>({});
  const [mutationKey, setMutationKey] = useState<string | null>(null);
  const mutationLock = useRef(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: () => void = () => undefined;

    try {
      unsubscribe = subscribeAdminResults(
        (nextResults: CMSResult[]) => {
          if (!mounted) return;
          setResults(sortByOrder(nextResults));
          setPageError(null);
          setIsLoading(false);
        },
        (error: unknown) => {
          if (!mounted) return;
          setPageError(errorMessage(error, 'Could not load results from Firebase.'));
          setIsLoading(false);
        }
      );
    } catch (error) {
      setPageError(errorMessage(error, 'Could not subscribe to results.'));
      setIsLoading(false);
    }

    fetchPublishedClients()
      .then((nextClients) => {
        if (!mounted) return;
        setClients([...nextClients].sort((a, b) => a.name.localeCompare(b.name)));
        setClientsError(null);
      })
      .catch((error) => {
        if (!mounted) return;
        setClientsError(errorMessage(error, 'Existing clients could not be loaded. You can still enter a client manually.'));
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !mutationLock.current) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.clientName.toLowerCase().includes(query) ||
        result.testimonial.toLowerCase().includes(query) ||
        (result.videoUrl || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' ? result.featured : !result.featured);
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [featuredFilter, results, searchQuery, statusFilter]);

  const resultPositions = useMemo(
    () => new Map(sortByOrder(results).map((result, index) => [result.id, index])),
    [results]
  );

  const homepageResults = useMemo(
    () =>
      results
        .filter((result) => result.featured)
        .sort((a, b) => {
          const difference = validOrder(a.homepageOrder) - validOrder(b.homepageOrder);
          if (difference !== 0) return difference;
          return validOrder(a.order) - validOrder(b.order) || a.id.localeCompare(b.id);
        }),
    [results]
  );

  const homepagePositions = useMemo(
    () => new Map(homepageResults.map((result, index) => [result.id, index])),
    [homepageResults]
  );

  const isBusy = mutationKey !== null;

  const beginMutation = (key: string): boolean => {
    if (mutationLock.current) return false;
    mutationLock.current = true;
    setMutationKey(key);
    setPageError(null);
    return true;
  };

  const endMutation = () => {
    mutationLock.current = false;
    setMutationKey(null);
  };

  const recordUndo = (description: string, previousState: CMSResult[]) => {
    try {
      pushResultsUndoAction(description, previousState);
    } catch (error) {
      console.warn('Result was saved, but undo history could not be recorded:', error);
      setToast({ message: 'Saved, but this change could not be added to Undo history.', tone: 'warning' });
    }
  };

  const updateForm = <K extends keyof ResultFormState>(key: K, value: ResultFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  };

  const openCreateModal = () => {
    setEditingResult(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPageError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (result: CMSResult) => {
    setEditingResult(result);
    setForm({
      clientId: result.clientId || '',
      clientName: result.clientName || '',
      clientLogoUrl: result.clientLogoUrl || '',
      beforeFollowers: result.beforeFollowers === null ? '' : String(result.beforeFollowers),
      afterFollowers: result.afterFollowers === null ? '' : String(result.afterFollowers),
      beforeViews: result.beforeViews === null ? '' : String(result.beforeViews),
      afterViews: result.afterViews === null ? '' : String(result.afterViews),
      durationMonths: result.durationMonths === null ? '' : String(result.durationMonths),
      beforeScreenshotUrl: result.beforeScreenshotUrl || '',
      afterScreenshotUrl: result.afterScreenshotUrl || '',
      testimonial: result.testimonial || '',
      videoUrl: result.videoUrl || '',
      videoPosterUrl: result.videoPosterUrl || '',
      featured: result.featured,
    });
    setFormErrors({});
    setPageError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (mutationLock.current) return;
    setIsModalOpen(false);
    setEditingResult(null);
    setFormErrors({});
  };

  const handleClientSelection = (clientId: string) => {
    if (!clientId) {
      updateForm('clientId', '');
      return;
    }

    const client = clients.find((candidate) => candidate.id === clientId);
    if (!client) return;
    setForm((current) => ({
      ...current,
      clientId: client.id,
      clientName: client.name,
      clientLogoUrl: client.logoUrl,
    }));
    setFormErrors((current) => ({
      ...current,
      clientId: undefined,
      clientName: undefined,
      clientLogoUrl: undefined,
      form: undefined,
    }));
  };

  const validateForm = (targetStatus: 'draft' | 'published') => {
    const nextErrors: Partial<Record<keyof ResultFormState | 'form', string>> = {};
    const beforeFollowers = parseOptionalInteger(form.beforeFollowers, 'Before followers');
    const afterFollowers = parseOptionalInteger(form.afterFollowers, 'After followers');
    const beforeViews = parseOptionalInteger(form.beforeViews, 'Before views');
    const afterViews = parseOptionalInteger(form.afterViews, 'After views');
    const durationMonths = parseOptionalInteger(form.durationMonths, 'Duration');

    if (!form.clientName.trim()) nextErrors.clientName = 'Client name is required.';
    if (beforeFollowers.error) nextErrors.beforeFollowers = beforeFollowers.error;
    if (afterFollowers.error) nextErrors.afterFollowers = afterFollowers.error;
    if (beforeViews.error) nextErrors.beforeViews = beforeViews.error;
    if (afterViews.error) nextErrors.afterViews = afterViews.error;
    if (durationMonths.error) nextErrors.durationMonths = durationMonths.error;

    const cleanVideoUrl = form.videoUrl.trim();
    if (cleanVideoUrl) {
      const validation = validateResultVideoUrl(cleanVideoUrl);
      if (!validation.valid) {
        nextErrors.videoUrl =
          validation.message || 'Enter a supported YouTube or Instagram Reel URL.';
      }
    }

    if (targetStatus === 'published') {
      if (!form.clientLogoUrl.trim()) nextErrors.clientLogoUrl = 'A client logo is required before publishing.';
      if (beforeFollowers.value === null) nextErrors.beforeFollowers = 'Before followers are required before publishing.';
      if (afterFollowers.value === null) nextErrors.afterFollowers = 'After followers are required before publishing.';
      if (beforeViews.value === null) nextErrors.beforeViews = 'Before views are required before publishing.';
      if (afterViews.value === null) nextErrors.afterViews = 'After views are required before publishing.';
      if (durationMonths.value === null || durationMonths.value <= 0) {
        nextErrors.durationMonths = 'A published result needs a duration greater than 0 months.';
      }
      if (!form.beforeScreenshotUrl.trim()) {
        nextErrors.beforeScreenshotUrl = 'A verified before screenshot is required before publishing.';
      }
      if (!form.afterScreenshotUrl.trim()) {
        nextErrors.afterScreenshotUrl = 'A verified after screenshot is required before publishing.';
      }
      if (!form.testimonial.trim()) {
        nextErrors.testimonial = 'An approved one-line client testimonial is required before publishing.';
      }
      if (cleanVideoUrl && !form.videoPosterUrl.trim()) {
        nextErrors.videoPosterUrl = 'Upload a poster for the linked video before publishing.';
      }
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    return {
      beforeFollowers: beforeFollowers.value,
      afterFollowers: afterFollowers.value,
      beforeViews: beforeViews.value,
      afterViews: afterViews.value,
      durationMonths: durationMonths.value,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const targetStatus: 'draft' | 'published' =
      submitter?.value === 'published' ? 'published' : 'draft';
    const metrics = validateForm(targetStatus);
    if (!metrics || !beginMutation('save')) return;

    const previousState = cloneResults(results);
    const now = Date.now();
    const existing = editingResult;
    const maxOrder = results.reduce((maximum, result) => Math.max(maximum, validOrder(result.order)), -1);
    const finiteMaxOrder = maxOrder === Number.MAX_SAFE_INTEGER ? results.length - 1 : maxOrder;
    const maxHomepageOrder = results.reduce(
      (maximum, result) => Math.max(maximum, validOrder(result.homepageOrder)),
      -1
    );
    const finiteMaxHomepageOrder =
      maxHomepageOrder === Number.MAX_SAFE_INTEGER ? results.length - 1 : maxHomepageOrder;

    const nextResult: CMSResult = {
      id: existing?.id || createResultId(),
      clientId: form.clientId || undefined,
      clientName: form.clientName.trim(),
      clientLogoUrl: form.clientLogoUrl.trim(),
      beforeFollowers: metrics.beforeFollowers,
      afterFollowers: metrics.afterFollowers,
      beforeViews: metrics.beforeViews,
      afterViews: metrics.afterViews,
      durationMonths: metrics.durationMonths,
      beforeScreenshotUrl: form.beforeScreenshotUrl.trim(),
      afterScreenshotUrl: form.afterScreenshotUrl.trim(),
      testimonial: form.testimonial.replace(/\s+/g, ' ').trim(),
      videoUrl: form.videoUrl.trim() || undefined,
      videoPosterUrl: form.videoPosterUrl.trim() || undefined,
      featured: form.featured,
      order: existing?.order ?? finiteMaxOrder + 1,
      homepageOrder: existing?.homepageOrder ?? finiteMaxHomepageOrder + 1,
      status: targetStatus,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      publishedAt:
        targetStatus === 'published' ? existing?.publishedAt || now : existing?.publishedAt,
      archivedAt: undefined,
    };

    try {
      const saved = await saveResult(nextResult);
      setResults((current) => {
        const exists = current.some((result) => result.id === saved.id);
        return sortByOrder(
          exists
            ? current.map((result) => (result.id === saved.id ? saved : result))
            : [...current, saved]
        );
      });
      recordUndo(
        `${existing ? 'Updated' : 'Added'} ${targetStatus} result: ${saved.clientName}`,
        previousState
      );
      setToast({
        message: `${saved.clientName} was ${targetStatus === 'published' ? 'published' : 'saved as a draft'}.`,
        tone: 'success',
      });
      setIsModalOpen(false);
      setEditingResult(null);
      setFormErrors({});
    } catch (error) {
      setFormErrors({
        form: errorMessage(error, 'Firebase could not save this result. No success was recorded.'),
      });
    } finally {
      endMutation();
    }
  };

  const handleFeaturedToggle = async (result: CMSResult) => {
    if (!beginMutation(`featured:${result.id}`)) return;
    const previousState = cloneResults(results);
    const nextResult: CMSResult = {
      ...result,
      featured: !result.featured,
      updatedAt: Date.now(),
    };

    try {
      const saved = await saveResult(nextResult);
      setResults((current) =>
        sortByOrder(current.map((item) => (item.id === saved.id ? saved : item)))
      );
      recordUndo(
        `${saved.featured ? 'Featured' : 'Unfeatured'} result: ${saved.clientName}`,
        previousState
      );
      setToast({
        message: `${saved.clientName} is ${saved.featured ? 'featured' : 'no longer featured'}.`,
        tone: 'success',
      });
    } catch (error) {
      setPageError(errorMessage(error, 'Firebase could not update the featured setting.'));
    } finally {
      endMutation();
    }
  };

  const seedSampleResult = async () => {
    if (!beginMutation('seed:sample')) return;
    if (INITIAL_RESULTS.length === 0) {
      endMutation();
      return;
    }

    const now = Date.now();
    try {
      const savedList: CMSResult[] = [];
      for (const sample of INITIAL_RESULTS) {
        const saved = await saveResult({
          ...sample,
          createdAt: sample.createdAt || now,
          updatedAt: now,
          publishedAt: sample.status === 'published' ? (sample.publishedAt || now) : undefined,
        });
        savedList.push(saved);
      }
      setResults(sortByOrder(savedList));
      setToast({
        message: `${savedList.length} client sample results saved to CMS.`,
        tone: 'success',
      });
    } catch (error) {
      setPageError(errorMessage(error, 'Firebase could not save sample results.'));
    } finally {
      endMutation();
    }
  };

  const moveResult = async (id: string, direction: -1 | 1, field: OrderField) => {
    if (!beginMutation(`move:${field}:${id}`)) return;
    const previousState = cloneResults(results);
    const ordered =
      field === 'order'
        ? sortByOrder(results)
        : [...results]
            .filter((result) => result.featured)
            .sort((a, b) => {
              const difference = validOrder(a.homepageOrder) - validOrder(b.homepageOrder);
              if (difference !== 0) return difference;
              return validOrder(a.order) - validOrder(b.order) || a.id.localeCompare(b.id);
            });
    const currentIndex = ordered.findIndex((result) => result.id === id);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= ordered.length) {
      endMutation();
      return;
    }

    const reorderedIds = ordered.map((result) => result.id);
    [reorderedIds[currentIndex], reorderedIds[targetIndex]] = [
      reorderedIds[targetIndex],
      reorderedIds[currentIndex],
    ];
    const positions = new Map(reorderedIds.map((resultId, index) => [resultId, index]));
    const nextResults = sortByOrder(
      results.map((result) => {
        const position = positions.get(result.id);
        return position === undefined ? result : { ...result, [field]: position, updatedAt: Date.now() };
      })
    );
    const movedResult = results.find((result) => result.id === id);

    try {
      const saved = await reorderResults(nextResults);
      setResults(sortByOrder(saved));
      recordUndo(
        `Moved ${movedResult?.clientName || 'result'} ${direction < 0 ? 'up' : 'down'} in ${
          field === 'order' ? 'results' : 'homepage'
        } order`,
        previousState
      );
      setToast({
        message: `${movedResult?.clientName || 'Result'} moved ${direction < 0 ? 'up' : 'down'} in ${
          field === 'order' ? 'results' : 'homepage'
        } order.`,
        tone: 'success',
      });
    } catch (error) {
      setPageError(errorMessage(error, 'Firebase could not save the new result order.'));
    } finally {
      endMutation();
    }
  };

  const handleArchive = async (result: CMSResult) => {
    const confirmed = window.confirm(
      `Archive “${result.clientName}”? It will leave published result views but remain available in this manager.`
    );
    if (!confirmed || !beginMutation(`archive:${result.id}`)) return;
    const previousState = cloneResults(results);
    const now = Date.now();

    try {
      await archiveResult(result.id);
      setResults((current) =>
        sortByOrder(
          current.map((item) =>
            item.id === result.id
              ? { ...item, status: 'archived', featured: false, archivedAt: now, updatedAt: now }
              : item
          )
        )
      );
      recordUndo(`Archived result: ${result.clientName}`, previousState);
      setToast({ message: `${result.clientName} was archived.`, tone: 'success' });
      if (editingResult?.id === result.id) {
        setIsModalOpen(false);
        setEditingResult(null);
      }
    } catch (error) {
      const message = errorMessage(error, 'Firebase could not archive this result.');
      if (editingResult?.id === result.id) {
        setFormErrors({ form: message });
      } else {
        setPageError(message);
      }
    } finally {
      endMutation();
    }
  };

  const handlePermanentDelete = async (result: CMSResult) => {
    const confirmed = window.confirm(
      `Permanently delete “${result.clientName}”? This removes the record from Firebase and cannot be recovered by restoring the archive.`
    );
    if (!confirmed || !beginMutation(`delete:${result.id}`)) return;

    try {
      await deleteResultPermanently(result.id);
      setResults((current) => current.filter((item) => item.id !== result.id));
      setToast({ message: `${result.clientName} was permanently deleted.`, tone: 'success' });
      if (editingResult?.id === result.id) {
        setIsModalOpen(false);
        setEditingResult(null);
      }
    } catch (error) {
      setPageError(errorMessage(error, 'Firebase could not permanently delete this result.'));
    } finally {
      endMutation();
    }
  };

  const linkedClientMissing =
    Boolean(form.clientId) && !clients.some((client) => client.id === form.clientId);
  const videoValidation = form.videoUrl.trim()
    ? validateResultVideoUrl(form.videoUrl.trim())
    : null;
  const publishedCount = results.filter((result) => result.status === 'published').length;
  const draftCount = results.filter((result) => result.status === 'draft').length;
  const featuredCount = results.filter((result) => result.status === 'published' && result.featured).length;

  return (
    <section className="min-h-full bg-[#04060A] text-white" aria-labelledby="results-cms-title">
      <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-white/10 bg-[#070B12]/95 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-[#008CFF]">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Results CMS</span>
              </div>
              <h1 id="results-cms-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                Client results
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                Manage verified before-and-after proof, testimonials, publishing state, and display order.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              disabled={isBusy}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#008CFF] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,140,255,0.25)] transition hover:bg-[#1598ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add result
            </button>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 bg-black/20">
            {[
              { label: 'Published', value: publishedCount, color: 'text-emerald-300' },
              { label: 'Drafts', value: draftCount, color: 'text-amber-300' },
              { label: 'Featured', value: featuredCount, color: 'text-[#49AFFF]' },
            ].map((stat) => (
              <div key={stat.label} className="border-r border-white/10 px-3 py-4 text-center last:border-r-0 sm:px-5">
                <div className={`text-xl font-bold sm:text-2xl ${stat.color}`}>{stat.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        {pageError && (
          <div
            className="flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">The requested change was not confirmed.</p>
              <p className="mt-1 break-words text-red-200/80">{pageError}</p>
            </div>
            <button
              type="button"
              onClick={() => setPageError(null)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-100/70 hover:bg-red-400/10 hover:text-white"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#070B12]/95 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
            <div>
              <label htmlFor="results-search" className="sr-only">
                Search results
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden="true" />
                <input
                  id="results-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search client, testimonial, or video URL"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="results-status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="results-status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className={inputClass}
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="results-featured-filter" className="sr-only">
                Filter by featured state
              </label>
              <select
                id="results-featured-filter"
                value={featuredFilter}
                onChange={(event) => setFeaturedFilter(event.target.value as FeaturedFilter)}
                className={inputClass}
              >
                <option value="all">All placements</option>
                <option value="featured">Featured only</option>
                <option value="standard">Not featured</option>
              </select>
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/35" aria-live="polite">
            Showing {filteredResults.length} of {results.length} results. Reorder controls always use the full saved list.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-[#070B12]/80">
            <div className="flex items-center gap-3 text-sm text-white/55">
              <Loader2 className="h-5 w-5 animate-spin text-[#008CFF]" aria-hidden="true" />
              Loading results…
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#070B12]/70 px-5 py-16 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-white/20" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold">No matching results</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
              {results.length === 0
                ? 'Add the first result when verified client data is ready, or load the pre-configured sample result.'
                : 'Change the search or filters to see other result records.'}
            </p>
            {results.length === 0 && (
              <button
                type="button"
                onClick={seedSampleResult}
                disabled={isBusy}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#008CFF]/35 bg-[#008CFF]/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#7CC4FF] transition hover:bg-[#008CFF]/25 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Load Sample Results
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredResults.map((result) => {
              const listPosition = resultPositions.get(result.id) ?? -1;
              const homepagePosition = homepagePositions.get(result.id) ?? -1;
              const mutationActive = mutationKey?.endsWith(result.id) || false;

              return (
                <article
                  key={result.id}
                  className={`overflow-hidden rounded-2xl border bg-[#070B12] shadow-[0_14px_45px_rgba(0,0,0,0.25)] transition ${
                    result.status === 'archived'
                      ? 'border-white/5 opacity-65'
                      : 'border-white/10 hover:border-[#008CFF]/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-[#008CFF]/25 bg-[#008CFF]/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#49AFFF]">
                        #{listPosition + 1}
                      </span>
                      <span className={`rounded-md border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyles[result.status]}`}>
                        {result.status}
                      </span>
                      {result.featured && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-violet-400/25 bg-violet-400/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-violet-300">
                          <Sparkles className="h-3 w-3" aria-hidden="true" /> Featured
                        </span>
                      )}
                    </div>
                    {mutationActive && <Loader2 className="h-4 w-4 animate-spin text-[#008CFF]" aria-label="Saving" />}
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/45 p-2">
                        {result.clientLogoUrl ? (
                          <img src={result.clientLogoUrl} alt={`${result.clientName} logo`} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-white/20" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold tracking-tight">{result.clientName}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                            {result.durationMonths === null ? 'Duration not set' : `${result.durationMonths} month${result.durationMonths === 1 ? '' : 's'}`}
                          </span>
                          {result.videoUrl && (
                            <span className="inline-flex items-center gap-1.5 text-[#49AFFF]">
                              <FileVideo2 className="h-3.5 w-3.5" aria-hidden="true" /> Video linked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" /> Followers
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          <span className="text-white/45">{formatMetric(result.beforeFollowers)}</span>
                          <span className="px-1.5 text-[#008CFF]">→</span>
                          <span>{formatMetric(result.afterFollowers)}</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35">
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Views
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          <span className="text-white/45">{formatMetric(result.beforeViews)}</span>
                          <span className="px-1.5 text-[#008CFF]">→</span>
                          <span>{formatMetric(result.afterViews)}</span>
                        </div>
                      </div>
                    </div>

                    {result.testimonial && (
                      <blockquote className="line-clamp-2 border-l-2 border-[#008CFF]/60 pl-3 text-sm leading-6 text-white/55">
                        “{result.testimonial}”
                      </blockquote>
                    )}

                    <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white/35">Results order</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => moveResult(result.id, -1, 'order')}
                            disabled={isBusy || listPosition <= 0}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/70 transition hover:border-[#008CFF]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={`Move ${result.clientName} up in full results order`}
                          >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" /> Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveResult(result.id, 1, 'order')}
                            disabled={isBusy || listPosition < 0 || listPosition >= results.length - 1}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/70 transition hover:border-[#008CFF]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={`Move ${result.clientName} down in full results order`}
                          >
                            <ArrowDown className="h-4 w-4" aria-hidden="true" /> Down
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white/35">
                          Homepage order {result.featured && homepagePosition >= 0 ? `#${homepagePosition + 1}` : ''}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => moveResult(result.id, -1, 'homepageOrder')}
                            disabled={isBusy || !result.featured || homepagePosition <= 0}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/70 transition hover:border-violet-400/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={`Move ${result.clientName} up in homepage order`}
                          >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" /> Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveResult(result.id, 1, 'homepageOrder')}
                            disabled={isBusy || !result.featured || homepagePosition < 0 || homepagePosition >= homepageResults.length - 1}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/70 transition hover:border-violet-400/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={`Move ${result.clientName} down in homepage order`}
                          >
                            <ArrowDown className="h-4 w-4" aria-hidden="true" /> Down
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(result)}
                        disabled={isBusy}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#008CFF] px-4 text-sm font-bold text-white transition hover:bg-[#1598ff] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit
                      </button>
                      {result.status !== 'archived' && (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={result.featured}
                          onClick={() => handleFeaturedToggle(result)}
                          disabled={isBusy}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/70 transition hover:border-violet-400/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {result.featured ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                          {result.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}
                      {result.status === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => handlePermanentDelete(result)}
                          disabled={isBusy}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/10 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete permanently
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleArchive(result)}
                          disabled={isBusy}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/55 transition hover:border-amber-400/30 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Archive className="h-4 w-4" aria-hidden="true" /> Archive
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div
            className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#070B12] shadow-[0_30px_100px_rgba(0,0,0,0.7)] sm:max-h-[92vh] sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-editor-title"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#04060A] px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#49AFFF]">
                  {editingResult ? `Editing ${editingResult.status}` : 'New result'}
                </p>
                <h2 id="result-editor-title" className="mt-1 truncate text-xl font-bold">
                  {editingResult ? editingResult.clientName : 'Add client result'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isBusy}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Close result editor"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-7 p-4 sm:p-6">
                {formErrors.form && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Result was not saved.</p>
                      <p className="mt-1 text-red-200/80">{formErrors.form}</p>
                    </div>
                  </div>
                )}

                <fieldset disabled={isBusy} className="space-y-4">
                  <legend className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#008CFF]/15 text-[#49AFFF]">1</span>
                    Client identity
                  </legend>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="result-client" className={labelClass}>Existing client</label>
                      <select
                        id="result-client"
                        value={form.clientId}
                        onChange={(event) => handleClientSelection(event.target.value)}
                        className={inputClass}
                      >
                        <option value="">Custom or unlinked client</option>
                        {linkedClientMissing && <option value={form.clientId}>Linked client is unavailable</option>}
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs leading-5 text-white/35">
                        Selecting a client fills its name and logo. You can replace either field below.
                      </p>
                      {clientsError && <p className="mt-1.5 text-xs text-amber-300" role="status">{clientsError}</p>}
                    </div>
                    <div>
                      <label htmlFor="clientName" className={labelClass}>Client name <span className="text-red-300">*</span></label>
                      <input
                        id="clientName"
                        type="text"
                        value={form.clientName}
                        onChange={(event) => updateForm('clientName', event.target.value)}
                        placeholder="Client or brand name"
                        autoComplete="organization"
                        aria-invalid={Boolean(formErrors.clientName)}
                        aria-describedby={formErrors.clientName ? 'clientName-error' : undefined}
                        className={`${inputClass} ${formErrors.clientName ? 'border-red-400/60' : ''}`}
                      />
                      {formErrors.clientName && <p id="clientName-error" className="mt-1.5 text-xs text-red-300" role="alert">{formErrors.clientName}</p>}
                    </div>
                  </div>
                  <CloudinaryUploader
                    label="Client logo"
                    value={form.clientLogoUrl}
                    onChange={(url) => updateForm('clientLogoUrl', url)}
                    accept="image"
                    helpText="Use the selected client logo or upload a replacement to Cloudinary. Required to publish."
                    requireCloudinary
                  />
                  {formErrors.clientLogoUrl && <p className="text-xs text-red-300" role="alert">{formErrors.clientLogoUrl}</p>}
                </fieldset>

                <fieldset disabled={isBusy} className="space-y-4 border-t border-white/10 pt-7">
                  <legend className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#008CFF]/15 text-[#49AFFF]">2</span>
                    Performance metrics
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <NumberField id="beforeFollowers" label="Followers before" value={form.beforeFollowers} error={formErrors.beforeFollowers} onChange={(value) => updateForm('beforeFollowers', value)} disabled={isBusy} placeholder="Optional" />
                    <NumberField id="afterFollowers" label="Followers after" value={form.afterFollowers} error={formErrors.afterFollowers} onChange={(value) => updateForm('afterFollowers', value)} disabled={isBusy} placeholder="Optional" />
                    <NumberField id="durationMonths" label="Duration in months" value={form.durationMonths} error={formErrors.durationMonths} onChange={(value) => updateForm('durationMonths', value)} disabled={isBusy} placeholder="Required to publish" />
                    <NumberField id="beforeViews" label="Views before" value={form.beforeViews} error={formErrors.beforeViews} onChange={(value) => updateForm('beforeViews', value)} disabled={isBusy} placeholder="Optional" />
                    <NumberField id="afterViews" label="Views after" value={form.afterViews} error={formErrors.afterViews} onChange={(value) => updateForm('afterViews', value)} disabled={isBusy} placeholder="Optional" />
                  </div>
                  <p className="text-xs leading-5 text-white/35">Metrics accept nonnegative whole numbers only. Leave an unknown metric blank rather than estimating it.</p>
                </fieldset>

                <fieldset disabled={isBusy} className="space-y-4 border-t border-white/10 pt-7">
                  <legend className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#008CFF]/15 text-[#49AFFF]">3</span>
                    Before and after proof
                  </legend>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <CloudinaryUploader
                        label="Before screenshot"
                        value={form.beforeScreenshotUrl}
                        onChange={(url) => updateForm('beforeScreenshotUrl', url)}
                        accept="image"
                        helpText="Upload the verified starting screenshot to Cloudinary."
                        requireCloudinary
                      />
                      {formErrors.beforeScreenshotUrl && <p className="mt-1.5 text-xs text-red-300" role="alert">{formErrors.beforeScreenshotUrl}</p>}
                    </div>
                    <div>
                      <CloudinaryUploader
                        label="After screenshot"
                        value={form.afterScreenshotUrl}
                        onChange={(url) => updateForm('afterScreenshotUrl', url)}
                        accept="image"
                        helpText="Upload the verified outcome screenshot to Cloudinary."
                        requireCloudinary
                      />
                      {formErrors.afterScreenshotUrl && <p className="mt-1.5 text-xs text-red-300" role="alert">{formErrors.afterScreenshotUrl}</p>}
                    </div>
                  </div>
                </fieldset>

                <fieldset disabled={isBusy} className="space-y-4 border-t border-white/10 pt-7">
                  <legend className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#008CFF]/15 text-[#49AFFF]">4</span>
                    Testimonial and video
                  </legend>
                  <div>
                    <label htmlFor="testimonial" className={labelClass}>Client testimonial</label>
                    <textarea
                      id="testimonial"
                      rows={3}
                      maxLength={280}
                      value={form.testimonial}
                      onChange={(event) => updateForm('testimonial', event.target.value)}
                      placeholder="Paste the approved one-line client testimonial without inventing or rewriting it."
                      aria-invalid={Boolean(formErrors.testimonial)}
                      aria-describedby={formErrors.testimonial ? 'testimonial-error' : undefined}
                      className={`${inputClass} min-h-24 resize-y ${formErrors.testimonial ? 'border-red-400/60' : ''}`}
                    />
                    {formErrors.testimonial && <p id="testimonial-error" className="mt-1.5 text-xs text-red-300" role="alert">{formErrors.testimonial}</p>}
                  </div>
                  <div>
                    <label htmlFor="videoUrl" className={labelClass}>YouTube or Instagram video URL</label>
                    <input
                      id="videoUrl"
                      type="url"
                      inputMode="url"
                      value={form.videoUrl}
                      onChange={(event) => updateForm('videoUrl', event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=… or https://www.instagram.com/reel/…"
                      aria-invalid={Boolean(formErrors.videoUrl)}
                      aria-describedby={formErrors.videoUrl ? 'videoUrl-error' : 'videoUrl-help'}
                      className={`${inputClass} ${formErrors.videoUrl ? 'border-red-400/60' : ''}`}
                    />
                    {formErrors.videoUrl ? (
                      <p id="videoUrl-error" className="mt-1.5 text-xs text-red-300" role="alert">{formErrors.videoUrl}</p>
                    ) : (
                      <p id="videoUrl-help" className={`mt-1.5 text-xs ${videoValidation?.valid ? 'text-emerald-300' : 'text-white/35'}`}>
                        {videoValidation?.valid
                          ? `${videoValidation.platform === 'youtube' ? 'YouTube' : 'Instagram'} URL recognized.`
                          : 'Optional. Only supported YouTube and Instagram result URLs can be saved.'}
                      </p>
                    )}
                  </div>
                  <CloudinaryUploader
                    label="Video poster"
                    value={form.videoPosterUrl}
                    onChange={(url) => updateForm('videoPosterUrl', url)}
                    accept="image"
                    helpText="Required when a video URL is published. The public page never scrapes social thumbnails."
                    requireCloudinary
                  />
                  {formErrors.videoPosterUrl && <p className="text-xs text-red-300" role="alert">{formErrors.videoPosterUrl}</p>}
                </fieldset>

                <fieldset disabled={isBusy} className="space-y-4 border-t border-white/10 pt-7">
                  <legend className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#008CFF]/15 text-[#49AFFF]">5</span>
                    Placement
                  </legend>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.featured}
                    onClick={() => updateForm('featured', !form.featured)}
                    className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                      form.featured
                        ? 'border-[#008CFF]/40 bg-[#008CFF]/10'
                        : 'border-white/10 bg-black/25 hover:border-white/20'
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-white">Feature on homepage</span>
                      <span className="mt-1 block text-xs leading-5 text-white/40">Featured records can be arranged with the homepage order controls.</span>
                    </span>
                    <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${form.featured ? 'bg-[#008CFF]' : 'bg-white/15'}`} aria-hidden="true">
                      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${form.featured ? 'left-6' : 'left-1'}`} />
                    </span>
                  </button>
                </fieldset>
              </div>

              <div className="sticky bottom-0 border-t border-white/10 bg-[#04060A]/95 p-4 backdrop-blur-xl sm:px-6">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isBusy}
                      className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      Cancel
                    </button>
                    {editingResult && editingResult.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleArchive(editingResult)}
                        disabled={isBusy}
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.08] px-4 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                      >
                        <Archive className="h-4 w-4" aria-hidden="true" /> Archive
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <button
                      type="submit"
                      name="intent"
                      value="draft"
                      disabled={isBusy}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-5 text-sm font-bold text-white transition hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mutationKey === 'save' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                      {editingResult?.status === 'published' ? 'Unpublish to draft' : 'Save draft'}
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="published"
                      disabled={isBusy}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#008CFF] px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,140,255,0.24)] transition hover:bg-[#1598ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mutationKey === 'save' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-4 z-[120] max-w-[calc(100vw-2rem)] rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:right-6 ${
            toast.tone === 'success'
              ? 'border-emerald-400/25 bg-[#092019] text-emerald-200'
              : 'border-amber-400/25 bg-[#241B08] text-amber-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default ResultsCMS;
