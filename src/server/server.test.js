const server = require('./server');
require('dotenv-safe').config();

function apiMock(controllers, httpResponseHelper, middleware, daos) {
  console.log('do nothing');
}

describe('Test Server.js', () => {
  it('Server Start', async () => {
    server.start(null, null, apiMock, (err, server) => {
      expect(err).toBe(false);
      expect(server).toBe(server);
    });
  });

  it('Server Stop', async () => {
   let status = server.stop(null)
    expect(status).toBe(true);
  });
});
