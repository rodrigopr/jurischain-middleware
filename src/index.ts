import type { JurischainConfiguration } from 'jurischain-module/lib/jurischain-runner';

import type { solve } from 'jurischain-module';

import type {
  Middleware,
  MiddlewareNextFn,
  RRNLResponseObject,
  RRNLRequestObject,
} from './react-relay-network-layer';

type JurischainSolver = typeof solve

interface HTTPInterceptionTarget {
    header: string
    code: number
}

interface Options {
    intercept: HTTPInterceptionTarget
    solver: JurischainSolver
}

function retrieveChallenge(
  { intercept: { header, code } }: Options,
  response?: RRNLResponseObject,
): false | JurischainConfiguration {
  if (!response) {
    return false;
  }

  if (response.status !== code) {
    return false;
  }

  if (!response.headers) {
    return false;
  }

  const challengeType = response.headers[header];

  if (!challengeType) {
    return false;
  }

  const challengeHeader = JSON.parse(challengeType);
  if (!challengeHeader) {
    throw new Error('invalid challenge encapsulation');
  }

  const { difficulty, seed, ...otherProps } = challengeHeader;
  if (!Number.isInteger(difficulty) || !seed) {
    throw new Error('invalid challenge scheme, missing properties');
  }

  return { seed: Buffer.from(seed, 'base64').toString('ascii'), difficulty, ...otherProps };
}

async function middleware(
  next: MiddlewareNextFn,
  req: RRNLRequestObject,
  opts: Options,
): Promise<RRNLResponseObject> {
  try {
    return next(req);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e) {
      throw e;
    }

    const challenge = retrieveChallenge(opts, e.fetchResponse);
    if (challenge) {
      const response = await opts.solver(challenge);
      req.headers = {
        ...req.headers,
        [opts.intercept.header]: JSON.stringify({
          ...challenge,
          response: Buffer.from(response, 'ascii').toString('base64'),
          seed: Buffer.from(seed).toString('base64'),
        }),
      };
      return middleware(next, req, opts);
    }

    throw e;
  }
}

type JurischainOptions = Partial<Omit<Options, 'solver'>>
    & Pick<Options, 'solver'>;

const defaultIntercept: HTTPInterceptionTarget = {
  code: 401,
  header: 'challenge',
};

function jurischain(opts: JurischainOptions): Middleware {
  return (next) => (req) => middleware(next, req, {
    ...opts,
    intercept: opts.intercept || defaultIntercept,
    solver: opts.solver,
  });
}

export default jurischain;
export { JurischainOptions, JurischainSolver };
