// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Application State
let state = {
    isAuthenticated: false,
    token: '',
    targetIP: '',
    proxies: [],
    loading: false,
    error: '',
    selectedProxy: null,
    minSimilarity: 80
};

// DOM Elements
let elements = {};

// Initialize the application
function init() {
    // Load saved token if exists
    const savedToken = localStorage.getItem('thordata_token');
    if (savedToken) {
        state.token = savedToken;
    }

    render();
}

// Render the application
function render() {
    const root = document.getElementById('root');
    
    if (!state.isAuthenticated) {
        root.innerHTML = renderLoginPage();
        attachLoginHandlers();
    } else {
        root.innerHTML = renderMainPage();
        attachMainHandlers();
    }
}

// Render Login Page
function renderLoginPage() {
    return `
        <div class="container">
            <div class="login-container">
                <div class="logo">
                    <h1>🔐 ThorData Proxy Manager</h1>
                    <p>Enterprise Proxy Solution</p>
                </div>

                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="token">API Token</label>
                        <input
                            type="password"
                            id="token"
                            value="${state.token}"
                            placeholder="Enter your ThorData API token"
                            required
                            ${state.loading ? 'disabled' : ''}
                        />
                    </div>

                    ${state.error ? `<div class="error-message">${state.error}</div>` : ''}

                    <button type="submit" class="btn btn-primary" ${state.loading ? 'disabled' : ''}>
                        ${state.loading ? 'Authenticating...' : 'Login'}
                    </button>

                    <div class="info-box">
                        <p><strong>Demo Mode:</strong> Enter any token with 10+ characters to try the app</p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Render Main Page
function renderMainPage() {
    return `
        <div class="container">
            <div class="header">
                <h1>🌐 ThorData Proxy Manager</h1>
                <button id="logoutBtn" class="btn btn-secondary">Logout</button>
            </div>

            <div class="main-content">
                <!-- Search Section -->
                <div class="search-section">
                    <h2>Search Proxies</h2>
                    <form id="searchForm" class="search-form">
                        <div class="form-row">
                            <div class="form-group flex-2">
                                <label for="targetIP">Target IP Address</label>
                                <input
                                    type="text"
                                    id="targetIP"
                                    value="${state.targetIP}"
                                    placeholder="e.g., 192.168.1.1"
                                    required
                                    ${state.loading ? 'disabled' : ''}
                                />
                            </div>

                            <div class="form-group flex-1">
                                <label for="similarity">Min Similarity (%)</label>
                                <input
                                    type="number"
                                    id="similarity"
                                    value="${state.minSimilarity}"
                                    min="80"
                                    max="100"
                                    ${state.loading ? 'disabled' : ''}
                                />
                            </div>
                        </div>

                        ${state.error ? `<div class="error-message">${state.error}</div>` : ''}

                        <button type="submit" class="btn btn-primary" ${state.loading ? 'disabled' : ''}>
                            ${state.loading ? 'Searching...' : 'Search Proxies'}
                        </button>
                    </form>
                </div>

                ${state.proxies.length > 0 ? renderProxiesSection() : ''}
                ${state.selectedProxy ? renderOutputSection() : ''}
            </div>
        </div>
    `;
}

// Render Proxies Section
function renderProxiesSection() {
    return `
        <div class="results-section">
            <h2>Available Proxies (${state.proxies.length} found)</h2>
            <div class="proxy-grid">
                ${state.proxies.map((proxy, index) => renderProxyCard(proxy, index)).join('')}
            </div>
        </div>
    `;
}

// Render Proxy Card
function renderProxyCard(proxy, index) {
    const isSelected = state.selectedProxy && 
                      state.selectedProxy.host === proxy.host && 
                      state.selectedProxy.port === proxy.port;
    const similarityClass = proxy.similarity >= 95 ? 'high' : proxy.similarity >= 85 ? 'medium' : 'low';
    
    return `
        <div class="proxy-card ${isSelected ? 'selected' : ''}" data-index="${index}">
            <div class="proxy-header">
                <span class="proxy-location">
                    📍 ${proxy.city}, ${proxy.country}
                </span>
                <span class="similarity-badge ${similarityClass}">
                    ${proxy.similarity}% match
                </span>
            </div>
            <div class="proxy-details">
                <div class="proxy-endpoint">
                    <strong>${proxy.host}:${proxy.port}</strong>
                </div>
            </div>
            ${isSelected ? `
                <div class="proxy-actions">
                    <button class="btn btn-copy" data-copy="${proxy.host}:${proxy.port}">
                        📋 Copy Host:Port
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Render Output Section
function renderOutputSection() {
    return `
        <div class="output-section">
            <h2>Selected Proxy</h2>
            <div class="output-box">
                <div class="output-content">
                    <code>${state.selectedProxy.host}:${state.selectedProxy.port}</code>
                </div>
                <button id="copyOutputBtn" class="btn btn-primary">
                    📋 Copy to Clipboard
                </button>
            </div>
        </div>
    `;
}

// Attach Login Handlers
function attachLoginHandlers() {
    const form = document.getElementById('loginForm');
    const tokenInput = document.getElementById('token');
    
    tokenInput.addEventListener('input', (e) => {
        state.token = e.target.value;
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
}

// Attach Main Handlers
function attachMainHandlers() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    const targetIPInput = document.getElementById('targetIP');
    const similarityInput = document.getElementById('similarity');
    
    targetIPInput.addEventListener('input', (e) => {
        state.targetIP = e.target.value;
    });
    
    similarityInput.addEventListener('input', (e) => {
        state.minSimilarity = parseInt(e.target.value);
    });
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSearch();
    });
    
    // Proxy cards
    const proxyCards = document.querySelectorAll('.proxy-card');
    proxyCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            state.selectedProxy = state.proxies[index];
            render();
        });
    });
    
    // Copy buttons
    const copyBtns = document.querySelectorAll('[data-copy]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(btn.dataset.copy);
        });
    });
    
    // Output copy button
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', () => {
            copyToClipboard(`${state.selectedProxy.host}:${state.selectedProxy.port}`);
        });
    }
}

// Handle Login
async function handleLogin() {
    state.loading = true;
    state.error = '';
    render();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: state.token }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            state.isAuthenticated = true;
            localStorage.setItem('thordata_token', state.token);
        } else {
            state.error = data.message || 'Login failed';
        }
    } catch (err) {
        state.error = 'Failed to connect to server. Please ensure the backend is running.';
    } finally {
        state.loading = false;
        render();
    }
}

// Handle Logout
function handleLogout() {
    state.isAuthenticated = false;
    state.token = '';
    state.proxies = [];
    state.selectedProxy = null;
    state.error = '';
    localStorage.removeItem('thordata_token');
    render();
}

// Handle Search
async function handleSearch() {
    state.loading = true;
    state.error = '';
    state.proxies = [];
    state.selectedProxy = null;
    render();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/proxy/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`,
            },
            body: JSON.stringify({
                target_ip: state.targetIP,
                min_similarity: state.minSimilarity,
                max_similarity: 100,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch proxies');
        }
        
        const data = await response.json();
        state.proxies = data;
    } catch (err) {
        state.error = err.message || 'Failed to search proxies';
    } finally {
        state.loading = false;
        render();
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard: ' + text);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard: ' + text);
    });
}

// Start the app
window.addEventListener('DOMContentLoaded', init);
