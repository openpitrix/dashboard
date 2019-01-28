import { Tree } from 'components/Base';

const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      {
        key: '0-0-0',
        title: 'parent 1-1',
        children: [
          {
            key: '0-0-0-0',
            title: 'parent 1-1-0'
          }
        ]
      }
    ]
  }
];

describe('Base/Tree', () => {
  it('basic render', () => {
    const wrapper = render(<Tree treeData={treeData} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
