import axios from 'axios';

// Configure API client
const apiClient = axios.create({
  baseURL: 'https://your-backend-name.hf.space',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Types for API communication
export interface QueryRequest {
  query: string;
  history: Array<{
    type: 'user' | 'assistant';
    content: string;
  }>;
}

export interface QueryResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point' | 'Polygon' | 'LineString';
      coordinates: number[] | number[][] | number[][][];
    };
    properties: {
      [key: string]: any;
    };
  }>;
  metadata?: {
    query: string;
    timestamp: string;
    count: number;
  };
}

// Main API service functions
export const apiService = {
  /**
   * Send a query to the backend and get geospatial results
   */
  async postQuery(queryText: string, history: any[]): Promise<QueryResponse | null> {
    try {
      const response = await apiClient.post<QueryResponse>('/query', {
        query: queryText,
        history: history.slice(-5), // Send only last 5 messages for context
      });
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      
      // For demo purposes, return mock data when API is not available
      return generateMockData(queryText);
    }
  },

  /**
   * Health check for the backend
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return false;
    }
  },
};

/**
 * Generate mock geospatial data for demo purposes
 * This creates realistic-looking data points around Delhi
 */
function generateMockData(query: string): QueryResponse {
  const features = [];
  const centerLat = 28.6139;
  const centerLng = 77.2090;
  const pointCount = Math.floor(Math.random() * 100) + 50;

  // Generate different types of data based on query keywords
  const isPopulation = query.toLowerCase().includes('population') || query.toLowerCase().includes('people');
  const isCommercial = query.toLowerCase().includes('business') || query.toLowerCase().includes('shop') || query.toLowerCase().includes('commercial');
  const isTransport = query.toLowerCase().includes('transport') || query.toLowerCase().includes('metro') || query.toLowerCase().includes('bus');

  for (let i = 0; i < pointCount; i++) {
    // Create random points around Delhi with realistic spread
    const lat = centerLat + (Math.random() - 0.5) * 0.5;
    const lng = centerLng + (Math.random() - 0.5) * 0.5;
    
    let properties: any = {
      id: i,
      name: `Location ${i + 1}`,
      value: Math.floor(Math.random() * 1000) + 100,
      category: isCommercial ? 'commercial' : isTransport ? 'transport' : 'residential',
      intensity: Math.random(),
      elevation: Math.random() * 100 + 10,
    };

    if (isPopulation) {
      properties = {
        ...properties,
        population: Math.floor(Math.random() * 50000) + 1000,
        density: Math.floor(Math.random() * 10000) + 500,
        age_median: Math.floor(Math.random() * 30) + 25,
      };
    }

    if (isCommercial) {
      properties = {
        ...properties,
        business_type: ['retail', 'restaurant', 'office', 'service'][Math.floor(Math.random() * 4)],
        revenue: Math.floor(Math.random() * 1000000) + 50000,
        employees: Math.floor(Math.random() * 100) + 5,
      };
    }

    if (isTransport) {
      properties = {
        ...properties,
        transport_type: ['metro', 'bus', 'auto'][Math.floor(Math.random() * 3)],
        capacity: Math.floor(Math.random() * 1000) + 100,
        frequency: Math.floor(Math.random() * 60) + 5,
      };
    }

    features.push({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat],
      },
      properties,
    });
  }

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
    },
  };
}

export default apiService;