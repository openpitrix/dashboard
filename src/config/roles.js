const roles = [
  {
    name: 'Administrator',
    value: 'global_admin',
    description: 'ADMINISTRATOR_DESC'
  },
  {
    name: 'Developer',
    value: 'developer',
    description: 'DEVELOPER_DESC'
  },
  {
    name: 'Normal User',
    value: 'user',
    description: 'NORMAL_DESC'
  }
];

export const roleMap = {
  global_admin: 'Administrator',
  developer: 'Developer',
  user: 'Normal User',
  isv: 'ISV'
};

// portal => user getter
export const roleTypes = {
  admin: 'Admin',
  isv: 'ISV',
  dev: 'Dev',
  user: 'Normal'
};

export const roleToPortal = {
  global_admin: 'admin',
  isv: 'isv',
  developer: 'dev',
  user: 'user'
};

export const moduleDataLevels = ['self', 'group', 'all'];

export default roles;
