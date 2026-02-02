# ThorData Proxy Manager

A complete proxy management application with ThorData API integration.

## Features

✅ **Authentication**: Login using ThorData API token  
✅ **Target IP Input**: Specify the target IP address for proxy search  
✅ **Smart Search**: Find proxies with 80-100% similarity matching  
✅ **Proxy Selection**: Browse and select from available proxies  
✅ **Copy-Paste Output**: Easy Host:Port copying to clipboard  
✅ **Modern UI**: Clean, responsive React-based interface  
✅ **Demo Mode**: Test the application without actual API credentials

## Architecture

### Frontend
- **Technology**: React (vanilla JavaScript with Babel)
- **Features**:
  - Token-based authentication
  - Real-time proxy search
  - Interactive proxy selection
  - Copy-to-clipboard functionality
  - Responsive design

### Backend
- **Technology**: Python with FastAPI
- **Features**:
  - RESTful API endpoints
  - ThorData API integration
  - Session management
  - CORS support
  - Mock data fallback for testing

## Installation

### Prerequisites
- Python 3.8 or higher
- Modern web browser
- (Optional) ThorData API token

### Backend Setup

1. Navigate to the backend directory:
```bash
cd proxy-app/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python main.py
```

The API server will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd proxy-app/frontend
```

2. Serve the frontend using any static file server:

**Option 1: Python HTTP Server**
```bash
python -m http.server 3000
```

**Option 2: Node.js HTTP Server**
```bash
npx http-server -p 3000
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

The application will be available at `http://localhost:3000`

## Usage

### 1. Login
- Open the application in your browser
- Enter your ThorData API token
- For demo mode, enter any string with 10+ characters

### 2. Search Proxies
- Enter the target IP address (e.g., `192.168.1.1`)
- Adjust minimum similarity if needed (default: 80%)
- Click "Search Proxies"

### 3. Select Proxy
- Browse the available proxies
- Click on a proxy card to select it
- View location, similarity score, and endpoint details

### 4. Copy Host:Port
- Click "Copy to Clipboard" button
- The Host:Port will be copied in format: `proxy.example.com:8080`
- Paste wherever needed

## API Endpoints

### POST /api/auth/login
Authenticate with ThorData API token

**Request:**
```json
{
  "token": "your-api-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user_info": {
    "username": "demo_user"
  }
}
```

### POST /api/proxy/search
Search for proxies matching target IP

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "target_ip": "192.168.1.1",
  "min_similarity": 80,
  "max_similarity": 100
}
```

**Response:**
```json
[
  {
    "host": "proxy1.thordata.net",
    "port": 8080,
    "country": "United States",
    "city": "New York",
    "similarity": 95
  }
]
```

### GET /api/health
Health check endpoint

## Configuration

### Backend Configuration
Edit `backend/main.py` to configure:
- `THORDATA_API_BASE`: ThorData API base URL
- CORS origins
- Port and host settings

### Frontend Configuration
Edit `frontend/app.js` to configure:
- `API_BASE_URL`: Backend API URL (default: `http://localhost:8000`)

## Demo Mode

The application includes a demo mode for testing without actual ThorData credentials:

1. Enter any token with 10+ characters
2. The backend will generate mock proxy data
3. All features work as in production mode

## Production Deployment

### Backend
1. Use a production WSGI server (e.g., gunicorn):
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

2. Configure proper CORS origins
3. Use Redis for session storage
4. Add rate limiting and authentication middleware

### Frontend
1. Build for production (if using a build tool)
2. Serve static files via nginx or similar
3. Update API_BASE_URL to production backend URL
4. Enable HTTPS

## Security Considerations

⚠️ **Important Security Notes:**

- Never commit API tokens to version control
- Use environment variables for sensitive configuration
- Implement proper session management in production
- Enable HTTPS for production deployments
- Validate and sanitize all user inputs
- Implement rate limiting on API endpoints

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.8+)
- Verify all dependencies are installed
- Check if port 8000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify API_BASE_URL in `app.js` is correct

### Login fails
- For demo mode, ensure token is 10+ characters
- Check backend logs for errors
- Verify network connectivity

## License

This project is part of the Docusaurus repository and follows its MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review backend logs
- Open an issue in the repository
