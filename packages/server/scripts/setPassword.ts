process.env.NODE_ENV = 'development';

import { compare } from 'bcrypt';
import program from 'commander';
import dotenv from 'dotenv';
import { prompt, QuestionCollection } from 'inquirer';

import { storePassword } from '../src/requestHandlers/accounts/storePassword';
import { db } from '../src/store';

dotenv.config();

const questions: QuestionCollection<{
  email: string;
  password: string;
}> = [
  {
    message: 'Enter your email address:',
    name: 'email',
    type: 'input',
  },
  {
    message: 'Enter your password:',
    name: 'password',
    type: 'password',
  },
];

const newPassQuestions: QuestionCollection<{
  email: string;
  password: string;
}> = [
  {
    message: "Enter user's email:",
    name: 'email',
    type: 'input',
  },
  {
    message: 'Enter new password:',
    name: 'password',
    type: 'password',
  },
];

program
  .command('setPassword')
  .alias('p')
  .description('Set password for user')
  .action(() => {
    prompt(questions).then(answers =>
      db.findUserByEmail(
        {
          email: answers.email,
        },
        (err, res) => {
          if (err) {
            console.error(`Cannot find user in database: ${err}`);
            return;
          }
          if (res === null) {
            console.error(`User does not exists.`);
            return;
          }

          compare(answers.password, res.password || '', (hashErr, same) => {
            if (hashErr || !same) {
              console.error(`Wrong password.`);
              process.exit(1);
            }
            prompt(newPassQuestions).then(newPassAnswers => {
              storePassword(
                newPassAnswers.password,
                {
                  email: newPassAnswers.email,
                },
                storeRes => {
                  if ('error' in storeRes) {
                    console.error(
                      `Failed to set new password: ${JSON.stringify(
                        storeRes.error
                      )}.`
                    );
                    process.exit(1);
                  }
                  console.log('Done.');
                  process.exit(0);
                }
              );
            });
          });
        }
      )
    );
  });

program.parse(process.argv);
