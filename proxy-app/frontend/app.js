const { useState, useEffect } = React;

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Main App Component
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [targetIP, setTargetIP] = useState('');
    const [proxies, setProxies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProxy, setSelectedProxy] = useState(null);
    const [minSimilarity, setMinSimilarity] = useState(80);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                localStorage.setItem('thordata_token', token);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setToken('');
        setProxies([]);
        setSelectedProxy(null);
        localStorage.removeItem('thordata_token');
    };

    // Search proxies
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setProxies([]);
        setSelectedProxy(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/proxy/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    target_ip: targetIP,
                    min_similarity: minSimilarity,
                    max_similarity: 100,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch proxies');
            }

            const data = await response.json();
            setProxies(data);
        } catch (err) {
            setError(err.message || 'Failed to search proxies');
        } finally {
            setLoading(false);
        }
    };

    // Copy to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        });
    };

    // Check for saved token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('thordata_token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Login Page
    if (!isAuthenticated) {
        return (
            <div className="container">
                <div className="login-container">
                    <div className="logo">
                        <h1>🔐 ThorData Proxy Manager</h1>
                        <p>Enterprise Proxy Solution</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="token">API Token</label>
                            <input
                                type="password"
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter your ThorData API token"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>

                        <div className="info-box">
                            <p><strong>Demo Mode:</strong> Enter any token with 10+ characters to try the app</p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Main Application Page
    return (
        <div className="container">
            <div className="header">
                <h1>🌐 ThorData Proxy Manager</h1>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                </button>
            </div>

            <div className="main-content">
                {/* Search Section */}
                <div className="search-section">
                    <h2>Search Proxies</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label htmlFor="targetIP">Target IP Address</label>
                                <input
                                    type="text"
                                    id="targetIP"
                                    value={targetIP}
                                    onChange={(e) => setTargetIP(e.target.value)}
                                    placeholder="e.g., 192.168.1.1"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group flex-1">
                                <label htmlFor="similarity">Min Similarity (%)</label>
                                <input
                                    type="number"
                                    id="similarity"
                                    value={minSimilarity}
                                    onChange={(e) => setMinSimilarity(parseInt(e.target.value))}
                                    min="80"
                                    max="100"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search Proxies'}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                {proxies.length > 0 && (
                    <div className="results-section">
                        <h2>Available Proxies ({proxies.length} found)</h2>
                        <div className="proxy-grid">
                            {proxies.map((proxy, index) => (
                                <div
                                    key={index}
                                    className={`proxy-card ${selectedProxy === proxy ? 'selected' : ''}`}
                                    onClick={() => setSelectedProxy(proxy)}
                                >
                                    <div className="proxy-header">
                                        <span className="proxy-location">
                                            📍 {proxy.city}, {proxy.country}
                                        </span>
                                        <span className={`similarity-badge ${proxy.similarity >= 95 ? 'high' : proxy.similarity >= 85 ? 'medium' : 'low'}`}>
                                            {proxy.similarity}% match
                                        </span>
                                    </div>
                                    <div className="proxy-details">
                                        <div className="proxy-endpoint">
                                            <strong>{proxy.host}:{proxy.port}</strong>
                                        </div>
                                    </div>
                                    {selectedProxy === proxy && (
                                        <div className="proxy-actions">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(`${proxy.host}:${proxy.port}`);
                                                }}
                                                className="btn btn-copy"
                                            >
                                                📋 Copy Host:Port
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Proxy Display */}
                {selectedProxy && (
                    <div className="output-section">
                        <h2>Selected Proxy</h2>
                        <div className="output-box">
                            <div className="output-content">
                                <code>{selectedProxy.host}:{selectedProxy.port}</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard(`${selectedProxy.host}:${selectedProxy.port}`)}
                                className="btn btn-primary"
                            >
                                📋 Copy to Clipboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
