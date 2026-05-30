/**
 * Generates static/Albert-Sylvester-CV.pdf from portfolio copy.
 * Run: node scripts/generate-cv.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const root = path.join(fileURLToPath(new URL('.', import.meta.url)), '..');
const out = path.join(root, 'static', 'Albert-Sylvester-CV.pdf');

const MARGIN = 54;
const PAGE_W = 595.28;
const CONTENT_W = PAGE_W - MARGIN * 2;
const INK = '#1a1a18';
const MUTED = '#5c5c58';
const RULE = '#d4d4d0';

function sectionTitle(doc, text) {
	doc.moveDown(0.6);
	doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED).text(text.toUpperCase(), {
		characterSpacing: 0.8
	});
	doc.moveDown(0.15);
	doc
		.moveTo(MARGIN, doc.y)
		.lineTo(MARGIN + CONTENT_W, doc.y)
		.strokeColor(RULE)
		.lineWidth(0.5)
		.stroke();
	doc.moveDown(0.45);
	doc.fillColor(INK);
}

function role(doc, { title, meta, bullets }) {
	doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(title);
	if (meta) {
		doc.font('Helvetica').fontSize(10).fillColor(MUTED).text(meta);
	}
	doc.moveDown(0.2);
	for (const line of bullets) {
		doc.font('Helvetica').fontSize(9.75).fillColor(INK).text(`•  ${line}`, {
			width: CONTENT_W,
			lineGap: 2
		});
	}
	doc.moveDown(0.45);
}

const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
const stream = fs.createWriteStream(out);
doc.pipe(stream);

doc.font('Helvetica-Bold').fontSize(22).fillColor(INK).text('Albert Sylvester');
doc.moveDown(0.15);
doc.font('Helvetica').fontSize(11).fillColor(MUTED).text('Concept & front-end developer · Copenhagen');
doc.moveDown(0.35);
doc
	.font('Helvetica')
	.fontSize(9.5)
	.fillColor(INK)
	.text('albertsylvester@outlook.dk  ·  linkedin.com/in/albert-sylvester-l  ·  www.albertsylvester.dk');

sectionTitle(doc, 'Profile');
doc
	.font('Helvetica')
	.fontSize(9.75)
	.fillColor(INK)
	.text(
		'Front-end developer who works across user research, product and code. I build production software in TypeScript and React, talk to users regularly, and help teams decide what to build next. Most of my recent work is SharePoint / Microsoft 365 product development and custom React web parts for enterprise clients.',
		{ width: CONTENT_W, lineGap: 2 }
	);

sectionTitle(doc, 'Experience');

role(doc, {
	title: 'CPH Cloud Company',
	meta: 'Concept & front-end developer · 2023–present',
	bullets: [
		'Custom React web parts and SharePoint consulting for clients including Novo Nordisk, AO Johansen and Xellia.',
		'Built and maintained internal SharePoint web parts for Novo Nordisk Global Medical Affairs, including a therapy-area navigation matrix editable by non-developers.',
		'Broader Microsoft 365 and Azure work: tenant administration, permissions, and practical work outside the codebase.'
	]
});

role(doc, {
	title: 'BMF Systems',
	meta: 'Product developer · SharePoint / M365',
	bullets: [
		'Sole developer on a modular ISO management system installed in customers’ own SharePoint tenants.',
		'Owned incident handling, risk assessment, supplier evaluation, document workflows, and related product modules.',
		'Worked as product developer and support: customer feedback, prioritisation with stakeholders, and implementation.'
	]
});

role(doc, {
	title: 'FaunaPhotonics',
	meta: 'Software developer · 2021–2023',
	bullets: [
		'Frontend developer on the customer data portal; maintained and extended the IoT/data-facing product surface.',
		'Bachelor thesis (2023): user interviews and end-to-end Figma prototype for the insect data portal rebuild.'
	]
});

sectionTitle(doc, 'Education');
doc.font('Helvetica-Bold').fontSize(10).text('KEA · Digital Concept Development (Bachelor)');
doc.font('Helvetica').fontSize(9.75).fillColor(MUTED).text('2021–2023');
doc.moveDown(0.25);
doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text('Copenhagen Business Academy · Computer Science');
doc.font('Helvetica').fontSize(9.75).fillColor(MUTED).text('2018–2021');

sectionTitle(doc, 'Skills');
doc
	.font('Helvetica')
	.fontSize(9.75)
	.fillColor(INK)
	.text(
		'TypeScript · JavaScript · React · SharePoint Framework (SPFx) · Microsoft 365 · Azure · SQL · Figma · user interviews · product discovery',
		{ width: CONTENT_W, lineGap: 2 }
	);

sectionTitle(doc, 'Languages');
doc.font('Helvetica').fontSize(9.75).text('English and Danish — spoken and written');

doc.end();

await new Promise((resolve, reject) => {
	stream.on('finish', resolve);
	stream.on('error', reject);
});

console.log(`Wrote ${out} (${fs.statSync(out).size} bytes)`);
