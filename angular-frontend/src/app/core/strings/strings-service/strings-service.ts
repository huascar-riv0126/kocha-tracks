import { Injectable, inject, signal, TransferState, makeStateKey } from '@angular/core';
import { STRINGS_LOADER } from '../strings-token';

const STRINGS_STATE_KEY = makeStateKey<Record<string, string>>('strings');

@Injectable({ providedIn: 'root' })
export class StringsService {
  private readonly loader = inject(STRINGS_LOADER);
  private readonly transferState = inject(TransferState);

  private readonly _strings = signal<Record<string, string>>({});
  readonly strings = this._strings.asReadonly();

  async load(): Promise<void> {
    if (this.transferState.hasKey(STRINGS_STATE_KEY)) {
      this._strings.set(this.transferState.get(STRINGS_STATE_KEY, {}));
      return;
    }

    const data = await this.loader();
    this._strings.set(data);
    this.transferState.set(STRINGS_STATE_KEY, data);
  }

  get(key: string): string {
    return this._strings()[key] ?? key;
  }
}
