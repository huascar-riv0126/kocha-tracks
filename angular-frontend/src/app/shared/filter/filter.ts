import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

export interface FilterOption {
  /** Texto original recibido (es lo que se emite). */
  value: string;
  /** Texto mostrado, con la primera letra en mayúscula. */
  label: string;
}

@Component({
  selector: 'app-filter',
  imports: [GetStringsPipe],
  templateUrl: './filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filter {
  private readonly stringsService = inject(StringsService);

  /** Lista de palabras a mostrar como filtros. "Todos" se antepone automáticamente. */
  readonly filters = input.required<string[]>();

  /** Emite el contenido del filtro seleccionado ("Todos" para el chip inicial). */
  readonly filterChange = output<string>();

  /** null = chip "Todos". */
  protected readonly selected = signal<string | null>(null);

  protected readonly options = computed<FilterOption[]>(() =>
    this.filters().map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    })),
  );

  protected select(value: string | null): void {
    this.selected.set(value);
    this.filterChange.emit(value ?? this.stringsService.get('filter.all'));
  }
}
