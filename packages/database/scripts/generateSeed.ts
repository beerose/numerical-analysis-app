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
let i = 1;

while (i <= 5) {
  const user = {
    email: faker.internet.email(),
    id: i,
    userName: faker.name.findName().replace("'", ''),
    userRole: Role.Admin,
  };
  users.push(user);
  i += 1;
}

while (i <= 155) {
  const user = {
    email: faker.internet.email(),
    id: i,
    studentIndex: faker.random.number(),
    userName: faker.name.findName().replace("'", ''),
    userRole: Role.Student,
  };
  users.push(user);
  i += 1;
}

while (i <= 210) {
  const user = {
    email: faker.internet.email(),
    id: i,
    userName: faker.name.findName().replace("'", ''),
    userRole: Role.SuperUser,
  };
  users.push(user);
  i += 1;
}

const userToQuery = (user: User) => `
  INSERT INTO users(id, user_name, email, student_index, user_role)
  VALUES (${user.id}, '${user.userName}', '${user.email}', '${
  user.studentIndex ? user.studentIndex : ' '
}', '${user.userRole}');
`;

let usersSql: string[] = [];
users.forEach(u => usersSql.push(userToQuery(u)));

fs.writeFile('./sql-scripts/users.seed.sql', usersSql.join(''), (err: any) => {
  if (err) {
    console.error(err);
  }
});

// Groups

enum GroupType {
  Lab = 'lab',
  Ex = 'exercise',
  Lecture = 'lecture',
}

type Group = {
  id: number;
  groupName: string;
  groupType: string;
  lecturerId: number;
};

let groups: Group[] = [];
for (let j = 1; j < 50; j += 1) {
  groups.push({
    groupName: faker.commerce.productName(),
    // tslint:disable-next-line:insecure-random
    groupType: ['lab', 'exercise', 'lecture'][Math.floor(Math.random() * 3)],
    id: j,
    lecturerId: users.filter(u => u.userRole === Role.SuperUser)[
      // tslint:disable-next-line:insecure-random
      Math.floor(Math.random() * 50)
    ].id,
  });
}

const groupToQuery = (group: Group) => `
  INSERT INTO \`groups\`(id, group_name, group_type, lecturer_id)
  VALUES (${group.id}, '${group.groupName}', '${group.groupType}', ${
  group.lecturerId
});
`;

let groupsSql: string[] = [];
groups.forEach(g => groupsSql.push(groupToQuery(g)));

fs.writeFile('./sql-scripts/groups.seed.sql', groupsSql.join(''), err => {
  console.error(err);
});
