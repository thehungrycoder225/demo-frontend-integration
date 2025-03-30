# Complete JWT Authentication Workflow with React & REST API (Step-by-Step with Forms)

This guide walks through a full authentication system with practical examples covering:

- **User Registration**
- **Login**
- **Protected Routes**
- **Token Refresh**
- **Logout**

---

## 1. Setup & Project Structure

```plaintext
📂 src/
├── 📂 api/ # API service layer
│   ├── auth.js # Auth-related API calls
│   └── axios.js # Axios instance
├── 📂 components/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   └── ProtectedRoute.jsx
├── 📂 hooks/
│   └── useAuth.js # Custom auth hook
├── 📂 pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── App.jsx
└── main.jsx
```

---

## 2. Backend API Endpoints (Example)

Assume we have these REST endpoints:

```http
POST /api/auth/register  # Register user
POST /api/auth/login     # Login (returns JWT)
POST /api/auth/refresh   # Refresh token
POST /api/auth/logout    # Invalidate token
GET  /api/profile        # Protected route
```

---

## 3. Step-by-Step Implementation

### 3.1 Configure Axios Instance

```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### 3.2 Auth Service Layer

```javascript
// src/api/auth.js
import api from './axios';

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data.user;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data.accessToken;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
};
```

---

### 3.3 Login Form with Validation

```javascript
// src/components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}

      <div>
        <label>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>

      <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
        Login
      </button>
    </form>
  );
};
```

---

### 3.4 Protected Route Component

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return isTokenValid(token) ? children : <Navigate to='/login' replace />;
};
```

---

### 3.5 App Router Setup

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 3.6 Dashboard with Logout

```javascript
// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import api from '../api/axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUserData(response.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className='p-4'>
      <h1>Welcome {userData?.name}!</h1>
      <button
        onClick={handleLogout}
        className='bg-red-500 text-white p-2 rounded'
      >
        Logout
      </button>
    </div>
  );
};
```

---

## 4. Key Security Practices Implemented

- **Token Storage**: Using interceptors to automatically attach tokens.
- **Token Refresh**: Automatic 401 handling with retry logic.
- **Route Protection**: Checking token validity before rendering.
- **Form Validation**: Basic client-side validation.
- **Secure Logout**: Server-side token invalidation.

---

## 5. Testing the Flow

- **Registration**: Submit form → Store token → Redirect to dashboard.
- **Protected Access**: Access `/dashboard` without login → Redirect to login.
- **Token Refresh**: Wait for token to expire → Next API call auto-refreshes.
- **Logout**: Clears token → Redirects to login.

---

## 6. Enhancements for Production

- Add loading states during API calls.
- Implement password reset flow.
- Add role-based access control (RBAC).
- Use `httpOnly` cookies instead of `localStorage`.
- Implement CAPTCHA for registration/login.

---
