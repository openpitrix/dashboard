import debug from 'debug';

const debugMock = debug('mock:oauth');

const encodeIDMAP = {
  global_admin:
    'eyJleHAiOjE1NTk4MTg3NTEsImlhdCI6MTU1OTgxMTU1MSwic3ViIjoidWlkLWdsb2JhbF9hZG1pbiJ9',
  isv: 'eyJleHAiOjE1NTk4MTg3NTEsImlhdCI6MTU1OTgxMTU1MSwic3ViIjoidWlkLWlzdiJ9',
  user:
    'eyJleHAiOjE1NTk4MTg3NTEsImlhdCI6MTU1OTgxMTU1MSwic3ViIjoidWlkLXVzZXIifQ=='
};

const getRole = username => {
  let role = null;
  const roleArray = [
    {
      role: 'global_admin',
      reg: /admin/i
    },
    {
      role: 'isv',
      reg: /isv/i
    },
    {
      role: 'user',
      reg: /user/i
    }
  ];

  roleArray.some(item => {
    if (item.reg.test(username)) {
      role = item.role;
      return true;
    }

    return false;
  });
  return role;
};

export default function (config) {
  const { data } = config;
  const role = getRole(data.username);
  debugMock('username: %s, role: %s', data.username, role);
  const encodeID = encodeIDMAP[role];
  return {
    access_token: `eyJhbGciOiJIUzUxMiJ9.${encodeID}.5kRoHvwecyuDl1-azdK-B2HGSZ3zaqsvQcHA1s1P8qvqauuYH3_R_01EvXQzhCy_SyjjD4MJ_tFaSlPig7_CMQ`,
    expires_in: 7200,
    id_token: `eyJhbGciOiJIUzUxMiJ9.${encodeID}.}.6lUB9mo6eKLZxenDht_9atM7vYx1Qh650jTMtKchwzGrcnlvCQeu462XLH9NHMbvrjJNu01AH8-YEgvaRzCxIw`,
    refresh_token: 'f4qqMLUDQ9TuHJxh69yOmtjlFGrEfKe8fBhfOxayjYGKj0LxIu',
    token_type: 'Bearer'
  };
}
