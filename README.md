## Numerical Analysis App

## Setup

### Set up your MySQL database

Run all sql queries in `server/migrations/` to set up the database.

### Create the first admin

Insert the first admin into the users table. He can add more admins, superusers and users.

### Environment variables

Set `DB_NAME, DB_HOST, DB_PASSWORD, DB_USER` in your ENV

-- TBD --

## Development

### Prerequirements

- [yarn](https://yarnpkg.com/lang/en/docs/install/)

### Packages instalation

```
yarn
```

### Server

This project is using MySQL Database to store data.
For DB migrations make sure you have migrate tool installed:
[DbMate installation](https://dbmate.readthedocs.io/en/latest/)

1. Start MySQL server and create `numerical_analysis` database:

```
DATABASE_URL="mysql://<username>:<password>@127.0.0.1:3306/numerical_analysis" dbmate create
```

2. Create database structure:

```
DATABASE_URL="mysql://<username>:<password>@127.0.0.1:3306/numerical_analysis" dbmate -d ./migrations/ up
```

3. Starting the service

```
yarn workspaces server start
```

App will be served on `locaholst:3000`.

The server requires following environment variables to connect to the database:

```
    DB_NAME, DB_HOST, DB_PASSWORD, DB_USER
```

You can create `server/.env` file for development.

```
    DB_NAME=numerical_analysis_app
    DB_HOST=localhost
    DB_PASSWORD=password
    DB_USER=root
```

---

To speed up development process run service in watch mode:

```
    yarn workspaces server dev
```

### Client

1. Starting the app

```
yarn worksapces client dev
```

App will be running at http://localhost:1234.

### Client & Server

To run client and server concurrently:

```
yarn dev
```

---

In watch mode:

```
yarn start
```

## API Documentation

Documentation was created with [Swagger UI](https://swagger.io/) and is hosted within the app:

```
yarn workspaces server start
```

Documentation will be server on `localhost:8082/api-docs`
