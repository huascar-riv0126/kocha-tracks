import { Component } from '@angular/core';
import { Button } from '../../../shared/button/button';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';

@Component({
  imports: [Button, GetStringsPipe],
  selector: 'app-actions-card',
  templateUrl: './actions-card.html',
})
export class ActionsCard {}
