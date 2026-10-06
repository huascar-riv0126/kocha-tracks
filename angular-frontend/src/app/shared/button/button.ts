import { Component, input, output, computed } from '@angular/core';

export type ButtonVariant = 'outline';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  outline:
    '[--btn-bg:transparent] ' +
    '[--btn-text:var(--color-txt-secondary)] ' +
    '[--btn-border:var(--color-border-default)] ' +
    '[--btn-hover-bg:var(--color-interactive-primary-hover)] ' +
    '[--btn-hover-text:var(--color-on-dark)] ' +
    '[--btn-hover-border:var(--color-interactive-primary-hover)]',
};

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
})
export class Button {
  label = input<string | null>(null);
  icon = input<string | null>(null);
  ariaLabel = input<string | null>(null);

  variant = input<ButtonVariant>('outline');
  disabled = input(false);
  fullWidth = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  bg = input<string | null>(null);
  text = input<string | null>(null);
  border = input<string | null>(null);
  hoverBg = input<string | null>(null);
  hoverText = input<string | null>(null);
  hoverBorder = input<string | null>(null);

  btnClick = output<MouseEvent>();

  readonly iconOnly = computed(() => !!this.icon() && !this.label());

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md border ' +
      'font-outfit font-bold text-sm/4.5 transition-colors duration-200 cursor-pointer ' +
      'disabled:opacity-50 disabled:cursor-not-allowed ' +
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-primary ' +
      'bg-(--btn-bg) text-(color:--btn-text) border-(color:--btn-border) ' +
      'enabled:hover:bg-(--btn-hover-bg) enabled:hover:text-(color:--btn-hover-text) ' +
      'enabled:hover:border-(color:--btn-hover-border)';

    const size = this.iconOnly()
      ? 'size-10'
      : `p-3 ${this.fullWidth() ? 'w-full' : 'w-auto'}`;

    return `${base} ${size} ${VARIANT_CLASSES[this.variant()]}`;
  });

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.btnClick.emit(event);
    }
  }
}
