function WebDesignPage() {
    try {
        const [designQuery, setDesignQuery] = React.useState('');
        const [designResponse, setDesignResponse] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);
        const [error, setError] = React.useState('');

        const handleDesignQuery = async (e) => {
            e.preventDefault();
            if (!designQuery.trim() || isLoading) return;
            
            setIsLoading(true);
            setError('');
            
            try {
                const designPrompt = `As a web design and development expert, please provide guidance on the following web design or development question: ${designQuery}. Include code examples if relevant.`;
                const response = await fetchGeminiResponse(designPrompt);
                setDesignResponse(response);
            } catch (err) {
                console.error('Web design query failed:', err);
                setError('Failed to get web design assistance. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="p-4 max-w-4xl mx-auto" data-name="web-design-page">
                <div className="mb-6" data-name="web-design-header">
                    <h2 className="text-2xl font-bold text-gray-800">Web Design Assistant</h2>
                    <p className="text-gray-600">Get expert web design and development guidance</p>
                </div>
                
                <form onSubmit={handleDesignQuery} className="mb-6" data-name="web-design-form">
                    <div className="mb-4">
                        <textarea
                            value={designQuery}
                            onChange={(e) => setDesignQuery(e.target.value)}
                            placeholder="Ask about web design, UI/UX, or request code examples..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            disabled={isLoading}
                            data-name="design-query-input"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !designQuery.trim()}
                        className={`px-4 py-2 rounded-lg ${
                            isLoading || !designQuery.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                        data-name="get-design-help-button"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="fas fa-palette mr-2"></i> Get Design Help
                            </span>
                        )}
                    </button>
                </form>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg" data-name="design-error">
                        {error}
                    </div>
                )}
                
                {designResponse && !error && (
                    <div className="mt-6" data-name="design-response">
                        <h3 className="text-lg font-semibold mb-2">Design Solution:</h3>
                        <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap border-l-4 border-purple-500">
                            {designResponse}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('WebDesignPage component error:', error);
        reportError(error);
        return null;
    }
}
