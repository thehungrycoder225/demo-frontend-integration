# Building Forms in React: Best Practices with Practical Examples

Forms are a critical part of web applications, used for user input, authentication, search, and more. In React, building efficient, maintainable, and user-friendly forms requires following best practices in structure, validation, and state management.

## 6.1 Controlled vs. Uncontrolled Components

### Best Practice: Use Controlled Components for Predictable State

- **Controlled**: Form data is managed by React state.
- **Uncontrolled**: Form data is handled by the DOM (use `useRef`).

#### Example (Controlled Input)

```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
    </form>
  );
}
```

✅ **Why?**

- Easier validation & real-time updates.
- State is predictable and testable.

---

## 6.2 Handling Form Submission

### Best Practice: Prevent Default Reload & Use `onSubmit`

```jsx
const handleSubmit = (e) => {
  e.preventDefault(); // Prevents page reload
  console.log({ email, password });
};

return <form onSubmit={handleSubmit}>...</form>;
```

✅ **Why?**

- Avoids full-page reloads (better UX).
- Enables async form handling (e.g., API calls).

---

## 6.3 Form Validation

### Best Practice: Use Schema Validation (Zod) + React Hook Form

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('email')} placeholder='Email' />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('password')} type='password' />
      {errors.password && <p>{errors.password.message}</p>}

      <button type='submit'>Login</button>
    </form>
  );
}
```

✅ **Why?**

- **Zod**: Type-safe validation.
- **React Hook Form**: Optimized re-renders, minimal boilerplate.

## 6.4 Disabling Submit Button

### Best Practice: Disable Until Valid

```jsx
<button type='submit' disabled={!isValid}>
  Submit
</button>
```

**Why?**

- Prevents invalid submissions.
- Improves UX by giving feedback.

## 6.5 Generic Form Components (Reusable)

### Best Practice: Create a `<FormInput />` Component

```jsx
function FormInput({ label, type, register, errors, name }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} {...register(name)} />
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
}

// Usage
<FormInput
  label='Email'
  type='email'
  register={register}
  errors={errors}
  name='email'
/>;
```

**Why?**

- Reduces duplication.
- Ensures consistent styling/validation.

## 6.6 Handling Dynamic Forms (Add/Remove Fields)

### Best Practice: Use `useFieldArray` (React Hook Form)

```jsx
import { useFieldArray } from 'react-hook-form';

function DynamicForm() {
  const { control, register } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ name: '' })}>Add Item</button>
    </form>
  );
}
```

**Why?**

- Simplifies dynamic form management.
- Handles nested arrays efficiently.

## 6.7 Optimizing Performance

### Best Practice: Memoize Expensive Computations

```jsx
import { useMemo } from 'react';

function ExpensiveForm({ users }) {
  const filteredUsers = useMemo(
    () => users.filter((user) => user.isActive),
    [users]
  );

  return (
    <form>
      {filteredUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </form>
  );
}
```

**Why?**

- Avoids unnecessary re-renders.

## 6.8 Accessibility (A11y) Best Practices

### Best Practice: Use Semantic HTML & ARIA Labels

```jsx
<form aria-labelledby='login-heading'>
  <h2 id='login-heading'>Login</h2>
  <label htmlFor='email'>Email</label>
  <input id='email' type='email' {...register('email')} />
</form>
```

**Why?**

- Screen reader-friendly.
- Better keyboard navigation.

## Summary of Best Practices

| Best Practice           | Example                 | Why?                    |
| ----------------------- | ----------------------- | ----------------------- |
| Controlled Components   | `useState` + `onChange` | Predictable state       |
| Schema Validation       | Zod + React Hook Form   | Type-safe, clean        |
| Reusable Components     | `<FormInput />`         | DRY code                |
| Dynamic Forms           | `useFieldArray`         | Easier array management |
| Disable Invalid Submits | `disabled={!isValid}`   | Better UX               |
| Accessibility           | Labels, ARIA            | Inclusive design        |

## Step-by-Step Workflow for Building Forms in React with Best Practices

This guide provides a complete, step-by-step workflow for building forms in React, covering:

✔ Controlled components  
✔ Form validation (Zod + React Hook Form)  
✔ Reusable form components  
✔ Dynamic fields  
✔ API submission  
✔ Accessibility & performance optimizations
