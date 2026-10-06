import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { eventResolver } from './event-resolver';
import { EventMock } from './event-mock.model';
import { EventMockService } from './event-mock';

const executeResolver: ResolveFn<EventMock> = (...resolverParameters) =>
  TestBed.runInInjectionContext(() => eventResolver(...resolverParameters));

const notFoundUrlTree = { url: '/404' } as unknown as UrlTree;
const existingEvent = { id: 1 } as unknown as EventMock;

let eventToReturn: EventMock | undefined;
let requestedIds: number[];
let parsedUrls: string[];

function resolve(eventId?: string): EventMock | RedirectCommand {
  const route = {
    paramMap: {
      get: (key: string) => (key === 'eventId' && eventId !== undefined ? eventId : null),
    },
  } as unknown as ActivatedRouteSnapshot;

  return executeResolver(route, {} as RouterStateSnapshot) as EventMock | RedirectCommand;
}

function expectRedirectToNotFound(result: EventMock | RedirectCommand) {
  expect(result).toBeInstanceOf(RedirectCommand);

  const command = result as RedirectCommand;
  expect(command.redirectTo).toBe(notFoundUrlTree);
  expect(command.navigationBehaviorOptions?.skipLocationChange).toBe(true);
  expect(parsedUrls).toEqual(['/404']);
}

describe('eventResolver', () => {
  beforeEach(() => {
    eventToReturn = undefined;
    requestedIds = [];
    parsedUrls = [];

    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventMockService,
          useValue: {
            getEvent: (id: number) => {
              requestedIds.push(id);
              return eventToReturn;
            },
          },
        },
        {
          provide: Router,
          useValue: {
            parseUrl: (url: string) => {
              parsedUrls.push(url);
              return notFoundUrlTree;
            },
          },
        },
      ],
    });
  });

  describe('when the id is valid', () => {
    it('returns the event provided by the service', () => {
      eventToReturn = existingEvent;

      expect(resolve('1')).toBe(existingEvent);
      expect(parsedUrls).toEqual([]);
    });

    it('requests the event using the id converted to a number', () => {
      eventToReturn = existingEvent;

      resolve('42');

      expect(requestedIds).toEqual([42]);
    });

    it('accepts the maximum length of 10 digits', () => {
      resolve('9999999999');

      expect(requestedIds).toEqual([9999999999]);
    });

    it('redirects to /404 when the service finds no event', () => {
      eventToReturn = undefined;

      expectRedirectToNotFound(resolve('999'));
      expect(requestedIds).toEqual([999]);
    });
  });

  describe('when the id is missing or invalid', () => {
    it('redirects to /404 without querying the service when the id is missing', () => {
      expectRedirectToNotFound(resolve());
      expect(requestedIds).toEqual([]);
    });

    for (const id of ['', '-1', '0', 'text', '1.5', '01', ' 1', '1 ', '12345678901']) {
      it(`redirects to /404 without querying the service for id "${id}"`, () => {
        expectRedirectToNotFound(resolve(id));
        expect(requestedIds).toEqual([]);
      });
    }
  });
});
