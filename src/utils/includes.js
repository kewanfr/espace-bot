const Logger = require("./logger");

var _log = console.log;
var _error = console.error;
var _warn = console.warn;
var _info = console.info;
var _debug = console.debug;

console._log = (...args) => {
  _log(...args);
};

console._error = (...args) => {
  _error(...args);
};

console.log = (...args) => {
  // _log(...args);
  Logger.log([...args]);
};

console.error = (...args) => {
  // _error(...args);
  Logger.error([...args]);
}

console.warn = (...args) => {
  // _warn(...args);
  Logger.warn([...args]);
}

console.info = (...args) => {
  // _info(...args);
  Logger.info([...args]);
}

console.debug = (...args) => {
  // _debug(...args);
  Logger.debug([...args]);
}