# Styling Components with Tailwind CSS

Tailwind CSS is a utility-first framework that allows you to style components directly in your markup. Unlike traditional CSS (e.g., BEM, SCSS), Tailwind promotes consistency, reusability, and rapid development without leaving your JSX/HTML.

Let’s explore best practices with real-world examples to ensure clean, maintainable, and scalable styling.

## 1. Use `@apply` for Reusable Styles (But Sparingly)

**Problem:** Repeating the same utility classes (e.g., `bg-blue-500 text-white p-4 rounded-lg`) across multiple buttons is tedious.

**Solution:** Extract common styles into a CSS class using `@apply`.

### Example: Custom Button Component

```css
/* styles.css (global CSS file) */
.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors;
}
```

```jsx
// Button.jsx
<button className='btn-primary'>Submit</button>
```

**When to Avoid `@apply`:**

- Overusing `@apply` defeats Tailwind’s utility-first approach.
- Reserve it for truly repeated styles (e.g., buttons, cards).

---

## 2. Organize Classes with Logical Grouping

**Problem:** Long, unreadable class strings like:

```jsx
<div className='flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
  ...
</div>
```

**Solution:** Group related classes line-by-line for readability.

### Example: Clean Card Component

```jsx
<div
  className='
      flex justify-between items-center 
      p-4 bg-gray-100 rounded-lg 
      shadow-md hover:shadow-lg 
      transition-shadow
   '
>
  Card Content
</div>
```

**Bonus:** Use the Prettier plugin (`prettier-plugin-tailwindcss`) to auto-sort classes.

---

## 3. Leverage `tailwind.config.js` for Design Consistency

**Problem:** Hardcoding colors/sizes (e.g., `bg-[#3b82f6]`) leads to inconsistency.

**Solution:** Customize `tailwind.config.js` to enforce a design system.

### Example: Customizing Colors & Spacing

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6', // Now use `bg-brand-primary`
          secondary: '#10b981',
        },
      },
      spacing: {
        18: '4.5rem', // Add custom spacing (e.g., `p-18`)
      },
    },
  },
};
```

**Usage:**

```jsx
<button className='bg-brand-primary text-white p-18'>Brand Button</button>
```

---

## 4. Prefer Responsive Design with Variants

**Problem:** Writing separate media queries for different screen sizes.

**Solution:** Use Tailwind’s responsive prefixes (`sm:`, `md:`, `lg:`).

### Example: Responsive Navbar

```jsx
<div className='flex flex-col md:flex-row gap-4'>
  <div className='w-full md:w-1/4'>Sidebar</div>
  <div className='w-full md:w-3/4'>Main Content</div>
</div>
```

**Key Breakpoints:**

| Prefix | Screen Size |
| ------ | ----------- |
| `sm:`  | ≥640px      |
| `md:`  | ≥768px      |
| `lg:`  | ≥1024px     |

---

## 5. Optimize for Dark Mode

**Problem:** Manually toggling dark mode styles.

**Solution:** Use `dark:` prefix + class strategy in `tailwind.config.js`.

### Example: Dark Mode Toggle

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Toggle via `class` (not media query)
};
```

**Usage:**

```jsx
<div className='bg-white dark:bg-gray-800 text-black dark:text-white'>
  Light/Dark Content
</div>
```

**Implementation:**

```jsx
// Toggle in React
const [isDark, setIsDark] = useState(false);
useEffect(() => {
  document.documentElement.classList.toggle('dark', isDark);
}, [isDark]);
```

---

## 6. Use `group` and `peer` for Parent/Sibling Styling

**Problem:** Styling a child element based on parent hover (`:hover > child` in CSS).

**Solution:** Tailwind’s `group` and `peer` modifiers.

### Example: Hoverable Card with Child Effects

```jsx
<div className='group bg-gray-100 p-4 rounded-lg'>
  <h3 className='group-hover:text-blue-500'>Card Title</h3>
  <p>Content</p>
</div>
```

**Peer Example:** Style a sibling based on input focus.

```jsx
<label className='block'>
  <input className='peer' type='checkbox' />
  <span className='peer-checked:text-green-500'>Toggle Me</span>
</label>
```

---

## 7. Avoid Arbitrary Values (Use Extend Config Instead)

