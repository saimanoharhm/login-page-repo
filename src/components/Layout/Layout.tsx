import { Fragment } from 'react';
import MainNavigation from './MainNavigation';

const Layout: React.FC = ({ children }) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
