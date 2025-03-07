function Sidebar({ activeFeature, onFeatureSelect }) {
    try {
        const features = [
            { id: 'chat', icon: 'comments', label: 'Chat' },
            { id: 'security', icon: 'shield-alt', label: 'Security' },
            { id: 'webdesign', icon: 'palette', label: 'Web Design' },
            { id: 'voice', icon: 'microphone', label: 'Voice Chat' },
            { id: 'automation', icon: 'robot', label: 'Automation' },
            { id: 'weather', icon: 'cloud-sun', label: 'Weather' },
            { id: 'study', icon: 'graduation-cap', label: 'Study Helper' },
            { id: 'images', icon: 'images', label: 'Image Generation' }
        ];

        return (
            <div className="sidebar" data-name="sidebar">
                <div className="mb-4 sm:mb-6" data-name="sidebar-header">
                    <h2 className="text-base sm:text-lg font-semibold mb-2">Features</h2>
                </div>
                <nav data-name="sidebar-nav">
                    {features.map(feature => (
                        <div
                            key={feature.id}
                            className={`feature-item flex items-center space-x-3 ${activeFeature === feature.id ? 'active' : ''}`}
                            onClick={() => onFeatureSelect(feature.id)}
                            data-name={`sidebar-feature-${feature.id}`}
                        >
                            <i className={`fas fa-${feature.icon} w-5`}></i>
                            <span className="text-sm sm:text-base">{feature.label}</span>
                        </div>
                    ))}
                </nav>
            </div>
        );
    } catch (error) {
        console.error('Sidebar component error:', error);
        reportError(error);
        return null;
    }
}
