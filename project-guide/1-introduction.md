# Best Practices for Building React Components with Relatable Examples

Building components efficiently is crucial for scalable and maintainable React applications. Below, we’ll explore best practices with real-world examples for each key concept.

## 1. Introduction to Components

### Best Practices:

- **Single Responsibility Principle (SRP)**  
  Each component should do one thing well.
- **Reusability**  
  Design components to be reused across the app.
- **Proper Naming**  
  Use descriptive names (e.g., `UserCard`, `SearchBar`).

### Example: A Reusable Button Component

```jsx
// Good: Reusable, single responsibility
const Button = ({ label, onClick, variant = 'primary' }) => {
  const baseStyles = 'py-2 px-4 rounded font-medium';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    danger: 'bg-red-500 text-white hover:bg-red-700',
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {label}
    </button>
  );
};

// Usage
<Button label='Submit' onClick={handleSubmit} variant='primary' />;
```

---

## 2. Conditional Rendering

### Best Practices:

- **Avoid Nested Ternary Hell**  
  Use early returns or helper functions for complex logic.
- **Use Logical `&&` for Simple Conditions**  
  Cleaner than ternary when only one branch is needed.

### Example: User Greeting (Conditional Rendering)

```jsx
// Clean & readable
const UserGreeting = ({ user }) => {
  if (!user) return <p>Please log in.</p>; // Early return

  return (
    <div>
      <h2>Welcome back, {user.name}!</h2>
      {user.isAdmin && <button>Admin Dashboard</button>} {/* Logical && */}
    </div>
  );
};

// Avoid nested ternaries:
// {user ? user.isAdmin ? <AdminButton /> : <UserButton /> : <LoginButton />}
```

---

## 3. Event Handling

### Best Practices:

- **Avoid Inline Arrow Functions in Render**  
  Can cause unnecessary re-renders.
- **Use `useCallback` for Memoized Handlers**  
  Optimizes performance in lists.

### Example: Handling Clicks Efficiently

```jsx
// Good: Memoized handler
const UserList = ({ users }) => {
  const handleDelete = useCallback((userId) => {
    console.log('Deleting:', userId);
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
```

---

## 4. State Management

### Best Practices:

- **Lift State Up When Shared**  
  Avoid prop drilling; use Context API or state management libraries (Redux, Zustand).
- **Avoid Deeply Nested State**  
  Flatten state structure for easier updates.

### Example: Shopping Cart (State Management)

```jsx
// Lifting state up to parent
const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cart} />
    </>
  );
};
```

---

## 5. Props: Passing Data & Functions

### Best Practices:

- **Use Prop Types (`prop-types` or TypeScript)**  
  Catch bugs early with type checking.
- **Keep Props Minimal**  
  Avoid passing too many props; consider composition.

### Example: Typed Props with TypeScript

```tsx
// Type-safe props
type UserCardProps = {
  name: string;
  age: number;
  onEdit: (id: number) => void;
};

const UserCard = ({ name, age, onEdit }: UserCardProps) => (
  <div>
    <h3>
      {name}, {age}
    </h3>
    <button onClick={() => onEdit(1)}>Edit</button>
  </div>
);
```

---

## 6. Styling Components (Tailwind Best Practices)

### Best Practices:

- **Extract Reusable Styles**  
  Use `@apply` or component classes to avoid repetition.
- **Keep JSX Clean**  
  Move complex styles to a separate file if needed.

### Example: Tailwind with CSS Modules

```jsx
// Clean JSX with extracted styles
import styles from "./Card.module.css";

const Card = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

/* Card.module.css */
.card {
  @apply p-4 shadow-md rounded-lg bg-white;
}
```

---

## Summary: Key Takeaways

| **Concept**               | **Best Practice**               | **Example**                            |
| ------------------------- | ------------------------------- | -------------------------------------- |
| **Component Design**      | Single Responsibility, Reusable | `<Button variant="primary" />`         |
| **Conditional Rendering** | Avoid nested ternaries          | `{user && <Profile />}`                |
| **Event Handling**        | Memoize callbacks               | `useCallback`                          |
| **State Management**      | Lift state up, avoid nesting    | `const [cart, setCart] = useState([])` |
| **Props**                 | Type-check & keep minimal       | TypeScript / `prop-types`              |
| **Styling**               | Extract reusable styles         | Tailwind `@apply`                      |

### Final Tip:

- Test components in isolation (Storybook, Jest + React Testing Library).
- Avoid premature optimization—focus on readability first.
