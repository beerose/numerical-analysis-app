// tslint:disable:no-var-requires
const faker = require('faker');
const fs = require('fs');
// Users

enum Role {
  Admin = 'admin',
  SuperUser = 'superUser',
  Student = 'student',
}

type User = {
  id: number;
  userName: string;
  email: string;
  studentIndex?: string;
  userRole: Role;
};

const users: User[] = [];
// Admin
let i = 0;

while (i < 5) {
  const user = {
    email: faker.internet.email(),
    id: i,
    userName: faker.name.findName(),
    userRole: Role.Admin,
  };
  users.push(user);
  i += 1;
}

while (i < 155) {
  const user = {
    email: faker.internet.email(),
    id: i,
    studentIndex: faker.random.number(),
    userName: faker.name.findName(),
    userRole: Role.Student,
  };
  users.push(user);
  i += 1;
}

while (i < 210) {
  const user = {
    email: faker.internet.email(),
    id: i,
    userName: faker.name.findName(),
    userRole: Role.SuperUser,
  };
  users.push(user);
  i += 1;
}

const userToQuery = (user: User) => `
  INSERT INTO users(id, user_name, email, student_index, user_role)
  VALUES (${user.id}, ${user.userName}, ${user.email}, ${
  user.studentIndex ? user.studentIndex : ''
}, ${user.userRole});
`;

let usersSql: string[] = [];
users.forEach(u => usersSql.push(userToQuery(u)));

fs.writeFile('./sql-scripts/users.sql', usersSql.join(''), (err: any) => {
  if (err) {
    console.error(err);
  }
});
