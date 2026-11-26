import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, test } from 'node:test';
import express from 'express';
import { AppError } from '../src/utils/AppError.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';

// Explicit fake settings keep these middleware checks independent of local secrets.
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/hrms_test';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

const { default: app } = await import('../src/app.js');
let server;
let baseUrl;
let errorServer;
let errorBaseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  // A separate fixture exercises real error middleware without adding production routes.
  const fixture = express();
  fixture.get('/expected', () => {
    throw new AppError('Validation failed', 400, [
      { field: 'email', message: 'Enter a valid email' },
    ]);
  });
  fixture.get('/unexpected', async () => {
    throw new Error('Private database credentials must not be returned');
  });
  fixture.use(errorHandler);
  errorServer = fixture.listen(0, '127.0.0.1');
  await once(errorServer, 'listening');
  errorBaseUrl = `http://127.0.0.1:${errorServer.address().port}`;
});

after(async () => {
  for (const instance of [server, errorServer]) {
    if (!instance) continue;
    await new Promise((resolve, reject) => {
      instance.close((error) => error ? reject(error) : resolve());
      instance.closeAllConnections();
    });
  }
});

test('unknown routes return JSON with security and credentialed CORS headers', async () => {
  const response = await fetch(`${baseUrl}/middleware-check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
      Cookie: 'example=hello',
    },
    body: JSON.stringify({ name: 'Example' }),
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { success: false, message: 'Route not found' });
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-powered-by'), null);
});

test('app handles a JSON POST preflight from the client', async () => {
  const response = await fetch(`${baseUrl}/middleware-check`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.ok(response.headers.get('access-control-allow-methods').includes('POST'));
  assert.equal(response.headers.get('access-control-allow-headers'), 'content-type');
});

test('app does not authorize an unrelated browser origin through CORS', async () => {
  const response = await fetch(`${baseUrl}/middleware-check`, {
    method: 'POST',
    headers: { Origin: 'https://unrelated.example' },
  });
  assert.notEqual(response.headers.get('access-control-allow-origin'), 'https://unrelated.example');
  await response.arrayBuffer();
});

test('malformed JSON returns a consistent error without echoing the body', async () => {
  const response = await fetch(`${baseUrl}/middleware-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"private":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: 'Request body contains invalid JSON',
  });
});

test('expected application errors preserve their status and field feedback', async () => {
  const response = await fetch(`${errorBaseUrl}/expected`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: 'Validation failed',
    errors: [{ field: 'email', message: 'Enter a valid email' }],
  });
});

test('unexpected async failures return a generic 500 response', async () => {
  const response = await fetch(`${errorBaseUrl}/unexpected`);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    success: false,
    message: 'Internal server error',
  });
});

test('health endpoint confirms the server is running', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    message: 'Server is running',
  });
});
