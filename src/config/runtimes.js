export const providers = [
  { name: 'QingCloud', icon: 'qingcloud', key: 'qingcloud' },
  { name: 'Aliyun', icon: 'aliyun', key: 'aliyun' },
  { name: 'Amazon Web Service', icon: 'aws', key: 'aws' },
  { name: 'Kubernetes', icon: 'kubernetes', key: 'kubernetes' },
  {
    name: 'OpenStack',
    icon: 'openstack',
    key: 'openstack',
    disabled: true
  },
  {
    name: 'VMware',
    icon: 'vmware',
    key: 'vmware',
    disabled: true
  },
  {
    name: 'EdgeWise',
    icon: 'edgewise',
    key: 'edgewise',
    disabled: true
  }
];

export const PLATFORM = {
  qingcloud: 'qingcloud',
  aliyun: 'aliyun',
  aws: 'aws',
  kubernetes: 'kubernetes'
};

export const userTabs = [
  { name: 'My runtimes', value: 'runtime' },
  { name: 'Authorization info', value: 'runtime_credential' }
];

export const nonUserTabs = [
  { name: 'Testing env', value: 'runtime' },
  { name: 'Authorization info', value: 'runtime_credential' }
];

export const runtimeTabs = [
  { name: 'Instance', value: 0 },
  { name: 'Agent', value: 1 }
];

export const providerMap = {
  vmbased: ['qingcloud', 'aws', 'aliyun'],
  helm: ['kubernetes']
};

export const CLUSTER_TYPE = {
  instance: 0,
  agent: 1
};

export const regExpNamespace = /^[a-z0-9]([a-z0-9]*[a-z0-9])?$/;

export const platformUrl = {
  qingcloud: {
    console: 'https://console.qingcloud.com/',
    accessKey: 'https://console.qingcloud.com/access_keys/'
  },
  aws: {
    console: 'https://console.aws.amazon.com/',
    accessKey:
      'https://console.aws.amazon.com/iam/home?region=us-east-2#/security_credentials/'
  },
  aliyun: {
    console: 'https://home.console.aliyun.com/',
    accessKey: 'https://usercenter.console.aliyun.com/#/manage/ak/'
  }
};
