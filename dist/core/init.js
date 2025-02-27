export function initDevTools(config) {
    if (process.env.NODE_ENV !== 'development') {
        console.warn('Dev tools should only be used in development mode');
        return;
    }
    // Initialize the target element
    const target = config.target || document.createElement('div');
    if (!config.target) {
        target.id = 'dev-tools-root';
        document.body.appendChild(target);
    }
    // Set up theme
    document.documentElement.setAttribute('data-theme', config.theme);
    // Initialize features
    config.features.forEach(feature => {
        // Feature initialization will be implemented here
        console.log(`Initializing feature: ${feature}`);
    });
}
//# sourceMappingURL=init.js.map