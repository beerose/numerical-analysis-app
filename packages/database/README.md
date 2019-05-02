# 🚛 Deployment

We're deploying the database on heroku as https://numerical-db.herokuapp.com/

# 🔌 How to setup a database?

Add following varaibles to .env file:

```
DB_NAME=
MYSQL_ROOT_PASSWORD=
```

In `./sql-scripts` there are some sql files that initialize database and will be
executed right after container is created.

```sh
yarn init
```

Check ports:

```sh
yarn db:ports
```

Use container's MySQL console:

```sh
yarn docker:mysql
```

Use container's bash console:

```sh
yarn docker:bash
```

Logs from the docker container:

```sh
yarn docker:logs
```

# DEPRECATED BELOW

set root password

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_here';
```

```sql
create user 'user_here'@'%' IDENTIFIED WITH mysql_native_password BY 'password_here';
grant all on *.* to 'user_here'@'%';
```

```sh
yarn db:interactive
```

```sql
system mysql -u 'user_here' -p
```

enter your password and create database

```sql
create database numerical;
```

Now you can run your migrations with dbmate or manually.
