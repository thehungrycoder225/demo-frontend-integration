# Data Visualization with Chart.js – Best Practices & Step-by-Step Workflow

## 1. Why Data Visualization Matters

Data visualization helps users understand trends, patterns, and insights quickly. Poorly designed charts can mislead or confuse users.

### Best Practices

- **Use the Right Chart Type**
- **Optimize Performance** (Avoid unnecessary re-renders)
- **Ensure Accessibility** (Labels, contrast, keyboard navigation)
- **Keep It Simple** (Avoid clutter, highlight key insights)

---

## 2. Step-by-Step Workflow with Chart.js & React

### Step 1: Install Dependencies

```bash
npm install chart.js react-chartjs-2
```

### Step 2: Create a Reusable Chart Component

```jsx
// components/BarChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Sales Data' },
    },
  };

  return <Bar data={data} options={options} />;
};
```

### Step 3: Fetch Data & Pass to Chart

```jsx
// pages/SalesDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart } from '../components/BarChart';

export const SalesDashboard = () => {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sales');
        setSalesData(formatChartData(res.data));
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      }
    };
    fetchData();
  }, []);

  const formatChartData = (apiData) => ({
    labels: apiData.map((item) => item.month), // ["Jan", "Feb", ...]
    datasets: [
      {
        label: 'Sales (USD)',
        data: apiData.map((item) => item.sales), // [1200, 1900, ...]
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  if (!salesData) return <p>Loading...</p>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Sales Dashboard</h1>
      <div className='w-full max-w-3xl mx-auto'>
        <BarChart data={salesData} />
      </div>
    </div>
  );
};
```

---

## 3. Best Practices in Action

### 1. Choose the Right Chart Type

| **Use Case**     | **Best Chart Type** | **Example**                     |
| ---------------- | ------------------- | ------------------------------- |
| Trends over time | Line Chart          | Stock prices, monthly revenue   |
| Comparisons      | Bar Chart           | Sales by region, survey results |
| Part-to-whole    | Pie/Doughnut Chart  | Market share, budget allocation |
| Distribution     | Histogram           | Age distribution, salary ranges |

**Example:**

```jsx
// LineChart.jsx
import { Line } from 'react-chartjs-2';

export const LineChart = ({ data }) => (
  <Line data={data} options={{ responsive: true }} />
);
```

### 2. Optimize Performance

- **Memoize chart data** to prevent unnecessary re-renders.
- **Debounce API calls** if data updates frequently.

```jsx
// Memoize formatted data
const formattedData = useMemo(() => formatChartData(rawData), [rawData]);

// Debounced search (for dynamic filtering)
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  fetchData(debouncedSearch);
}, [debouncedSearch]);
```

### 3. Ensure Accessibility

- Add ARIA labels for screen readers.
- Use high-contrast colors.
- Provide text alternatives (e.g., a data table below the chart).

```jsx
<BarChart data={data} aria-label='Monthly sales bar chart' />
```

### 4. Simplify & Highlight Key Insights

- Annotate important points (e.g., peak sales month).
- Use tooltips for additional context.

```jsx
options: {
  plugins: {
    annotation: {
      annotations: {
        highlightPeak: {
          type: "line",
          yMin: peakValue,
          yMax: peakValue,
          borderColor: "red",
          borderWidth: 2,
          label: {
            content: `Peak: $${peakValue}`,
            enabled: true,
          },
        },
      },
    },
  },
}
```

---

## 4. Advanced Techniques

### Dynamic Data Updates (Real-Time Dashboards)

```jsx
// Using WebSockets or polling
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/realtime');
  ws.onmessage = (event) => {
    setSalesData(JSON.parse(event.data));
  };
  return () => ws.close();
}, []);
```

### Combining Multiple Datasets

```jsx
datasets: [
  {
    label: '2023 Sales',
    data: [1200, 1900, 1500],
    borderColor: 'rgb(53, 162, 235)',
  },
  {
    label: '2024 Sales',
    data: [1800, 2100, 2000],
    borderColor: 'rgb(255, 99, 132)',
  },
];
```

---

## 5. Common Pitfalls & Fixes

| **Issue**           | **Solution**                          |
| ------------------- | ------------------------------------- |
| Chart not rendering | Ensure `ChartJS.register()` is called |
| Slow performance    | Memoize data, use `React.memo`        |
| Unreadable labels   | Rotate axis labels, reduce clutter    |
| Misleading scales   | Start y-axis at 0 for bar charts      |

---

## 6. Hands-On Exercise

**Task:** Build a COVID-19 Tracker Dashboard

**Fetch data from a public API (e.g., disease.sh).**

**Display:**

- A line chart for daily cases.
- A bar chart for deaths by country.
- A pie chart for vaccination rates.

**Starter Code:**

```jsx
// Fetch data from:
const res = await axios.get('https://disease.sh/v3/covid-19/countries');
```

---

## Summary

### Best Practices:

- Right chart type
- Performance optimization
- Accessibility
- Simplicity

### Workflow:

1. Install `chart.js` + `react-chartjs-2`.
2. Register required components (`ChartJS.register()`).
3. Fetch & format API data.
4. Pass data to reusable chart components.

**Pro Tip:** Use Chart.js plugins for annotations, zoom, etc.

**Next Step:** Integrate into your capstone project!
