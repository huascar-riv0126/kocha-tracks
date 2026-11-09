import { EventChange } from '../event-history/event-change.model';
import { Source } from '../../sources-page/source-model';

interface ExampleChange extends Pick<EventChange, 'id' | 'version' | 'occurredAt' | 'type'> {
  readonly titleKey: string;
  readonly fieldKey: string;
  readonly beforeKey: string;
  readonly afterKey: string;
  readonly descriptionKey: string;
}

interface EventHistoryExample {
  readonly changes: readonly ExampleChange[];
  readonly sources: readonly Pick<Source, 'id' | 'name' | 'url'>[];
}

/** Demonstration revisions for the existing mock events, not a record of real reports. */
const examples: Readonly<Record<number, EventHistoryExample>> = {
  1: {
    sources: [], // This mock event only cites local user reports, without a news URL.
    changes: [
      {
        id: '1-started',
        version: 1,
        occurredAt: new Date('2026-10-01T12:30:00-04:00'),
        type: 'started',
        titleKey: 'eventHistoryPage.fixture.startedTitle',
        fieldKey: 'eventHistoryPage.fixture.state',
        beforeKey: 'eventHistoryPage.fixture.unrecorded',
        afterKey: 'eventHistoryPage.fixture.active',
        descriptionKey: 'eventHistoryPage.fixture.startedDescription',
      },
      {
        id: '1-updated',
        version: 2,
        occurredAt: new Date('2026-10-01T14:30:00-04:00'),
        type: 'updated',
        titleKey: 'eventHistoryPage.fixture.updatedTitle',
        fieldKey: 'eventHistoryPage.fixture.severity',
        beforeKey: 'severity.mid',
        afterKey: 'severity.low',
        descriptionKey: 'eventHistoryPage.fixture.updatedDescription',
      },
    ],
  },
  2: {
    // Only the newsrooms named by this event's sourceName are related to its example.
    sources: [
      { id: 5, name: 'Unitel', url: 'https://unitel.bo/' },
      { id: 3, name: 'Opinión', url: 'https://www.opinion.com.bo/cochabamba/' },
    ],
    changes: [
      {
        id: '2-started',
        version: 1,
        occurredAt: new Date('2026-10-01T09:30:00-04:00'),
        type: 'started',
        titleKey: 'eventHistoryPage.fixture.startedTitle',
        fieldKey: 'eventHistoryPage.fixture.state',
        beforeKey: 'eventHistoryPage.fixture.unrecorded',
        afterKey: 'eventHistoryPage.fixture.active',
        descriptionKey: 'eventHistoryPage.fixture.startedDescription',
      },
      {
        id: '2-finished',
        version: 2,
        occurredAt: new Date('2026-10-01T14:30:00-04:00'),
        type: 'finished',
        titleKey: 'eventHistoryPage.fixture.finishedTitle',
        fieldKey: 'eventHistoryPage.fixture.state',
        beforeKey: 'eventHistoryPage.fixture.active',
        afterKey: 'eventHistoryPage.fixture.resolved',
        descriptionKey: 'eventHistoryPage.fixture.finishedDescription',
      },
    ],
  },
  3: {
    sources: [
      { id: 6, name: 'Red UNO', url: 'https://www.reduno.com.bo/' },
      { id: 7, name: 'ATB', url: 'https://www.atb.com.bo/' },
    ],
    changes: [
      {
        id: '3-started',
        version: 1,
        occurredAt: new Date('2026-10-01T13:45:00-04:00'),
        type: 'started',
        titleKey: 'eventHistoryPage.fixture.startedTitle',
        fieldKey: 'eventHistoryPage.fixture.state',
        beforeKey: 'eventHistoryPage.fixture.unrecorded',
        afterKey: 'eventHistoryPage.fixture.active',
        descriptionKey: 'eventHistoryPage.fixture.startedDescription',
      },
    ],
  },
};

const emptyExample: EventHistoryExample = { changes: [], sources: [] };

export function getEventHistoryExample(eventId: number): EventHistoryExample {
  return examples[eventId] ?? emptyExample;
}
