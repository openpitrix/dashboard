import { mappingStatus } from 'utils';

const filters = (onChange, selectValue) => [
  {
    key: 'status',
    conditions: [
      { name: 'Draft', value: 'draft' },
      { name: mappingStatus('Active'), value: 'active' },
      { name: mappingStatus('Suspended'), value: 'suspended' },
      { name: 'Deleted', value: 'deleted' }
    ],
    onChangeFilter: onChange,
    selectValue
  }
];

export default filters;
