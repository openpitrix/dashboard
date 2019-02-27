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

export const adminRoleNameMap = {
  global_admin: 'Super admin',
  isv: 'ISV',
  user: 'Normal User'
};

export const isvRoleNameMap = {
  isv: 'Super admin',
  developer: 'Developer'
};

export default roles;

export const AdminPortal = 'global_admin';
export const ISVPortal = 'isv';
export const UserPortal = 'user';

export const getRoleName = (role = {}, portal = 'global_admin') => {
  let name = '';
  if (portal === AdminPortal) {
    name = adminRoleNameMap[role.role_id];
  }
  if (portal === ISVPortal) {
    name = isvRoleNameMap[role.role_id];
  }
  if (!name) {
    name = role.role_name;
  }
  return name;
};

export const CannotEditController = 'pitrix';
