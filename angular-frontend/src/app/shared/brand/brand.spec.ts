import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandComponent } from './brand';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

// Mock del pipe para aislar la prueba de las traducciones reales
@Pipe({ name: 'getStrings', standalone: true })
class MockGetStringsPipe implements PipeTransform {
  transform(value: string): string { return 'Kocha Tracks'; }
}

describe('BrandComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;

beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} } 
      ]
    })
    .overrideComponent(BrandComponent, {
      remove: { imports: [GetStringsPipe] },
      add: { imports: [MockGetStringsPipe] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
   
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería aplicar clases de texto oscuro cuando la variante es "light"', () => {
    component.variant = 'light';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('span');
    expect(textElement.classList).toContain('text-[var(--color-txt-primary)]');
  });

  it('debería aplicar clases de texto blanco cuando la variante es "dark"', () => {
    component.variant = 'dark';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('span');
    expect(textElement.classList).toContain('text-[var(--color-on-dark)]');
  });

  it('no debería mostrar el texto cuando la variante es "logo-only"', () => {
    component.variant = 'logo-only';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('span');
    expect(textElement).toBeNull();
  });

  it('debería renderizarse como un enlace <a> cuando isClickable es true', () => {
    component.isClickable = true;
    fixture.detectChanges();
    const linkElement = fixture.nativeElement.querySelector('a');
    expect(linkElement).toBeTruthy();
  });

  it('debería renderizarse como un <div> estático cuando isClickable es false', () => {
    component.isClickable = false;
    fixture.detectChanges();
    const divElement = fixture.nativeElement.querySelector('div.pointer-events-none');
    expect(divElement).toBeTruthy();
  });
});