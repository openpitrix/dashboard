import TypeVersions from 'components/TypeVersions';
import { mount } from "enzyme";

const props = {
  types: ['helm'],
  versions: [{
    version_id: 'appr-132',
    name: '1.0.0'
  }]
};
describe('Component TypeVersions', () => {
  it('basic render', () => {
    const wrapper = render(<TypeVersions {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onClick', () => {
    const mockClick = jest.fn();
    const wrapper = mount(
      <TypeVersions {...props} changeType={mockClick}>
        Click me
      </TypeVersions>
    );
    wrapper.simulate('click');
  });
});
