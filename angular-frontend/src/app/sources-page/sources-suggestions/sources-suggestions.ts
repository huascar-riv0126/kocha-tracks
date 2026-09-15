import { Component } from '@angular/core';
import { SuggestionForm } from './suggestion-form/suggestion-form';

@Component({
  imports: [SuggestionForm],
  selector: 'app-sources-suggestions',
  templateUrl: './sources-suggestions.html',
})
export class SourcesSuggestions {}
