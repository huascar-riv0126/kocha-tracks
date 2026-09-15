import { Component } from '@angular/core';
import { DataFlowGrid } from './data-flow-grid/data-flow-grid';

@Component({
  imports: [DataFlowGrid],
  selector: 'app-sources-data-flow',
  templateUrl: './sources-data-flow.html',
})
export class SourcesDataFlow {}
