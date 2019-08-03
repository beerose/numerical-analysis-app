type Commands = { [key in string]?: () => void } & { help?: () => void };

export function defineCommands<T extends Commands>(commands: T) {
  // tslint:disable-next-line:no-function-expression
  return function run() {
    const [funcName] = process.argv.slice(2);

    const procedure = commands[funcName];
    if (procedure) {
      procedure.apply(commands);
      return;
    }

    if (commands.help) {
      commands.help();
      return;
    }

    console.error(`\
commands[${funcName}] is not defined.
❌ Commands handled:
${Object.keys(commands)
  .map(s => '    ' + s)
  .join('\n')}
    `);
  };
}
