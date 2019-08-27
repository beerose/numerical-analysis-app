const { execSync } = require('child_process');

/**
 * @param {string} commandsStr
 * @param {{ dir?: string | undefined }} arg2=
 */
function exec(commandsStr, { dir } = {}) {
  const commands = commandsStr
    .trim()
    .split('\n')
    .map(x => x.trim())
    .filter(x => x && !x.startsWith('#'));

  for (const cmd of commands) {
    const fullCommand = dir ? `cd ${dir} && ${cmd}` : cmd;

    try {
      console.log(`--> ${fullCommand.trim()} \n`);
      execSync(fullCommand, { stdio: 'inherit' });
    } catch (err) {
      console.error('💔 ', fullCommand, 'failed 🔥');
      throw err;
    }
  }
}

module.exports = {
  exec,
};
