# How to setup a database?

```sh
yarn db:setup
```

```sh
yarn db:ports # check ports
```

wait a minute

```sh
yarn db:grepForPassword
```

copy the temporary password and use it to log in

```sh
yarn db:interactive
```

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
