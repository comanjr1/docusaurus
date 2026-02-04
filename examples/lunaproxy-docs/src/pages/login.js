import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple demo login - in production, use real authentication
    if (username && password) {
      localStorage.setItem('lunaproxy_user', username);
      localStorage.setItem('lunaproxy_auth', 'true');
      setIsLoggedIn(true);
      // Redirect to dashboard
      window.location.href = '/proxy-dashboard';
    }
  };

  return (
    <Layout
      title="Login"
      description="Login to LunaProxy Dashboard">
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>Login to LunaProxy</h1>
          <p>Access your residential proxy dashboard</p>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          
          <div className={styles.demoInfo}>
            <p><strong>Demo Mode:</strong> Use any username and password to login</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