**Problem:** Using arbitrary values (`w-[300px]`, `text-[#abc123]`) reduces maintainability.

**Solution:** Define reusable values in `tailwind.config.js`.

### Bad Practice

```jsx
<div className='w-[300px] bg-[#abc123]'>...</div>
```

### Good Practice

```javascript
// tailwind.config.js
theme: {
   extend: {
      width: {
         card: "300px",
      },
      colors: {
         customGreen: "#abc123",
      },
   },
}
```

**Usage:**

```jsx
<div className='w-card bg-customGreen'>...</div>
```

---

## 8. Optimize for Performance with PurgeCSS

**Problem:** Unused styles bloat production CSS.

**Solution:** Configure purge in `tailwind.config.js`.

```javascript
// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'], // Tree-shake unused classes
};
```

**Verify:** Run `npm run build` and check the `dist/css` file size.

---

## 9. Keep Accessibility in Mind

**Problem:** Ignoring keyboard navigation and screen readers.

**Solution:** Use Tailwind’s accessibility-friendly utilities.

### Examples:

**Focus Rings:**

```jsx
<button className='focus:outline-none focus:ring-2 focus:ring-blue-500'>
  Accessible Button
</button>
```

**Screen Reader Text:**

```jsx
<span className='sr-only'>Save</span>
```

---

## 10. Combine with CSS Modules for Complex Cases

**Problem:** Highly dynamic or component-scoped styles.

**Solution:** Use Tailwind + CSS Modules for hybrid styling.

### Example: Button.module.css

```css
/* Button.module.css */
.custom-btn {
  @apply px-4 py-2 rounded-lg; /* Tailwind utilities */
  background: linear-gradient(to right, #3b82f6, #10b981); /* Custom CSS */
}
```

**Usage:**

```jsx
import styles from './Button.module.css';
<button className={`${styles['custom-btn']} text-white`}>
  Gradient Button
</button>;
```

---

## Summary of Best Practices

| Practice                 | Example                             |
| ------------------------ | ----------------------------------- |
| `@apply` for Reusability | `.btn { @apply bg-blue-500; }`      |
| Logical Grouping         | Multi-line class organization       |
| Config Customization     | Define brand colors in config       |
| Responsive Prefixes      | `md:flex`, `lg:w-1/2`               |
| Dark Mode                | `dark:bg-gray-800`                  |
| `group`/`peer`           | `group-hover:text-blue-500`         |
| Avoid Arbitrary Values   | Use `w-card` instead of `w-[300px]` |
| PurgeCSS                 | Remove unused styles                |
| Accessibility            | `focus:ring`, `sr-only`             |
| CSS Modules Hybrid       | Combine with custom CSS             |

---

## Setting Up Tailwind in a React Project

### Step 1: Create a React App (Vite)

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
```

### Step 2: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Step 3: Configure `tailwind.config.js`

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}, // Add custom styles here
  },
  plugins: [],
};
```

### Step 4: Add Tailwind to CSS

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Run the App

```bash
npm run dev
```

✅ **Now Tailwind is ready!**

---

## Final Workflow Summary

| Step          | Action                    | Example                          |
| ------------- | ------------------------- | -------------------------------- |
| Setup         | Install Tailwind + Config | `npx tailwindcss init`           |
| Style         | Apply utility classes     | `bg-blue-500 text-white`         |
| Responsive    | Use `sm:`, `md:`, `lg:`   | `md:flex`                        |
| Dark Mode     | Toggle `dark:` classes    | `dark:bg-gray-800`               |
| Reuse         | `@apply` in CSS           | `.btn { @apply px-4 py-2; }`     |
| Advanced      | `group`/`peer`            | `group-hover:text-blue-500`      |
| Optimize      | PurgeCSS                  | `purge: ["./src/**/*.{js,jsx}"]` |
| Accessibility | Focus states              | `focus:ring-2`                   |

---

## Final Project Structure

```plaintext
📂 src/
├── 📂 components/
│   ├── Button.jsx          # Reusable button
│   ├── Card.jsx            # Responsive card
│   └── DarkModeToggle.jsx
├── 📂 styles/
│   └── index.css           # Tailwind imports + @apply
├── App.jsx
└── main.jsx                # Imports CSS
```
