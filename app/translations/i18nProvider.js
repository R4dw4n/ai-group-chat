'use client'
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function TranslationProvider({ children }) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n])
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}