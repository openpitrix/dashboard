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

export const userTabs = [
  { name: 'My runtimes', value: 'runtime' },
  { name: 'Authorization info', value: 'runtime_credential' }
];

export const nonUserTabs = [
  { name: 'Testing env', value: 'runtime' },
  { name: 'Authorization info', value: 'runtime_credential' }
];
