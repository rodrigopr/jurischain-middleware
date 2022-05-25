# Jurischain Middleware for ReactRelayNetworkLayer (Classic)

Helper to enable the use of Jurischain with ReactRelayNetworkLayer written in TypeScript.

## TL-DR

### Installation

```bash
npm install --save jurischain-module
npm install --save jurischain-middleware
```

### Use

```javascript
import Relay from 'react-relay';
import { RelayNetworkLayer } from 'react-relay-network-layer';
import { solve as JurischainSolver } from 'jurischain-module'
import JurischainMiddleware from 'jurischain-middleware'

Relay.injectNetworkLayer(new RelayNetworkLayer([
    JurischainMiddleware({ solver: JurischainSolver })
]));
```
