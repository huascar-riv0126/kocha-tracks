import type { StringsLoader } from '../strings-token';

const STRINGS_FILE_PATH = 'strings/es.json';
const BROWSER_DIST_DIR = 'dist/angular-frontend/browser';

let cachedStrings: Record<string, string> | null = null;

async function readStringsFromDisk(): Promise<Record<string, string>> {
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');

  const filePath = join(process.cwd(), BROWSER_DIST_DIR, STRINGS_FILE_PATH);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export const serverStringsLoader: StringsLoader = async () => {
  if (cachedStrings) {
    return cachedStrings;
  }

  try {
    cachedStrings = await readStringsFromDisk();
    return cachedStrings;
  } catch (error) {
    // Expected during route extraction at build time, when dist/ doesn't exist yet.
    console.warn('[StringsService] Could not read strings file from disk.', error);
    return {};
  }
};
