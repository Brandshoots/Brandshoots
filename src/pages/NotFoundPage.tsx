import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

export const NotFoundPage: React.FC = () => (
  <main className="min-h-screen overflow-x-hidden bg-[#08090C] text-white">
    <MainNavbar />
    <section className="flex min-h-[78vh] items-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1380px] border-t border-white/15 pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] font-semibold text-[#008CFF]">ERROR 404</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(3.5rem,10vw,8.5rem)] font-sans font-black uppercase leading-[0.88] tracking-[-0.025em]">
          Page not found.
        </h1>
        <p className="mt-6 max-w-xl font-sans font-light text-base leading-relaxed text-white/75 sm:text-lg">
          The page you requested does not exist or may have moved. Return to the BrandShoots homepage to continue.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#008CFF] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold text-white transition-colors hover:bg-white hover:text-[#08090C]"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO HOME
        </Link>
      </div>
    </section>
    <BrandShootsFooter />
  </main>
);

export default NotFoundPage;
