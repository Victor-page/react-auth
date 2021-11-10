import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import getEndpoint from '../../utils/getEndPoint';

import classes from './AuthForm.module.css';

const alertErrorMessage = (error) => alert(error.message);

const handleError = (data) => {
  let errorMessage = 'Authentication failed!';
  if (data && data.error && data.error.message) {
    errorMessage = data.error.message;
  }

  throw new Error(errorMessage);
};

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleResponse = (response) => {
    setIsLoading(false);
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(handleError);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const requestBodyPayload = JSON.stringify({
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    });

    const configuration = {
      method: 'POST',
      body: requestBodyPayload,
      headers: { 'Content-Type': 'application/json' },
    };

    setIsLoading(true);
    let endPoint;
    if (isLogin) {
      endPoint = getEndpoint('signInWithPassword');
    } else {
      endPoint = getEndpoint('signUp');
    }
    fetch(endPoint, configuration)
      .then(handleResponse)
      .then((data) => {
        authCtx.login(data.idToken);
        history.replace('/');
      })
      .catch(alertErrorMessage);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
            minLength="6"
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin
              ? 'Create a new account'
              : 'Login with an existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
