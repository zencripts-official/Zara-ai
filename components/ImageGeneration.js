function ImageGeneration() {
    try {
        const [prompt, setPrompt] = React.useState('');
        const [generatedText, setGeneratedText] = React.useState('');
        const [isGenerating, setIsGenerating] = React.useState(false);
        const [error, setError] = React.useState('');

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!prompt.trim() || isGenerating) return;
            
            setIsGenerating(true);
            setError('');
            
            try {
                const imageAgent = createImageGenerationAgent();
                const result = await imageAgent(prompt);
                setGeneratedText(result);
            } catch (err) {
                console.error('Image generation failed:', err);
                setError('Failed to generate image description. Please try again.');
            } finally {
                setIsGenerating(false);
            }
        };

        return (
            <div className="p-3 sm:p-4 max-w-4xl mx-auto" data-name="image-generation">
                <div className="mb-4 sm:mb-6" data-name="image-generation-header">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-responsive">AI Image Generation</h2>
                    <p className="text-sm sm:text-base text-gray-600">Describe the image you want to generate</p>
                </div>
                
                <form onSubmit={handleSubmit} data-name="image-generation-form">
                    <div className="mb-3 sm:mb-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            disabled={isGenerating}
                            data-name="image-prompt-input"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isGenerating || !prompt.trim()}
                        className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg ${
                            isGenerating || !prompt.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        data-name="generate-button"
                    >
                        {isGenerating ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Generating...
                            </span>
                        ) : (
                            'Generate Description'
                        )}
                    </button>
                </form>
                
                {error && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base" data-name="image-generation-error">
                        {error}
                    </div>
                )}
                
                {generatedText && !error && (
                    <div className="mt-4 sm:mt-6" data-name="generated-content">
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Generated Description:</h3>
                        <div className="p-3 sm:p-4 bg-gray-100 rounded-lg whitespace-pre-wrap text-sm sm:text-base">
                            {generatedText}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('ImageGeneration component error:', error);
        reportError(error);
        return null;
    }
}
