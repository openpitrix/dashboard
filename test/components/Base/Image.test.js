import Image from 'components/Base/Image';

const setup = global.setWrapper(Image);

describe('Base/Iamge', () => {
  it('renders attachments', () => {
    const wrapper = setup('render', {
      src: '/helloword'
    });
    expect(wrapper).toMatchSnapshot();
  });
});
