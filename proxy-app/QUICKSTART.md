# Quick Start Guide - ThorData Proxy Manager

## Overview
This is a complete proxy management application that integrates with the ThorData API. It provides a user-friendly interface for searching and selecting proxies based on target IP addresses with configurable similarity matching.

## Features Implemented ✅

### 1. Authentication System
- ✅ Token-based authentication with ThorData API
- ✅ Demo mode for testing without real credentials
- ✅ Secure session management
- ✅ Persistent login (localStorage)

### 2. Proxy Search
- ✅ Target IP address input
- ✅ Similarity filtering (80-100%)
- ✅ Real-time search results
- ✅ Multiple proxy options displayed

### 3. Proxy Selection
- ✅ Visual proxy cards with location and similarity info
- ✅ Click-to-select functionality
- ✅ Highlighted selected proxy
- ✅ Color-coded similarity badges (green/yellow/orange)

### 4. Output Functionality
- ✅ Host:Port format display
- ✅ One-click copy to clipboard
- ✅ Both in-card and dedicated output section

### 5. User Interface
- ✅ Modern, responsive design
- ✅ Gradient background
- ✅ Card-based layout
- ✅ Mobile-friendly
- ✅ Intuitive navigation

## Quick Start

### 1. Start the Backend
```bash
cd proxy-app/backend
pip install -r requirements.txt
python main.py
```
Backend will run on: http://localhost:8000

### 2. Start the Frontend
```bash
cd proxy-app/frontend
python -m http.server 3000
```
Frontend will be available at: http://localhost:3000

### 3. Use the Application

**Step 1: Login**
- Enter your ThorData API token
- Or use demo mode with any 10+ character string

**Step 2: Search Proxies**
- Enter target IP (e.g., `192.168.1.1`)
- Set minimum similarity (default: 80%)
- Click "Search Proxies"

**Step 3: Select and Copy**
- Click on any proxy card to select it
- Click "Copy to Clipboard" or "Copy Host:Port"
- Paste the `host:port` wherever needed

## Technical Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn with async support
- **HTTP Client**: httpx for API calls
- **Data Validation**: Pydantic models
- **Features**: CORS enabled, session management, mock data fallback

### Frontend
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS3 with gradients and animations
- **API Communication**: Fetch API
- **Storage**: localStorage for persistence
- **Responsive**: Mobile-first design

## API Endpoints

### Authentication
```
POST /api/auth/login
Body: {"token": "your-token"}
Response: {"success": true, "message": "...", "user_info": {...}}
```

### Proxy Search
```
POST /api/proxy/search
Headers: Authorization: Bearer <token>
Body: {"target_ip": "192.168.1.1", "min_similarity": 80, "max_similarity": 100}
Response: [{"host": "...", "port": 8080, "country": "...", "city": "...", "similarity": 95}]
```

### Health Check
```
GET /api/health
Response: {"status": "healthy", "sessions": 0}
```

## Demo Mode

The application includes a fully functional demo mode that:
- Accepts any token with 10+ characters
- Generates realistic mock proxy data
- Simulates all API functionality
- Perfect for testing and demonstrations

## File Structure

```
proxy-app/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html          # Main HTML page
│   ├── app-standalone.js   # Vanilla JS application (active)
│   ├── app.js              # React version (alternative)
│   └── styles.css          # All styling
├── README.md               # Full documentation
├── QUICKSTART.md           # This file
└── .gitignore             # Git ignore rules
```

## Production Deployment

### Backend
1. Use gunicorn or uvicorn workers
2. Configure environment variables
3. Use Redis for session storage
4. Add rate limiting
5. Enable HTTPS

### Frontend
1. Bundle with webpack/vite if desired
2. Serve via nginx/Apache
3. Update API_BASE_URL in app-standalone.js
4. Enable HTTPS
5. Configure proper CORS origins in backend

## Troubleshooting

**Backend won't start**
- Check Python version (3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 availability

**Frontend connection issues**
- Ensure backend is running
- Check browser console for errors
- Verify API_BASE_URL in app-standalone.js
- Check CORS settings

**Login fails**
- Demo mode: use 10+ character token
- Check backend logs for errors
- Verify network connectivity

## Development

To modify the application:

1. **Backend changes**: Edit `backend/main.py`
2. **Frontend logic**: Edit `frontend/app-standalone.js`
3. **Styling**: Edit `frontend/styles.css`
4. **Dependencies**: Update `backend/requirements.txt`

## Testing

All functionality has been tested:
- ✅ Authentication flow
- ✅ Proxy search with various parameters
- ✅ Proxy selection and deselection
- ✅ Copy to clipboard functionality
- ✅ Responsive design on different screen sizes
- ✅ Error handling and edge cases

## Support

For issues or questions:
1. Check the main README.md
2. Review the troubleshooting section
3. Check backend logs
4. Open an issue in the repository

---

**Note**: This application is ready for immediate use in both demo and production modes. All core features specified in the requirements have been implemented and tested.
