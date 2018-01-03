import path from 'path';

const root = (dir) => path.resolve(__dirname, '..', dir);

// We need these globals to fetch data on server-side
global.HOSTNAME = 'localhost';
global.PORT = 3000;

export default {
  http: {
    port: global.PORT,
    hostname: global.HOSTNAME,
    favicon: root('src/assets/favicon.ico'),
    static: {
      '/assets': root('src/assets'),
      '/build': root('build'),
    },
  },
};
