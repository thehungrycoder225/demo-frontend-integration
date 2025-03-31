# Building Generic, Reusable Charts with Chart.js

Learn how to create reusable chart components with Chart.js, covering:

- **Bar Chart**
- **Line Chart**
- **Pie/Doughnut Chart**
- **Generic Chart Wrapper (Advanced)**

---

## 1. Base Setup: Centralized Chart Configuration

Avoid repetitive Chart.js setup by centralizing configurations.

**File:** `src/lib/chartConfig.js`

```javascript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: { enabled: true },
  },
};

export const CHART_COLORS = {
  blue: 'rgba(54, 162, 235, 0.7)',
  red: 'rgba(255, 99, 132, 0.7)',
  green: 'rgba(75, 192, 192, 0.7)',
  orange: 'rgba(255, 159, 64, 0.7)',
  purple: 'rgba(153, 102, 255, 0.7)',
};
```

---

## 2. Reusable Bar Chart Component

**File:** `src/components/charts/BarChart.jsx`

```jsx
import { Bar } from 'react-chartjs-2';
import { defaultOptions, CHART_COLORS } from '../../lib/chartConfig';

const BarChart = ({ data, title, xTitle, yTitle }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: dataset.color || Object.values(CHART_COLORS)[idx % 5],
      borderColor: dataset.borderColor || 'rgba(0,0,0,0.1)',
      borderWidth: 1,
    })),
  };

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: { display: !!title, text: title },
    },
    scales: {
      x: { title: { display: !!xTitle, text: xTitle } },
      y: { title: { display: !!yTitle, text: yTitle } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
```

**Usage Example:**

```jsx
<BarChart
  title='Monthly Sales'
  xTitle='Month'
  yTitle='Revenue ($)'
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: '2023 Sales',
        data: [1200, 1900, 1500],
        color: CHART_COLORS.blue,
      },
      {
        label: '2024 Sales',
        data: [1800, 2100, 2000],
        color: CHART_COLORS.green,
      },
    ],
  }}
/>
```

---

## 3. Reusable Line Chart Component

**File:** `src/components/charts/LineChart.jsx`

```jsx
import { Line } from 'react-chartjs-2';
import { defaultOptions, CHART_COLORS } from '../../lib/chartConfig';

const LineChart = ({ data, title, xTitle, yTitle, showPoints = true }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, idx) => ({
      ...dataset,
      borderColor: dataset.color || Object.values(CHART_COLORS)[idx % 5],
      backgroundColor: 'rgba(0,0,0,0.1)',
      pointRadius: showPoints ? 3 : 0,
      tension: 0.1,
    })),
  };

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: { display: !!title, text: title },
    },
    scales: {
      x: { title: { display: !!xTitle, text: xTitle } },
      y: { title: { display: !!yTitle, text: yTitle } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
```

**Usage Example:**

```jsx
<LineChart
  title='Website Traffic'
  xTitle='Day'
  yTitle='Visitors'
  showPoints={false}
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'Mobile Users', data: [320, 450, 400, 510, 600] },
      { label: 'Desktop Users', data: [200, 300, 350, 400, 500] },
    ],
  }}
/>
```

---

## 4. Reusable Pie/Doughnut Chart

**File:** `src/components/charts/PieChart.jsx`

```jsx
import { Pie, Doughnut } from 'react-chartjs-2';
import { defaultOptions, CHART_COLORS } from '../../lib/chartConfig';

const PieChart = ({ data, title, isDoughnut = false }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors || Object.values(CHART_COLORS),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: { display: !!title, text: title },
    },
  };

  return isDoughnut ? (
    <Doughnut data={chartData} options={options} />
  ) : (
    <Pie data={chartData} options={options} />
  );
};

export default PieChart;
```

**Usage Example:**

```jsx
<PieChart
  title='Market Share'
  data={{
    labels: ['Apple', 'Samsung', 'Google', 'Other'],
    values: [45, 30, 15, 10],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  }}
/>
```

---

## 5. Advanced: Generic Chart Wrapper

**File:** `src/components/charts/GenericChart.jsx`

```jsx
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { defaultOptions, CHART_COLORS } from '../../lib/chartConfig';

const chartComponents = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
};

const GenericChart = ({
  type = 'bar',
  data,
  title,
  xTitle,
  yTitle,
  showPoints,
  isDoughnut,
}) => {
  const ChartComponent = chartComponents[type];

  const processedData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: dataset.color || Object.values(CHART_COLORS)[idx % 5],
      borderColor: dataset.borderColor || 'rgba(0,0,0,0.1)',
      pointRadius: type === 'line' ? (showPoints ? 3 : 0) : undefined,
      tension: type === 'line' ? 0.1 : undefined,
    })),
  };

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: { display: !!title, text: title },
    },
    scales:
      type !== 'pie' && type !== 'doughnut'
        ? {
            x: { title: { display: !!xTitle, text: xTitle } },
            y: { title: { display: !!yTitle, text: yTitle } },
          }
        : undefined,
  };

  return <ChartComponent data={processedData} options={options} />;
};

export default GenericChart;
```

**Usage Example:**

```jsx
<GenericChart
  type='line'
  title='Temperature Data'
  xTitle='Day'
  yTitle='°C'
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'New York', data: [12, 19, 15, 22, 18] },
      { label: 'London', data: [8, 11, 13, 9, 12] },
    ],
  }}
/>
```

---

## Key Takeaways

- **Centralized Config**: Simplify Chart.js setup.
- **Reusable Components**: Modularize for flexibility.
- **Customizable Props**: Titles, colors, and interactivity.
- **Advanced Features**: Lazy loading, error handling, and dynamic updates.

Enhance your charts with loading states, empty fallbacks, and interactivity for a professional-grade experience.
