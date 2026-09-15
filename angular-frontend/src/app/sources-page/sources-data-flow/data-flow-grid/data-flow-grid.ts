import { Component } from '@angular/core';
import { DataFlowCard } from './data-flow-card/data-flow-card';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';

@Component({
  imports: [DataFlowCard, GetStringsPipe],
  selector: 'app-data-flow-grid',
  templateUrl: './data-flow-grid.html',
})
export class DataFlowGrid {
  protected readonly flowSteps = [
    {
      number: '1',
      title: 'sources.dataflow.flow.step1.title',
      description: 'sources.dataflow.flow.step1.desc'
    },
    {
      number: '2',
      title: 'sources.dataflow.flow.step2.title',
      description: 'sources.dataflow.flow.step2.desc'
    },
    {
      number: '3',
      title: 'sources.dataflow.flow.step3.title',
      description: 'sources.dataflow.flow.step3.desc'
    }
  ];
}
