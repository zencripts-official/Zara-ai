function Header() {
    try {
        return (
            <header className="bg-white border-b border-gray-200 px-4 py-3" data-name="header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3" data-name="header-left">
                        <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/zara.svg" 
                             alt="Zara AI Logo" 
                             className="h-8 w-8 sm:h-8 sm:w-8"
                             data-name="header-logo" />
                        <h1 className="text-lg sm:text-xl font-semibold text-responsive" data-name="header-title">Zara AI Assistant</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4" data-name="header-actions">
                        <button className="p-2 hover:bg-gray-100 rounded-full" data-name="header-theme-toggle">
                            <i className="fas fa-moon"></i>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full" data-name="header-settings">
                            <i className="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
            </header>
        );
    } catch (error) {
        console.error('Header component error:', error);
        reportError(error);
        return null;
    }
}
