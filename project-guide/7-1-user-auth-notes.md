# User Authentication with JWT (React + REST API)

## 1. Understanding JWT (JSON Web Tokens)

### What is a JWT?

A compact, URL-safe token format (`header.payload.signature`) for securely transmitting claims between parties.

**Structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Use Case:**  
After login, the server returns a JWT, which the frontend stores (e.g., in `localStorage` or `httpOnly` cookies) and sends with subsequent requests.

---

## 2. Best Practices with Relatable Examples

### 2.1 Secure Token Storage

**Bad Practice:** Storing JWT in `localStorage` without encryption (vulnerable to XSS).  
 **Best Practice:**

- Use `httpOnly` cookies (server-side) for better security.
- If using `localStorage`, encrypt the token (e.g., with `crypto-js`).

**Example (Frontend - Storing Token):**

```jsx
// After successful login:
const { token } = await axios.post('/api/login', { email, password });
localStorage.setItem('authToken', token); // Only if no httpOnly option
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Attach to headers
```

---

### 2.2 Token Expiry & Refresh Tokens

**Bad Practice:** Using a single long-lived JWT (risk if stolen).  
 **Best Practice:**

- Set short-lived access tokens (e.g., 15 mins) + long-lived refresh tokens.
- Store refresh tokens securely (`httpOnly` cookie) and use them to get new access tokens.

**Example (Token Refresh Flow):**

```jsx
// 1. Login -> Get accessToken and refreshToken
const { accessToken, refreshToken } = await loginUser();

// 2. When accessToken expires, call `/refresh` endpoint
try {
  const { newAccessToken } = await axios.post('/api/refresh', { refreshToken });
  localStorage.setItem('authToken', newAccessToken);
} catch (err) {
  // Force logout if refresh fails
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

---

### 2.3 Protecting Routes

**Bad Practice:** Only checking token presence (no validation).  
 **Best Practice:**

- Verify token validity (e.g., signature, expiry) before granting access.
- Use a higher-order component (HOC) or `<ProtectedRoute>` wrapper.

**Example (ProtectedRoute.jsx):**

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = token && !isTokenExpired(token); // Add expiry check

  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

// Usage:
<Route
  path='/dashboard'
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

---

### 2.4 Handling Token Expiry Gracefully

**Bad Practice:** Silent failures when token expires.  
 **Best Practice:**

- Intercept `401` errors globally (Axios) and attempt token refresh.

**Example (Axios Interceptor):**

```jsx
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config); // Retry request
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

### 2.5 CSRF Protection

**Bad Practice:** Ignoring CSRF when using cookies.  
 **Best Practice:**

- Use anti-CSRF tokens (e.g., `csrf-token` header) if using cookies.

**Example (Django-style CSRF):**

```jsx
// Frontend: Attach CSRF token from cookie to headers
const csrfToken = getCookie('csrftoken');
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
```

---

### 2.6 Password Security

**Bad Practice:** Sending plaintext passwords.  
 **Best Practice:**

- Always hash passwords on the backend.
- Use HTTPS to encrypt traffic.

**Example (Frontend - Basic Validation):**

```jsx
// Prevent weak passwords before sending to API
const handleSubmit = () => {
  if (password.length < 8) {
    setError('Password must be 8+ characters');
    return;
  }
  axios.post('/api/register', { email, password });
};
```

---

### 2.7 Logout Mechanism

**Bad Practice:** Only clearing frontend token.  
 **Best Practice:**

- Call a `/logout` endpoint to invalidate the token on the server.
- Clear client-side storage.

**Example (Logout Flow):**

```jsx
const handleLogout = async () => {
  await axios.post('/api/logout'); // Server blacklists token
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
```

---

## 3. Real-World Example: Auth Flow in a Todo App

### Step 1: Login

```jsx
const login = async (email, password) => {
  const res = await axios.post('/api/login', { email, password });
  localStorage.setItem('authToken', res.data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
};
```

### Step 2: Authenticated API Calls

```jsx
// Fetch protected data
const fetchTodos = async () => {
  const res = await axios.get('/api/todos');
  setTodos(res.data);
};
```

### Step 3: Token Refresh

```jsx
// In a separate service file (auth.js)
export const refreshAuthToken = async () => {
  const refreshToken = getCookie('refreshToken');
  const res = await axios.post('/api/refresh', { refreshToken });
  localStorage.setItem('authToken', res.data.accessToken);
  return res.data.accessToken;
};
```

---

## 4. Common Pitfalls & Fixes

| **Pitfall**                   | **Solution**                       |
| ----------------------------- | ---------------------------------- |
| Storing JWT in `localStorage` | Use `httpOnly` cookies or encrypt. |
| No token expiry check         | Validate `exp` claim in JWT.       |
| No refresh token logic        | Implement `/refresh` endpoint.     |
| No CSRF protection            | Add `X-CSRF-TOKEN` header.         |

---

## 5. Key Takeaways

- Never store sensitive data in JWT (e.g., passwords).
- Always expire tokens (short-lived access + refresh tokens).
- Secure storage: Prefer `httpOnly` cookies over `localStorage`.
- Handle `401` errors globally with Axios interceptors.
- Protect routes with `<ProtectedRoute>`.
