# REST API Frontend Integration with ReactJS: A Comprehensive Guide

## Introduction

Modern web applications rely on seamless integration with backend services through REST APIs. This module explores how to build a ReactJS application using Vite, connect it with a REST API, and efficiently manage data and state. We will cover fundamental concepts, best practices, and hands-on coding exercises to reinforce learning.

## 1. What is React?

### Overview

React is a JavaScript library for building user interfaces. It follows a component-based architecture, making UI development more scalable and reusable.

### Key Features

- **Component-Based Architecture** – UI is broken down into reusable, independent components.
- **Virtual DOM** – Enhances performance by updating only changed elements instead of reloading the entire page.
- **Declarative Syntax** – Allows developers to design UI states and let React handle rendering efficiently.
- **State Management** – Enables handling of dynamic and interactive UI elements.

### When to Use React?

- When building interactive, data-driven web applications.
- When you need reusable components for UI consistency.
- When performance optimization is crucial.

### Practical Exercise

1. Set up a basic React application.
2. Create a functional component that displays `"Hello, React!"`.
3. Modify the component to accept a `name` prop and display `"Hello, [name]!"` dynamically.

## 2. Vite React Setup & Project Structure

### Overview

Vite is a modern build tool that provides a faster and leaner development experience compared to traditional setups like Create React App (CRA). It offers fast refresh, optimized builds, and a simplified configuration process.

### Setting Up a React App with Vite

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
npm run dev
```

### Project Structure

```
my-app/
│-- src/
│   │-- components/   # Reusable components
│   │-- pages/        # Page-level components
│   │-- hooks/        # Custom hooks
│   │-- services/     # API service functions
│   │-- App.jsx       # Main application file
│-- public/          # Static assets
│-- index.html       # Entry point
```

### Best Practices

- Keep components small and focused on a single responsibility.
- Organize files into meaningful directories (`components`, `pages`, `services`).
- Use `hooks/` to store reusable logic.
- Separate API-related code into `services/` for maintainability.

### Exercise

1. Set up a new React project using Vite.
2. Create a `components` folder and build a simple reusable button component.
3. Explore and modify the `App.jsx` file to render multiple components.

## 3. Building Components in React

### Overview

Components are the core building blocks of a React application. React supports both functional and class components, but functional components are now the standard due to their simplicity and support for Hooks.

### Topics Covered

- **Functional Components** – Stateless, reusable UI elements.
- **Class Components** – Legacy components that manage state using `this.state`.
- **Conditional Rendering** – Dynamically showing/hiding elements.
- **Event Handling** – Handling user interactions like clicks and input.
- **State Management** – Managing local component state with the `useState` hook.
- **Props** – Passing data between components.
- **Passing Functions via Props** – Enabling child-to-parent communication.

### Example: Counter Component

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### Exercise

1. Create a "Counter" component that increments and decrements a value.
2. Modify it to accept an initial count as a prop.
3. Implement a reset button that resets the counter to its initial value.

## 4. Styling Components with Tailwind CSS

### Overview

Tailwind CSS is a utility-first CSS framework that simplifies styling in React applications by allowing developers to use predefined classes directly in their JSX code.

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Adding Tailwind to Your Project

Modify `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Using Tailwind in Components

```jsx
export default function Button() {
  return (
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
      Click Me
    </button>
  );
}
```

### Best Practices

- Use Tailwind utility classes for quick styling.
- Extract reusable styles into `className` variables.
- Leverage Tailwind’s responsive design features (`sm:`, `md:`, `lg:` breakpoints).

### Exercise

1. Create a styled button using Tailwind and apply different utility classes.
2. Add hover effects and responsive styling.
3. Style a navigation bar component with Tailwind.

We’ve covered the fundamentals of setting up a React project with Vite, understanding components, and styling with Tailwind CSS. In the next module, we’ll dive into **Managing Component State in React**, including handling nested state, arrays, and sharing state between components.
