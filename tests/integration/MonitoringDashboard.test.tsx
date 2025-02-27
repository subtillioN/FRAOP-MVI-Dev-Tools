import React from 'react';
import { render, screen, act } from '../__utils__/test-utils';
import MonitoringDashboard from '../../src/components/MonitoringDashboard';
import { mockPropAnalysisResult } from '../__fixtures__/mockData';
import { MonitoringService } from '../../src/services/MonitoringService';

describe('MonitoringDashboard Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders real-time metrics and updates with new data', async () => {
    const monitoringService = MonitoringService.getInstance();
    
    render(<MonitoringDashboard data={mockPropAnalysisResult} />);

    // Initial render
    expect(screen.getByText('Real-time Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Components Tracked')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // From mock data

    // Simulate monitoring update
    act(() => {
      monitoringService['notifyListeners']({
        type: 'update',
        timestamp: Date.now(),
        data: {
          ...mockPropAnalysisResult,
          components: [
            ...mockPropAnalysisResult.components,
            {
              componentName: 'NewComponent',
              props: []
            }
          ]
        }
      });
      jest.advanceTimersByTime(1000);
    });

    // Check updated values
    expect(screen.getByText('3')).toBeInTheDocument(); // Updated component count
  });

  it('displays warnings when they occur', () => {
    const monitoringService = MonitoringService.getInstance();
    
    render(<MonitoringDashboard data={mockPropAnalysisResult} />);

    // Simulate warning
    act(() => {
      monitoringService['notifyListeners']({
        type: 'warning',
        timestamp: Date.now(),
        data: {
          message: 'High frequency prop updates detected'
        }
      });
    });

    expect(screen.getByText('High frequency prop updates detected')).toBeInTheDocument();
  });

  it('updates metrics chart with new data points', () => {
    render(<MonitoringDashboard data={mockPropAnalysisResult} />);

    const chartContainer = screen.getByTestId('monitoring-dashboard');
    expect(chartContainer).toBeInTheDocument();

    // Verify chart elements
    expect(chartContainer.querySelector('.recharts-line')).toBeInTheDocument();
    expect(chartContainer.querySelector('.recharts-tooltip')).toBeInTheDocument();
  });
}); 