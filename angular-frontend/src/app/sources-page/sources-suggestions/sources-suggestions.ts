import { Component } from '@angular/core';
import { SuggestionForm } from './suggestion-form/suggestion-form';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [SuggestionForm, GetStringsPipe],
  selector: 'app-sources-suggestions',
  templateUrl: './sources-suggestions.html',
})
export class SourcesSuggestions {}
