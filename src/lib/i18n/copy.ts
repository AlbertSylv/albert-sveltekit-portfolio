import type { Locale } from './locales';
import { isExperienceSlug } from './experience';

export type WorkCard = {
	slug: string;
	menuLabel: string;
	title: string;
	context: string;
	note: string;
	thumbSrc: string;
	thumbAlt: string;
};

export type Copy = {
	meta: { title: string; description: string };
	nav: { home: string; work: string; workMenu: string; contact: string };
	lang: { label: string; da: string; en: string };
	hero: {
		kicker: string;
		headline: string;
		lead: string;
		portraitSrc: string;
		portraitAlt: string;
		ctaWork: string;
		ctaContact: string;
	};
	contribution: {
		title: string;
		bullets: string[];
	};
	work: {
		title: string;
		subtitle: string;
		cards: WorkCard[];
	};
	experience: {
		back: string;
	};
	contact: {
		title: string;
		lead: string;
		email: string;
		linkedin: string;
	};
	footer: { rights: string; availability: string };
};

export const copy: Record<Locale, Copy> = {
	en: {
		meta: {
			title: 'Albert Sylvester · Front-end developer · Copenhagen',
			description:
				'Front-end developer in Copenhagen. I build software in production with TypeScript and React, talk to users, and help teams figure out what to build next. Most recently at BMF Systems.'
		},
		nav: { home: 'Home', work: 'Experience', workMenu: 'Open experience pages', contact: 'Contact' },
		lang: { label: 'Language', da: 'Dansk', en: 'English' },
		hero: {
			kicker: 'Copenhagen',
			headline: 'Turning real user problems into software that ships.',
			lead:
				'Concept and front-end developer who works across user research, product and code.',
			portraitSrc: 'images/home/portrait.png',
			portraitAlt: 'Albert Sylvester.',
			ctaWork: 'See my work',
			ctaContact: 'Get in touch'
		},
		contribution: {
			title: 'What I do',
			bullets: [
				'For the past few years my main job has been full-time front-end development. React in production, with features and fixes that actually go live.',
				'I use AI deliberately in my own workflow where it pays off. That gives me more time for the harder, end-to-end problems.',
				'I can follow a piece of work the whole way: from a rough idea, through small tests, to a release that reaches real users.',
				'I talk to users and customers regularly. What they struggle with is what shapes the next thing we build.',
				'I help teams prioritise across roles, with what users actually told us as the starting point.'
			]
		},
		work: {
			title: "What I've worked on",
			subtitle: 'Just headlines. Write or call if you want more.',
			cards: [
				{
					slug: 'bmf-systems',
					menuLabel: 'BMF Systems',
					title: 'BMF Systems',
					context: 'ISO & quality tooling · SharePoint / M365',
					note: 'I build the parts of SharePoint that people actually use day to day: documents, incidents, risks and operational forms.',
					thumbSrc: 'images/home/work-bmf.png',
					thumbAlt: 'BMF Systems logo.'
				},
				{
					slug: 'cph-cloud',
					menuLabel: 'CPH Cloud',
					title: 'CPH Cloud',
					context: 'Two years · UX / developer · agency-side',
					note: 'Two years on the agency side. Timelines, talking to stakeholders, and getting useful pieces shipped for clients.',
					thumbSrc: 'images/home/work-cphcloud.png',
					thumbAlt: 'CPH Cloud logo.'
				},
				{
					slug: 'fauna-photonics',
					menuLabel: 'FaunaPhotonics',
					title: 'FaunaPhotonics · Bachelor',
					context: 'Digital concept · 2023',
					note: 'Bachelor project at FaunaPhotonics. I interviewed their customers about the insect data portal and built a clickable prototype for the next version.',
					thumbSrc: 'images/home/work-fauna.png',
					thumbAlt: 'FaunaPhotonics logo.'
				}
			]
		},
		experience: {
			back: '← Home'
		},
		contact: {
			title: 'Contact',
			lead: 'Email or LinkedIn. I usually reply within a few working days.',
			email: 'Email',
			linkedin: 'LinkedIn'
		},
		footer: {
			rights: 'Albert Sylvester',
			availability: 'Concept- and front-end developer. Copenhagen.'
		}
	},
	da: {
		meta: {
			title: 'Albert Sylvester · Front-end-udvikler · København',
			description:
				'Front-end-udvikler i København. Jeg bygger software i produktion med TypeScript og React, taler med brugerne, og hjælper teamet med at finde ud af hvad vi skal bygge som det næste. Senest BMF Systems.'
		},
		nav: { home: 'Forside', work: 'Erfaring', workMenu: 'Åbn liste over udvalgte roller', contact: 'Kontakt' },
		lang: { label: 'Sprog', da: 'Dansk', en: 'English' },
		hero: {
			kicker: 'København',
			headline: 'Bygger digitale produkter med rod i brugernes problemer.',
			lead:
				'Koncept- og front-end-udvikler der arbejder med brugerundersøgelser, produkt og kode.',
			portraitSrc: 'images/home/portrait.png',
			portraitAlt: 'Albert Sylvester.',
			ctaWork: 'Se hvad jeg har lavet',
			ctaContact: 'Tag fat i mig'
		},
		contribution: {
			title: 'Det jeg kan',
			bullets: [
				'De sidste par år har min hovedopgave været fuldtids front-end-udvikling. React i praksis, med features og fixes der lander i produktion.',
				'Jeg bruger AI bevidst i mit eget arbejde der hvor det betaler sig. Det giver mere tid til det egentlige problem og mindre tid på gentagne, lavpraktiske ting.',
				'Jeg kan følge en opgave hele vejen: fra en løs idé, over små tests, ud til en release der faktisk når brugerne.',
				'Jeg har jævnlig kontakt med brugere og kunder. Det de slås med, peger direkte på hvad vi skal bygge som det næste.',
				'Jeg hjælper med at prioritere på tværs af roller, med udgangspunkt i hvad brugerne rent faktisk sagde.'
			]
		},
		work: {
			title: 'Hvad jeg har arbejdet med',
			subtitle: 'Kun overskrifter. Skriv eller ring hvis du vil høre mere.',
			cards: [
				{
					slug: 'bmf-systems',
					menuLabel: 'BMF Systems',
					title: 'BMF Systems',
					context: 'ISO og kvalitetsledelse · SharePoint / M365',
					note: 'Jeg bygger den del af SharePoint som brugerne møder i hverdagen: dokumenter, hændelser, risici og driftsskemaer.',
					thumbSrc: 'images/home/work-bmf.png',
					thumbAlt: 'BMF Systems-logo.'
				},
				{
					slug: 'cph-cloud',
					menuLabel: 'CPH Cloud',
					title: 'CPH Cloud',
					context: 'To år · UX/udvikler · bureau-side',
					note: 'To år på bureau-siden. Tidsplaner, dialog med interessenter, og at få konkrete, brugbare bidder ud til kunderne.',
					thumbSrc: 'images/home/work-cphcloud.png',
					thumbAlt: 'CPH Cloud-logo.'
				},
				{
					slug: 'fauna-photonics',
					menuLabel: 'FaunaPhotonics',
					title: 'FaunaPhotonics · Bachelor',
					context: 'Digital koncept · 2023',
					note: 'Bachelorprojekt hos FaunaPhotonics. Jeg interviewede deres kunder om insekt-dataportalen og lavede en klikbar prototype til næste version.',
					thumbSrc: 'images/home/work-fauna.png',
					thumbAlt: 'FaunaPhotonics-logo.'
				}
			]
		},
		experience: {
			back: '← Forside'
		},
		contact: {
			title: 'Kontakt',
			lead: 'Mail eller LinkedIn. Jeg svarer som regel inden for et par hverdage.',
			email: 'Mail',
			linkedin: 'LinkedIn'
		},
		footer: {
			rights: 'Albert Sylvester',
			availability: 'Koncept- og front-end-udvikler. København.'
		}
	}
};

export function t(locale: Locale): Copy {
	return copy[locale];
}

export function workCardBySlug(locale: Locale, slug: string): WorkCard | undefined {
	if (!isExperienceSlug(slug)) return undefined;
	return copy[locale].work.cards.find((c) => c.slug === slug);
}
