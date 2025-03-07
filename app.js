function App() {
    try {
        const [activeFeature, setActiveFeature] = React.useState('chat');
        const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

        const renderActiveFeature = () => {
            switch (activeFeature) {
                case 'chat':
                    return <ChatPage />;
                case 'security':
                    return <SecurityPage />;
                case 'webdesign':
                    return <WebDesignPage />;
                case 'voice':
                    return <VoiceChatPage />;
                case 'automation':
                    return <AutomationPage />;
                case 'weather':
                    return <WeatherWidget />;
                case 'study':
                    return <StudyHelperPage />;
                case 'images':
                    return <ImageGeneration />;
                default:
                    return <ChatPage />;
            }
        };

        const handleFeatureSelect = (feature) => {
            setActiveFeature(feature);
            setIsMobileMenuOpen(false);
        };

        return (
            <div className="app-container" data-name="app-root">
                {/* Desktop Sidebar */}
                <div className="lg:block hidden" data-name="sidebar-container">
                    <Sidebar 
                        activeFeature={activeFeature}
                        onFeatureSelect={handleFeatureSelect}
                    />
                </div>
                
                <main className="flex flex-col" data-name="main-content">
                    <Header />
                    
                    {/* Mobile Navigation */}
                    <div className="lg:hidden flex overflow-x-auto py-2 px-2 sm:px-4 bg-white border-b border-gray-200" data-name="mobile-nav">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="px-2 py-1 mr-2 rounded-lg text-gray-600 lg:hidden"
                            data-name="mobile-menu-toggle"
                        >
                            <i className="fas fa-bars mr-1"></i>
                            <span className="text-sm">Menu</span>
                        </button>
                        
                        <button 
                            onClick={() => handleFeatureSelect('chat')}
                            className={`px-2 sm:px-3 py-1 sm:py-2 mr-2 rounded-lg ${activeFeature === 'chat' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            data-name="mobile-nav-chat"
                        >
                            <i className="fas fa-comments mr-1 sm:mr-2"></i>
                            <span className="text-xs sm:text-sm">Chat</span>
                        </button>
                        <button 
                            onClick={() => handleFeatureSelect('security')}
                            className={`px-2 sm:px-3 py-1 sm:py-2 mr-2 rounded-lg ${activeFeature === 'security' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            data-name="mobile-nav-security"
                        >
                            <i className="fas fa-shield-alt mr-1 sm:mr-2"></i>
                            <span className="text-xs sm:text-sm">Security</span>
                        </button>
                        <button 
                            onClick={() => handleFeatureSelect('voice')}
                            className={`px-2 sm:px-3 py-1 sm:py-2 mr-2 rounded-lg ${activeFeature === 'voice' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            data-name="mobile-nav-voice"
                        >
                            <i className="fas fa-microphone mr-1 sm:mr-2"></i>
                            <span className="text-xs sm:text-sm">Voice</span>
                        </button>
                        <button 
                            onClick={() => handleFeatureSelect('weather')}
                            className={`px-2 sm:px-3 py-1 sm:py-2 mr-2 rounded-lg ${activeFeature === 'weather' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            data-name="mobile-nav-weather"
                        >
                            <i className="fas fa-cloud-sun mr-1 sm:mr-2"></i>
                            <span className="text-xs sm:text-sm">Weather</span>
                        </button>
                    </div>
                    
                    {/* Mobile Full Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50" data-name="mobile-full-menu-overlay">
                            <div className="bg-white w-64 h-full overflow-y-auto p-4" data-name="mobile-full-menu">
                                <div className="flex justify-between items-center mb-4" data-name="mobile-menu-header">
                                    <h2 className="font-semibold">Zara AI Features</h2>
                                    <button 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-gray-100"
                                        data-name="mobile-menu-close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <Sidebar 
                                    activeFeature={activeFeature}
                                    onFeatureSelect={handleFeatureSelect}
                                />
                            </div>
                        </div>
                    )}
                    
                    {renderActiveFeature()}
                </main>
            </div>
        );
    } catch (error) {
        console.error('App component error:', error);
        reportError(error);
        return null;
    }
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
