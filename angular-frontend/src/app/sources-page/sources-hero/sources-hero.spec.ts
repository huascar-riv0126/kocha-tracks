import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourcesHero } from './sources-hero';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('SourcesHero', () => {
  let component: SourcesHero;
  let fixture: ComponentFixture<SourcesHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesHero],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the KEY for title text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('sources.hero.title');
  });
});
