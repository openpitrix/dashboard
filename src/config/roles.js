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
  user: 'Normal User'
};

// matching user provider's getter
// i.e admin => user.isAdmin
export const roleTypes = {
  admin: 'Admin',
  isv: 'ISV',
  dev: 'Dev',
  user: 'Normal'
};

export const portalToRole = {
  admin: 'global_admin',
  isv: 'isv',
  dev: 'developer',
  user: 'user'
};

export default roles;
