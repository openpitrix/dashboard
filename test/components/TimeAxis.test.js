import TimeAxis from 'components/TimeAxis';

describe('Component TimeAxis', () => {
  const timeList = [
    {
      job_action: 'CreateCluster',
      create_time: '2019-04-08T02:39:28Z',
      status: 'successful'
    },
    {
      job_action: 'UpgradeCluster',
      create_time: '2019-04-09T02:39:28Z',
      status: 'working'
    },
    {
      job_action: 'RollbackCluster',
      create_time: '2019-04-09T03:39:28Z',
      status: 'failed'
    }
  ];

  it('basic render', () => {
    const wrapper = render(<TimeAxis timeList={timeList} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
