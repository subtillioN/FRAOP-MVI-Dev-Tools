import { EventEmitter } from 'events';
export class MonitoringService extends EventEmitter {
    constructor() {
        super();
        this.isMonitoring = false;
        this.updateInterval = null;
    }
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    startMonitoring(interval = 1000) {
        if (this.isMonitoring)
            return;
        this.isMonitoring = true;
        this.emit('monitoring:started');
        this.updateInterval = setInterval(() => {
            const event = {
                type: 'update',
                componentName: 'System',
                timestamp: Date.now(),
                data: {
                    message: 'Monitoring update'
                }
            };
            this.emit('metrics:collected', event);
        }, interval);
    }
    stopMonitoring() {
        if (!this.isMonitoring)
            return;
        this.isMonitoring = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.emit('monitoring:stopped');
    }
    trackPropUpdate(componentName, propName, value) {
        const event = {
            type: 'prop-update',
            componentName,
            timestamp: Date.now(),
            data: {
                propName,
                propValue: value
            }
        };
        this.emit('metrics:collected', event);
    }
    trackRender(componentName, duration) {
        const event = {
            type: 'render',
            componentName,
            timestamp: Date.now(),
            data: {
                renderDuration: duration
            }
        };
        this.emit('metrics:collected', event);
    }
    reportError(componentName, error) {
        const event = {
            type: 'error',
            componentName,
            timestamp: Date.now(),
            data: {
                error,
                message: error.message
            }
        };
        this.emit('metrics:collected', event);
    }
    reportWarning(componentName, message) {
        const event = {
            type: 'warning',
            componentName,
            timestamp: Date.now(),
            data: {
                message
            }
        };
        this.emit('metrics:collected', event);
    }
    subscribe(callback) {
        this.on('metrics:collected', callback);
        return () => this.off('metrics:collected', callback);
    }
}
//# sourceMappingURL=MonitoringService.js.map