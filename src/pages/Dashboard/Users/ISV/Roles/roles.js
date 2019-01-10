export default [
  {
    name: '超级管理员',
    value: 'global_admin',
    description: '拥有所有功能的最高权限，不得编辑和删除。',
    authList: [
      { title: '应用开发中心', auths: ['创建应用', '提交应用', '测试应用'] },
      { title: '测试环境', auths: ['创建环境', '创建环境授权信息', '管理环境'] }
    ]
  },
  {
    name: '管理员',
    value: 'admin',
    description: '负责日常管理工作。',
    authList: [
      { title: '应用开发中心', auths: ['创建应用', '提交应用', '测试应用'] },
      { title: '测试环境', auths: ['创建环境', '创建环境授权信息', '管理环境'] }
    ]
  },
  {
    name: '开发人员',
    value: 'developer',
    description: '负责开发、测试、运维应用。',
    authList: [
      { title: '应用开发中心', auths: ['创建应用', '提交应用', '测试应用'] },
      { title: '测试环境', auths: ['创建环境', '创建环境授权信息', '管理环境'] }
    ]
  },
  {
    name: '财务人员',
    value: 'financial',
    description: '负责帐户的收入、消费以及对账管理等工作。',
    authList: [
      { title: '应用开发中心', auths: ['创建应用', '提交应用', '测试应用'] },
      { title: '测试环境', auths: ['创建环境', '创建环境授权信息', '管理环境'] }
    ]
  }
];
