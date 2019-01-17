import Upload from 'components/Base/Upload';

const findByRef = (wrapper, ref = '') => wrapper.findWhere(node => node.getDOMNode() === wrapper.instance()[ref]);

describe('Base/Upload', () => {
  const checkFile = jest.fn().mockReturnValue(() => true);

  const file1 = {
    name: 'cat.jpg',
    size: 1000,
    type: 'image/jpeg'
  };
  const file2 = {
    name: 'dog.jpg',
    size: 1000,
    type: 'image/jpeg'
  };

  const fileContents = 'file contents';
  const file = new Blob([fileContents], { type: 'text/plain' });
  const readAsDataURL = jest.fn();
  const addEventListener = jest.fn((_, evtHandler) => {
    evtHandler();
  });
  const dummyFileReader = {
    addEventListener,
    readAsDataURL,
    result: fileContents
  };
  window.FileReader = jest.fn(() => dummyFileReader);

  it('basic render', () => {
    const wrapper = render(<Upload />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('disabled', () => {
    const wrapper = mount(<Upload disabled />);
    expect(wrapper.prop('disabled')).toBeTruthy();
  });

  it('call keyDown', () => {
    const wrapper = mount(<Upload />);
    wrapper.simulate('keyDown', { key: 'Enter' });
  });

  it('call dragOver', () => {
    const wrapper = mount(<Upload />);
    wrapper.simulate('dragOver', { type: 'dragover' });
    expect(wrapper.state().isDraging).toBe(true);
  });

  it('call dragLeave', () => {
    const wrapper = mount(<Upload />);
    wrapper.simulate('dragOver', { type: 'dragleave' });
    expect(wrapper.state().isDraging).toBe(false);
  });

  it('call drop', () => {
    const wrapper = mount(<Upload />);
    wrapper.simulate('drop', { dataTransfer: { files: [file] } });
    expect(wrapper.state().isDraging).toBe(false);
    wrapper.unmount();
  });

  it('call onChange', () => {
    const wrapper = mount(<Upload checkFile={checkFile} />);
    const input = findByRef(wrapper, 'fileInput');
    input.simulate('change', { target: { files: [file] } });
    expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
  });

  it('call directory onFileDrop', () => {
    const wrapper = mount(
      <Upload directory accept="jpg" checkFile={checkFile} />
    );

    const createReader = jest.fn();
    createReader.mockReturnValue({
      readEntries: jest.fn().mockReturnValue(['test'])
    });

    const webkitGetAsEntry = jest.fn();
    webkitGetAsEntry
      .mockReturnValueOnce({
        isFile: true,
        file: jest.fn()
      })
      .mockReturnValueOnce({
        isFile: false,
        isDirectory: true,
        createReader
      });
    file1.webkitGetAsEntry = webkitGetAsEntry;
    file2.webkitGetAsEntry = webkitGetAsEntry;
    const items = [file1, file2];

    wrapper.simulate('drop', { dataTransfer: { items } });
    expect(webkitGetAsEntry).toHaveBeenCalled();
    expect(createReader).toHaveBeenCalled();
    wrapper.unmount();
  });
});
