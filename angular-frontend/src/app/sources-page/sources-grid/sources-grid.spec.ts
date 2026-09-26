import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SourcesGrid } from './sources-grid';
import { SourceCard } from './source-card/source-card';
import { SourcesService } from '../sources-service';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { Source } from '../source-model';
import { SourcesServiceStub, StringsServiceStub, } from '@testutils/stubs';

const mockSources: Source[] = [
  { id: 1, name: 'Source One', url: 'https://one.example.com', description: 'First source' },
  { id: 2, name: 'Source Two', url: 'https://two.example.com', description: 'Second source' },
];

describe('SourcesGrid', () => {
  let component: SourcesGrid;
  let fixture: ComponentFixture<SourcesGrid>;
  let sourcesServiceStub: SourcesServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesGrid],
      providers: [
        { provide: SourcesService, useClass: SourcesServiceStub },
        { provide: StringsService, useClass: StringsServiceStub },
      ],
    }).compileComponents();

    sourcesServiceStub = TestBed.inject(SourcesService) as unknown as SourcesServiceStub;
    sourcesServiceStub.getSources.mockReturnValue(of(mockSources));

    fixture = TestBed.createComponent(SourcesGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one source-card per source', () => {
    const cards = fixture.debugElement.queryAll(By.directive(SourceCard));
    expect(cards.length).toBe(mockSources.length);
  });
});