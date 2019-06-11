import debug from 'debug';

const debugMock = debug('mock');

export default function (config) {
  const { data } = config;
  let { user_id } = data;
  debug('mock:detail')('user_id: %s', user_id);
  let role = 'user';
  if (user_id) {
    role = user_id.replace('uid-', '');
  } else {
    user_id = 'uid-rOwLKL45AOYK';
  }
  debugMock('user_id: %s, role: %s', user_id, role);

  return {
    total_count: 1,
    user_detail_set: [
      {
        user: {
          user_id,
          username: `CYPRESS-TEST-${role.toUpperCase()}`,
          email: `CYPRESS-TEST-${role.toUpperCase()}@op.com`,
          phone_number: '',
          description: '',
          status: 'active',
          create_time: '2019-04-26T03:47:27Z',
          update_time: '2019-05-21T07:48:40Z',
          status_time: '2019-04-26T03:47:27Z'
        },
        role_set: [
          {
            role_id: role,
            role_name: role,
            portal: role,
            owner: 'system',
            owner_path: ':system',
            status: 'active',
            controller: 'pitrix',
            create_time: '2019-03-04T09:22:30Z',
            update_time: '2019-03-04T09:22:30Z',
            status_time: '2019-03-04T09:22:30Z'
          }
        ],
        group_set: [
          {
            parent_group_id: '',
            group_id: 'gid-WlQ1AYOMg0Er',
            group_path: 'gid-WlQ1AYOMg0Er',
            name: 'root',
            status: 'active',
            description: '',
            create_time: '2019-04-26T03:47:27Z',
            update_time: '2019-04-26T03:47:27Z',
            status_time: '2019-04-26T03:47:27Z'
          }
        ]
      }
    ]
  };
}
