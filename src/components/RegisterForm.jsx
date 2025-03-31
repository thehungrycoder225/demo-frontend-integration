import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    if (!username || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    try {
      const response = await register(username, password);
      if (response.success) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        toast.error(
          response.message || 'Registration failed. Please try again.'
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'An error occurred. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          className='bg-pink-900 font-semibold text-white p-3 rounded'
        >
          Register
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
