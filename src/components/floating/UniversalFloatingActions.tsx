import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

const safeHttpsUrl = (value: string | undefined, fallback: string): string => {
  try {
    const url = new URL((value || '').trim());
    if (url.protocol === 'https:' && url.hostname && !url.username && !url.password) {
      return url.toString();
    }
  } catch {}
  return fallback;
};

const sanitizeWhatsAppNumber = (...values: Array<string | undefined>): string => {
  for (const value of values) {
    const digits = (value || '').replace(/\D/g, '');
    if (/^\d{7,15}$/.test(digits)) return digits;
  }
  return INITIAL_SITE_SETTINGS.whatsappPhone;
};

const InstagramGlyph: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
  </svg>
);

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.86 11.86 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.45-8.41Zm-8.42 18.27h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.85 9.85 0 0 1-1.51-5.23C2.19 6.43 6.63 2 12.1 2c2.65 0 5.14 1.03 7.01 2.9A9.84 9.84 0 0 1 22 11.89c0 5.44-4.43 9.86-9.9 9.86Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
  </svg>
);

export const UniversalFloatingActions: React.FC = () => {
  const location = useLocation();
  const { settings, contact } = useCMSContent();
  const isAdmin = location.pathname.startsWith('/admin');
  const isReferenceLab = location.pathname.startsWith('/reference-lab');

  if (isAdmin || isReferenceLab) return null;

  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    'Hi BrandShoots, I would like to discuss a film production project.'
  )}`;
  const instagramUrl = safeHttpsUrl(
    settings?.instagramUrl,
    safeHttpsUrl(contact?.instagramUrl, INITIAL_CONTACT_PAGE.instagramUrl)
  );

  const actionClass = 'group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-transparent transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A] md:h-12 md:w-12';
  const tooltipClass = 'pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded bg-[#08090C]/95 px-2.5 py-1.5 text-[10px] font-medium tracking-[0.12em] text-white/85 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block';
  const placementClass = 'bottom-0 right-0 flex-col gap-1 md:right-6 md:gap-2';

  return (
    <aside
      data-floating-actions
      aria-label="Quick actions"
      className={`fixed z-[200] flex items-center ${placementClass}`}
    >
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open BrandShoots on Instagram"
        title="Instagram"
        className={`${actionClass} text-[#E1306C]`}
      >
        <span className={tooltipClass}>Instagram</span>
        <InstagramGlyph className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 md:h-[22px] md:w-[22px]" />
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BrandShoots on WhatsApp"
        title="WhatsApp"
        className={`${actionClass} text-[#25D366]`}
      >
        <span className={tooltipClass}>WhatsApp</span>
        <WhatsAppGlyph className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 md:h-[22px] md:w-[22px]" />
      </a>

      <Link
        to="/contact"
        aria-label="Contact BrandShoots"
        title="Contact"
        className={`${actionClass} text-[#008CFF]`}
      >
        <span className={tooltipClass}>Contact</span>
        <MessageCircle className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 md:h-[22px] md:w-[22px]" strokeWidth={1.9} />
      </Link>
    </aside>
  );
};

export default UniversalFloatingActions;
