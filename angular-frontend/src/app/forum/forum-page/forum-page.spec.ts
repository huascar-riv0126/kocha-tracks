import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumPage } from './forum-page';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('ForumPage', () => {
  let fixture: ComponentFixture<ForumPage>;
  let component: ForumPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumPage],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // — Estructura general ——————————————————————————————————————————

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar', () => {
    const sidebar = fixture.nativeElement.querySelector('[data-testid="sidebar"]') as HTMLElement;
    expect(sidebar).toBeTruthy();
  });

  it('should render the detail panel', () => {
    const panel = fixture.nativeElement.querySelector('[data-testid="detail-panel"]') as HTMLElement;
    expect(panel).toBeTruthy();
  });

  it('should render the page title', () => {
    const title = fixture.nativeElement.querySelector('[data-testid="page-title"]') as HTMLElement;
    expect(title).toBeTruthy();
  });

  // — Lista de conversaciones ————————————————————————————————————

  it('should render all mock conversations in the sidebar', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="conversation-item"]');
    expect(items.length).toBe(3);
  });

  it('should select a conversation when clicking an item', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="conversation-item"]') as NodeListOf<HTMLElement>;
    items[1].click();
    fixture.detectChanges();
    expect(component.selectedConversation().id).toBe(2);
  });

  // — Búsqueda ————————————————————————————————————————————————————

  it('should render the search input', () => {
    const input = fixture.nativeElement.querySelector('[data-testid="search-input"]') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('should filter conversations based on search query', () => {
    component.searchQuery.set('Norte');
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('[data-testid="conversation-item"]');
    expect(items.length).toBe(1);
  });

  it('should show empty state when no conversations match the search', () => {
    component.searchQuery.set('xyz_no_match_ever');
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('[data-testid="empty-list"]') as HTMLElement;
    expect(empty).toBeTruthy();
  });

  // — Panel de detalle —————————————————————————————————————————

  it('should render the detail header with selected conversation title', () => {
    const title = fixture.nativeElement.querySelector('[data-testid="detail-title"]') as HTMLElement;
    expect(title.textContent?.trim()).toBe(component.selectedConversation().title);
  });

  it('should render the messages section', () => {
    const section = fixture.nativeElement.querySelector('[data-testid="messages-section"]') as HTMLElement;
    expect(section).toBeTruthy();
  });

  it('should render all mock messages', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="message-item"]');
    expect(items.length).toBe(3);
  });

  // — Área de comentario ——————————————————————————————————————————

  it('should render the comment textarea', () => {
    const textarea = fixture.nativeElement.querySelector('[data-testid="comment-textarea"]') as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
  });

  it('should render the submit button disabled', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="comment-submit"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('should update newComment signal on textarea input', () => {
    const textarea = fixture.nativeElement.querySelector('[data-testid="comment-textarea"]') as HTMLTextAreaElement;
    textarea.value = 'Mi comentario de prueba';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.newComment()).toBe('Mi comentario de prueba');
  });
});
