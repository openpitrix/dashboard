export const platformUserID = 'gid-platform';
export const normalUserID = 'gid-user';
export const ISVID = 'gid-isv';
export const rootName = '管理用户';
export const normalUserName = '普通用户';
export const ISVName = '应用服务商';

const rootGroup = [
  {
    title: rootName
  },
  {
    group_id: platformUserID,
    key: platformUserID,
    title: '平台用户',
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
