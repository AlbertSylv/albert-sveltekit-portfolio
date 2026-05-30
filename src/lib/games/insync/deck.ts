import { INSYNC_CARDS } from './cards';
import type { InSyncCard } from './types';

export function shuffleDeck<T>(items: T[]): T[] {
	const out = [...items];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

export type DeckState = {
	drawPile: InSyncCard[];
	discard: InSyncCard[];
};

export function createDeck(): DeckState {
	return {
		drawPile: shuffleDeck(INSYNC_CARDS),
		discard: []
	};
}

export function drawCard(deck: DeckState): { deck: DeckState; card: InSyncCard | null } {
	let { drawPile, discard } = deck;
	if (drawPile.length === 0) {
		if (discard.length === 0) return { deck, card: null };
		drawPile = shuffleDeck(discard);
		discard = [];
	}
	const [card, ...rest] = drawPile;
	return {
		deck: { drawPile: rest, discard },
		card: card ?? null
	};
}

export function cardById(id: string): InSyncCard | undefined {
	return INSYNC_CARDS.find((c) => c.id === id);
}
