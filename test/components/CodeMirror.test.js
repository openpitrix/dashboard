import CodeMirror from 'components/CodeMirror';

describe('Component CodeMirror', () => {
  it('basic render', () => {
    const wrapper = <CodeMirror />;

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
