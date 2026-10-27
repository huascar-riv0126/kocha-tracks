import { Injectable, inject, signal, TransferState, makeStateKey, Injector, DestroyRef } from '@angular/core';
import { STRINGS_LOADER } from '../strings-token';
import { TranslocoService, TRANSLOCO_TRANSPILER } from '@jsverse/transloco';

const STRINGS_STATE_KEY = makeStateKey<Record<string, string>>('strings');

@Injectable({ providedIn: 'root' })
export class StringsService {
  private readonly loader = inject(STRINGS_LOADER, { optional: true });
  private readonly transferState = inject(TransferState);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef, { optional: true });

  private readonly _strings = signal<Record<string, string>>({});
  readonly strings = this._strings.asReadonly();

  private _transloco: TranslocoService | null = null;

  constructor() {
    this.initTranslocoBridge();
  }

  private initTranslocoBridge(): void {
    const transpiler = this.injector.get(TRANSLOCO_TRANSPILER, null, { optional: true });
    if (transpiler) {
      this._transloco = this.injector.get(TranslocoService, null, { optional: true });
      if (this._transloco) {
        const initialLang = this._transloco.getActiveLang();
        if (initialLang) {
          const trans = this._transloco.getTranslation(initialLang);
          if (trans && Object.keys(trans).length > 0) {
            this._strings.set(trans as Record<string, string>);
          }
        }

        const sub = this._transloco.langChanges$.subscribe((lang) => {
          const trans = this._transloco!.getTranslation(lang);
          if (trans && Object.keys(trans).length > 0) {
            this._strings.set(trans as Record<string, string>);
          }
        });
        if (this.destroyRef) {
          this.destroyRef.onDestroy(() => sub.unsubscribe());
        }
      }
    }
  }

  async load(): Promise<void> {
    if (this.transferState.hasKey(STRINGS_STATE_KEY)) {
      this._strings.set(this.transferState.get(STRINGS_STATE_KEY, {}));
      return;
    }

    if (this.loader) {
      const data = await this.loader();
      this._strings.set(data);
      this.transferState.set(STRINGS_STATE_KEY, data);
    }
  }

  get(key: string): string {
    const current = this._strings();
    if (current[key]) {
      return current[key];
    }

    if (this._transloco) {
      const lang = this._transloco.getActiveLang();
      const trans = this._transloco.getTranslation(lang);
      if (trans && trans[key]) {
        return trans[key] as string;
      }
    }

    return key;
  }
}
