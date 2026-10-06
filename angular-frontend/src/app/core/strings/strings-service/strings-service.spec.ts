import { TestBed } from '@angular/core/testing';
import { TransferState, makeStateKey } from '@angular/core';
import { StringsService } from './strings-service';
import { STRINGS_LOADER } from '../strings-token';

const STRINGS_STATE_KEY = makeStateKey<Record<string, string>>('strings');

describe('StringsService', () => {
  let service: StringsService;
  let transferState: TransferState;
  let loaderSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loaderSpy = vi.fn(() => Promise.resolve({ 'greeting.hello': 'Hola' }));

    TestBed.configureTestingModule({
      providers: [{ provide: STRINGS_LOADER, useValue: loaderSpy }],
    });

    service = TestBed.inject(StringsService);
    transferState = TestBed.inject(TransferState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the key itself before load() is called', () => {
    expect(service.get('greeting.hello')).toBe('greeting.hello');
  });

  it('should call the loader when TransferState has no cached strings', async () => {
    await service.load();

    expect(loaderSpy).toHaveBeenCalledTimes(1);
    expect(service.get('greeting.hello')).toBe('Hola');
  });

  it('should use TransferState and skip the loader when strings are already cached', async () => {
    transferState.set(STRINGS_STATE_KEY, { 'greeting.hello': 'Cached Hola' });

    await service.load();

    expect(loaderSpy).not.toHaveBeenCalled();
    expect(service.get('greeting.hello')).toBe('Cached Hola');
  });
});
