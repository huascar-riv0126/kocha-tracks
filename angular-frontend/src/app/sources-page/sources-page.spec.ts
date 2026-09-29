import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SourcesPage } from './sources-page';
import { SourcesHero } from './sources-hero/sources-hero';
import { SourcesGrid } from './sources-grid/sources-grid';
import { SourcesDataFlow } from './sources-data-flow/sources-data-flow';
import { SourcesSuggestions } from './sources-suggestions/sources-suggestions';
import { StringsService } from '../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('SourcesPage', () => {
  let component: SourcesPage;
  let fixture: ComponentFixture<SourcesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesPage],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app-sources-hero component', () => {
    const formSection = fixture.debugElement.query(By.directive(SourcesHero));
    expect(formSection).toBeTruthy();
  });

  it('should render the app-sources-grid component', () => {
    const formSection = fixture.debugElement.query(By.directive(SourcesGrid));
    expect(formSection).toBeTruthy();
  });

  it('should render the app-sources-data-flow component', () => {
    const formSection = fixture.debugElement.query(By.directive(SourcesDataFlow));
    expect(formSection).toBeTruthy();
  });

  it('should render the app-sources-suggestions component', () => {
    const formSection = fixture.debugElement.query(By.directive(SourcesSuggestions));
    expect(formSection).toBeTruthy();
  });
});
