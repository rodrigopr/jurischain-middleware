/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

import type { BatchRequestMap } from './middleware/batch';

export type FetchWithMiddleware = (
    req: RRNLRequestObject,
) => Promise<RRNLResponsePayload>;
export type MiddlewareNextFn = (
    req: RRNLRequestObject,
) => Promise<RRNLResponseObject>;
export type Middleware = (next: MiddlewareNextFn) => MiddlewareNextFn;
// {
//   supports?: string | string[],
// };
export type FetchOpts = {
    url?: string;
    method: 'POST' | 'GET';
    headers: Record<string, string>;
    body: string | FormData;
    credentials: 'omit' | 'same-origin' | 'include';
};
export type RRNLRequestObject =
    | RRNLRequestObjectQuery
    | RRNLRequestObjectMutation
    | RRNLRequestObjectBatchQuery;
export type RRNLRequestObjectQuery = FetchOpts & {
    relayReqType: 'query';
    relayReqId: string;
    relayReqObj: RelayClassicRequest;
};
export type RRNLRequestObjectMutation = FetchOpts & {
    relayReqType: 'mutation';
    relayReqId: string;
    relayReqObj: RelayClassicRequest;
};
export type RRNLRequestObjectBatchQuery = FetchOpts & {
    relayReqType: 'batch-query';
    relayReqId: string;
    relayReqMap: BatchRequestMap;
    relayReqObj?: void;
};
export type GraphQLResponseErrors = Array<{
    message: string;
    locations?: Array<{
        column: number;
        line: number;
    }>;
    stack?: Array<string>;
}>;
export type GraphQLResponse = {
    data?: any;
    errors?: GraphQLResponseErrors;
};
export type RRNLResponsePayload = {
    readonly data: unknown | null | undefined;
    readonly errors?: unknown | null | undefined;
};
export type RRNLResponseObject = {
    ok: any;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    url: string;
    payload?: GraphQLResponse;
};
export type RelayClassicRequest = {
    resolve: (payload: unknown) => Promise<unknown>;
    reject: (error: Error) => Promise<unknown>;
    getID: () => string;
    getFiles: () => Record<string, File> | null | undefined;
    getQueryString: () => string;
    getVariables: () => Record<string, any>;
    getDebugName: () => string;
};
export type RRNLOptions = {
    noThrow?: boolean;
};
