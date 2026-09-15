import { Component } from '@angular/core';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';

@Component({
  imports: [GetStringsPipe],
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.html',
})
export class SuggestionForm {}
