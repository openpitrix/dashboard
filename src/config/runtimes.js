export const providers = [
  { name: 'qingcloud', icon: 'qingcloud', key: 'qingcloud' },
  { name: 'aliyun', icon: 'aliyun', key: 'aliyun' },
  { name: 'aws', icon: 'aws', key: 'aws' },
  { name: 'kubernetes', icon: 'kubernetes', key: 'kubernetes' },
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

export const runtimeTabs = [
  { name: 'Instance', value: 0 },
  { name: 'Agent', value: 1 }
];
