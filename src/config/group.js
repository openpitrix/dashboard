export const platformUserID = 'gid-platform';
export const normalUserID = 'gid-user';
export const ISVID = 'gid-isv';
export const rootName = 'Admin users';
export const normalUserName = 'Normal User';
export const ISVName = 'ISV';

const rootGroup = [
  {
    title: rootName
  },
  {
    group_id: platformUserID,
    key: platformUserID,
    title: 'Platform user',
    children: [
      {
        group_id: normalUserID,
        key: normalUserID,
        title: normalUserName
      },
      {
        group_id: ISVID,
        key: ISVID,
        title: ISVName
      }
    ]
  }
];

export default rootGroup;
