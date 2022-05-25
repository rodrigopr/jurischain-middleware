const { default: jurischainMiddleware } = require('../dist');

const desiredResponse = 'empty-response';

const defaultChallenge = {
  seed: Buffer.from('Hello', 'ascii').toString('base64'),
  difficulty: 10,
};

const RequireAuthentication = {
  status: 401,
  headers: {
    challenge: JSON.stringify(defaultChallenge),
  },
};

async function mockJurischain() {
  return desiredResponse;
}

test('test authentication', async () => {
  const middleware = jurischainMiddleware({ solver: mockJurischain });
  await middleware((req) => {
    if (req.headers && req.headers.challenge) {
      const { response } = JSON.parse(req.headers.challenge);
      expect(response).toEqual(Buffer.from(desiredResponse, 'ascii').toString('base64'));
      return;
    }
    throw Object.assign(new Error(), {
      fetchResponse: RequireAuthentication,
    });
  })({});
});
