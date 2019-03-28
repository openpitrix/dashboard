import React, { Suspense } from 'react';

import Loading from 'components/Loading';

const LazyLoad = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

export default LazyLoad;
