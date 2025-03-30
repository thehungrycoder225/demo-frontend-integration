# Building Generic, Reusable Charts with Chart.js

Let's create a set of highly reusable chart components that can be customized for any project. We'll cover:

- **Bar Chart**
- **Line Chart**
- **Pie/Doughnut Chart**
- **Generic Chart Wrapper (Advanced)**

---

## 1. Base Setup: Generic Chart Configuration

First, let's create a centralized configuration to avoid repeating Chart.js registrations.

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

// Register all Chart.js components we might use
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

// Default options for all charts
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
};

// Common color palette
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
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: !!xTitle,
          text: xTitle,
        },
      },
      y: {
        title: {
          display: !!yTitle,
          text: yTitle,
        },
      },
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
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: !!xTitle,
          text: xTitle,
        },
      },
      y: {
        title: {
          display: !!yTitle,
          text: yTitle,
        },
      },
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
      {
        label: 'Mobile Users',
        data: [320, 450, 400, 510, 600],
      },
      {
        label: 'Desktop Users',
        data: [200, 300, 350, 400, 500],
      },
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
      title: {
        display: !!title,
        text: title,
      },
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

For ultimate reusability, create one wrapper component that renders any chart type.

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
      title: {
        display: !!title,
        text: title,
      },
    },
    scales:
      type !== 'pie' && type !== 'doughnut'
        ? {
            x: {
              title: {
                display: !!xTitle,
                text: xTitle,
              },
            },
            y: {
              title: {
                display: !!yTitle,
                text: yTitle,
              },
            },
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
      {
        label: 'New York',
        data: [12, 19, 15, 22, 18],
      },
      {
        label: 'London',
        data: [8, 11, 13, 9, 12],
      },
    ],
  }}
