import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

import loginService from '../services/login';
import blogService from '../services/blogs';
import Notification from '../components/Notification';

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: null,
  });
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
      return navigate('/');
    } catch {
      setNotificationMessage({
        message: 'wrong credentials',
        type: 'error',
      });
    }
  };

  return (
    <div>
      {/* /TODO: show this info instread of form for logged in user */}
      {/* <p>
        {user.username} logged in <button onClick={logout}>logout</button>
      </p> */}

      <h2>Log in to application</h2>
      <Notification
        notificationMessage={notificationMessage}
        setNotificationMessage={setNotificationMessage}
      />
      <form onSubmit={handleLogin} className="login-form">
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant="standard"
        />
        <TextField
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          variant="standard"
          type="password"
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
