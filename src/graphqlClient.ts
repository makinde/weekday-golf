/* eslint-disable no-param-reassign */
import { GraphQLClient } from 'graphql-request';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import transform from 'lodash/transform';
import crossFetch from 'cross-fetch';

const { NEXT_PUBLIC_API_ENDPOINT } = process.env;

// Hasura GraphQL requires arrays to be passed as postgres literals :(
// https://hasura.io/docs/latest/graphql/core/databases/postgres/mutations/insert.html#insert-an-object-with-an-array-field
// This is extra annoying since there are some args to the API that are arrays
// of enums (see useRoundScoresUpsert) so we have to try to find arrays that
// are likely ids (H4x).
const serializeArraysDeep = (obj: any) => transform(obj, (result, val, key) => {
  if (isArray(val) && val.every(Number.isInteger)) {
    result[key] = `{${val}}`;
  } else if (!isArray(val) && isObject(val)) {
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

// eslint-disable-next-line max-len
function customFetcher<TData, TVariables>(query: string, variables?: TVariables): (() => Promise<TData>) {
  return async () => client.request<TData, TVariables>(query, variables);
}

export { client as default, customFetcher };
