import { Component } from '@angular/core';
import { DataFlowGrid } from './data-flow-grid/data-flow-grid';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [DataFlowGrid, GetStringsPipe],
  selector: 'app-sources-data-flow',
  templateUrl: './sources-data-flow.html',
})
export class SourcesDataFlow {}
