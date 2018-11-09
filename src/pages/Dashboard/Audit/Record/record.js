export const records = [
  {
    status: 'passed',
    title: '服务商自审',
    description: '服务商管理员自行审核应用的基本信息，以及服务商的认证与合约是否齐全完整。',
    process: [
      {
        status: 'passed',
        name: '确认应用信息及功能'
      },
      {
        status: 'passed',
        name: '确认应用定价 '
      },
      {
        status: 'passed ',
        name: '服务商认证申请'
      },
      {
        status: 'passed',
        name: '服务商认证申请 '
      }
    ],
    auditor: 'alex@yunify.com',
    passTime: '2018年10月24日 12:22:34'
  },
  {
    status: 'processing',
    title: '平台-商务审核',
    description: '审核服务商认证信息，以及合约和保证金签署和缴纳情况、应用定价等。',
    process: [
      {
        status: 'passed',
        name: '应用信息'
      },
      {
        status: 'passed',
        name: '应用定价 '
      },
      {
        status: 'process',
        name: '服务商信息'
      },
      {
        status: 'error',
        name: '服务商合约 '
      }
    ],
    auditor: 'lhliang@yunify.com',
    passTime: '2018年10月24日 12:22:34'
  },
  {
    status: 'notStarted',
    title: '平台-技术审核',
    description: '严格测试应用的功能性、稳定性，以及应用的各个信息。',
    process: [
      {
        status: 'notStarted',
        name: '应用全部功能'
      },
      {
        status: 'notStarted',
        name: '应用定价 '
      }
    ],
    auditor: 'ray@yunify.com',
    passTime: '2018年10月24日 12:22:34'
  }
];
