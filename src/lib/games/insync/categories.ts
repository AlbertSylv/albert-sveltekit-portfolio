import type { CardCategory } from './types';
import type { Locale } from '$lib/i18n/locales';

const LABELS: Record<CardCategory, Record<Locale, string>> = {
	general: { en: 'General', da: 'Generelt' },
	social: { en: 'Social', da: 'Socialt' },
	food: { en: 'Food & drink', da: 'Mad & drikke' },
	pop: { en: 'Pop culture', da: 'Popkultur' },
	life: { en: 'Life & work', da: 'Liv & arbejde' },
	places: { en: 'Places & things', da: 'Steder & ting' },
	weird: { en: 'Weird & funny', da: 'Mærkeligt & sjovt' },
	debate: { en: 'Debate', da: 'Debat' },
	classic: { en: 'Classic', da: 'Klassisk' }
};

export function categoryLabel(category: CardCategory, locale: Locale): string {
	return LABELS[category][locale];
}
