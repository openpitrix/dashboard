import TdUser from 'components/TdUser';

describe('Component TdUser', () => {
  const users = [
    {
      user_id: 'user-123',
      name: 'user123'
    },
    {
      user_id: 'user-133',
      name: 'user133'
    }
  ];

  it('basic render', () => {
    const wrapper = render(<TdUser users={users} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has find user', () => {
    const wrapper = render(<TdUser users={users} userId="user123" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
