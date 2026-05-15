import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param): param is 'da' | 'en' =>
	param === 'da' || param === 'en';
