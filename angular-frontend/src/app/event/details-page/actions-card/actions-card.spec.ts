import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActionsCard } from './actions-card';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { Button } from '../../../shared/button/button';

describe('ActionsCard', () => {
  let component: ActionsCard;
  let fixture: ComponentFixture<ActionsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCard],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render this card title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('strong')?.textContent?.trim()).toBe('action.card.title');
  });

  it('should render 3 <app-button> components', () => {
    const buttons = fixture.debugElement.queryAll(By.directive(Button));
    expect(buttons.length).toBe(3);
  });
});
