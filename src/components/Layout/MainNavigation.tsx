import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const MainNavigation: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const logoutHandler = () => {
    authCtx.logout();
    // optional: redirect the user
    navigate('/auth');
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Login Page</div>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
