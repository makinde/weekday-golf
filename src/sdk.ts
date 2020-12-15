import { GraphQLClient } from 'graphql-request';
import { getSdk } from './types';

const { NEXT_PUBLIC_API_ENDPOINT } = process.env;

const client = new GraphQLClient(NEXT_PUBLIC_API_ENDPOINT);
const sdk = getSdk(client);

export default sdk;
