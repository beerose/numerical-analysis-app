## Numerical Analysis App

## Setup

### Set up your MySQL database

Run all sql queries in `database/scripts/createTables.sql` to set up the database.

### Create the first admin

Insert the first admin into the users table. He can add more admins, superusers and users.

```
    yarn workspace server createFirstAdmin --username admin --email admin@example.com
```

### Environment variables

Set `DB_NAME, DB_HOST, DB_PASSWORD, DB_USER` in your ENV.

## Deploy

```
  yarn workspace server build
  yarn workspace scripts deploy-server
```

## Development

### Prerequirements

- [yarn](https://yarnpkg.com/lang/en/docs/install/)

### Packages instalation

```
yarn
```

### Server

**TODO UPDATE THIS INFORMATION ABOUT DATABASE**

1. Start MySQL server and create `numerical_analysis` database:

```
yarn db:setup
yarn db:start
```

2. Create database tables

Enter database cli with `yarn db:interactive` and run `packages/database/sql-scripts/createTables.sql`.

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
    DB_NAME=numerical
    DB_HOST=localhost
    DB_PASSWORD=haslo
    DB_USER=root
    JWT_SECRET=tajemnica
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

### Text Editor

#### Useful VSCode extensions

Here's a list of VSCode extensions we've found useful while developing this project

- VSCode TypeScript TSLint Plugin [(link)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)

- VSCode Styled Components [(link)](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)

- Comment Tagged Templates [(link)](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates)

<img style="width:400px" src="https://raw.githubusercontent.com/mjbvz/vscode-comment-tagged-templates/master/docs/example.png"/>

## Server API

Server lists available routes on `GET /`.

## Authorization

We are using two levels of authorization.
The first one is based on RBAC (Role Based Access Control). We have three roles defined:

1. Admin -- an administrator of the whole system that has access to the all endpoints. There's no limit on how many admins there can be.
2. SuperUser -- we assumed that role SuperUser (this name may be changed when we come up with a better one) will be given to the Univerity employes -- lecturers, people that give classes and so on. This type of user has access to the limited amount of endpoints. He doesn't have access to the users management section, so he cannot for example add new admins.
3. Student -- any student that attend a class. This role endpoints starts with the prefix `students` and this user doesn't have access to any of the Admin and SuperUser endpoints.

The second layer of the authorization is linked to the SuperUser role and groups management. Each SuperUser can have a different privileges in each group. For example in group with id `1` user can have all possible privileges, but in group with id `2` he can only perfom read operations.
Following the Attribute Based Access Control (ABAC) we define waht a SuperUser is allowed to do in a particular group:

1. Edit
2. Read

The lecturer of the group has full access in it, but he can also share privileges to edit this group to the another user. So when a new group is created privilege `edit` is granted to its `lecturer`.
This model will allow us to extend it to a different attributes, for example: `EditUsers`, `ReadUsers`, `EditMeetings` and so on. By default each SuperUser is granted with `Read` attribute for each group.

## Known Problems

- GraphQL Code Generator generated type don't allow partial resolution which is one of the main features and source of performance benefits of GraphQL.
  We could use https://github.com/prisma/graphqlgen instead.
