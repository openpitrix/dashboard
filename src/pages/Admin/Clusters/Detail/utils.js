export const getFilterOptions = ({trans, onChange, selectValue})=> {
  return [
    {
      key: 'status',
      conditions: [
        { name: trans('Pending'), value: 'pending' },
        { name: trans('Active'), value: 'active' },
        { name: trans('Stopped'), value: 'stopped' },
        { name: trans('Suspended'), value: 'suspended' },
        { name: trans('Deleted'), value: 'deleted' },
        { name: trans('Ceased'), value: 'ceased' }
      ],
      onChangeFilter: onChange,
      selectValue: selectValue
    }
  ];
}
