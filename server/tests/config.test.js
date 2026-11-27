import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const serverDirectory = fileURLToPath(new URL('../', import.meta.url));
const validEnvironment = {
  NODE_ENV: 'test',
  PORT: '3000',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/hrms_test',
  CLIENT_ORIGIN: 'http://localhost:5173',
};

function run(code, overrides = {}, cwd = serverDirectory) {
  return spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd,
    env: { ...process.env, ...validEnvironment, ...overrides },
    encoding: 'utf8',
    timeout: 15000,
  });
}

test('configuration parses the port and normalizes the client origin', () => {
  const result = run(`
    import assert from 'node:assert/strict';
    import { env } from './src/config/env.js';
    assert.equal(env.PORT, 3000);
    assert.equal(env.CLIENT_ORIGIN, 'http://localhost:5173');
  `, { CLIENT_ORIGIN: 'http://localhost:5173/' });
  assert.equal(result.status, 0, result.stderr);
});

test('configuration rejects invalid settings without exposing their values', () => {
  for (const [field, value] of [
    ['NODE_ENV', 'invalid'],
    ['PORT', '0'],
    ['PORT', '65536'],
    ['PORT', 'abc'],
    ['MONGODB_URI', ''],
    ['MONGODB_URI', 'https://secret-user:secret-password@example.com'],
    ['CLIENT_ORIGIN', ''],
    ['CLIENT_ORIGIN', 'https://example.com/private'],
    ['CLIENT_ORIGIN', 'https://example.com?private=true'],
    ['CLIENT_ORIGIN', 'https://user:password@example.com'],
    ['CLIENT_ORIGIN', 'ftp://example.com'],
  ]) {
    const result = run("await import('./src/config/env.js');", { [field]: value });
    assert.notEqual(result.status, 0, `${field} should fail`);
    assert.ok(result.stderr.includes(`Invalid environment configuration: ${field}`));
    assert.ok(!result.stderr.includes('secret-password'));
  }
});

test('configuration can be imported from outside the server directory', () => {
  const configUrl = new URL('../src/config/env.js', import.meta.url).href;
  const result = run(`await import(${JSON.stringify(configUrl)});`, {},
    fileURLToPath(new URL('../../', import.meta.url)));
  assert.equal(result.status, 0, result.stderr);
});

test('database connection awaits Mongoose and propagates connection failures', () => {
  const result = run(`
    import assert from 'node:assert/strict';
    import mongoose from 'mongoose';
    import { connectDB } from './src/config/db.js';
    let connected = false;
    mongoose.connect = async (uri, options) => {
      assert.equal(uri, 'mongodb://127.0.0.1:27017/hrms_test');
      assert.equal(options.serverSelectionTimeoutMS, 10000);
      await Promise.resolve();
      connected = true;
    };
    await connectDB();
    assert.equal(connected, true);
    const failure = new Error('Simulated database outage');
    mongoose.connect = async () => { throw failure; };
    await assert.rejects(connectDB(), (error) => error === failure);
  `);
  assert.equal(result.status, 0, result.stderr);
});
