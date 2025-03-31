// src/components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await login(username, password);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username || '');
        localStorage.setItem('role', response.role || '');
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}

      <div>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='text'
          value={formData.username}
          onChange={handleChange}
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          className='w-full p-2 border rounded'
        />
      </div>

      <button type='submit' className='bg-neutral-900 text-white p-3 rounded'>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
