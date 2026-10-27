import { inject, Injectable, Injector } from '@angular/core';
import { TranslocoMissingHandler, TranslocoMissingHandlerData } from '@jsverse/transloco';
import { StringsService } from './strings-service/strings-service';

@Injectable({ providedIn: 'root' })
export class StringsFallbackMissingHandler implements TranslocoMissingHandler {
  private readonly injector = inject(Injector);

  handle(key: string, _data: TranslocoMissingHandlerData): string {
    const stringsService = this.injector.get(StringsService, null, { optional: true });
    if (stringsService) {
      const fallback = stringsService.strings()[key];
      if (fallback) {
        return fallback;
      }
    }
    return key;
  }
}
