# **DevNotes: JWT Authentication with Role-Based Access Control (RBAC) in React & REST API**

## **1. Overview**

This guide covers implementing **JWT Authentication** with **Role-Based Access Control (RBAC)** in a React frontend connected to a REST API. It ensures only authorized users can access protected routes and enforces role-specific access control.

### **Key Features:**

- Secure **User Registration & Login**
- **JWT Authentication** with LocalStorage
- **Protected Routes** using React Router
- **Role-Based Access Control (RBAC)** (e.g., Admin/User)
- **Logout Handling**
- **Error Handling & Best Practices**

---

## **2. Project Structure**

```
project-root/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   ├── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AdminPage.jsx
│   │   ├── Unauthorized.jsx
│   ├── services/
│   │   ├── authService.js
│   ├── App.jsx
│   ├── index.jsx
├── .env
├── package.json
```

---

## **3. Authentication Workflow**

### **Step 1: Setting Up Authentication Service**

#### **`src/services/authService.js`**

```js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const registerUser = async (userData) =>
  axios.post(`${API_URL}/register`, userData);
export const loginUser = async (userData) =>
  axios.post(`${API_URL}/login`, userData);
export const getUserProfile = async (token) => {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
```

---

### **Step 2: Context API for Global Auth State**

#### **`src/context/AuthContext.js`**

```js
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
```

---

### **Step 3: Implementing Login with Role Handling**

#### **`src/components/Login.jsx`**

```js
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/authService';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      login(response.data);
      navigate(response.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      alert('Invalid login credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder='Email' />
      <input type='password' {...register('password')} placeholder='Password' />
      <button type='submit'>Login</button>
    </form>
  );
}

export default Login;
```

---

### **Step 4: Role-Based Protected Routes**

#### **`src/components/ProtectedRoute.jsx`**

```js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to='/login' />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to='/unauthorized' />;

  return children;
}

export default ProtectedRoute;
```

---

### **Step 5: Implementing Role-Based Routes in `App.jsx`**

#### **`src/App.jsx`**

```js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/unauthorized' element={<Unauthorized />} />

          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedRoute requiredRole='admin'>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

### **Step 6: Implementing Logout**

#### **`src/components/Logout.js`**

```js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Logout() {
  const { logout } = useContext(AuthContext);
  return <button onClick={logout}>Logout</button>;
}

export default Logout;
```

---

## **7. Summary & Best Practices**

✅ **Secure authentication with JWT & LocalStorage**
✅ **Role-Based Access using React Context**
✅ **Protected routes using `ProtectedRoute.js`**
✅ **Logout and automatic token removal**
✅ **Graceful error handling & redirects**
