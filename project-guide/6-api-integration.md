# Best Practices for Connecting to APIs via Axios in React

Connecting to APIs is a fundamental part of modern web development. Axios is a popular HTTP client for making API requests due to its simplicity, promise-based structure, and interceptors. Below, we’ll explore best practices with real-world examples to ensure efficient, secure, and maintainable API integration.

---

## 1. Structuring API Requests Properly

**Best Practice:**  
✅ Create a centralized API service to avoid repeating Axios configurations across components.

**Example:** `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000, // Fail if request takes longer than 5s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (e.g., add JWT token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor (e.g., handle 401 errors)
api.interceptors.response.use(
  (response) => response.data, // Directly return data
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Why?**

- **Reusability:** Avoid rewriting `baseURL`, headers, and interceptors.
- **Security:** Automatically attach tokens.
- **Error Handling:** Centralized logic for failed requests.

---

## 2. Using `useEffect` for Data Fetching

**Best Practice:**  
✅ Fetch data in `useEffect` and manage loading, error, and data states.

**Example:** Fetching Users

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency = runs once on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Why?**

- **Avoid race conditions:** Cleanup if the component unmounts (next section).
- **User feedback:** Show loading/error states.

---

## 3. Cancelling Requests on Unmount (Cleanup)

**Best Practice:**  
✅ Cancel pending requests when a component unmounts to prevent memory leaks.

**Example:** Using `AbortController`

```javascript
useEffect(() => {
  const abortController = new AbortController();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', {
        signal: abortController.signal,
      });
      setUsers(response.data);
    } catch (err) {
      if (!abortController.signal.aborted) {
        setError('Failed to fetch users.');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();

  return () => abortController.abort(); // Cleanup on unmount
}, []);
```

**Why?**

- Prevents `"Can't perform state update on unmounted component"` warnings.
- Stops unnecessary network requests.

---

## 4. Error Handling Strategies

**Best Practice:**  
✅ Handle API errors gracefully (network issues, 4xx/5xx responses).

**Example:** Structured Error Handling

```javascript
try {
  const response = await api.get('/users');
  setUsers(response.data);
} catch (err) {
  if (err.response) {
    // Server responded with 4xx/5xx
    console.error('Server error:', err.response.status);
    setError('Server error. Please try again.');
  } else if (err.request) {
    // No response received (network issue)
    console.error('Network error:', err.message);
    setError('Network error. Check your connection.');
  } else {
    // Other errors (e.g., Axios config issue)
    console.error('Unexpected error:', err.message);
    setError('Something went wrong.');
  }
}
```

**Why?**

- Improves debugging (logs different error types).
- Better user experience (specific error messages).

---

## 5. Optimizing Performance (Debouncing, Caching)

**Best Practice:**  
✅ Debounce search inputs to avoid excessive API calls.

**Example:** Debounced Search with Lodash

```javascript
import { debounce } from 'lodash';

function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm) return;
    const response = await api.get(`/users?q=${searchTerm}`);
    setResults(response.data);
  }, 500); // Wait 500ms after last keystroke

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel(); // Cleanup
  }, [query]);

  return (
    <div>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Why?**

- Reduces unnecessary API calls.
- Improves performance and server load.

---

## 6. Handling CRUD Operations

**Best Practice:**  
✅ Re-fetch data after mutations (POST/PUT/DELETE) to keep UI in sync.

**Example:** Adding a New User

```javascript
const addUser = async (userData) => {
  try {
    await api.post('/users', userData);
    // Option 1: Re-fetch all users
    const response = await api.get('/users');
    setUsers(response.data);

    // Option 2: Optimistically update UI
    // setUsers((prev) => [...prev, userData]);
  } catch (err) {
    console.error('Failed to add user:', err);
  }
};
```

**Why?**

- Ensures data consistency between frontend and backend.
- Optimistic updates can improve perceived performance.

---

## 7. Using Custom Hooks for API Calls

**Best Practice:**  
✅ Abstract API logic into reusable custom hooks.

**Example:** `useFetch` Hook

```javascript
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage in a component
const { data: users, loading, error } = useFetch('/users');
```

**Why?**

- Reduces code duplication.
- Promotes separation of concerns.

---

## Summary of Best Practices

| **Best Practice**         | **Example**                                   |
| ------------------------- | --------------------------------------------- |
| Centralized API service   | `axios.create()` with interceptors            |
| Loading & error states    | `useState` for loading and error              |
| Request cleanup           | `AbortController` in `useEffect`              |
| Structured error handling | Differentiate `err.response` vs `err.request` |
| Debouncing                | Lodash `debounce` for search inputs           |
| Re-fetch after mutations  | Call `GET` after `POST/PUT/DELETE`            |
| Custom hooks              | `useFetch` for reusable logic                 |

---

**Final Thoughts**

- Always handle errors – never assume API calls will succeed.
- Optimize performance – debounce, cache, and cancel requests.
- Keep code DRY – use services and custom hooks.
