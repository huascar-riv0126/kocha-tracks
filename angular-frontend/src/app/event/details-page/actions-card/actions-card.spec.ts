import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsCard } from './actions-card';

describe('ActionsCard', () => {
  let component: ActionsCard;
  let fixture: ComponentFixture<ActionsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
