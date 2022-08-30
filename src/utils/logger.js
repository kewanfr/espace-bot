const chalk = require('chalk');
const dayjs = require('dayjs');

const format = `{tstamp} {tag} {txt}\n`;

const error = (content) => {
  write("", 'black', 'bgRed', 'ERROR', true);
  console._error(content);
}

const warn = (content) => {
  write(content, 'black', 'bgYellow', 'WARN', false);
}

const typo = (content) => {
  write(content, 'black', 'bgCyan', 'TYPO', false);
}

const command = (content) => {
  write(content, 'magenta', 'bgBlack', 'CMD', false);
}

const slashCommand = (content) => {
  write(content, 'magenta', 'bgBlack', 'SLASH-CMD', false);
}

const event = (content) => {
  write(content, 'cyan', 'bgBlack', 'EVT', false);
}

const component = (content, tag = "COMPONENT") => {
  write(content, 'blue', 'bgBlack', tag, false);
}

const client = (content, tag = "CLIENT") => {
  write(content, 'black', 'bgCyan', 'CLIENT', false);
}

const ready = (content) => {
  write(content, 'black', 'bgGreen', 'READY', false);
}

const success = (content, tag = "SUCCESS") => {
  write(content, 'black', 'bgGreen', tag, false);
}

const info = (content, tag = "INFO") => {
  write(content, 'black', 'bgBlue', tag, false);
}

const log = (content) => {
  write(content, 'black', 'bgBlue', "LOG", false);
}

const debug = (content) => {
  write(content, 'black', 'bgYellow', 'DEBUG', false);
}

const write = (content, tagColor, bgTagColor, tag, error = false) => {
  const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
  const logTag = `[${tag}]`;
  const stream = error ? process.stderr : process.stdout;
  if(Array.isArray(content)) {
    let msg = "";
    content.forEach(c => {
      if(typeof c === 'object') c = JSON.stringify(c, false, 2);
      msg += c + " ";
    });
    content = msg;
  }
  if(typeof content === 'object') content = JSON.stringify(content, false, 2);
  const item = format
    .replace('{tstamp}', chalk.gray(timestamp))
    .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
    .replace('{txt}', chalk.white(content));

  stream.write(item);
}

module.exports = {
  error,
  warn,
  typo,
  command,
  slashCommand,
  event,
  component,
  client,
  ready,
  success,
  info,
  log,
  debug,
}
