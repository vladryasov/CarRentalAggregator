import React, { useState, FormEvent } from 'react';
import { LoginRequest } from '../types/AuthTypes';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);

  const request: LoginRequest = { email, password, rememberMe };

  try {
    const response = isLoginMode
      ? await login(request)
      : await register(request);

    console.log(`${isLoginMode ? 'Login' : 'Registration'} successful:`, response);

    if (isLoginMode || request.rememberMe) {
      navigate('/main');
    } else {
      // после регистрации перекидываем на форму логина
      setIsLoginMode(true);
      setEmail('');
      setPassword('');
    }
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      `An error occurred during ${isLoginMode ? 'login' : 'registration'}`
    );
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isLoginMode ? 'Login to Your Account' : 'Create a New Account'}</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={styles.input}
          />
        </div>
        {isLoginMode && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
        )}
        <button type="submit" style={styles.button}>
          {isLoginMode ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => setIsLoginMode(!isLoginMode)}
        style={styles.toggleButton}
      >
        {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  error: {
    color: 'red',
    marginBottom: '12px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  field: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    marginTop: '15px',
    textAlign: 'center',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default LoginForm;
