import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

function run(code) {
  return spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: '3000',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/hrms_test',
      CLIENT_ORIGIN: 'http://localhost:5173',
    },
    encoding: 'utf8',
    timeout: 15000,
  });
}

test('startup connects before listening and serves the health endpoint', () => {
  const result = run(`
    import assert from 'node:assert/strict';
    import { once } from 'node:events';
    import mongoose from 'mongoose';
    import app from './src/app.js';
    let connected = false;
    let server;
    mongoose.connect = async () => { connected = true; };
    const listen = app.listen.bind(app);
    app.listen = (port, callback) => {
      assert.equal(port, 3000);
      assert.equal(connected, true);
      // Use a free test port instead of taking the developer's port 3000.
      server = listen(0, '127.0.0.1', callback);
      return server;
    };
    await import('./server.js');
    if (!server.listening) await once(server, 'listening');
    const response = await fetch('http://127.0.0.1:' + server.address().port + '/api/health');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).message, 'Server is running');
    await new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections();
    });
  `);
  assert.equal(result.status, 0, result.stderr);
});

test('a failed database connection prevents listening and exits unsuccessfully', () => {
  const result = run(`
    import assert from 'node:assert/strict';
    import mongoose from 'mongoose';
    import app from './src/app.js';
    mongoose.connect = async () => { throw new Error('private connection details'); };
    app.listen = () => { console.error('Unexpected listener'); process.exit(2); };
    await import('./server.js');
  `);
  assert.equal(result.status, 1, result.stderr);
  assert.ok(result.stderr.includes('Server startup failed'));
  assert.ok(!result.stderr.includes('private connection details'));
  assert.ok(!result.stderr.includes('Unexpected listener'));
});
