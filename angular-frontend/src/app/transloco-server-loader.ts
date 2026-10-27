import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoServerLoader implements TranslocoLoader {
  async getTranslation(lang: string): Promise<Translation> {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');

    try {
      // In production runtime, check browser dist directory
      const distPath = join(process.cwd(), 'dist/angular-frontend/browser/i18n', `${lang}.json`);
      const raw = await readFile(distPath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      // During build / prerender, read from public folder
      try {
        const publicPath = join(process.cwd(), 'public/i18n', `${lang}.json`);
        const raw = await readFile(publicPath, 'utf-8');
        return JSON.parse(raw);
      } catch (error) {
        console.warn(`[TranslocoServerLoader] Could not read ${lang}.json from disk.`, error);
        return {};
      }
    }
  }
}
