export default {
  total_count: 10,
  op_group_set: [
    {
      group_id: 'grp-01',
      group_name: 'QingCloud 应用中心',
      parent_group_id: null,
      level: 1,
      seq_order: 1
    },
    {
      group_id: 'grp-02',
      group_name: '内部组织',
      parent_group_id: 'grp-01',
      level: 2,
      seq_order: 1
    },
    {
      group_id: 'grp-03',
      group_name: '外部组织',
      parent_group_id: 'grp-01',
      level: 2,
      seq_order: 2
    },
    {
      group_id: 'grp-04',
      group_name: '应用平台开发部',
      parent_group_id: 'grp-02',
      level: 2,
      seq_order: 2
    },
    {
      group_id: 'grp-05',
      group_name: '云平台 IaaS 开发部',
      parent_group_id: 'grp-02',
      level: 2,
      seq_order: 2
    },
    {
      group_id: 'grp-06',
      group_name: 'OpenPitrix',
      parent_group_id: 'grp-04',
      level: 2,
      seq_order: 1
    },
    {
      group_id: 'grp-07',
      group_name: 'AppCenter',
      parent_group_id: 'grp-04',
      level: 2,
      seq_order: 2
    },
    {
      group_id: 'grp-08',
      group_name: 'KubeSphere',
      parent_group_id: 'grp-04',
      level: 2,
      seq_order: 3
    },
    {
      group_id: 'grp-9',
      group_name: '应用服务商',
      parent_group_id: 'grp-03',
      level: 2,
      seq_order: 1
    },
    {
      group_id: 'grp-10',
      group_name: '普通用户',
      parent_group_id: 'grp-03',
      level: 2,
      seq_order: 2
    }
  ]
};
