# Getting Started with FRAOP-MVI Dev Tools

This guide will help you get started with the FRAOP-MVI Dev Tools and show you how to make the most of its features.

## Installation

First, install the package using npm:

```bash
npm install fraop-mvi-dev-tools
```

Or using yarn:

```bash
yarn add fraop-mvi-dev-tools
```

## Basic Setup

1. Create a mount point for the dev tools in your app:

```html
<!-- index.html -->
<div id="dev-tools-root"></div>
```

2. Initialize the dev tools in your application:

```typescript
// App.tsx
import { initDevTools } from 'fraop-mvi-dev-tools';

if (process.env.NODE_ENV === 'development') {
  initDevTools({
    target: document.getElementById('dev-tools-root'),
    features: ['monitoring', 'optimization', 'analysis'],
    theme: 'dark'
  });
}
```

## Component Monitoring

### Basic Monitoring

1. Import the MonitoringDashboard:

```typescript
import { MonitoringDashboard } from 'fraop-mvi-dev-tools';
```

2. Add it to your development layout:

```typescript
function DevLayout() {
  const [data, setData] = useState<PropAnalysisResult>();
  
  useEffect(() => {
    const service = MonitoringService.getInstance();
    return service.subscribe(event => {
      if (event.type === 'update') {
        setData(event.data);
      }
    });
  }, []);

  return data ? <MonitoringDashboard data={data} /> : null;
}
```

### Advanced Monitoring

Use the PropAnalyzer directly for custom monitoring:

```typescript
import { PropAnalyzer } from 'fraop-mvi-dev-tools';

const analyzer = new PropAnalyzer();

// HOC for tracking
function withPropTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function TrackedComponent(props: P) {
    useEffect(() => {
      analyzer.trackPropUsage(WrappedComponent, props, componentName);
    }, [props]);

    return <WrappedComponent {...props} />;
  };
}

// Usage
const TrackedButton = withPropTracking(Button, 'Button');
```

## Performance Optimization

### Using OptimizationRecommendations

1. Import the component:

```typescript
import { OptimizationRecommendations } from 'fraop-mvi-dev-tools';
```

2. Add it to your development tools:

```typescript
function DevTools() {
  const [data, setData] = useState<PropAnalysisResult>();
  
  // ... monitoring setup ...

  return (
    <div>
      <MonitoringDashboard data={data} />
      <OptimizationRecommendations data={data} />
    </div>
  );
}
```

### Implementing Recommendations

When you receive optimization suggestions:

1. Review the suggested changes in the OptimizationRecommendations panel
2. Apply memoization where recommended:

```typescript
// Before
function MyComponent({ frequently, updated, props, stable }) {
  // Component logic
}

// After
const MyComponent = React.memo(
  function MyComponent({ frequently, updated, props, stable }) {
    // Component logic
  },
  (prev, next) => {
    // Only re-render for frequently updated props
    return (
      prev.stable === next.stable &&
      prev.props === next.props
    );
  }
);
```

## Performance Analysis

### Using RenderImpactAnalysis

1. Import the component:

```typescript
import { RenderImpactAnalysis } from 'fraop-mvi-dev-tools';
```

2. Add it to your development tools:

```typescript
function DevTools() {
  return (
    <div>
      <RenderImpactAnalysis data={propAnalysisResult} />
    </div>
  );
}
```

### Interpreting Results

The RenderImpactAnalysis component provides:

- Component render frequency
- Prop update patterns
- Render cascades
- Performance bottlenecks

Use this information to:

1. Identify components that render too frequently
2. Find prop values that change unnecessarily
3. Optimize render cascades
4. Implement performance improvements

## Best Practices

1. **Development Only**
   - Always wrap dev tools initialization in a development check
   - Remove dev tools in production builds

2. **Performance Monitoring**
   - Start monitoring early in development
   - Track key components consistently
   - Review performance metrics regularly

3. **Optimization**
   - Address high-impact issues first
   - Test performance improvements
   - Document optimization decisions

4. **Integration**
   - Use with existing dev tools
   - Integrate with your CI/CD pipeline
   - Share findings with your team

## Troubleshooting

### Common Issues

1. **Dev Tools Not Showing**
   - Check mount point exists
   - Verify development environment
   - Check console for errors

2. **Performance Impact**
   - Disable monitoring in production
   - Use selective monitoring
   - Implement sampling for large applications

3. **Data Accuracy**
   - Verify component names
   - Check prop tracking setup
   - Review monitoring configuration

## Next Steps

- Explore advanced features
- Implement custom plugins
- Contribute to the project
- Share feedback and suggestions 