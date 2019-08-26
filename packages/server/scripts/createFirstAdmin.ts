import * as bcrypt from 'bcrypt';
import chalk from 'chalk';
import * as readline from 'readline';
import { sql } from 'tag-sql';
import yargs from 'yargs';

import { echo } from '../src/lib/echo';
import { connection } from '../src/store/connection';

declare module 'readline' {
  interface Interface {
    stdoutMuted: boolean;
    output: {
      write(s: string): void;
    };
    _writeToOutput(s: string): void;
  }
}

const askForPassword = () =>
  new Promise<string>(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.stdoutMuted = true;

    rl.question('Password: ', password => {
      rl.close();
      resolve(password);
    });

    rl._writeToOutput = stringToWrite => {
      if (rl.stdoutMuted) {
        rl.output.write('*');
      } else {
        rl.output.write(stringToWrite);
      }
    };
  });

const SALT_ROUNDS = 10;

function main() {
  const { username, email } = yargs
    .options({
      username: {
        type: 'string',
        required: true,
      },
      email: {
        type: 'string',
        required: true,
      },
    })
    .parse(process.argv);

  echo`
    ${chalk.bold('Creating admin user')} ${username} ${email}.
    Please provide password.
  `;

  askForPassword()
    .then(password => bcrypt.hash(password, SALT_ROUNDS))
    .then(hashed =>
      connection.query(
        sql`
          insert into users (
            user_name,
            email,
            user_role,
            password
          ) values (
            ${username},
            ${email},
            'admin',
            ${hashed}
          )
      `,
        (err, res) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          echo`
            ${res}
          `;
          process.exit(0);
        }
      )
    );
}

main();
