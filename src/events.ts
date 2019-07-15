import { Emitter } from '@poppinss/events';
import wait from 'waait';
import { insert } from './data';

interface EventsMap {
  'track:start': { requestId: string; userId: number; timestamp: number };
  'track:end': { requestId: string; userId: number; timestamp: number };
}

const emitter = new Emitter<EventsMap>();

const map = new Map<string, any>();
export const __map__ = map;

emitter.on('track:start', ({ requestId, userId, timestamp }) => {
  map.set(requestId, { userId, start: { timestamp } });
});

emitter.on('track:end', async ({ requestId, timestamp }) => {
  console.log('...');
  await wait(3000);
  const data = map.get(requestId);
  console.log('End of request. Data ->', data);

  insert({
    userId: data.userId,
    time: {
      start: data.start.timestamp,
      end: timestamp
    },
    insertedAt: Date.now()
  });

  console.log('Inserted.');

  // Prevent memory leak:
  map.delete(requestId);
});

export default emitter;
