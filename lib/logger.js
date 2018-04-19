if (process.env.BROWSER) {
  console.debug = console.log.bind(console, '%cDBG', 'color: #00893f; font-weight: bold');
  console.info = console.log.bind(console, '%cINF', 'color: #007bff; font-weight: bold');
} else {
  const { inspect } = require('util');
  const logger = function(color, name) {
    return function(...args) {
      // Get arguments without deoptimizing v8
      args = args.map(
        arg =>
          typeof arg === 'object'
            ? inspect(arg, {
                colors: true,
                depth: 4,
                breakLength: Infinity
              })
            : arg
      );
      console.log(`\u001b[3${color};1m${name}\u001b[0m`, ...args);
    };
  };

  // Enable color logging
  console.debug = logger(6, 'DBG').bind(console);
  console.info = logger(2, 'INF').bind(console);
  console.warn = logger(3, 'WRN').bind(console);
  console.error = logger(1, 'ERR').bind(console);
  console.server = msg => console.log(`\u001b[34;1m${msg}\u001b[0m`);
}
