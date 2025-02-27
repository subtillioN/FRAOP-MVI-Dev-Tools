# API Documentation

## Core APIs

### PropAnalyzer

The main analysis engine for tracking and analyzing prop usage in React components.

#### Methods

##### `trackPropUsage(Component: ComponentType<any>, props: Record<string, any>, componentName: string): void`

Tracks prop usage for a specific component render.

```typescript
const analyzer = new PropAnalyzer();
analyzer.trackPropUsage(MyComponent, { prop1: 'value' }, 'MyComponent');
```

##### `analyzeProps(): PropAnalysisResult`

Analyzes collected prop data and returns comprehensive analysis results.

```typescript
const analysis = analyzer.analyzeProps();
// Returns: PropAnalysisResult
```

##### `getComponentPropUsage(componentName: string): PropUsage | undefined`

Gets prop usage data for a specific component.

##### `getRenderCount(componentName: string): number`

Gets the render count for a specific component.

##### `reset(): void`

Resets all collected data.

### MonitoringService

Singleton service for real-time monitoring and event handling.

#### Methods

##### `getInstance(): MonitoringService`

Gets the singleton instance of the monitoring service.

```typescript
const service = MonitoringService.getInstance();
```

##### `startMonitoring(interval?: number): void`

Starts monitoring with optional update interval in milliseconds.

##### `stopMonitoring(): void`

Stops the monitoring process.

##### `subscribe(listener: (event: MonitoringEvent) => void): () => void`

Subscribes to monitoring events and returns an unsubscribe function.

## Components

### MonitoringDashboard

Real-time monitoring dashboard for component performance.

#### Props

```typescript
interface MonitoringDashboardProps {
  data: PropAnalysisResult;
}
```

### OptimizationRecommendations

Component for displaying optimization suggestions.

#### Props

```typescript
interface OptimizationRecommendationsProps {
  data: PropAnalysisResult;
}
```

### RenderImpactAnalysis

Visualizes the impact of prop changes on component renders.

#### Props

```typescript
interface RenderImpactAnalysisProps {
  data: PropAnalysisResult;
}
```

### PropValueHistory

Tracks and displays the history of prop values.

#### Props

```typescript
interface PropValueHistoryProps {
  data: PropAnalysisResult;
}
```

### PropPatternDetection

Detects and displays patterns in prop usage.

#### Props

```typescript
interface PropPatternDetectionProps {
  data: PropAnalysisResult;
}
```

### PerformanceImpact

Analyzes and visualizes performance impact of components.

#### Props

```typescript
interface PerformanceImpactProps {
  data: PropAnalysisResult;
}
```

## Types

### PropAnalysisResult

```typescript
interface PropAnalysisResult {
  components: PropUsage[];
  unusedProps: {
    componentName: string;
    propName: string;
  }[];
  propPatterns: {
    pattern: string;
    count: number;
    components: string[];
  }[];
  frequentUpdates: {
    componentName: string;
    propName: string;
    updateCount: number;
  }[];
}
```

### PropUsage

```typescript
interface PropUsage {
  componentName: string;
  props: {
    name: string;
    type: string;
    required: boolean;
    usageCount: number;
    defaultValue?: any;
    valueChanges?: number;
    lastValue?: any;
  }[];
}
```

### MonitoringEvent

```typescript
interface MonitoringEvent {
  type: 'update' | 'warning' | 'error';
  timestamp: number;
  data: any;
}
``` 