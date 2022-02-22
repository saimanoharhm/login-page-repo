import React, { useState, useContext } from 'react';
import classes from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

// let obj: string;
const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();
  const [enteredConPassword, setEnteredConPassword] = useState('');
  const [conPasswordIsValid, setConPasswordIsValid] = useState<boolean>();
  const [formIsValid, setFormIsValid] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredEmail(event.target.value);
    setFormIsValid(
      event.target.value.includes('@') && enteredPassword.trim().length > 5
    );
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredPassword(event.target.value);
    setFormIsValid(
      enteredEmail.includes('@') &&
        enteredEmail.includes('.com') &&
        event.target.value.trim().length > 5
    );
  };

  const conPasswordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredConPassword(event.target.value);
    setFormIsValid(
      enteredEmail.includes('@') &&
        enteredEmail.includes('.com') &&
        event.target.value.trim().length > 5
    );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(
      enteredEmail.includes('@') && enteredEmail.includes('.com')
    );
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 5);
  };

  const validateConPasswordHandler = () => {
    setConPasswordIsValid(enteredConPassword.trim().length > 5);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD7w1KBlvUlhLwQMj4Cy_x5fEotvo0vVSw';
      // 'https://anisoft.us/airbackup/api/user/validateuser';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD7w1KBlvUlhLwQMj4Cy_x5fEotvo0vVSw';
      // 'https://anisoft.us/airbackup/api/user/createuser';
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
          // return res.text();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data);
        console.log(data.idToken);
        authCtx.login(data.idToken);
        navigate('/');
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1 className={classes.header}>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`}
        >
          <label
            htmlFor="email"
            className={`${emailIsValid === false ? classes.invalidLabel : ''}`}
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            required
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
          {
            <p className={classes.invalidText}>{`${
              emailIsValid === false ? 'Please enter valid email!' : ''
            }`}</p>
          }
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label
            htmlFor="password"
            className={`${
              passwordIsValid === false ? classes.invalidLabel : ''
            }`}
          >
            Your Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Your Password"
            required
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
          {
            <p className={classes.invalidText}>{`${
              passwordIsValid === false
                ? 'Password should contain atleast 6 characters.'
                : ''
            }`}</p>
          }
        </div>
        {!isLogin && (
          <div
            className={`${classes.control} ${
              conPasswordIsValid === false ? classes.invalid : ''
            }`}
          >
            <label
              htmlFor="password"
              className={`${
                conPasswordIsValid === false ? classes.invalidLabel : ''
              }`}
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Confirm Password"
              required
              value={enteredConPassword}
              onChange={conPasswordChangeHandler}
              onBlur={validateConPasswordHandler}
            />
            {
              <p className={classes.invalidText}>{`${
                conPasswordIsValid === false
                  ? 'Password should contain atleast 6 characters and must match to above.'
                  : ''
              }`}</p>
            }
          </div>
        )}
        <div className={classes.actions}>
          {!isLoading && (
            <button className={classes.login} disabled={!formIsValid}>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
