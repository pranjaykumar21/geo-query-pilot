// Demo configuration for GeoQuery-NLP
// In production, you would set your actual Mapbox token

export const DEMO_CONFIG = {
  // For demo purposes - replace with your actual Mapbox token
  MAPBOX_TOKEN: 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNsZmFjZW11NjAyM3YzZG9kcmJpOGF0MGEifQ.demo_token_here',
  
  // API endpoint - replace with your actual FastAPI backend
  API_BASE_URL: 'https://your-backend-name.hf.space',
  
  // Default Delhi coordinates
  DEFAULT_LOCATION: {
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 10,
    pitch: 45,
    bearing: 0,
  },
  
  // Sample queries for users to try
  SAMPLE_QUERIES: [
    "Show me population density in Delhi",
    "Find commercial areas with high foot traffic",
    "Where are the main transportation hubs?",
    "Show healthcare facilities in South Delhi",
    "Find residential areas with good connectivity"
  ]
};