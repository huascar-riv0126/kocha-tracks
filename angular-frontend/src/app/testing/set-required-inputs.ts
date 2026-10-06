import { ComponentFixture } from '@angular/core/testing';
import { InputSignal } from '@angular/core';

type InputValues<T> = {
  [K in keyof T as T[K] extends InputSignal<any> ? K : never]?:
    T[K] extends InputSignal<infer V> ? V : never;
};

export function setRequiredInputs<T>(
  fixture: ComponentFixture<T>,
  inputs: InputValues<T>,
) {
  Object.entries(inputs).forEach(([key, value]) => {
    fixture.componentRef.setInput(key, value);
  });
}