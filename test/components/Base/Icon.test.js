import { Icon } from 'components/Base';

describe(`Base/Icon`, () => {
  it(`basic render`, () => {
    const wrapper = shallow(<Icon name="app" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // xit('calls componentWillMount', ()=> {
  //   const spy=jest.spyOn(Icon.prototype, 'componentDidMount');
  //   const wrapper=mount(<Icon name='app'/>);
  //   expect(spy).toHaveBeenCalled();
  // })
});
