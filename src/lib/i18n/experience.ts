export const EXPERIENCE_SLUGS = ['bmf-systems', 'cph-cloud', 'fauna-photonics'] as const;
export type ExperienceSlug = (typeof EXPERIENCE_SLUGS)[number];

export function isExperienceSlug(s: string): s is ExperienceSlug {
	return (EXPERIENCE_SLUGS as readonly string[]).includes(s);
}
