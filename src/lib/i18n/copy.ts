import type { Locale } from './locales';
import { isExperienceSlug } from './experience';

export type WorkCardFigure = {
	src: string;
	alt: string;
	caption?: string;
};

export type WorkCardClient = {
	name: string;
	logoSrc: string;
	logoAlt: string;
	note?: string;
};

/** Inline link inside `WorkCard.note`. Replaces the `{{linkText}}` placeholder. */
export type WorkCardNoteLink = {
	text: string;
	slug: string;
};

/** One paragraph in the experience-page narrative, optionally preceded by a sub-heading. */
export type WorkCardDetailBlock = {
	heading?: string;
	body: string;
};

export type WorkCard = {
	slug: string;
	menuLabel: string;
	title: string;
	context: string;
	/** May contain a single `{{linkText}}` placeholder rendered as `noteLink`. */
	note: string;
	noteLink?: WorkCardNoteLink;
	/** Longer narrative on the `/experience/[slug]` page only, one paragraph per entry. */
	detail?: WorkCardDetailBlock[];
	thumbSrc: string;
	thumbAlt: string;
	/** Heading shown above the `figures` gallery; falls back to `experience.figuresHeading`. */
	figuresHeading?: string;
	figures?: WorkCardFigure[];
	clients?: WorkCardClient[];
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
		bullets: { heading: string; body: string }[];
	};
	work: {
		title: string;
		cards: WorkCard[];
	};
	experience: {
		back: string;
		/** Fallback heading above the figure gallery if a card does not override it. */
		figuresHeading: string;
		clients: string;
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
				{
					heading: 'Front-end that ships',
					body: 'For the past few years my main job has been full-time front-end development. React in production, with features and fixes that actually go live.'
				},
				{
					heading: 'AI where it pays off',
					body: 'I use AI deliberately in my own workflow where it pays off. That gives me more time for the harder, end-to-end problems.'
				},
				{
					heading: 'Idea to release',
					body: 'I can follow a piece of work the whole way: from a rough idea, through small tests, to a release that reaches real users.'
				},
				{
					heading: 'Close to users',
					body: 'I talk to users regularly, and what they actually struggle with is what shapes my priorities.'
				}
			]
		},
		work: {
			title: "What I've worked on",
			cards: [
				{
					slug: 'bmf-systems',
					menuLabel: 'BMF Systems',
					title: 'BMF Systems',
					context: 'ISO & quality tooling · SharePoint / M365',
					note: "CPH Cloud's own product: a SharePoint-based quality management system for ISO-certified companies.",
					thumbSrc: 'images/home/work-bmf.png',
					thumbAlt: 'BMF Systems logo.'
				},
				{
					slug: 'cph-cloud',
					menuLabel: 'CPH Cloud',
					title: 'CPH Cloud Company',
					context: 'Concept & front-end developer · agency · 2023-present',
					note: 'Custom React web parts and SharePoint consulting for larger clients like Novo Nordisk, AO Johansen and Xellia.',
					detail: [
						{
							heading: 'What the role looks like',
							body: 'Most days are concept and code development for custom React web parts inside SharePoint. The rest is broader Microsoft 365 and Azure work for smaller clients: tenant administration, permissions, and the practical things outside the codebase that need a developer on them.'
						},
						{
							heading: 'What is a SharePoint web part?',
							body: "It's a custom component you can add to a SharePoint page. Here's one I built as the only developer for Novo Nordisk's Global Medical Affairs. It sits on the Therapy Area landing pages: molecules along the left, indications along the top, and project links in the cells. Admins curate it directly on the page. Clicking a cell adds, edits or removes a link, with a SharePoint list as the underlying data source. A search above the matrix finds linked documents across the project pages."
						},
						{
							body: "It had to be editable by non-developers, work within SharePoint's permission model, and pass through Novo Nordisk's internal review and deployment process."
						}
					],
					thumbSrc: 'images/home/work-cphcloud.png',
					thumbAlt: 'CPH Cloud logo.',
					figuresHeading: 'GMA navigation matrix',
					figures: [
						{
							src: 'images/experience/cphcloud-gma-matrix.png',
							alt:
								"Screenshot of the GMA navigation matrix: rows of Novo Nordisk compounds (Semaglutide, Cagri-Sema, Ziltivekimab, Cardior, Coramitug) against columns of therapy areas (Heart failure, ASCVD, ATTR, Hypertension and CKD), with placeholder project links in the cells.",
							caption:
								"GMA navigation matrix, template version used for demonstration. The placeholder cells stand in for the real curated content, which stays inside Novo Nordisk."
						}
					],
					clients: [
						{
							name: 'Novo Nordisk',
							logoSrc: 'images/experience/client-novo-nordisk.png',
							logoAlt: 'Novo Nordisk logo.',
							note: 'Development and maintenance of internal SharePoint web parts, including the GMA navigation matrix above.'
						},
						{
							name: 'AO Johansen',
							logoSrc: 'images/experience/client-ao-johansen.png',
							logoAlt: 'AO Johansen logo.',
							note: 'SharePoint consulting.'
						},
						{
							name: 'Xellia Pharmaceuticals',
							logoSrc: 'images/experience/client-xellia.png',
							logoAlt: 'Xellia Pharmaceuticals logo.',
							note: 'SharePoint consulting.'
						},
						{
							name: 'Signum Life Science',
							logoSrc: 'images/experience/client-signum.png',
							logoAlt: 'Signum Life Science logo.',
							note: 'Technical support on a customer-facing website.'
						}
					]
				},
				{
					slug: 'fauna-photonics',
					menuLabel: 'FaunaPhotonics',
					title: 'FaunaPhotonics · Bachelor',
					context: "Digital concept development · insect data portal · 2023",
					note: "Bachelor thesis with FaunaPhotonics while studying digital concept development. Interview-led exploration of customer needs around the insect data portal, sketches, and a desktop Figma prototype for the planned portal replacement, centred on comparative views across sensors and seasons.",
					detail: [
						{
							heading: 'Why it mattered',
							body: "FaunaPhotonics was rebuilding their insect data portal for the 2024 season. They needed product direction, not just a visual refresh."
						},
						{
							heading: 'What I did',
							body: 'Interviewed customers already using the portal (Zoo København, Hedeselskabet, Better Energy, Clever), mapped findings against the business case around emerging biodiversity reporting, and prototyped the new portal end-to-end in Figma.'
						},
						{
							heading: 'The insight that drove the design',
							body: "Raw insect counts don't tell a story on their own. Users need comparison: across sensors, sites and seasons. The prototype puts the session list in every view and makes session-to-session comparison a first-class action."
						}
					],
					figures: [
						{
							src: 'images/experience/fauna-prototype-map.png',
							alt:
								'Screenshot from the Figma prototype: map of Denmark with Volito pins, filters, and expandable sensor cards.',
							caption:
								'Volito Map: overview with session list, search, date filters, and drill-down on a session.'
						},
						{
							src: 'images/experience/fauna-prototype-chart.png',
							alt:
								'Screenshot from the Figma prototype: line chart for insect categories and Volito sensor sidebar with Compare.',
							caption:
								'Session view: multi-series chart, category toggles, download, and Compare from the sensor list.'
						}
					],
					thumbSrc: 'images/home/work-fauna.png',
					thumbAlt: 'FaunaPhotonics logo.'
				}
			]
		},
		experience: {
			back: '← Home',
			figuresHeading: 'Figma prototype',
			clients: 'Clients I worked with at CPH Cloud'
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
			headline: 'Forbinder brugerundersøgelse, produkt og kode.',
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
				{
					heading: 'Front-end der lander',
					body: 'De sidste par år har min hovedopgave været fuldtids front-end-udvikling. React i praksis, med features og fixes der lander i produktion.'
				},
				{
					heading: 'AI hvor det betaler sig',
					body: 'Jeg bruger AI bevidst i mit eget arbejde der hvor det betaler sig. Det giver mere tid til det egentlige problem og mindre tid på gentagne, lavpraktiske ting.'
				},
				{
					heading: 'Idé til release',
					body: 'Jeg kan følge en opgave hele vejen: fra en løs idé, over små tests, ud til en release der faktisk når brugerne.'
				},
				{
					heading: 'Tæt på brugerne',
					body: 'Jeg har jævnlig kontakt med brugere, og det de slås med er det der bestemmer hvordan arbejdet skal prioriteres.'
				}
			]
		},
		work: {
			title: 'Hvad jeg har arbejdet med',
			cards: [
				{
					slug: 'bmf-systems',
					menuLabel: 'BMF Systems',
					title: 'BMF Systems',
					context: 'ISO og kvalitetsledelse · SharePoint / M365',
					note: 'CPH Clouds eget produkt: et kvalitetsledelsessystem på SharePoint til ISO-certificerede virksomheder.',
					thumbSrc: 'images/home/work-bmf.png',
					thumbAlt: 'BMF Systems-logo.'
				},
				{
					slug: 'cph-cloud',
					menuLabel: 'CPH Cloud',
					title: 'CPH Cloud Company',
					context: 'Koncept- og front-end-udvikler · bureau · 2023-nu',
					note: 'Skræddersyede React-webparts og SharePoint-konsulentarbejde for større kunder som Novo Nordisk, AO Johansen og Xellia.',
					detail: [
						{
							heading: 'Sådan ser rollen ud',
							body: 'De fleste dage er koncept- og kodeudvikling af skræddersyede React-webparts i SharePoint. Resten er bredere Microsoft 365- og Azure-arbejde for mindre kunder: tenant-administration, rettigheder, og de praktiske ting uden for koden der har brug for en udvikler på sig.'
						},
						{
							heading: 'Hvad er en SharePoint-webpart?',
							body: 'Det er en specialudviklet komponent du kan tilføje til en SharePoint-side. Her er én jeg byggede som eneste udvikler til Novo Nordisks Global Medical Affairs. Den sidder på Therapy Area-landingssiderne: molekyler i venstre side, indikationer i toppen, og projektlinks i cellerne. Administratorer kurerer den direkte på siden. Et klik på en celle tilføjer, redigerer eller fjerner et link, med en SharePoint-liste som datakilde. En søgning over matricen finder linkede dokumenter på tværs af projektsiderne.'
						},
						{
							body: 'Det skulle kunne redigeres af ikke-udviklere, fungere inden for SharePoints rettighedsmodel, og passere gennem Novo Nordisks interne review- og deployment-proces.'
						}
					],
					thumbSrc: 'images/home/work-cphcloud.png',
					thumbAlt: 'CPH Cloud-logo.',
					figuresHeading: 'GMA-navigationsmatrix',
					figures: [
						{
							src: 'images/experience/cphcloud-gma-matrix.png',
							alt:
								'Screenshot af GMA-navigationsmatricen: rækker med Novo Nordisks compounds (Semaglutide, Cagri-Sema, Ziltivekimab, Cardior, Coramitug) mod kolonner af terapiområder (Heart failure, ASCVD, ATTR, Hypertension and CKD), med placeholder-projektlinks i cellerne.',
							caption:
								'GMA-navigationsmatrix, template-version brugt til demonstration. Placeholder-cellerne står som stand-in for det reelle, kuraterede indhold, der ligger inde hos Novo Nordisk.'
						}
					],
					clients: [
						{
							name: 'Novo Nordisk',
							logoSrc: 'images/experience/client-novo-nordisk.png',
							logoAlt: 'Novo Nordisk-logo.',
							note: 'Udvikling og vedligeholdelse af interne SharePoint-webparts, herunder GMA-navigationsmatricen ovenfor.'
						},
						{
							name: 'AO Johansen',
							logoSrc: 'images/experience/client-ao-johansen.png',
							logoAlt: 'AO Johansen-logo.',
							note: 'SharePoint-konsulent.'
						},
						{
							name: 'Xellia Pharmaceuticals',
							logoSrc: 'images/experience/client-xellia.png',
							logoAlt: 'Xellia Pharmaceuticals-logo.',
							note: 'SharePoint-konsulent.'
						},
						{
							name: 'Signum Life Science',
							logoSrc: 'images/experience/client-signum.png',
							logoAlt: 'Signum Life Science-logo.',
							note: 'Teknisk support på kundevendt website.'
						}
					]
				},
				{
					slug: 'fauna-photonics',
					menuLabel: 'FaunaPhotonics',
					title: 'FaunaPhotonics · Bachelor',
					context: 'Digital konceptudvikling · insekt-dataportal · 2023',
					note: 'Bacheloropgave som digital konceptudvikler med FaunaPhotonics. Kvalitative kundeinterviews om behov til insekt-dataportalen, skitsearbejde og en desktop-prototype i Figma til den kommende portal, med vægt på sammenligning på tværs af sensorer og sæsoner.',
					detail: [
						{
							heading: 'Hvorfor det betød noget',
							body: 'FaunaPhotonics var ved at genopbygge deres insekt-dataportal til 2024-sæsonen. Det de manglede, var produktretning, ikke et nyt visuelt lag.'
						},
						{
							heading: 'Hvad jeg lavede',
							body: 'Interviewede kunder der allerede brugte portalen (Zoologisk Have København, Hedeselskabet, Better Energy, Clever), holdt indsigterne op mod businesscasen om kommende biodiversitetsrapportering, og lavede en gennemgående prototype i Figma.'
						},
						{
							heading: 'Indsigten der drev designet',
							body: 'Rå insekttal fortæller ikke en historie i sig selv. Brugerne har brug for at sammenligne: på tværs af sensorer, lokationer og sæsoner. Prototypen lægger session-listen ind på alle skærmbilleder og gør sammenligning af sessioner til en primær handling.'
						}
					],
					figures: [
						{
							src: 'images/experience/fauna-prototype-map.png',
							alt:
								'Screenshot fra Figma-prototypen: kort med Volito-pinne, session-liste og filtre.',
							caption:
								'Volito-kort: oversigt med session-liste, søgning, datointerval og udpakning af en session.'
						},
						{
							src: 'images/experience/fauna-prototype-chart.png',
							alt:
								'Screenshot fra Figma-prototypen: linjegraf og Volito-sessioner med Compare.',
							caption:
								'Sessionside: graf med insekt-kategorier, download og mulighed for sammenligning fra liste.'
						}
					],
					thumbSrc: 'images/home/work-fauna.png',
					thumbAlt: 'FaunaPhotonics-logo.'
				}
			]
		},
		experience: {
			back: '← Forside',
			figuresHeading: 'Prototype i Figma',
			clients: 'Kunder hos CPH Cloud'
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
