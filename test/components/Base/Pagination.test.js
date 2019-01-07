import { MemoryRouter } from 'react-router-dom';

import Pagination from 'components/Base/Pagination';

describe('Base/Pagination', () => {
  it('basic render', () => {
    const wrapper = render(
      <MemoryRouter>
        <Pagination className="test" defaultCurrent={2} pageSize={20} />
      </MemoryRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // it('call onChange', () => {
  //   const mockChange = jest.fn();
  //   const wrapper = mount(<Pagination defaultCurrent={2} onChange={mockChange} />);
  //   wrapper.find('.pi-pagination-next').simulate('click');
  //
  //   expect(mockChange).toHaveBeenCalled();
  //   expect(mockChange).toHaveBeenCalledTimes(1);
  //   expect(mockChange.mock.calls[0][0]).toEqual(3);
  // });
});
