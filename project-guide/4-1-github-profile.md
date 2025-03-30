# GitHub User Explorer with Advanced React Patterns

Here's a complete implementation of a GitHub profile viewer with lazy loading, skeleton UI, API caching, and error boundaries.

---

## 1. Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── Profile/
│   │   ├── Profile.jsx (lazy)
│   │   └── ProfileSkeleton.jsx
│   ├── Repos/
│   │   ├── RepoList.jsx
│   │   ├── RepoSkeleton.jsx
│   │   └── RepoCard.jsx
│   └── Search.jsx
├── hooks/
│   ├── useCachedFetch.js
│   └── useGitHubAPI.js
├── pages/
│   └── Explorer.jsx
└── services/
  └── github.js
```

---

## 2. Core Implementation

### 2.1 API Service with Cache Layer

```javascript
// services/github.js
const cache = new Map();

export const fetchGitHubData = async (endpoint) => {
  if (cache.has(endpoint)) {
    return cache.get(endpoint);
  }

  try {
    const response = await fetch(`https://api.github.com${endpoint}`);
    const data = await response.json();
    cache.set(endpoint, data);
    return data;
  } catch (error) {
    throw new Error(`GitHub API failed: ${error.message}`);
  }
};
```

### 2.2 Custom Hook with Cache

```javascript
// hooks/useGitHubAPI.js
import { useState, useEffect } from 'react';
import { fetchGitHubData } from '../services/github';

export const useGitHubAPI = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGitHubData(endpoint);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
```

---

## 3. UI Components

### 3.1 Lazy-Loaded Profile Section

```javascript
// components/Profile/Profile.jsx
const Profile = ({ username }) => {
  const { data, loading, error } = useGitHubAPI(`/users/${username}`);

  if (loading) return <ProfileSkeleton />;
  if (error) throw error; // Let ErrorBoundary catch

  return (
    <div className='profile-card'>
      <img src={data.avatar_url} alt={data.name} />
      <h2>{data.name}</h2>
      <p>{data.bio}</p>
    </div>
  );
};

export default Profile;

// components/Profile/ProfileSkeleton.jsx
export const ProfileSkeleton = () => (
  <div className='skeleton-profile'>
    <div className='skeleton-avatar' />
    <div className='skeleton-name' />
    <div className='skeleton-bio' />
  </div>
);
```

### 3.2 Repository List with Skeleton

```javascript
// components/Repos/RepoList.jsx
const RepoList = ({ username }) => {
  const { data, loading, error } = useGitHubAPI(`/users/${username}/repos`);

  if (loading) return <RepoSkeleton count={5} />;
  if (error) return <div className='error'>Error loading repos</div>;

  return (
    <div className='repo-grid'>
      {data.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

// components/Repos/RepoSkeleton.jsx
export const RepoSkeleton = ({ count }) => (
  <div className='skeleton-grid'>
    {[...Array(count)].map((_, i) => (
      <div key={i} className='skeleton-repo'>
        <div className='skeleton-repo-name' />
        <div className='skeleton-repo-desc' />
      </div>
    ))}
  </div>
);
```

---

## 4. Error Boundary

```javascript
// components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-boundary'>
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 5. Main Explorer Page

```javascript
// pages/Explorer.jsx
import { lazy, Suspense, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Search from '../components/Search';
import { RepoSkeleton } from '../components/Repos/RepoSkeleton';

const Profile = lazy(() => import('../components/Profile/Profile'));

export default function Explorer() {
  const [username, setUsername] = useState('octocat');

  return (
    <div className='explorer'>
      <Search onSearch={setUsername} />

      <ErrorBoundary>
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile username={username} />
        </Suspense>
      </ErrorBoundary>

      <h3>Repositories</h3>
      <Suspense fallback={<RepoSkeleton count={5} />}>
        <RepoList username={username} />
      </Suspense>
    </div>
  );
}
```

---

## 6. Search Component

```javascript
// components/Search.jsx
export const Search = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Enter GitHub username'
      />
      <button type='submit'>Search</button>
    </form>
  );
};
```

---

## 7. Styling (Tailwind CSS Example)

```css
/* Skeleton styles */
.skeleton-profile,
.skeleton-repo {
  background: #eee;
  background-image: linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px);
  background-size: 200%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px;
  }
  100% {
    background-position: calc(200px + 100%);
  }
}

/* Error boundary */
.error-boundary {
  @apply p-4 border border-red-300 bg-red-50 rounded;
}
```

---

## Key Features Demonstrated

- **Lazy Loading**: Profile component loads only when needed, reducing initial bundle size.
- **Skeleton UI**: `ProfileSkeleton` and `RepoSkeleton` provide visual feedback during data fetch.
- **API Caching**: Prevents duplicate requests and enables instant load for previously viewed profiles.
- **Error Handling**: Error boundaries catch component errors and provide graceful fallback UI.
- **Performance Optimizations**: Memoized API responses, code splitting, and loading states prevent layout shift.

---

## Usage Example

```javascript
// App.jsx
import { Suspense } from 'react';
import Explorer from './pages/Explorer';

function App() {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <Explorer />
    </Suspense>
  );
}
```

Try searching for:

- `octocat` (GitHub's mascot)
- `gaearon` (Dan Abramov)
- Your own GitHub username
