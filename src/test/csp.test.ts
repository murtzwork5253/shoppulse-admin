/// <reference types="node" />
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Tests run from the project root. (A file URL doesn't work here: jsdom replaces the global URL.)
const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

// netlify.toml allows the inline theme script in index.html by hash. If the script is edited
// without updating the hash, the browser blocks it in production (dark mode would flash white).
describe('Content-Security-Policy', () => {
  it('allows exactly the inline script in index.html', () => {
    const scripts = [...read('index.html').matchAll(/<script>([\s\S]*?)<\/script>/g)];
    expect(scripts).toHaveLength(1);

    const hash = `sha256-${createHash('sha256').update(scripts[0][1]).digest('base64')}`;
    expect(read('netlify.toml')).toContain(`'${hash}'`);
  });

  it('does not allow unsafe inline or eval scripts', () => {
    const csp = read('netlify.toml').match(/script-src ([^;]*);/)?.[1] ?? '';
    expect(csp).toContain('sha256-');
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).not.toContain('unsafe-eval');
  });
});
