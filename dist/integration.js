export class DevToolsIntegration {
    constructor() {
        this.isInitialized = false;
        this.analysisUpdateInterval = null;
        this.handleComponentMount = (component) => {
            const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!devTools)
                return;
            // Emit component registration
            devTools.emit('prop-tracking:component-mounted', {
                componentName: component.name || 'Anonymous',
                componentId: component._debugID,
                props: component.props,
            });
        };
        this.handleComponentUnmount = (component) => {
            const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!devTools)
                return;
            // Emit component unregistration
            devTools.emit('prop-tracking:component-unmounted', {
                componentId: component._debugID,
            });
        };
    }
    static getInstance() {
        if (!DevToolsIntegration.instance) {
            DevToolsIntegration.instance = new DevToolsIntegration();
        }
        return DevToolsIntegration.instance;
    }
    initialize() {
        if (this.isInitialized)
            return;
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools) {
            console.warn('React DevTools not detected. Some features may be limited.');
            return;
        }
        // Register custom DevTools panel
        this.registerDevToolsPanel();
        // Listen for component mount/unmount events
        devTools.on('mount', this.handleComponentMount);
        devTools.on('unmount', this.handleComponentUnmount);
        // Start periodic analysis updates
        this.startAnalysisUpdates();
        this.isInitialized = true;
    }
    registerDevToolsPanel() {
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools)
            return;
        // Register custom panel
        devTools.emit('register-panel', {
            id: 'prop-analysis',
            title: 'Prop Analysis',
            icon: 'data:image/svg+xml,...', // TODO: Add panel icon
        });
    }
    updateAnalysis(analysis) {
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools)
            return;
        // Emit analysis update
        devTools.emit('prop-tracking:analysis-update', {
            timestamp: Date.now(),
            analysis,
        });
    }
    startAnalysisUpdates() {
        if (this.analysisUpdateInterval)
            return;
        // Update analysis every 2 seconds
        this.analysisUpdateInterval = window.setInterval(() => {
            const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!devTools)
                return;
            // Emit heartbeat to keep connection alive
            devTools.emit('prop-tracking:heartbeat', {
                timestamp: Date.now(),
            });
        }, 2000);
    }
    addInspectedComponent(componentId) {
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools)
            return;
        // Add component to inspection list
        devTools.emit('prop-tracking:inspect-component', {
            componentId,
            timestamp: Date.now(),
        });
    }
    removeInspectedComponent(componentId) {
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools)
            return;
        // Remove component from inspection list
        devTools.emit('prop-tracking:uninspect-component', {
            componentId,
            timestamp: Date.now(),
        });
    }
    getInspectedComponents() {
        // Return list of currently inspected component IDs
        // This would be maintained by listening to DevTools events
        return [];
    }
    cleanup() {
        if (this.analysisUpdateInterval) {
            window.clearInterval(this.analysisUpdateInterval);
            this.analysisUpdateInterval = null;
        }
        const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!devTools)
            return;
        // Unregister event listeners
        devTools.emit('prop-tracking:cleanup', {
            timestamp: Date.now(),
        });
        this.isInitialized = false;
    }
}
export const initializeDevToolsIntegration = () => {
    const integration = DevToolsIntegration.getInstance();
    integration.initialize();
    return integration;
};
//# sourceMappingURL=integration.js.map