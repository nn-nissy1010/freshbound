'use client';

export type Lang = 'ja' | 'en';

export const t = (lang: Lang, ja: string, en: string) => lang === 'ja' ? ja : en;
