# Managing Component State in React

Managing state effectively is crucial for building scalable, maintainable, and bug-free React applications. Below, we’ll explore best practices with real-world examples to help you master state management.

## 1. State Hook (`useState`) – Best Practices

### ✅ Do: Use Descriptive Variable Names

**❌ Bad:**

```jsx
const [x, setX] = useState(null);
```

**✅ Good:**

```jsx
const [user, setUser] = useState(null);
```

### ✅ Do: Initialize State Properly

Avoid undefined or null if possible.

**❌ Bad:**

```jsx
// May cause "undefined" errors
const [todos, setTodos] = useState();
```

**✅ Good:**

```jsx
// Initialize with default value
const [todos, setTodos] = useState([]);
```

### ✅ Do: Group Related State

Instead of multiple `useState` calls:

**❌ Cluttered:**

```jsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
```

**✅ Group related state:**

```jsx
const [form, setForm] = useState({
  name: '',
  email: '',
});
```

---

## 2. Updating Objects & Arrays – Avoiding Mutations

### 🔄 Updating Objects (Immutability)

**❌ Bad (Direct Mutation):**

```jsx
const updateUser = () => {
  user.name = 'Alice'; // ❌ Mutates directly
  setUser(user); // Won’t trigger re-render
};
```

**✅ Good (Spread Operator):**

```jsx
const updateUser = () => {
  setUser({ ...user, name: 'Alice' }); // ✅ Creates new object
};
```

### 📝 Updating Nested Objects

**❌ Bad (Nested Mutation):**

```jsx
user.profile.age = 30; // ❌ Still mutating!
setUser(user);
```

**✅ Good (Deep Copy):**

```jsx
setUser({
  ...user,
  profile: { ...user.profile, age: 30 },
});
```

### 📊 Updating Arrays

**❌ Bad (Push Mutates):**

```jsx
todos.push(newTodo); // ❌ Mutates array
setTodos(todos);
```

**✅ Good (New Array):**

```jsx
// Adding
setTodos([...todos, newTodo]);

// Removing
setTodos(todos.filter((todo) => todo.id !== id));

// Updating
setTodos(
  todos.map((todo) => (todo.id === id ? { ...todo, done: true } : todo))
);
```

---

## 3. Simplifying State Logic with Immer

### Problem: Deeply nested state updates are verbose.

**Solution:** Use Immer to write mutable-like code safely.

### 📦 Install Immer

```bash
npm install immer
```

### 🔄 Example: Updating Nested State

**Without Immer (Messy):**

```jsx
setUser({
  ...user,
  address: { ...user.address, zip: '20002' },
});
```

**With Immer (Clean):**

```jsx
import { produce } from 'immer';

setUser(
  produce((draft) => {
    draft.address.zip = '20002'; // ✅ Looks like mutation, but safe!
  })
);
```

---

## 4. Sharing State Between Components

### 🔼 Lifting State Up

When sibling components need the same state:

```jsx
// Parent Component
const [count, setCount] = useState(0);

<ChildA count={count} />
<ChildB setCount={setCount} />
```

### 🌐 Using Context API for Global State

**Use Case:** Theme, Auth, User Preferences.

**Step 1: Create Context**

```jsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}
```

**Step 2: Consume Context**

```jsx
function ChildComponent() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme('dark')}>Current Theme: {theme}</button>
  );
}
```

---

## 5. Avoiding Common State Pitfalls

### 🚫 Don’t Use State for Derived Values

**❌ Bad (Redundant State):**

```jsx
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**✅ Good (Compute Dynamically):**

```jsx
const fullName = `${firstName} ${lastName}`; // No state needed!
```

### 🚫 Don’t Overuse `useState` for Forms

Instead of managing each input with `useState`:

**❌ Tedious:**

```jsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
```

**✅ Use `useReducer` or `React Hook Form`:**

```jsx
const { register, handleSubmit } = useForm();
```

---

## Real-World Example: Shopping Cart State

### 🛒 State Structure

```jsx
const [cart, setCart] = useState({
  items: [],
  total: 0,
});
```

### 🔄 Adding an Item (Immutably)

```jsx
const addToCart = (product) => {
  setCart((prev) => ({
    items: [...prev.items, product],
    total: prev.total + product.price,
  }));
};
```

### 🗑️ Removing an Item

```jsx
const removeFromCart = (productId) => {
  setCart((prev) => ({
    items: prev.items.filter((item) => item.id !== productId),
    total: prev.items.reduce((sum, item) => sum + item.price, 0),
  }));
};
```

---

## Summary of Best Practices

| Practice                      | Example                                  |
| ----------------------------- | ---------------------------------------- |
| Use descriptive state names   | `[user, setUser]` instead of `[x, setX]` |
| Initialize state properly     | `useState([])` instead of `useState()`   |
| Group related state           | `useState({ name: "", email: "" })`      |
| Avoid direct mutations        | Use spread operator `{ ...obj }`         |
| Use Immer for complex state   | `produce(draft => { draft.value = 5 })`  |
| Lift state up when needed     | Share state between siblings via parent  |
| Use Context for global state  | `ThemeContext.Provider`                  |
| Avoid redundant derived state | Compute values dynamically (`fullName`)  |

---

## Final Thoughts

- **Immutability is key** → Always return new objects/arrays.
- **Keep state minimal** → Avoid storing computed values.
- **Use tools like Immer** for cleaner nested updates.
- **Lift state up or use Context** for shared state.
