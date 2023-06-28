import React from 'react';
import HeaderComponent from '../components/HeaderComponent';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <HeaderComponent />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
