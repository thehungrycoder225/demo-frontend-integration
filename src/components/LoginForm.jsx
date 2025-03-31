// src/components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import toast, { Toaster } from 'react-hot-toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await login(username, password);

      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <form onSubmit={handleSubmit} className='space-y-4'>
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

        <button
          type='submit'
          className='bg-neutral-900 font-semibold text-white p-3 rounded hover:bg-neutral-800 transition duration-200 ease-in-out w-full'
        >
          Login
        </button>
      </form>
    </>
  );
};

export default LoginForm;
