import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteSeo } from './components/seo/SiteSeo';
import { UniversalFloatingActions } from './components/floating/UniversalFloatingActions';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then((module) => ({ default: module.PortfolioPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const PackagesPage = lazy(() => import('./pages/PackagesPage').then((module) => ({ default: module.PackagesPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })));
const BunqReferenceLab = lazy(() => import('./reference-lab/bunq/BunqReferenceLab').then((module) => ({ default: module.BunqReferenceLab })));
const WithMediaReferenceLab = lazy(() => import('./reference-lab/withmedia/WithMediaReferenceLab').then((module) => ({ default: module.WithMediaReferenceLab })));
const LusionReferenceLab = lazy(() => import('./reference-lab/lusion/LusionReferenceLab').then((module) => ({ default: module.LusionReferenceLab })));

const PageFallback = ({ background = '#08090C' }: { background?: string }) => (
  <div className="min-h-screen" style={{ background }} aria-hidden="true" />
);

export function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#05070B]">
      <SiteSeo />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />

        <Route
          path="/portfolio"
          element={
            <Suspense fallback={<PageFallback background="#020306" />}>
              <PortfolioPage />
            </Suspense>
          }
        />
        <Route path="/portfolio/:clientSlug" element={<Navigate to="/portfolio" replace />} />
        <Route path="/projects/:clientSlug" element={<Navigate to="/portfolio" replace />} />

        <Route
          path="/about"
          element={
            <Suspense fallback={<PageFallback background="#04060A" />}>
              <AboutPage />
            </Suspense>
          }
        />

        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <ContactPage />
            </Suspense>
          }
        />

        <Route
          path="/packages"
          element={
            <Suspense fallback={<PageFallback />}>
              <PackagesPage />
            </Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <AdminPage />
            </Suspense>
          }
        />

        <Route
          path="/reference-lab/bunq"
          element={
            <Suspense fallback={<PageFallback background="#04060A" />}>
              <BunqReferenceLab />
            </Suspense>
          }
        />
        <Route
          path="/reference-lab/bunq/*"
          element={
            <Suspense fallback={<PageFallback background="#04060A" />}>
              <BunqReferenceLab />
            </Suspense>
          }
        />
        <Route
          path="/reference-lab/withmedia"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <WithMediaReferenceLab />
            </Suspense>
          }
        />
        <Route
          path="/reference-lab/withmedia/*"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <WithMediaReferenceLab />
            </Suspense>
          }
        />
        <Route
          path="/reference-lab/lusion"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <LusionReferenceLab />
            </Suspense>
          }
        />
        <Route
          path="/reference-lab/lusion/*"
          element={
            <Suspense fallback={<PageFallback background="#05070B" />}>
              <LusionReferenceLab />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      <UniversalFloatingActions />
    </main>
  );
}

export default App;
