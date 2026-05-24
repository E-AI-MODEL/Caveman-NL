#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = 'E-AI-MODEL/caveman-NL';
const ROOT = path.resolve(__dirname, '..');
const SKILL_SOURCE = path.join(ROOT, 'SKILL.md');
const DEFAULT_HOME = path.join(os.homedir(), '.caveman-nl');
const DEFAULT_SKILL_DIR = path.join(DEFAULT_HOME, 'skills', 'caveman-nl');
const AGENTS_FILE = path.join(process.cwd(), 'AGENTS.md');
const BEGIN = '<!-- caveman-nl-begin -->';
const END = '<!-- caveman-nl-end -->';

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    uninstall: false,
    withInit: false,
    skillDir: DEFAULT_SKILL_DIR,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--uninstall' || a === '-u') opts.uninstall = true;
    else if (a === '--with-init') opts.withInit = true;
    else if (a === '--skill-dir') {
      const v = argv[++i];
      if (!v) die('--skill-dir heeft pad nodig');
      opts.skillDir = expandHome(v);
    } else if (a === '--help' || a === '-h') opts.help = true;
    else die(`Onbekende optie: ${a}`);
  }
  return opts;
}

function expandHome(p) {
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return path.resolve(p);
}

function die(msg) {
  console.error(`caveman-nl: ${msg}`);
  process.exit(2);
}

function log(opts, msg) {
  console.log(opts.dryRun ? `[dry-run] ${msg}` : msg);
}

function writeFile(opts, file, content, mode) {
  log(opts, `write ${file}`);
  if (opts.dryRun) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  if (mode) fs.chmodSync(file, mode);
}

function removeFile(opts, file) {
  log(opts, `remove ${file}`);
  if (opts.dryRun) return;
  try { fs.unlinkSync(file); } catch (_) {}
}

function removeDirIfEmpty(opts, dir) {
  if (opts.dryRun) return;
  try { fs.rmdirSync(dir); } catch (_) {}
}

function readSkill() {
  return fs.readFileSync(SKILL_SOURCE, 'utf8');
}

function installSkill(opts) {
  const skillTarget = path.join(opts.skillDir, 'SKILL.md');
  writeFile(opts, skillTarget, readSkill());
  console.log(`Skill geïnstalleerd: ${skillTarget}`);
}

function initAgentsBlock(opts) {
  const block = `${BEGIN}\nGebruik caveman-NL voor korte Nederlandstalige antwoorden wanneer gebruiker /caveman gebruikt, "holenman aan" zegt, of expliciet minder woorden wil.\n\nLaad regels uit: ${path.join(opts.skillDir, 'SKILL.md')}\n\nKernregels: korte zinnen, geen vulling, technische termen exact, code/URLs/paden ongewijzigd, veiligheid en duidelijke volgorde boven compressie.\n${END}\n`;
  let current = '';
  if (fs.existsSync(AGENTS_FILE)) current = fs.readFileSync(AGENTS_FILE, 'utf8');
  const re = new RegExp(`${BEGIN}[\\s\\S]*?${END}\\n?`, 'm');
  const next = re.test(current) ? current.replace(re, block) : `${current}${current && !current.endsWith('\n') ? '\n' : ''}\n${block}`;
  writeFile(opts, AGENTS_FILE, next);
  console.log(`Repo-instructie bijgewerkt: ${AGENTS_FILE}`);
}

function uninstall(opts) {
  removeFile(opts, path.join(opts.skillDir, 'SKILL.md'));
  if (!opts.dryRun) {
    removeDirIfEmpty(opts, opts.skillDir);
    removeDirIfEmpty(opts, path.dirname(opts.skillDir));
  }
  if (fs.existsSync(AGENTS_FILE) || opts.dryRun) {
    let current = fs.existsSync(AGENTS_FILE) ? fs.readFileSync(AGENTS_FILE, 'utf8') : '';
    const re = new RegExp(`\\n?${BEGIN}[\\s\\S]*?${END}\\n?`, 'm');
    const next = current.replace(re, '\n').replace(/\n{3,}/g, '\n\n');
    writeFile(opts, AGENTS_FILE, next);
  }
  console.log('caveman-NL verwijderd.');
}

function help() {
  console.log(`caveman-NL installer\n\nGebruik:\n  caveman-nl [--with-init] [--dry-run]\n  caveman-nl --uninstall\n\nOpties:\n  --with-init        Voeg AGENTS.md blok toe aan huidige repo\n  --skill-dir <pad>  Installeer SKILL.md in eigen pad\n  --dry-run          Toon acties, schrijf niets\n  --uninstall        Verwijder skill en AGENTS.md blok\n\nVoor npx:\n  npx -y github:${REPO} -- --with-init`);
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help) help();
else if (opts.uninstall) uninstall(opts);
else {
  installSkill(opts);
  if (opts.withInit) initAgentsBlock(opts);
  console.log('Klaar. Activeer in je agent met /caveman of "holenman aan".');
}
