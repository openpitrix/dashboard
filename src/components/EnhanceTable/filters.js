import { mappingStatus } from 'utils';

const defaultConditions = [
  { name: 'Draft', value: 'draft' },
  { name: mappingStatus('Active'), value: 'active' },
  { name: mappingStatus('Suspended'), value: 'suspended' },
  { name: 'Deleted', value: 'deleted' }
];

const filters = (onChange, selectValue, replace = []) => [
  {
    key: 'status',
    conditions: replace.length ? replace : defaultConditions,
    onChangeFilter: onChange,
    selectValue
  }
];

export default filters;
