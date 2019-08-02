#!/usr/bin/env node

/* eslint no-console:0 */
const { spawn } = require('child_process');

const spawnServer = () => {
  const server = spawn(
    'nodemon',
    ['server/server.js', '--watch', 'server', '--watch', 'lib'],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    }
  );

  server.stdout.on('data', data => {
    console.log(`[server]: ${data}`);
  });

  server.stderr.on('data', data => {
    console.log(`[server]: ${data}`);
  });

  server.on('close', code => {
    console.log(`server exited with code ${code}`);
  });

  return server;
};

const server = spawnServer();

server.on(`error`, () => {
  console.log('kill server..');
  server.kill();
});
