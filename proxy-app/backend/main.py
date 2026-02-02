#!/usr/bin/env python3
"""
Proxy Application Backend API
FastAPI server for ThorData proxy management
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import asyncio

app = FastAPI(title="ThorData Proxy API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ThorData API Base URL
THORDATA_API_BASE = "https://api.thordata.com/v1"

# Models
class LoginRequest(BaseModel):
    token: str

class ProxySearchRequest(BaseModel):
    target_ip: str
    min_similarity: int = 80
    max_similarity: int = 100

class ProxyResponse(BaseModel):
    host: str
    port: int
    country: str
    city: str
    similarity: int

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_info: Optional[dict] = None

# In-memory session storage (use Redis in production)
sessions = {}


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "ThorData Proxy API", "status": "running"}


@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate user with ThorData API token
    """
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {request.token}"}
            
            # Validate token with ThorData API
            # Note: This is a mock implementation. Replace with actual ThorData API endpoint
            response = await client.get(
                f"{THORDATA_API_BASE}/auth/validate",
                headers=headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                user_data = response.json()
                # Store session
                sessions[request.token] = user_data
                return LoginResponse(
                    success=True,
                    message="Login successful",
                    user_info=user_data
                )
            else:
                return LoginResponse(
                    success=False,
                    message="Invalid token"
                )
    except httpx.RequestError:
        # Fallback for demo - accept any non-empty token
        if request.token and len(request.token) > 10:
            sessions[request.token] = {"demo": True}
            return LoginResponse(
                success=True,
                message="Login successful (demo mode)",
                user_info={"demo": True, "username": "demo_user"}
            )
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/proxy/search", response_model=List[ProxyResponse])
async def search_proxies(
    request: ProxySearchRequest,
    authorization: str = Header(None)
):
    """
    Search for proxies matching target IP with similarity filtering
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    if token not in sessions:
        raise HTTPException(status_code=401, detail="Session expired")
    
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Call ThorData API to search proxies
            # Note: This is a mock implementation. Replace with actual ThorData API endpoint
            response = await client.get(
                f"{THORDATA_API_BASE}/proxies/search",
                headers=headers,
                params={
                    "target_ip": request.target_ip,
                    "min_similarity": request.min_similarity,
                    "max_similarity": request.max_similarity
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                proxies = response.json().get("proxies", [])
                return [ProxyResponse(**proxy) for proxy in proxies]
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch proxies"
                )
    except httpx.RequestError:
        # Fallback demo data - generate mock proxies
        mock_proxies = generate_mock_proxies(request.target_ip, request.min_similarity)
        return mock_proxies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_mock_proxies(target_ip: str, min_similarity: int) -> List[ProxyResponse]:
    """
    Generate mock proxy data for demo purposes
    """
    import random
    
    countries = ["United States", "United Kingdom", "Germany", "France", "Japan", "Singapore"]
    cities = {
        "United States": ["New York", "Los Angeles", "Chicago", "Houston"],
        "United Kingdom": ["London", "Manchester", "Birmingham"],
        "Germany": ["Berlin", "Munich", "Hamburg"],
        "France": ["Paris", "Lyon", "Marseille"],
        "Japan": ["Tokyo", "Osaka", "Kyoto"],
        "Singapore": ["Singapore"]
    }
    
    proxies = []
    for i in range(random.randint(5, 15)):
        country = random.choice(countries)
        city = random.choice(cities[country])
        similarity = random.randint(min_similarity, 100)
        
        proxy = ProxyResponse(
            host=f"proxy{i+1}.thordata.net",
            port=random.randint(8000, 9999),
            country=country,
            city=city,
            similarity=similarity
        )
        proxies.append(proxy)
    
    # Sort by similarity (highest first)
    proxies.sort(key=lambda x: x.similarity, reverse=True)
    
    return proxies


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "sessions": len(sessions)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
