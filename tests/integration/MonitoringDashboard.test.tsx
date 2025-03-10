import React from 'react';
import { render, screen, act, waitFor, cleanup } from '../__utils__/test-utils';
import MonitoringDashboard from '../../src/components/MonitoringDashboard';
import { mockPropAnalysisResult } from '../__fixtures__/mockData';
import { MonitoringService } from '../../src/services/MonitoringService';

describe('MonitoringDashboard Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    cleanup(); // Clean up after each test
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders real-time metrics and updates with new data', async () => {
    const { unmount } = render(<MonitoringDashboard data={mockPropAnalysisResult} />);

    // Initial render
    expect(screen.getByText('Real-time Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Components Tracked')).toBeInTheDocument();
    
    // Find by test ID and then check content
    const componentCount = screen.getByTestId('component-count');
    expect(componentCount).toHaveTextContent('2');

    // Clean up previous render
    unmount();

    // Simulate monitoring update with new render
    const updatedData = {
      ...mockPropAnalysisResult,
      components: [
        ...mockPropAnalysisResult.components,
        {
          componentName: 'NewComponent',
          props: []
        }
      ]
    };

    // Render with updated data
    render(<MonitoringDashboard data={updatedData} />);

    // Check updated values using test ID
    await waitFor(() => {
      const updatedCount = screen.getByTestId('component-count');
      expect(updatedCount).toHaveTextContent('3');
    });
  });

  it('displays warnings when they occur', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('High frequency prop updates detected')).toBeInTheDocument();
    });
  });

  it('updates metrics chart with new data points', async () => {
    render(<MonitoringDashboard data={mockPropAnalysisResult} />);

    const chartContainer = screen.getByTestId('monitoring-dashboard');
    expect(chartContainer).toBeInTheDocument();

    // Wait for chart elements to render
    await waitFor(() => {
      expect(chartContainer.querySelector('.recharts-wrapper')).toBeInTheDocument();
      expect(chartContainer.querySelector('.recharts-cartesian-grid')).toBeInTheDocument();
    });
  });
}); 