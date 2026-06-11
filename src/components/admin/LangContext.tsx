'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }
const LangContext = createContext<LangCtx>({ lang: 'ja', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
