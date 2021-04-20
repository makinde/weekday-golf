# 🏌🏾‍♂ Weekday Golf (hosted on dotherest.com)
A site/app for a small number of small groups to track their golf rounds. More importantly, a place for friends to try and learn new technologies for building sites and apps.

## Technologies
- [NextJS](https://nextjs.org/docs/getting-started)
- [TypeScript](https://www.typescriptlang.org/docs)
- [GraphQL](https://graphql.org) (Endpoint built with [Hasura](https://hasura.io/docs/1.0/graphql/core/index.html) atop a Postgres DB). Ask for access.
- [Vercel](https://vercel.com/docs) hosting
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Bootstrap CSS](https://getbootstrap.com/docs/5.0/getting-started/introduction/) (using [React Bootstrap](https://react-bootstrap.github.io/components/alerts) with [Dashkit Theme](https://dashkit.goodthemes.co/docs/components.html))
- [ChartJS](https://www.chartjs.org/docs/latest/) ([for React](https://github.com/reactchartjs/react-chartjs-2)) for charts

## Features
- Fast. This does need to be balanced with simplicity and other things, but generally we try to make this production level performance.
- Supports multiple courses. The site allows people to enter scores from different courses with different pars.
- Intimate. It's designed for a small number of small groups. So it's cool to have nicknames, pictures, and lists of all the courses. Those things wouldn't scale to even hundreds of users, but whatevs.
- Too much data :P . The site allows you to dig into more stats than you probably want to know about your golf
- Data Entry. You can track rounds directly on the site/app.

## Contributing
Contributions from clowns and clown-adjacent folks are welcome. Just holler at an existing contributor for access to Hasura, Vercel, or the code.

We are the target users, and also some other folks (potentially our friends/family). So when adding new features, think of what we want, but also keep in mind the general case of someone who's not geeking out as much as us. Make it easy for them as well. When possible, streamline. For example, the round card only shows pars for each hole when the course isn't all par 3. That way we see a super clean card when playing on executive courses, but the interface scales to support full 18 hole courses.

### Ways to Contribute
- Add feature requests as tasks. No coding even involved.
- To add a new visualization, add a new card and stick it on a page. If you aren't sure of its value, start with it lower on the page and we can move it as we use it and assess its value.
- If you'd like to rework an entire page, perhaps start buy copying it and adding a nav link to the page, e.g. "Rounds (beta)". That way we can use it and compare with the old one, and over time merge/delete one of them.
- If you'd like to overhaul the entire site structurally and have a completely new way to organize everything, maybe create a subsite and we can add a link to it at the top so people can switch between the standard one and the experimental one.
- If you're not sure which bucket your new thing fits into, you can ask ahead of time, or you can submit a PR and we'll comment with how it can fit into one of the above buckets.

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
Data from all the rounds are stored in a Postgres database. Hasura is a service that you point to a DB and it generates a graphql endpoint based on it (crazy, I know). We try to push a decent amount of things back to SQL/Hasura so the front end can mostly just worry about querying data in the shape it needs and rendering it. Ask for access to Hasura if you don't have it. You can use the GraphiQL interface provided to explore and add data.

Data is queried using graphQL. All queries/fragments/mutations are in *.graphql files collocated with the typescript file that uses it. `yarn generate` looks at all these files and produces a strongly typed sdk and result types for all the queries, mutations, and fragments. In development, `yarn dev` will run this generation any time the files are touched, which is really convenient.

### Deployment
Vercel is connected to this repository. Every pull request will automatically get a new URL to host the branch. That URL will be shown on the PR page by the Vercel bot. For now, the production add will redeploy whenever any data changes or any code is pushed.

## New Ideas
Feel free to come up with ideas, implement them, and send a PR. The easiest way to do this is to add a new thing as a new card. If you want to propose an idea or there's something you'd like to see, open an issue and someone else might pick it up.
