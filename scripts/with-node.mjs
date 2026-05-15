/**
 * Re-run argv with a Node binary that satisfies MIN_MAJOR (20+).
 * Avoids npm/.cmd resolution picking an older Node on some Windows setups.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const MIN_MAJOR = 20;

function majorFrom(v) {
	const m = /^v(\d+)/.exec(String(v ?? '').trim());
	return m ? Number(m[1]) : 0;
}

function majorFor(nodePath) {
	const r = spawnSync(nodePath, ['-e', 'process.stdout.write(process.version)'], {
		encoding: 'utf8'
	});
	if (r.error || r.status !== 0) return 0;
	return majorFrom(r.stdout);
}

function orderedCandidates() {
	const list = [];

	const push = (p) => {
		if (p && !list.includes(p)) list.push(p);
	};

	push(process.execPath);

	if (process.platform === 'win32') {
		const pf = process.env.ProgramFiles;
		const pfx86 = process.env['ProgramFiles(x86)'];
		if (pf) push(path.join(pf, 'nodejs', 'node.exe'));
		if (pfx86) push(path.join(pfx86, 'nodejs', 'node.exe'));
		const symlink = process.env.NVM_SYMLINK;
		if (symlink) push(path.join(symlink, 'node.exe'));
	}

	push('node');

	return list;
}

function pickNode() {
	for (const p of orderedCandidates()) {
		if (p !== 'node' && !fs.existsSync(p)) continue;
		if (majorFor(p) >= MIN_MAJOR) return p;
	}

	return process.execPath;
}

const rest = process.argv.slice(2);
if (rest.length === 0) {
	console.error('usage: node scripts/with-node.mjs <script.js> [...args]');
	process.exit(1);
}

const child = spawnSync(pickNode(), rest, { stdio: 'inherit' });
process.exit(child.status ?? 1);
