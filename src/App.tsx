import React, {
  Component,
  ReactNode,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Navigate,
  NavigationType,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { BrandShootsPreloader } from './components/preloader/BrandShootsPreloader';
import { StrokeRevealPreloader } from './components/about/StrokeRevealPreloader';
import { SiteSeo } from './components/seo/SiteSeo';
import { UniversalFloatingActions } from './components/floating/UniversalFloatingActions';
import { waitForBrandFonts } from './utils/criticalAssets';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then((module) => ({ default: module.PortfolioPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then((module) => ({ default: module.ResultsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const PackagesPage = lazy(() => import('./pages/PackagesPage').then((module) => ({ default: module.PackagesPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })));
const BunqReferenceLab = lazy(() => import('./reference-lab/bunq/BunqReferenceLab').then((module) => ({ default: module.BunqReferenceLab })));
const WithMediaReferenceLab = lazy(() => import('./reference-lab/withmedia/WithMediaReferenceLab').then((module) => ({ default: module.WithMediaReferenceLab })));
const LusionReferenceLab = lazy(() => import('./reference-lab/lusion/LusionReferenceLab').then((module) => ({ default: module.LusionReferenceLab })));

type LoaderMode = 'brand' | 'route';

interface TransitionState {
  key: string;
  mode: LoaderMode;
  routeReady: boolean;
  criticalReady: boolean;
  navigationType: NavigationType;
  initial: boolean;
}

interface RouteReadyProps {
  children: ReactNode;
  onReady: (key: string) => void;
}

const RouteReady: React.FC<RouteReadyProps> = ({ children, onReady }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    onReady(location.key);
  }, [location.key, onReady]);
  return <>{children}</>;
};

const PageFallback = ({ background = '#08090C' }: { background?: string }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading BrandShoots page"
    className="flex min-h-screen items-center justify-center px-8"
    style={{ background }}
  >
    <img
      src="/Logo Official.svg"
      alt="BrandShoots"
      width={1600}
      height={365}
      className="h-auto w-[min(72vw,460px)] opacity-90"
    />
  </div>
);

interface RouteErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: RouteErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: unknown) {
    console.error('BrandShoots route failed to load', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090C] px-6 text-center text-white">
        <div className="max-w-lg">
          <img src="/Logo Official.svg" alt="BrandShoots" width={1600} height={365} className="mx-auto h-auto w-56" />
          <h1 className="mt-10 text-3xl font-semibold tracking-[-0.035em]">This page could not be loaded.</h1>
          <p className="mt-4 text-sm leading-7 text-white/60">Check your connection and try loading the page again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 min-h-12 bg-[#1497F5] px-6 text-xs font-semibold tracking-[0.12em]"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }
}

const scrollToHash = (hash: string) => {
  if (!hash) return false;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;
  const lenis = (window as any).__lenis;
  if (lenis?.scrollTo) lenis.scrollTo(target, { offset: -88, duration: 0.85 });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
};

export function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const initialPathRef = useRef(location.pathname);
  const previousLocationRef = useRef({ pathname: location.pathname, hash: location.hash });
  const firstLocationEffectRef = useRef(true);
  const routeReadyKeysRef = useRef(new Set<string>());
  const criticalReadyKeysRef = useRef(new Set<string>());
  const scrollPositionsRef = useRef(new Map<string, number>());
  const completedTransitionRef = useRef<TransitionState | null>(null);
  const routeContentRef = useRef<HTMLDivElement>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [transition, setTransition] = useState<TransitionState | null>(() => ({
    key: location.key,
    mode: location.pathname === '/' ? 'brand' : 'route',
    routeReady: false,
    criticalReady: location.pathname !== '/',
    navigationType,
    initial: true,
  }));

  useEffect(() => {
    let cancelled = false;
    waitForBrandFonts().finally(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRouteReady = useCallback((key: string) => {
    routeReadyKeysRef.current.add(key);
    setTransition((current) => current?.key === key ? { ...current, routeReady: true } : current);
  }, []);

  const markCriticalReady = useCallback((key: string) => {
    criticalReadyKeysRef.current.add(key);
    setTransition((current) => current?.key === key ? { ...current, criticalReady: true } : current);
  }, []);

  const handleHomeCriticalReady = useCallback(() => {
    markCriticalReady(location.key);
  }, [location.key, markCriticalReady]);

  useLayoutEffect(() => {
    const previous = previousLocationRef.current;
    const samePage = previous.pathname === location.pathname;
    previousLocationRef.current = { pathname: location.pathname, hash: location.hash };

    if (firstLocationEffectRef.current) {
      firstLocationEffectRef.current = false;
      return;
    }

    if (samePage) {
      if (previous.hash !== location.hash && location.hash) {
        window.requestAnimationFrame(() => scrollToHash(location.hash));
      }
      return;
    }

    setTransition({
      key: location.key,
      mode: 'route',
      routeReady: routeReadyKeysRef.current.has(location.key),
      criticalReady: location.pathname !== '/' || criticalReadyKeysRef.current.has(location.key),
      navigationType,
      initial: false,
    });
  }, [location.hash, location.key, location.pathname, navigationType]);

  useEffect(() => {
    return () => {
      scrollPositionsRef.current.set(location.key, window.scrollY);
    };
  }, [location.key]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const content = routeContentRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (!transition) {
      if (content) content.inert = false;
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (content) content.inert = true;

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (content) content.inert = false;
    };
  }, [transition]);

  useLayoutEffect(() => {
    if (transition || !completedTransitionRef.current) return;
    const completed = completedTransitionRef.current;
    completedTransitionRef.current = null;

    window.requestAnimationFrame(() => {
      if (location.hash && scrollToHash(location.hash)) return;
      if (!completed.initial && completed.navigationType === NavigationType.Pop) {
        window.scrollTo({ top: scrollPositionsRef.current.get(completed.key) || 0, behavior: 'auto' });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }, [location.hash, transition]);

  const finishTransition = useCallback((completed: TransitionState) => {
    completedTransitionRef.current = completed;
    setTransition((current) => current?.key === completed.key ? null : current);
  }, []);

  const transitionActive = Boolean(transition && transition.key === location.key);
  const readyToExit = Boolean(
    transition &&
    transition.routeReady &&
    transition.criticalReady &&
    fontsReady
  );

  const wrapRoute = (content: ReactNode) => (
    <RouteReady onReady={markRouteReady}>{content}</RouteReady>
  );

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#05070B]">
      <SiteSeo />
      <div ref={routeContentRef} aria-hidden={transitionActive}>
        <RouteErrorBoundary resetKey={location.key}>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<PageFallback />}>
                  {wrapRoute(
                    <HomePage
                      transitionActive={transitionActive}
                      onCriticalReady={handleHomeCriticalReady}
                    />
                  )}
                </Suspense>
              }
            />
            <Route
              path="/portfolio"
              element={
                <Suspense fallback={<PageFallback background="#020306" />}>
                  {wrapRoute(<PortfolioPage transitionActive={transitionActive} />)}
                </Suspense>
              }
            />
            <Route
              path="/results"
              element={
                <Suspense fallback={<PageFallback background="#08090C" />}>
                  {wrapRoute(<ResultsPage transitionActive={transitionActive} />)}
                </Suspense>
              }
            />
            <Route path="/portfolio/:clientSlug" element={<Navigate to="/portfolio" replace />} />
            <Route path="/projects/:clientSlug" element={<Navigate to="/portfolio" replace />} />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageFallback background="#04060A" />}>
                  {wrapRoute(<AboutPage transitionActive={transitionActive} />)}
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<PageFallback background="#05070B" />}>
                  {wrapRoute(<ContactPage transitionActive={transitionActive} />)}
                </Suspense>
              }
            />
            <Route
              path="/packages"
              element={
                <Suspense fallback={<PageFallback />}>
                  {wrapRoute(<PackagesPage />)}
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<PageFallback background="#05070B" />}>
                  {wrapRoute(<AdminPage />)}
                </Suspense>
              }
            />
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<PageFallback background="#05070B" />}>
                  {wrapRoute(<AdminPage />)}
                </Suspense>
              }
            />
            <Route
              path="/reference-lab/bunq/*"
              element={
                <Suspense fallback={<PageFallback background="#04060A" />}>
                  {wrapRoute(<BunqReferenceLab />)}
                </Suspense>
              }
            />
            <Route
              path="/reference-lab/withmedia/*"
              element={
                <Suspense fallback={<PageFallback background="#05070B" />}>
                  {wrapRoute(<WithMediaReferenceLab />)}
                </Suspense>
              }
            />
            <Route
              path="/reference-lab/lusion/*"
              element={
                <Suspense fallback={<PageFallback background="#05070B" />}>
                  {wrapRoute(<LusionReferenceLab />)}
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageFallback />}>
                  {wrapRoute(<NotFoundPage />)}
                </Suspense>
              }
            />
          </Routes>
        </RouteErrorBoundary>
      </div>

      {!transition && <UniversalFloatingActions />}
      {transition && transition.mode === 'brand' && initialPathRef.current === '/' && (
        <BrandShootsPreloader
          key={transition.key}
          readyToExit={readyToExit}
          onComplete={() => finishTransition(transition)}
        />
      )}
      {transition && (transition.mode === 'route' || initialPathRef.current !== '/') && (
        <StrokeRevealPreloader
          key={transition.key}
          readyToExit={readyToExit}
          minimumDurationMs={transition.initial ? 1000 : 750}
          onComplete={() => finishTransition(transition)}
        />
      )}
    </main>
  );
}

export default App;
