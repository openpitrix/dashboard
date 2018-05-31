import React from 'react';
import TabsNav from 'components/TabsNav';

const navLinks = [
  'overview',
  'apps',
  'clusters',
  'runtimes',
  'repos',
  'users',
  'roles',
  'categories'
];

const ManageTabs = () => <TabsNav links={navLinks} options={{ prefix: '/manage' }} />;

export default ManageTabs;
