export enum UserRole {
  Admin = 'admin',
  SuperUser = 'superUser',
  Student = 'student',
}

export namespace UserRole {
  const values: UserRole[] = Object.values(UserRole);

  export function assert(str: string): UserRole {
    if (values.includes(str as UserRole)) {
      return str as UserRole;
    }
    throw new Error(
      `${str} is not UserRole. Legal roles are ${values.join(' ')}`
    );
  }
}
