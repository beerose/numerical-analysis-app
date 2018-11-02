## Numerical Analysis Server

## Development

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

3. Start the service:

```
yarn start
```

App will be served on `locaholst:3000`.

---

To speed up development process run service in watch mode:

- In first terminal:

```
    yarn watch-compile
```

- In second terminal:

```
    yarn watch-run
```

## API Documentation

Documentation was created with [Swagger UI](https://swagger.io/) and is hosted within the app:

```
yarn start
```

Documentation will be server on `localhost:3000/api-docs`
