import { GraphQLClient } from 'graphql-request';
import { getSdk } from './types';

const { API_ENDPOINT } = process.env;

const client = new GraphQLClient(API_ENDPOINT);
const sdk = getSdk(client);

export default sdk;
