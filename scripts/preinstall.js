/**
 * Preinstall guard to enforce pnpm usage across the monorepo.
 * Fails fast if installation is attempted via npm or yarn.
 *
 * Allowed: pnpm
 * Blocked: npm, yarn, bun
 */
const isCI = process.env.CI === 'true' || process.env.CI === '1';

// Detect invoking package manager via environment variables commonly set by each PM.
const userAgent = process.env.npm_config_user_agent || '';
const execPath = process.env.npm_execpath || '';
const pmFromUA = (() => {
  if (userAgent.includes('pnpm')) return 'pnpm';
  if (userAgent.includes('yarn')) return 'yarn';
  if (userAgent.includes('npm')) return 'npm';
  if (userAgent.includes('bun')) return 'bun';
  return '';
})();

const pmFromExec = (() => {
  const p = execPath.toLowerCase();
  if (p.includes('pnpm')) return 'pnpm';
  if (p.includes('yarn')) return 'yarn';
  if (p.includes('npm')) return 'npm';
  if (p.includes('bun')) return 'bun';
  return '';
})();

const detectedPM = pmFromUA || pmFromExec;

// In CI environments, we still enforce pnpm but provide clearer error guidance.
function fail(msg) {
  const guidance = `
This repository is configured to use pnpm exclusively.

Use the following commands instead:
  pnpm -w install
  pnpm -r build
  pnpm -r dev

If you haven't installed pnpm:
  corepack enable
  corepack prepare pnpm@9.12.3 --activate
  or: npm i -g pnpm@9

Detected: ${detectedPM || 'unknown'}
`;
  console.error(`\n[PREINSTALL GUARD] ${msg}\n${guidance}`);
  process.exit(1);
}

if (detectedPM && detectedPM !== 'pnpm') {
  fail(`Blocked installation via ${detectedPM}. Please use pnpm.`);
}

// Extra hardening: if userAgent is empty (rare) on local usage via other PMs, try to infer from lifecycle
// If no PM detected but npm_lifecycle_event exists during "preinstall" and npm_config_user_agent is missing,
// assume npm and block to be safe. In CI with proper pnpm setup, pnpm still sets user agent.
if (!detectedPM && process.env.npm_lifecycle_event === 'preinstall') {
  // Allow if running via pnpm because pnpm sets userAgent; otherwise block.
  fail('Unknown package manager detected during install. Only pnpm is allowed.');
}

// If we reached here, allow install to proceed.