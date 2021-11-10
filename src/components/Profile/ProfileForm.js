import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import getEndPoint from '../../utils/getEndPoint';
import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const setAccountInfoEndpoint = getEndPoint('update');

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    const requestBodyPayload = JSON.stringify({
      idToken: authCtx.token,
      password: enteredNewPassword,
      returnSecureToken: false,
    });

    const configuration = {
      method: 'POST',
      body: requestBodyPayload,
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(setAccountInfoEndpoint, configuration)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        history.replace('/');
      })
      .catch(console.log);
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          ref={newPasswordInputRef}
          minLength="6"
          required
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
