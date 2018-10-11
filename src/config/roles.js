const roles = [
  {
    name: 'Administrator',
    value: 'global_admin',
    description:
      'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
  },
  {
    name: 'Developer',
    value: 'developer',
    description:
      'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
  },
  {
    name: 'Normal User',
    value: 'user',
    description:
      'Software developer, one who programs computers or designs the system to match the requirements of a systems analyst'
  }
];

export const roleMap = {
  global_admin: 'Administrator',
  developer: 'Developer',
  user: 'Normal User'
};

export default roles;
