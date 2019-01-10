import ImageComponent from 'components/Base/Image';

const setup = global.setWrapper(ImageComponent);

describe('Base/Iamge', () => {
  const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC';
  const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC';

  it('basic render', () => {
    const wrapper = setup('render', {
      src: LOAD_SUCCESS_SRC
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('render base64', () => {
    const wrapper = setup('render', {
      src: LOAD_SUCCESS_SRC,
      isBase64Str: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('on error', () => {
    const wrapper = mount(<ImageComponent src={LOAD_FAILURE_SRC} />);
    const img = wrapper.instance().img;
    img.onerror(new Error('mocked error'));
    expect(wrapper.state().failed).toEqual(true);
  });
});
