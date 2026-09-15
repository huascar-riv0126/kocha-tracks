import { inject, Pipe, PipeTransform } from '@angular/core';
import { StringsService } from './strings-service/strings-service';

@Pipe({
  name: 'getStrings',
})
export class GetStringsPipe implements PipeTransform {
  private readonly stringsService = inject(StringsService);

  transform(key: string): string {
    return this.stringsService.get(key);
  }
}
