/**
 * Generates src/lib/games/insync/cards.ts from compact source rows.
 * Run: node scripts/generate-insync-cards.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../src/lib/games/insync/cards.ts');

/** [id, enLeft, enRight, daLeft, daRight] */
const SOURCE = {
	general: [
		['underrated-overrated', 'Underrated', 'Overrated', 'Undervurderet', 'Overvurderet'],
		['harmless-dangerous', 'Harmless', 'Dangerous', 'Ufarlig', 'Farlig'],
		['not-intimidating-very-intimidating', 'Not intimidating', 'Very intimidating', 'Ikke intimiderende', 'Meget intimiderende'],
		['low-effort-high-effort', 'Low effort', 'High effort', 'Lav indsats', 'Høj indsats'],
		['cheap-looking-expensive-looking', 'Cheap-looking', 'Expensive-looking', 'Ser billigt ud', 'Ser dyrt ud'],
		['easy-to-explain-hard-to-explain', 'Easy to explain', 'Hard to explain', 'Let at forklare', 'Svær at forklare'],
		['forgettable-iconic', 'Forgettable', 'Iconic', 'Glemt i morgen', 'Ikonisk'],
		['normal-unhinged', 'Normal', 'Unhinged', 'Normal', 'Skør'],
		['boring-exciting', 'Boring', 'Exciting', 'Kedelig', 'Spændende'],
		['innocent-suspicious', 'Innocent', 'Suspicious', 'Uskyldig', 'Mistænkelig'],
		['childish-mature', 'Childish', 'Mature', 'Barnlig', 'Moden'],
		['practical-ridiculous', 'Practical', 'Ridiculous', 'Praktisk', 'Latterlig'],
		['predictable-surprising', 'Predictable', 'Surprising', 'Forudsigelig', 'Overraskende'],
		['low-risk-high-risk', 'Low risk', 'High risk', 'Lav risiko', 'Høj risiko'],
		['polite-rude', 'Polite', 'Rude', 'Høflig', 'Uhøflig'],
		['subtle-obvious', 'Subtle', 'Obvious', 'Subtil', 'Tydelig'],
		['relaxing-stressful', 'Relaxing', 'Stressful', 'Afslappende', 'Stressende'],
		['simple-complicated', 'Simple', 'Complicated', 'Simpel', 'Kompliceret'],
		['cute-creepy', 'Cute', 'Creepy', 'Nuttet', 'Uhyggelig'],
		['wholesome-cursed', 'Wholesome', 'Cursed', 'Hyggelig', 'Forbandet']
	],
	social: [
		['green-flag-red-flag', 'Green flag', 'Red flag', 'Grønt flag', 'Rødt flag'],
		['reasonable-favor-huge-ask', 'Reasonable favor', 'Huge ask', 'Fornuftig tjeneste', 'Kæmpe tjeneste'],
		['good-excuse-bad-excuse', 'Good excuse', 'Bad excuse', 'God undskyldning', 'Dårlig undskyldning'],
		['fine-to-say-keep-to-yourself', 'Fine to say out loud', 'Keep that to yourself', 'Okay at sige højt', 'Hold det for dig selv'],
		['small-talk-deep-conversation', 'Small talk topic', 'Deep conversation topic', 'Smalltalk-emne', 'Dyb samtale'],
		['private-thought-public-announcement', 'Private thought', 'Public announcement', 'Privat tanke', 'Offentlig meddelelse'],
		['slightly-awkward-painfully-awkward', 'Slightly awkward', 'Painfully awkward', 'Lidt akavet', 'Pinligt akavet'],
		['acceptable-lie-unforgivable-lie', 'Acceptable lie', 'Unforgivable lie', 'Acceptabel løgn', 'Utilgivelig løgn'],
		['friendly-flirty', 'Friendly', 'Flirty', 'Venlig', 'Flirtende'],
		['confident-arrogant', 'Confident', 'Arrogant', 'Selvsikker', 'Arrogant'],
		['honest-too-honest', 'Honest', 'Too honest', 'Ærlig', 'For ærlig'],
		['cute-habit-annoying-habit', 'Cute habit', 'Annoying habit', 'Sød vane', 'Irriterende vane'],
		['good-listener-conversation-hijacker', 'Good listener', 'Conversation hijacker', 'God lytter', 'Samtale-kaprer'],
		['low-maintenance-high-maintenance-friend', 'Low-maintenance friend', 'High-maintenance friend', 'Nem ven', 'Krævende ven'],
		['textable-issue-phone-call-issue', 'Textable issue', 'Phone-call issue', 'Kan sms\'es om', 'Kræver telefonopkald'],
		['normal-message-concerning-message', 'Normal message', 'Concerning message', 'Normal besked', 'Bekymrende besked'],
		['worth-apologizing-not-worth-apologizing', 'Worth apologizing for', 'Not worth apologizing for', 'Værd at undskylde', 'Ikke værd at undskylde'],
		['forgivable-mistake-relationship-ending', 'Forgivable mistake', 'Relationship-ending mistake', 'Tilgivelig fejl', 'Forholds-dræber'],
		['good-party-guest-bad-party-guest', 'Good party guest', 'Bad party guest', 'God festgæst', 'Dårlig festgæst'],
		['knows-vibe-ruins-vibe', 'Knows the vibe', 'Ruins the vibe', 'Forstår stemningen', 'Ødelægger stemningen']
	],
	food: [
		['breakfast-dinner-food', 'Breakfast food', 'Dinner food', 'Morgenmad', 'Aftensmad'],
		['snack-meal', 'Snack', 'Meal', 'Snack', 'Måltid'],
		['comfort-food-punishment-food', 'Comfort food', 'Punishment food', 'Trøstemad', 'Straffemad'],
		['kid-food-adult-food', 'Kid food', 'Adult food', 'Børnemad', 'Voksenmad'],
		['mess-free-extremely-messy', 'Mess-free', 'Extremely messy', 'Intet svineri', 'Ekstremt svineri'],
		['worth-mess-not-worth-mess', 'Worth the mess', 'Not worth the mess', 'Svineriet værd', 'Ikke svineriet værd'],
		['bland-intense', 'Bland', 'Intense', 'Smagsløs', 'Intens'],
		['dry-saucy', 'Dry', 'Saucy', 'Tør', 'Masser af sovs'],
		['light-meal-food-coma', 'Light meal', 'Food coma', 'Let måltid', 'Madkoma'],
		['cheap-order-fancy-order', 'Cheap restaurant order', 'Fancy restaurant order', 'Billig bestilling', 'Fancy bestilling'],
		['safe-menu-risky-menu', 'Safe menu choice', 'Risky menu choice', 'Sikkert valg', 'Risikabelt valg'],
		['good-cold-only-good-hot', 'Good cold', 'Only good hot', 'God kold', 'Kun god varm'],
		['overpriced-worth-price', 'Overpriced', 'Worth the price', 'Overpris', 'Pengene værd'],
		['fake-tasting-natural-tasting', 'Fake-tasting', 'Natural-tasting', 'Smager kunstigt', 'Smager naturligt'],
		['looks-bad-tastes-good-looks-good-tastes-bad', 'Looks bad, tastes good', 'Looks good, tastes bad', 'Ser skidt ud, smager godt', 'Ser godt ud, smager dårligt'],
		['bad-airplane-food-good-airplane-food', 'Bad airplane food', 'Good airplane food', 'Dårlig flymad', 'God flymad'],
		['easy-share-awful-share', 'Easy to share', 'Awful to share', 'Nem at dele', 'Forfærdelig at dele'],
		['everyday-drink-special-occasion', 'Everyday drink', 'Special occasion drink', 'Hverdagsdrik', 'Festdrik'],
		['mild-painfully-spicy', 'Mild', 'Painfully spicy', 'Mild', 'Smertefuldt stærk'],
		['needs-topping-perfect-as-is', 'Needs a topping', 'Perfect as-is', 'Skal have topping', 'Perfekt som den er']
	],
	pop: [
		['guilty-pleasure-respectable-taste', 'Guilty pleasure', 'Respectable taste', 'Guilty pleasure', 'Respektabel smag'],
		['background-noise-must-watch', 'Background noise', 'Must-watch', 'Baggrundsstøj', 'Skal ses'],
		['cult-classic-mainstream-hit', 'Cult classic', 'Mainstream hit', 'Kultklassiker', 'Mainstream-hit'],
		['aged-badly-aged-well', 'Aged badly', 'Aged well', 'Aldret dårligt', 'Aldret godt'],
		['bad-sequel-great-sequel', 'Bad sequel idea', 'Great sequel idea', 'Dårlig efterfølger-idé', 'God efterfølger-idé'],
		['skip-intro-never-skip-intro', 'Skip the intro', 'Never skip the intro', 'Spring intro over', 'Aldrig spring intro over'],
		['one-hit-wonder-legendary-career', 'One-hit wonder', 'Legendary career', 'One-hit wonder', 'Legendarisk karriere'],
		['niche-fandom-everyone-knows', 'Niche fandom', 'Everyone knows it', 'Niche-fandom', 'Alle kender det'],
		['cringe-cool', 'Cringe', 'Cool', 'Cringe', 'Cool'],
		['try-hard-effortlessly-cool', 'Try-hard', 'Effortlessly cool', 'Prøver for hårdt', 'Cool uden at prøve'],
		['low-budget-blockbuster', 'Low-budget energy', 'Blockbuster energy', 'Lavbudget-energi', 'Blockbuster-energi'],
		['bad-karaoke-great-karaoke', 'Bad karaoke choice', 'Great karaoke choice', 'Dårligt karaokevalg', 'Godt karaokevalg'],
		['bad-wedding-song-great-wedding-song', 'Bad wedding song', 'Great wedding song', 'Dårlig bryllupssang', 'God bryllupssang'],
		['memeable-not-memeable', 'Memeable', 'Not memeable', 'Meme-værdig', 'Ikke meme-værdig'],
		['villain-coded-hero-coded', 'Villain-coded', 'Hero-coded', 'Skurk-energi', 'Helt-energi'],
		['side-character-main-character', 'Side character energy', 'Main character energy', 'Birolle-energi', 'Hovedrolle-energi'],
		['forgettable-villain-iconic-villain', 'Forgettable villain', 'Iconic villain', 'Glemt skurk', 'Ikonisk skurk'],
		['bad-reality-show-great-reality-show', 'Bad reality show idea', 'Great reality show idea', 'Dårlig reality-idé', 'God reality-idé'],
		['needs-reboot-leave-alone', 'Needs a reboot', 'Leave it alone', 'Trænger til reboot', 'Lad den være'],
		['flop-today-still-hit', 'Would flop today', 'Would still be a hit', 'Floppede i dag', 'Stadig et hit']
	],
	life: [
		['easy-class-impossible-class', 'Easy class', 'Impossible class', 'Let fag', 'Umuligt fag'],
		['fake-job-real-job', 'Fake-sounding job', 'Real-sounding job', 'Lyder opdigtet', 'Lyder ægte'],
		['useless-skill-essential-skill', 'Useless skill', 'Essential skill', 'Ubrugelig færdighed', 'Essentiel færdighed'],
		['not-resume-very-resume', 'Not résumé-worthy', 'Very résumé-worthy', 'Hører ikke hjemme på CV', 'Hører hjemme på CV'],
		['dream-job-nightmare-job', 'Dream job', 'Nightmare job', 'Drømmejob', 'Mareridtsjob'],
		['minor-inconvenience-day-ruining', 'Minor inconvenience', 'Day-ruining inconvenience', 'Lille irritationsmoment', 'Ødelægger hele dagen'],
		['productive-fake-productive', 'Productive', 'Fake productive', 'Produktiv', 'Fake produktiv'],
		['good-meeting-could-be-email', 'Good meeting topic', 'Could have been an email', 'Godt mødeemne', 'Kunne have været en mail'],
		['casual-signoff-formal-signoff', 'Casual email sign-off', 'Formal email sign-off', 'Afslappet mail-afsked', 'Formel mail-afsked'],
		['underpaid-overpaid', 'Underpaid', 'Overpaid', 'Underbetalt', 'Overbetalt'],
		['beginner-friendly-expert-only', 'Beginner-friendly', 'Expert-only', 'Begynder-venlig', 'Kun for eksperter'],
		['easy-fake-impossible-fake', 'Easy to fake', 'Impossible to fake', 'Let at fake', 'Umuligt at fake'],
		['low-pressure-high-pressure-decision', 'Low-pressure decision', 'High-pressure decision', 'Beslutning uden pres', 'Beslutning under pres'],
		['good-use-money-cry-for-help', 'Good use of money', 'Financial cry for help', 'God brug af penge', 'Økonomisk nødråb'],
		['worth-waking-up-not-worth', 'Worth waking up early for', 'Not worth waking up early for', 'Værd at stå tidligt op for', 'Ikke værd at stå tidligt op for'],
		['tiny-problem-actual-emergency', 'Tiny problem', 'Actual emergency', 'Lille problem', 'Rigtig nødsituation'],
		['fun-chore-soul-crushing-chore', 'Fun chore', 'Soul-crushing chore', 'Sjov pligt', 'Sjæleknusende pligt'],
		['good-habit-bad-habit', 'Good habit', 'Bad habit', 'God vane', 'Dårlig vane'],
		['temporary-phase-personality-trait', 'Temporary phase', 'Personality trait', 'Midlertidig fase', 'Personlighedstræk'],
		['responsible-reckless', 'Responsible', 'Reckless', 'Ansvarlig', 'Uansvarlig']
	],
	places: [
		['bedroom-museum', 'Belongs in a bedroom', 'Belongs in a museum', 'Hører hjemme på soveværelset', 'Hører hjemme på museum'],
		['normal-own-weird-own', 'Normal thing to own', 'Weird thing to own', 'Normalt at eje', 'Mærkeligt at eje'],
		['useful-decorative', 'Useful object', 'Decorative object', 'Nyttig ting', 'Pynteting'],
		['cheap-gift-thoughtful-gift', 'Cheap gift', 'Thoughtful gift', 'Billig gave', 'Gennemtænkt gave'],
		['good-souvenir-bad-souvenir', 'Good souvenir', 'Bad souvenir', 'God souvenir', 'Dårlig souvenir'],
		['clean-place-gross-place', 'Clean place', 'Gross place', 'Rent sted', 'Ulækkert sted'],
		['peaceful-chaotic-place', 'Peaceful place', 'Chaotic place', 'Fredeligt sted', 'Kaotisk sted'],
		['good-first-date-bad-first-date', 'Good first-date location', 'Bad first-date location', 'Godt første-date-sted', 'Dårligt første-date-sted'],
		['good-cry-bad-cry', 'Good place to cry', 'Bad place to cry', 'Godt sted at græde', 'Dårligt sted at græde'],
		['good-nap-terrible-nap', 'Good place to nap', 'Terrible place to nap', 'Godt sted at tage en lur', 'Forfærdeligt sted at tage en lur'],
		['public-behavior-private-behavior', 'Public place behavior', 'Private place behavior', 'Offentlig opførsel', 'Privat opførsel'],
		['safe-hiding-terrible-hiding', 'Safe hiding spot', 'Terrible hiding spot', 'Godt skjulested', 'Forfærdeligt skjulested'],
		['cozy-sterile', 'Cozy', 'Sterile', 'Hyggelig', 'Steril'],
		['inviting-hostile', 'Inviting', 'Hostile', 'Indbydende', 'Fjendtlig'],
		['too-empty-too-crowded', 'Too empty', 'Too crowded', 'For tomt', 'For overfyldt'],
		['looks-haunted-looks-normal', 'Looks haunted', 'Looks aggressively normal', 'Ser hjemsøgt ud', 'Ser aggressivt normal ud'],
		['vacation-errand-spot', 'Vacation spot', 'Errand spot', 'Feriested', 'Ærinde-sted'],
		['romantic-unromantic', 'Romantic place', 'Unromantic place', 'Romantisk sted', 'Uromantisk sted'],
		['good-bathroom-bad-bathroom', 'Good bathroom', 'Bad bathroom', 'Godt toilet', 'Dårligt toilet'],
		['worth-waiting-not-worth-waiting', 'Worth waiting in line for', 'Not worth waiting in line for', 'Værd at stå i kø for', 'Ikke værd at stå i kø for']
	],
	weird: [
		['little-cursed-deeply-cursed', 'A little cursed', 'Deeply cursed', 'Lidt forbandet', 'Dybt forbandet'],
		['goblin-royalty', 'Goblin energy', 'Royalty energy', 'Goblin-energi', 'Kongelig energi'],
		['human-robot', 'Human behavior', 'Robot behavior', 'Menneske-adfærd', 'Robot-adfærd'],
		['wizard-accountant', 'Wizard behavior', 'Accountant behavior', 'Troldmand-adfærd', 'Revisor-adfærd'],
		['normal-collection-concerning-collection', 'Normal collection', 'Concerning collection', 'Normal samling', 'Bekymrende samling'],
		['normal-pockets-too-many-pockets', 'Normal amount of pockets', 'Too many pockets', 'Normalt antal lommer', 'For mange lommer'],
		['tiny-animal-large-animal', 'Tiny animal energy', 'Large animal energy', 'Smådyr-energi', 'Stordyr-energi'],
		['scared-of-goose-goose-scared', 'Would be scared of a goose', 'A goose would be scared of them', 'Ville være bange for en gås', 'En gås ville være bange for dem'],
		['looks-edible-not-edible', 'Looks edible', 'Definitely not edible', 'Ser spiselig ud', 'Bestemt ikke spiselig'],
		['pet-name-villain-name', 'Could be a pet name', 'Could be a villain name', 'Kunne være kæledyrsnavn', 'Kunne være skurkenavn'],
		['normal-whisper-terrifying-whisper', 'Normal thing to whisper', 'Terrifying thing to whisper', 'Normalt at hviske', 'Skræmmende at hviske'],
		['not-suspicious-buy-very-suspicious-buy', 'Not suspicious to buy', 'Very suspicious to buy', 'Ikke mistænkeligt at købe', 'Meget mistænkeligt at købe'],
		['good-omen-bad-omen', 'Good omen', 'Bad omen', 'Godt varsel', 'Dårligt varsel'],
		['fairy-tale-crime-scene', 'Fairy tale object', 'Crime scene object', 'Eventyr-genstand', 'Gerningssted-genstand'],
		['magic-item-office-supply', 'Magic item', 'Office supply', 'Magisk genstand', 'Kontorartikel'],
		['haunted-doll-golden-retriever', 'Haunted doll energy', 'Golden retriever energy', 'Hjemsøgt dukke-energi', 'Golden retriever-energi'],
		['cryptid-influencer', 'Cryptid behavior', 'Influencer behavior', 'Cryptid-adfærd', 'Influencer-adfærd'],
		['normal-dream-nightmare', 'Normal dream', 'Nightmare', 'Normal drøm', 'Mareridt'],
		['cute-chaos-bad-chaos', 'Cute chaos', 'Bad chaos', 'Sødt kaos', 'Dårligt kaos'],
		['childrens-book-horror-movie', "Would survive in a children's book", 'Would survive in a horror movie', 'Overlever i børnebog', 'Overlever i gyserfilm']
	],
	debate: [
		['art-not-art', 'Art', 'Not art', 'Kunst', 'Ikke kunst'],
		['sport-not-sport', 'Sport', 'Not a sport', 'Sport', 'Ikke en sport'],
		['sandwich-not-sandwich', 'Sandwich', 'Not a sandwich', 'Sandwich', 'Ikke en sandwich'],
		['soup-not-soup', 'Soup', 'Not soup', 'Suppe', 'Ikke suppe'],
		['petty-justified', 'Petty', 'Justified', 'Smålig', 'Berettiget'],
		['ethical-unethical', 'Ethical', 'Unethical', 'Etisk', 'Uetisk'],
		['classy-trashy', 'Classy', 'Trashy', 'Stilfuld', 'Tarvelig'],
		['basic-sophisticated', 'Basic', 'Sophisticated', 'Basic', 'Sofistikeret'],
		['overdressed-underdressed', 'Overdressed', 'Underdressed', 'Overdressed', 'Underdressed'],
		['too-popular-not-popular-enough', 'Too popular', 'Not popular enough', 'For populær', 'Ikke populær nok'],
		['needs-rules-better-without', 'Needs rules', 'Better without rules', 'Skal have regler', 'Bedre uden regler'],
		['should-be-free-should-be-expensive', 'Should be free', 'Should be expensive', 'Skal være gratis', 'Skal være dyrt'],
		['public-good-private-luxury', 'Public good', 'Private luxury', 'Fællesgode', 'Privat luksus'],
		['real-holiday-fake-holiday', 'Real holiday', 'Fake holiday', 'Rigtig helligdag', 'Opdigtet helligdag'],
		['good-tradition-bad-tradition', 'Good tradition', 'Bad tradition', 'God tradition', 'Dårlig tradition'],
		['waste-of-time-time-well-spent', 'Waste of time', 'Time well spent', 'Spild af tid', 'Tid godt brugt'],
		['immature-fun-adult-fun', 'Immature fun', 'Adult fun', 'Umoden sjov', 'Voksen sjov'],
		['harmless-prank-cruel-prank', 'Harmless prank', 'Cruel prank', 'Uskyldig spøg', 'Grusom spøg'],
		['good-advice-terrible-advice', 'Good advice', 'Terrible advice', 'Godt råd', 'Forfærdeligt råd'],
		['too-niche-too-mainstream', 'Too niche', 'Too mainstream', 'For niche', 'For mainstream']
	],
	classic: [
		['hot-cold', 'Hot', 'Cold', 'Varm', 'Kold'],
		['fast-slow', 'Fast', 'Slow', 'Hurtig', 'Langsom'],
		['heavy-light', 'Heavy', 'Light', 'Tung', 'Let'],
		['loud-quiet', 'Loud', 'Quiet', 'Høj', 'Stille'],
		['rare-common', 'Rare', 'Common', 'Sjælden', 'Almindelig'],
		['old-fashioned-modern', 'Old-fashioned', 'Modern', 'Gammeldags', 'Moderne'],
		['natural-artificial', 'Natural', 'Artificial', 'Naturlig', 'Kunstig'],
		['messy-organized', 'Messy', 'Organized', 'Rodede', 'Organiseret'],
		['flexible-rigid', 'Flexible', 'Rigid', 'Fleksibel', 'Stiv'],
		['soft-hard', 'Soft', 'Hard', 'Blød', 'Hård'],
		['temporary-permanent', 'Temporary', 'Permanent', 'Midlertidig', 'Permanent'],
		['fragile-durable', 'Fragile', 'Durable', 'Skrøbelig', 'Holdbar'],
		['local-global', 'Local', 'Global', 'Lokal', 'Global'],
		['legal-illegal', 'Legal', 'Illegal', 'Legal', 'Ulovlig'],
		['public-private', 'Public', 'Private', 'Offentlig', 'Privat'],
		['formal-casual', 'Formal', 'Casual', 'Formel', 'Afslappet'],
		['luxurious-practical', 'Luxurious', 'Practical', 'Luksuriøs', 'Praktisk'],
		['ancient-futuristic', 'Ancient', 'Futuristic', 'Gammel', 'Futuristisk'],
		['familiar-alien', 'Familiar', 'Alien', 'Velkendt', 'Fremmed'],
		['safe-unsafe', 'Safe', 'Unsafe', 'Sikker', 'Usikker']
	]
};

const cards = [];
for (const [category, rows] of Object.entries(SOURCE)) {
	for (const [id, enL, enR, daL, daR] of rows) {
		cards.push({ id, category, enL, enR, daL, daR });
	}
}

const header = `/** Auto-generated by scripts/generate-insync-cards.mjs — do not edit by hand */\nimport type { InSyncCard } from './types';\n\nexport const INSYNC_CARDS: InSyncCard[] = [\n`;
const body = cards
	.map(
		(c) =>
			`\t{\n\t\tid: '${c.id}',\n\t\tcategory: '${c.category}',\n\t\tleft: { en: ${JSON.stringify(c.enL)}, da: ${JSON.stringify(c.daL)} },\n\t\tright: { en: ${JSON.stringify(c.enR)}, da: ${JSON.stringify(c.daR)} }\n\t}`
	)
	.join(',\n');
const footer = `\n];\n`;

writeFileSync(outPath, header + body + footer, 'utf8');
console.log(`Wrote ${cards.length} cards to ${outPath}`);