/>
```

---

## Key Takeaways

- **Centralized Config**: Avoid repeating Chart.js setup.
- **Color Management**: Use a consistent palette.
- **Props for Customization**: Titles, colors, visibility toggles.
- **Type Safety**: Consider using TypeScript for stricter props.
- **Performance**: Memoize chart data if dynamic.

Enhanced Reusable Charts with Loading States, Empty Fallbacks & Interactivity
Let's supercharge our chart components with:

Loading states (Skeleton UI + lazy loading)

Empty data fallbacks

Interactive click handlers

Error handling

1. Loading States with Skeleton Screens
   src/components/charts/ChartSkeleton.jsx
   jsx
   Copy
   import React from 'react';

export const ChartSkeleton = ({ type = 'bar' }) => {
const skeletonStyles = {
bar: 'h-64 w-full bg-gray-200 animate-pulse rounded',
line: 'h-64 w-full bg-gradient-to-b from-gray-200 to-gray-100 animate-pulse rounded',
pie: 'h-64 w-64 mx-auto rounded-full bg-gray-200 animate-pulse',
};

return (
<div className="p-4 border rounded-lg">
<div className="h-6 w-1/3 mb-4 bg-gray-300 animate-pulse rounded"></div>
<div className={skeletonStyles[type]} />
</div>
);
};
src/components/charts/GenericChart.jsx (Updated)
jsx
Copy
import React, { Suspense, lazy } from 'react';
import { ChartSkeleton } from './ChartSkeleton';
import { defaultOptions, CHART_COLORS } from '../../lib/chartConfig';

// Lazy load chart components
const ChartComponents = {
bar: lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar }))),
line: lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line }))),
pie: lazy(() => import('react-chartjs-2').then(module => ({ default: module.Pie }))),
doughnut: lazy(() => import('react-chartjs-2').then(module => ({ default: module.Doughnut }))),
};

const GenericChart = ({
type = 'bar',
data,
title,
xTitle,
yTitle,
isLoading = false,
emptyText = 'No data available',
onClick,
}) => {
if (isLoading) return <ChartSkeleton type={type} />;

if (!data?.labels?.length || !data?.datasets?.length) {
return (
<div className="p-8 text-center border rounded-lg bg-gray-50">
<p className="text-gray-500">{emptyText}</p>
</div>
);
}

const ChartComponent = ChartComponents[type];

const processedData = {
labels: data.labels,
datasets: data.datasets.map((dataset, idx) => ({
...dataset,
backgroundColor: dataset.color || Object.values(CHART_COLORS)[idx % 5],
borderColor: dataset.borderColor || 'rgba(0,0,0,0.1)',
pointRadius: type === 'line' ? 3 : undefined,
tension: type === 'line' ? 0.1 : undefined,
})),
};

const options = {
...defaultOptions,
onClick: (e, elements) => {
if (elements.length > 0 && onClick) {
const clickedElement = elements[0];
const label = processedData.labels[clickedElement.index];
const value = processedData.datasets[clickedElement.datasetIndex].data[clickedElement.index];
onClick({ label, value, element: clickedElement });
}
},
plugins: {
...defaultOptions.plugins,
title: {
display: !!title,
text: title,
},
},
scales: type !== 'pie' && type !== 'doughnut' ? {
x: {
title: {
display: !!xTitle,
text: xTitle,
},
},
y: {
title: {
display: !!yTitle,
text: yTitle,
},
},
} : undefined,
};

return (
<Suspense fallback={<ChartSkeleton type={type} />}>
<ChartComponent 
        data={processedData} 
        options={options} 
        className="cursor-pointer hover:opacity-90 transition-opacity"
      />
</Suspense>
);
};

export default GenericChart; 2. Usage Examples
With Loading State
jsx
Copy
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
const timer = setTimeout(() => {
setIsLoading(false);
}, 2000);
return () => clearTimeout(timer);
}, []);

<GenericChart
  type="bar"
  isLoading={isLoading}
  data={chartData}
/>
With Empty Data Fallback
jsx
Copy
<GenericChart
type="line"
data={{ labels: [], datasets: [] }}
emptyText="No sales data this month"
/>
With Click Handler
jsx
Copy
const handleChartClick = ({ label, value }) => {
alert(`You clicked ${label}: ${value}`);
};

<GenericChart
  type="pie"
  data={pieData}
  onClick={handleChartClick}
/> 3. Advanced Features
Error Boundary Wrapper
jsx
Copy
// src/components/charts/ChartErrorBoundary.jsx
import React from 'react';

export class ChartErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false };
}

static getDerivedStateFromError() {
return { hasError: true };
}

render() {
if (this.state.hasError) {
return (
<div className="p-4 bg-red-50 border border-red-200 rounded">
<p className="text-red-600">Failed to render chart</p>
</div>
);
}
return this.props.children;
}
}

// Usage:
<ChartErrorBoundary>
<GenericChart {...props} />
</ChartErrorBoundary>
Dynamic Data Reloading
jsx
Copy
const [chartKey, setChartKey] = useState(0);

const refreshChart = () => {
setChartKey(prev => prev + 1); // Forces remount
};

<button onClick={refreshChart}>Reload Data</button>
<GenericChart key={chartKey} {...props} /> 4. Complete Feature Breakdown
Feature Implementation Benefit
Lazy Loading React.lazy + Suspense Reduces bundle size
Skeleton UI Custom animated divs Better perceived performance
Empty States Conditional render check Improved UX for zero-data cases
Click Handlers Chart.js onClick event Enables drill-down interactions
Error Boundaries React Error Boundary Graceful failure handling
Dynamic Reload Key-based remounting Clean data refreshes 5. Performance Optimization Tips
Memoize Data Preparation

jsx
Copy
const processedData = useMemo(() => prepareData(rawData), [rawData]);
Debounce Rapid Updates

jsx
Copy
const debouncedData = useDebounce(liveData, 300);
Virtualize Multiple Charts

jsx
Copy
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
data={bigListOfCharts}
itemContent={(index, chartProps) => (
<GenericChart {...chartProps} />
)}
/>
These enhancements make your charts:

More resilient (error boundaries)

More interactive (click handlers)

Better UX (loading/empty states)

More performant (lazy loading)

Advanced Chart Customizations: Tooltips, Zooming & Animations
Let's enhance our reusable chart components with professional-grade features:

1. Custom Tooltip Styling
   1.1 Basic Tooltip Customization
   Add this to your chartConfig.js:

javascript
Copy
export const tooltipStyles = {
backgroundColor: 'rgba(0,0,0,0.8)',
titleColor: '#fff',
bodyColor: '#fff',
borderColor: 'rgba(255,255,255,0.2)',
borderWidth: 1,
padding: 12,
cornerRadius: 8,
displayColors: true,
usePointStyle: true,
};
1.2 Custom Tooltip Content
Update GenericChart.jsx:

jsx
Copy
const options = {
plugins: {
tooltip: {
...tooltipStyles,
callbacks: {
label: (context) => {
const label = context.dataset.label || '';
const value = context.raw;
return `${label}: ${formatCurrency(value)}`; // Custom formatter
},
footer: (items) => {
const total = items.reduce((sum, item) => sum + item.raw, 0);
return `Total: ${total}`;
}
}
}
}
};
1.3 External HTML Tooltips (Advanced)
javascript
Copy
// In chartConfig.js
export const externalTooltipHandler = (context) => {
const { chart, tooltip } = context;
const tooltipEl = document.getElementById('chart-tooltip');

if (!tooltipEl) return;

if (tooltip.opacity === 0) {
tooltipEl.style.opacity = 0;
return;
}

// Set tooltip content
tooltipEl.innerHTML = `    <div class="tooltip-header">${tooltip.title}</div>
    <div class="tooltip-body">
      ${tooltip.body.map(item => item.lines.join('\n')).join('\n')}
    </div>
 `;

// Position tooltip
const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
tooltipEl.style.left = positionX + tooltip.caretX + 'px';
tooltipEl.style.top = positionY + tooltip.caretY + 'px';
tooltipEl.style.opacity = 1;
};
Add this CSS:

css
Copy
#chart-tooltip {
position: absolute;
pointer-events: none;
background: rgba(0, 0, 0, 0.9);
color: white;
padding: 8px 12px;
border-radius: 6px;
font-size: 14px;
transition: all 0.1s ease;
z-index: 1000;
max-width: 300px;
} 2. Zoom & Pan Behaviors
2.1 Install Required Plugins
bash
Copy
npm install chartjs-plugin-zoom
2.2 Configure Zoom in chartConfig.js
javascript
Copy
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(zoomPlugin);

export const zoomOptions = {
pan: {
enabled: true,
mode: 'xy',
},
zoom: {
wheel: {
enabled: true,
},
pinch: {
enabled: true,
},
mode: 'xy',
limits: {
x: { min: 'original', max: 'original' },
y: { min: 'original', max: 'original' }
}
}
};
2.3 Add Reset Zoom Button
Update GenericChart.jsx:

jsx
Copy
const [chartRef, setChartRef] = useState(null);

const resetZoom = () => {
chartRef?.resetZoom();
};

return (

  <div className="relative">
    <ChartComponent 
      ref={(ref) => setChartRef(ref?.chartInstance)}
      data={processedData} 
      options={{
        ...options,
        plugins: {
          ...options.plugins,
          zoom: zoomOptions
        }
      }} 
    />
    <button 
      onClick={resetZoom}
      className="absolute top-2 right-2 bg-white p-1 rounded shadow"
    >
      Reset Zoom
    </button>
  </div>
);
3. Dynamic Data Update Animations
3.1 Smooth Transitions
Add to chartConfig.js:

javascript
Copy
export const animationConfig = {
animation: {
duration: 1000,
easing: 'easeOutQuart',
},
transitions: {
show: {
animations: {
x: { from: 0 },
y: { from: 0 }
}
},
hide: {
animations: {
x: { to: 0 },
y: { to: 0 }
}
}
}
};
3.2 Progressive Loading Effect
javascript
Copy
// When updating data:
const updateData = (newData) => {
setData(prev => ({
...prev,
datasets: prev.datasets.map((dataset, i) => ({
...dataset,
data: new Array(dataset.data.length)
.fill(null)
.map((\_, j) => j < currentStep ? newData.datasets[i].data[j] : null)
}))
}));

if (currentStep < newData.labels.length) {
setTimeout(() => setCurrentStep(c => c + 1), 100);
}
};
3.3 Animated Value Changes
javascript
Copy
// In your data formatter:
const animatedData = data.map((value, index) => ({
value,
from: previousData?.[index] || 0
}));

// In chart config:
animation: {
onProgress: (ctx) => {
const points = ctx.chart.data.datasets[0].data;
points.forEach((point, i) => {
if (typeof point === 'object') {
const progress = ctx.currentStep / ctx.numSteps;
point = point.from + (point.value - point.from) \* progress;
}
});
ctx.chart.update();
}
} 4. Complete Enhanced GenericChart.jsx
jsx
Copy
import React, { useState, useMemo } from 'react';
import {
defaultOptions,
CHART_COLORS,
tooltipStyles,
zoomOptions,
animationConfig
} from '../../lib/chartConfig';

const GenericChart = ({
type = 'bar',
data,
// ... other props
}) => {
const [chartRef, setChartRef] = useState(null);

const processedData = useMemo(() => ({
labels: data.labels,
datasets: data.datasets.map((dataset, idx) => ({
...dataset,
backgroundColor: dataset.color || Object.values(CHART_COLORS)[idx % 5],
borderColor: dataset.borderColor || 'rgba(0,0,0,0.1)',
pointRadius: type === 'line' ? 3 : undefined,
tension: type === 'line' ? 0.1 : undefined,
})),
}), [data]);

const options = useMemo(() => ({
...defaultOptions,
...animationConfig,
plugins: {
...defaultOptions.plugins,
tooltip: {
...tooltipStyles,
callbacks: {
label: (context) => `${context.dataset.label}: ${context.raw}`
}
},
zoom: zoomOptions,
legend: {
onClick: (e, legendItem) => {
// Custom legend click behavior
const index = legendItem.datasetIndex;
const ci = chartRef;
const meta = ci.getDatasetMeta(index);
meta.hidden = !meta.hidden;
ci.update();
}
}
},
onClick: handleChartClick,
}), [chartRef]);

return (
<div className="chart-container">
<ChartComponent
ref={(ref) => setChartRef(ref?.chartInstance)}
data={processedData}
options={options}
plugins={[zoomPlugin]}
/>

      <div className="chart-controls">
        <button onClick={() => chartRef?.resetZoom()}>
          Reset View
        </button>
        <button onClick={() => chartRef?.toggleDataVisibility(0)}>
          Toggle Dataset
        </button>
      </div>

      {/* External tooltip container */}
      <div id="chart-tooltip"></div>
    </div>

);
}; 5. Usage Examples
Custom Tooltip with Currency
jsx
Copy
<GenericChart
tooltipConfig={{
    callbacks: {
      label: (ctx) => `$${ctx.raw.toFixed(2)}`
    }
  }}
/>
Time-Based Zoom Limits
javascript
Copy
zoom: {
limits: {
x: {
min: new Date('2023-01-01').getTime(),
max: new Date('2023-12-31').getTime()
}
}
}
Dynamic Data Update
jsx
Copy
// Simulate streaming data
useEffect(() => {
const interval = setInterval(() => {
setData(prev => ({
...prev,
datasets: prev.datasets.map(dataset => ({
...dataset,
data: [...dataset.data.slice(1), Math.random() * 100]
}))
}));
}, 1000);
return () => clearInterval(interval);
}, []);
Key Benefits
Professional Tooltips - Custom formatting, HTML content, positioning

Data Exploration - Zoom/pan for detailed analysis

Engaging Visuals - Smooth animations for data changes

Performance - Optimized rendering with memoization
