# 🏌🏾‍♂ Weekday Golf
A site (and maybe app) for friends to track their friendly golf rounds. More importantly, a place for friends to try and learn new technologies for building sites and apps.

## Technologies
- [NextJS](https://nextjs.org/docs/getting-started)
- [TypeScript](https://www.typescriptlang.org/docs)
- [GraphQL](https://graphql.org) (Endpoint built with [Hasura](https://hasura.io/docs/1.0/graphql/core/index.html) atop a Postgres DB). Ask for access.
- [Vercel](https://vercel.com/docs) hosting
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Bootstrap CSS](https://getbootstrap.com/docs/5.0/getting-started/introduction/) (using [React Bootstrap](https://react-bootstrap.github.io/components/alerts) with [Dashkit Theme](https://dashkit.goodthemes.co/docs/components.html))
- [d3](https://github.com/d3/d3/wiki) for charts


## Contributing
Contributions from clwons and clown adjacent folks are welcome. Just holler at an existing contributor for access to Hasura, Vercel, or the code.

### Installation
Clone the repo locally and install dependencies:
```sh
$ git clone git@github.com:makinde/weekday-golf.git
$ cd weekday-golf
$ yarn install
```
### Environment Variables
The app requires a couple env variables, which you can get from any past contributor.
```sh
$ cp .env.example .env
```
Add the env vars to the `.env` file.

### Run the App
```sh
$ yarn dev
```
This script will compile types for the \*.graphql files, and start a local server.  The location for the local server defaults to `localhost:3000` but you can change this by changing the `$PORT` variable to something else. It will also watch the graphql files for changes and recompute the types file on the fly. If you want to build the types one off, you can run `yarn generate`.

The `dev` command also handles transpiling typescript on the fly, so you basically never need to worry about anything typescript specific. Just write TypeScript and it'll run.

### Data
Data from all the rounds are stored in a Postgres database. Hasura is a service that you point to a DB and it generates a graphql endpoing based on it (crazy, I know). We try to push a decent amount of things back to SQL/Hasura so the front end can mostly just worry about querying data in the shape it needs and rendering it. Ask for access to Hasura if you don't have it. You can use the GraphiQL interface provided to explore and add data.

Data is queried using graphQL. All queries/fragments/mutations are in *.graphql files collocated with the typescript file that uses it. `yarn generate` looks at all these files and produces a strongly typed sdk and result types for all the queries, mutations, and fragments. In development, `yarn dev` will run this generation any time the files are touched, which is really convenient. 

### Deployment
Vercel is connected to this repository. Every pull request will automatically get a new URL to host the branch. That URL will be shown on the PR page by the Vercel bot. For now, the production add will redeploy whenever any data changes or any code is pushed.

## New Ideas
Feel free to come up with ideas, implement them, and send a PR. The easiest way to do this is to add a new thing as a new card. If you want to propose an idea or there's something you'd like to see, open an issue and someone else might pick it up.
