/* eslint-disable no-param-reassign */
import { GraphQLClient } from 'graphql-request';
import useSWR, { cache, ConfigInterface } from 'swr';
import transform from 'lodash/transform';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import stringify from 'fast-json-stable-stringify';
import noop from 'lodash/noop';
import crossFetch from 'cross-fetch';

import { getSdk } from './types';

const { NEXT_PUBLIC_API_ENDPOINT } = process.env;
const BROWSER = typeof window !== 'undefined';

// Hasura GraphQL requires arrays to be passed as postgres literals :(
// https://hasura.io/docs/latest/graphql/core/databases/postgres/mutations/insert.html#insert-an-object-with-an-array-field
const serializeArraysDeep = (obj: any) => transform(obj, (result, val, key) => {
  if (isArray(val)) {
    result[key] = `{${val}}`;
  } else if (isObject(val)) {
    result[key] = serializeArraysDeep(val);
  } else {
    result[key] = val;
  }
});
const client = new GraphQLClient(NEXT_PUBLIC_API_ENDPOINT, {
  fetch(url, options) {
    if (typeof options?.body === 'string') {
      const parsedBody = JSON.parse(options.body);
      if (parsedBody.variables) {
        parsedBody.variables = serializeArraysDeep(parsedBody.variables);
      }
      options.body = JSON.stringify(parsedBody);
    }

    return crossFetch(url, options);
  },
});
const sdk = getSdk(client);

type Await<T> = T extends PromiseLike<infer U> ? U : T;
type Function = (...ards: any) => any;
type EnhancedConfig<T extends Function> = ConfigInterface<Await<ReturnType<T>>, Error> & {
  offline?: boolean
};

function getCacheKey<T extends Function>(fn: Function, variables: Parameters<T>[0]) {
  return `${fn.name}:${stringify(variables)}`;
}

/**
 * This react hook allows you to easily query the API using the generated SDK
 * and useSWR. It also allows you to specify the extra option `offline` to
 * true in order to have the query saved offline. Handy for buts of the app
 * that you want to have to work decently when there's no cell reception.
 *
 * It lets you "simplify" the former into the latter:
 *
 * ```
 * const { data } = useSWR(
 *   ['funcName', var1, var 2],
 *   () => sdk.funcName({ var1, var2 })
 *   { opt1, opt2 }
 * );
 * ```
 *
 * ```
 * const { data } = useSdk(
 *   sdk.funcName,
 *   { var1, var2 },
 *   { opt1, opt2, offline: true },
 * );
 * ```
 */
function useSdk<T extends Function>(
  fn: T,
  variables: Parameters<T>[0],
  options: EnhancedConfig<T> = {},
) {
  const key = getCacheKey(fn, variables);
  const {
    offline,
    onSuccess = noop,
    onError = noop,
    ...remainingOptions
  } = options;

  if (BROWSER && !cache.get(key) && offline) {
    const storedValueStr = localStorage.getItem(key);
    if (storedValueStr !== undefined) {
      const storedValue = JSON.parse(storedValueStr);
      cache.set(key, storedValue);
      onSuccess(key, storedValue, options);
    }
  }

  return useSWR<Await<ReturnType<T>>>(
    key,
    () => fn(variables),
    {
      ...remainingOptions,
      onSuccess(d, k, o) {
        if (offline) { localStorage.setItem(k, JSON.stringify(d)); }
        return onSuccess(d, k, o);
      },
      onError(e, k, o) {
        // if (offline) { localStorage.removeItem(key); }
        return onError(e, k, o);
      },
    },
  );
}

export { sdk as default, useSdk, getCacheKey };
