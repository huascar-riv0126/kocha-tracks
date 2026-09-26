import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { SourcesDataFlow } from './sources-data-flow';
import { DataFlowGrid } from './data-flow-grid/data-flow-grid';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('SourcesDataFlow', () => {
  let component: SourcesDataFlow;
  let fixture: ComponentFixture<SourcesDataFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesDataFlow],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesDataFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the KEY for title text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('sources.dataflow.title');
  });

  it('should render the app-data-flow-grid component', () => {
    const grid = fixture.debugElement.query(By.directive(DataFlowGrid));
    expect(grid).toBeTruthy();
  });
});