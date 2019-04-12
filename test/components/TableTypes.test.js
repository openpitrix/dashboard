import TableTypes from 'components/TableTypes';

const types = [
  { name: 'Unreviewed', value: 'unreviewed', status: ['submitted'] },
  { name: 'Reviewed', value: 'reviewed', status: ['rejected', 'passed'] }
];

describe('Component TableTypes', () => {
  it('basic render', () => {
    const wrapper = render(<TableTypes types={types} activeType="reviewed" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
