import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { SourceCard } from './source-card/source-card';
import { SourcesService } from '../sources-service';

@Component({
  selector: 'app-sources-grid',
  standalone: true,
  imports: [AsyncPipe, SourceCard],
  templateUrl: './sources-grid.html',
})
export class SourcesGrid {
  private readonly sourcesService = inject(SourcesService);

  readonly sources$ = this.sourcesService.getSources();
}