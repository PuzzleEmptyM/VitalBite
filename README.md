## Atlas Cinema Guru

This is the starter template for the Atlas Cinema Guru project. It contains the starting code for the movie database application.

![](./images/task-2-a.png)

### Getting Started

- Run `npm install` to install dependencies
- Run `npm run dev` to start the dev server
- Open http://localhost:3000 in a browser

### API Routes

If you would like to use client rendered components you will need to utilize these API endpoints:

- `GET /api/titles?page=1&minYear=2023&maxYear=2024&genres=Sci-Fi,Mystery` returns list of movies. Support pagination, filtering by min year, max year, and genres
- `GET /api/watch-later?page=1` return list of movies added to users watch later list. Support pagination.
- `GET /api/favorites?page=1` return list of movies added to users favorite list. Support pagination.
- `GET /api/activities?page=1` returns list of user’s app activity. Supports pagination
- `POST /api/watch-later/:id` Adds movie to a users watch later list.
- `DELETE /api/watch-later/:id` Removes a movie from a users watch later list.
- `POST /api/favorites/:id` Adds a movie to a a users favorites list.
- `DELETE /api/favorites/:id` Removes a movie from a users favorites list.

The code for these apis can be found in the [app/api](./app/api/) directory.

You can opt not to use the API and instead use server rendered components utilizing the data fetchers defined in [lib/data.ts](./lib/data.ts).

### Database Setup

The appliction expects a postgres database to store data. You will need to create a postgres database in vercel and populate the following env variables:

```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

Once the database is setup and the application can connect, you will need to [seed](https://en.wikipedia.org/wiki/Database_seeding) the database using the `GET /api/seed` endpoint. This will create necessary database tables and load starter data. See the code [here](./app/api/seed/route.ts).

Helper methods for interacting with the database are already implemented in [lib/data.ts](./lib/data.ts)

### Authentication

The applicaiton expects [Auth.js](https://authjs.dev/) to be configured for the application to authenticate and authorize users. Authentication is configured in [auth.ts](auth.ts) You will need to add the following env variables:

```
# Run `npx auth secret` to set value. See https://cli.authjs.dev
AUTH_SECRET=


# Copy from github. See https://authjs.dev/guides/configuring-github#registering-your-app
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```
