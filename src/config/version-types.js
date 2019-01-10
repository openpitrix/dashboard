import _ from 'lodash';

export const versionTypes = [
  {
    icon: 'vm-icon',
    name: 'VM',
    value: 'vmbased',
    intro: 'delivery_type_intro_vm'
  },
  {
    icon: 'helm-icon',
    name: 'Helm',
    value: 'helm',
    intro: 'delivery_type_intro_helm'
  },
  {
    icon: 'saas-icon',
    name: 'SaaS',
    value: 'saas',
    intro: 'delivery_type_intro_saas',
    disable: true
  },
  {
    icon: 'api-icon',
    name: 'API',
    value: 'api',
    intro: 'delivery_type_intro_api',
    disable: true
  },
  {
    icon: 'native-icon',
    name: 'Native',
    value: 'native',
    intro: 'delivery_type_intro_native',
    disable: true
  },
  {
    icon: 'serveless-icon',
    name: 'Serveless',
    value: 'serveless',
    intro: 'delivery_type_intro_serveless',
    disable: true
  }
];

export const getVersionTypesName = types => {
  if (!types) {
    return '';
  }

  const typeArr = types.split(',');
  return typeArr.map(
    type => (_.find(versionTypes, { value: type }) || {}).name || type
  );
};
