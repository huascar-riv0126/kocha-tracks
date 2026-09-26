import { TestBed } from '@angular/core/testing';
import { GetStringsPipe } from './get-strings-pipe';
import { StringsService } from './strings-service/strings-service';

describe('GetStringsPipe', () => {
  it('create an instance', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    });
    const pipe = TestBed.runInInjectionContext(() => new GetStringsPipe());
    expect(pipe).toBeTruthy();
  });
});
