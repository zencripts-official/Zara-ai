function WeatherWidget() {
    try {
        const [location, setLocation] = React.useState('');
        const [weather, setWeather] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState('');
        const [recentLocations, setRecentLocations] = React.useState([]);
        const [useCurrentLocation, setUseCurrentLocation] = React.useState(false);

        React.useEffect(() => {
            // Load recent locations from localStorage if available
            const savedLocations = localStorage.getItem('recentWeatherLocations');
            if (savedLocations) {
                try {
                    setRecentLocations(JSON.parse(savedLocations).slice(0, 5));
                } catch (e) {
                    console.error('Error loading recent locations:', e);
                }
            }
        }, []);

        const saveLocationToRecents = (loc) => {
            if (!loc || loc.trim() === '') return;
            
            const updatedLocations = [loc, ...recentLocations.filter(item => item.toLowerCase() !== loc.toLowerCase())].slice(0, 5);
            setRecentLocations(updatedLocations);
            
            try {
                localStorage.setItem('recentWeatherLocations', JSON.stringify(updatedLocations));
            } catch (e) {
                console.error('Error saving recent locations:', e);
            }
        };

        const handleSubmit = async (e) => {
            if (e) e.preventDefault();
            if (!location.trim() || loading) return;
            
            setLoading(true);
            setError('');
            setWeather(null);
            
            try {
                const weatherPrompt = `What's the current weather in ${location}? Please provide a brief summary including temperature, conditions, and forecast. Format the response as a weather report with sections for current conditions, temperature, humidity, wind, and a short forecast for the next 24 hours.`;
                const response = await fetchGeminiResponse(weatherPrompt);
                setWeather(response);
                saveLocationToRecents(location);
            } catch (err) {
                console.error('Weather retrieval failed:', err);
                setError('Failed to get weather information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const getCurrentLocationWeather = () => {
            if (navigator.geolocation) {
                setUseCurrentLocation(true);
                setLoading(true);
                setError('');
                
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            
                            // First, get the location name from coordinates
                            const locationPrompt = `Given the coordinates latitude ${latitude} and longitude ${longitude}, what is the name of the city or town at these coordinates? Just provide the name of the city/town and country, nothing else.`;
                            const locationName = await fetchGeminiResponse(locationPrompt);
                            
                            setLocation(locationName);
                            
                            // Then get the weather for this location
                            const weatherPrompt = `What's the current weather at coordinates latitude ${latitude} and longitude ${longitude} (${locationName})? Please provide a brief summary including temperature, conditions, and forecast. Format the response as a weather report with sections for current conditions, temperature, humidity, wind, and a short forecast for the next 24 hours.`;
                            const weatherResponse = await fetchGeminiResponse(weatherPrompt);
                            
                            setWeather(weatherResponse);
                            saveLocationToRecents(locationName);
                        } catch (err) {
                            console.error('Error getting weather for current location:', err);
                            setError('Failed to get weather for your current location. Please try entering a location manually.');
                        } finally {
                            setLoading(false);
                            setUseCurrentLocation(false);
                        }
                    },
                    (err) => {
                        console.error('Geolocation error:', err);
                        setError('Unable to access your location. Please check your browser permissions or enter a location manually.');
                        setLoading(false);
                        setUseCurrentLocation(false);
                    },
                    { timeout: 10000 }
                );
            } else {
                setError('Geolocation is not supported by your browser. Please enter a location manually.');
            }
        };

        const handleRecentLocationClick = (loc) => {
            setLocation(loc);
            setTimeout(() => {
                handleSubmit();
            }, 100);
        };

        return (
            <div className="p-3 sm:p-4 max-w-4xl mx-auto" data-name="weather-widget">
                <div className="mb-4 sm:mb-6" data-name="weather-header">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-responsive">Weather Information</h2>
                    <p className="text-sm sm:text-base text-gray-600">Get current weather for any location</p>
                </div>
                
                <form onSubmit={handleSubmit} className="mb-3 sm:mb-4" data-name="weather-form">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter city or location..."
                                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || useCurrentLocation}
                                data-name="location-input"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={getCurrentLocationWeather}
                                disabled={loading || useCurrentLocation}
                                className={`px-3 py-2 rounded-lg ${
                                    loading || useCurrentLocation
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                                data-name="current-location-button"
                            >
                                <i className="fas fa-location-dot mr-1 sm:mr-2"></i>
                                <span className="text-xs sm:text-sm">Current</span>
                            </button>
                            
                            <button
                                type="submit"
                                disabled={loading || !location.trim() || useCurrentLocation}
                                className={`px-3 py-2 rounded-lg ${
                                    loading || !location.trim() || useCurrentLocation
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                                data-name="get-weather-button"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <i className="fas fa-spinner fa-spin mr-1 sm:mr-2"></i>
                                        <span className="text-xs sm:text-sm">Loading...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <i className="fas fa-search mr-1 sm:mr-2"></i>
                                        <span className="text-xs sm:text-sm">Search</span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
                
                {recentLocations.length > 0 && (
                    <div className="mb-4" data-name="recent-locations">
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Recent searches:</p>
                        <div className="flex flex-wrap gap-2">
                            {recentLocations.map((loc, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRecentLocationClick(loc)}
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm"
                                    data-name={`recent-location-${index}`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base mb-4" data-name="weather-error">
                        {error}
                    </div>
                )}
                
                {loading && (
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg animate-pulse" data-name="weather-loading">
                        <div className="text-blue-500 mb-2">
                            <i className="fas fa-cloud-sun text-3xl sm:text-4xl"></i>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">Fetching weather information...</p>
                    </div>
                )}
                
                {weather && !loading && !error && (
                    <div className="mt-3 sm:mt-4 rounded-lg overflow-hidden shadow-md" data-name="weather-result">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg sm:text-xl font-semibold" data-name="weather-location">{location}</h3>
                                <span className="text-xs sm:text-sm opacity-80" data-name="weather-time">
                                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-white p-3 sm:p-4">
                            <div className="prose prose-sm sm:prose max-w-none" data-name="weather-content">
                                <div className="whitespace-pre-wrap text-sm sm:text-base">
                                    {weather}
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center" data-name="weather-footer">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Weather information provided by Zara AI
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('WeatherWidget component error:', error);
        reportError(error);
        return null;
    }
}
