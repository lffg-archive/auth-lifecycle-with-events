import express from 'express';
import uuid from 'uuid/v4';
import wait from 'waait';
import { get } from './data';
import emitter, { __map__ } from './events';

const app = express();

app.use((req, _, next) => {
  (req as any)._id = uuid();
  next();
});

app.get('/both', (_, res) => {
  res.json({
    __map__: [...__map__.entries()],
    __data__: get()
  });
});

app.get('/data', (_, res) => {
  res.json(get());
});

app.get('/map', (_, res) => {
  res.json([...__map__.entries()]);
});

app.get(
  '/',
  (req, res, next) => {
    if (!req.query.userId) {
      res.send('Invalid user id.');
    } else {
      next();
    }
  },
  async (req, res) => {
    const requestId = (req as any)._id;

    emitter.emit('track:start', {
      requestId,
      userId: req.query.userId,
      timestamp: Date.now()
    });

    await wait(1000);
    res.send(`<h1>Hello, ${req.query.userId}! ${requestId}</h1>`);

    await wait(3000);

    emitter.emit('track:end', {
      requestId,
      userId: req.query.userId,
      timestamp: Date.now()
    });
  }
);

app.listen(3333, () => console.log('Listening at http://localhost:3333'));
