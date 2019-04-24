export const platformUserID = 'gid-platform';
export const platformUserName = 'Platform user';
export const normalUserID = 'gid-user';
export const ISVID = 'gid-isv';
export const rootName = 'Admin users';
export const normalUserName = 'Normal User';
export const ISVName = 'ISV';
export const GROUP_NAME_MAP = {
  [platformUserID]: platformUserName,
  [ISVID]: ISVName,
  [normalUserID]: normalUserName
};

const rootGroup = [
  {
    title: rootName
  },
  {
    group_id: platformUserID,
    key: platformUserID,
    title: platformUserName,
    children: [
      {
        group_id: normalUserID,
        key: normalUserID,
        dataTestID: normalUserID,
        title: normalUserName
      },
      {
        group_id: ISVID,
        key: ISVID,
        dataTestID: ISVID,
        title: ISVName
      }
    ]
  }
];

export default rootGroup;
