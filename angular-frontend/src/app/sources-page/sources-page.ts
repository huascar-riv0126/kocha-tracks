import { Component } from '@angular/core';
import { SourcesGrid } from './sources-grid/sources-grid';
import { SourcesHero } from './sources-hero/sources-hero';
import { SourcesDataFlow } from './sources-data-flow/sources-data-flow';
import { SourcesSuggestions } from './sources-suggestions/sources-suggestions';

@Component({
  imports: [SourcesHero, SourcesGrid, SourcesDataFlow, SourcesSuggestions],
  selector: 'app-sources-page',
  templateUrl: './sources-page.html',
})
export class SourcesPage {}
