# FRAOP-MVI Dev Tools

A comprehensive development toolkit for React applications using Functional Reactive Aspect-Oriented Programming with Model-View-Intent architecture.

## Features

- 🔍 Real-time prop analysis and monitoring
- 📊 Performance impact visualization
- 🎯 Optimization recommendations
- 📈 Component relationship mapping
- ⏱️ Render impact analysis
- 🔄 Prop pattern detection
- 📝 Value history tracking
- ⚡ Real-time monitoring

## Installation

```bash
npm install fraop-mvi-dev-tools
```

## Quick Start

```typescript
import { initDevTools } from 'fraop-mvi-dev-tools';

// Initialize in development environment
if (process.env.NODE_ENV === 'development') {
  initDevTools({
    target: document.getElementById('dev-tools-root'),
    features: ['monitoring', 'optimization', 'analysis'],
    theme: 'dark'
  });
}
```

## Components

### MonitoringDashboard

Real-time monitoring of component performance and prop updates.

```typescript
import { MonitoringDashboard } from 'fraop-mvi-dev-tools';

function App() {
  return (
    <MonitoringDashboard data={propAnalysisResult} />
  );
}
```

### OptimizationRecommendations

Get actionable recommendations for improving component performance.

```typescript
import { OptimizationRecommendations } from 'fraop-mvi-dev-tools';

function App() {
  return (
    <OptimizationRecommendations data={propAnalysisResult} />
  );
}
```

### RenderImpactAnalysis

Analyze the impact of prop changes on component renders.

```typescript
import { RenderImpactAnalysis } from 'fraop-mvi-dev-tools';

function App() {
  return (
    <RenderImpactAnalysis data={propAnalysisResult} />
  );
}
```

## API Reference

### PropAnalyzer

The core analysis engine that tracks and analyzes prop usage.

```typescript
import { PropAnalyzer } from 'fraop-mvi-dev-tools';

const analyzer = new PropAnalyzer();
analyzer.trackPropUsage(Component, props, 'ComponentName');
const analysis = analyzer.analyzeProps();
```

### MonitoringService

Service for real-time monitoring and event handling.

```typescript
import { MonitoringService } from 'fraop-mvi-dev-tools';

const service = MonitoringService.getInstance();
service.startMonitoring();
service.subscribe(event => {
  console.log('Monitoring event:', event);
});
```

## Configuration

The dev tools can be configured with various options:

```typescript
initDevTools({
  target: HTMLElement,       // Mount point for dev tools
  features?: string[],       // Enabled features
  theme?: 'light' | 'dark', // UI theme
  plugins?: any[],          // Custom plugins
  position?: {              // Initial window position
    x: number,
    y: number
  }
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 