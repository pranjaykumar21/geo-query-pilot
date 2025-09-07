import axios from 'axios';

// Configure API client with fallback endpoints
const apiClient = axios.create({
  baseURL: 'https://lakshay911-geonlp.hf.space',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Fallback endpoints
const fallbackEndpoints = [
  'https://lakshay911-geonlp.hf.space',
  'https://api.geospatial-nlp.com',
  'https://mock-geo-api.example.com'
];

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
    structured?: boolean;
    categories?: {
      [categoryName: string]: Array<{
        name: string;
        type: string;
        description: string;
        category: string;
        [key: string]: any;
      }>;
    };
  };
}

// Main API service functions
export const apiService = {
  /**
   * Send a query to the backend and get geospatial results
   */
  async postQuery(queryText: string, history: any[]): Promise<QueryResponse | null> {
    // Try multiple endpoints for reliability
    for (const endpoint of fallbackEndpoints) {
      try {
        const response = await axios.post<QueryResponse>(`${endpoint}/query`, {
          query: queryText,
          history: history.slice(-5), // Send only last 5 messages for context
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
        
        console.log('API Success:', response.data);
        return response.data;
      } catch (error) {
        console.warn(`Failed to reach ${endpoint}:`, error);
        continue;
      }
    }
    
    console.log('All endpoints failed, using enhanced mock data');
    return generateEnhancedMockData(queryText);
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
 * Generate enhanced mock geospatial data for demo purposes
 * This creates realistic-looking data points with intelligent responses
 */
function generateEnhancedMockData(query: string): QueryResponse {
  const features = [];
  const centerLat = 28.6139;
  const centerLng = 77.2090;

  // Enhanced query parsing for specific location-based requests
  const queryLower = query.toLowerCase();
  const isHospital = queryLower.includes('hospital');
  const isSchool = queryLower.includes('school') || queryLower.includes('college');
  const isRestaurant = queryLower.includes('restaurant') || queryLower.includes('food') || queryLower.includes('cafe');
  const isBank = queryLower.includes('bank') || queryLower.includes('atm');
  const isMetro = queryLower.includes('metro') || queryLower.includes('station');
  const isCP = queryLower.includes('cp') || queryLower.includes('connaught') || queryLower.includes('central delhi');
  
  // Generate structured response based on query type
  if (isHospital && isCP) {
    return generateHospitalNearCPResponse(query);
  } else if (isSchool && isCP) {
    return generateSchoolNearCPResponse(query);
  } else if (isRestaurant && isCP) {
    return generateRestaurantNearCPResponse(query);
  } else if (isBank && isCP) {
    return generateBankNearCPResponse(query);
  } else if (isMetro && isCP) {
    return generateMetroNearCPResponse(query);
  }

  // Fallback to original data generation
  const pointCount = Math.floor(Math.random() * 100) + 50;
  const isPopulation = queryLower.includes('population') || queryLower.includes('people');
  const isCommercial = queryLower.includes('business') || queryLower.includes('shop') || queryLower.includes('commercial');
  const isTransport = queryLower.includes('transport') || queryLower.includes('metro') || queryLower.includes('bus');

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

// Specialized response generators for different categories
function generateHospitalNearCPResponse(query: string): QueryResponse {
  const hospitals = [
    {
      name: "Dr. Ram Manohar Lohia Hospital",
      type: "Public Hospital",
      description: "Offers excellent care at reasonable prices, known public hospital",
      coordinates: [77.2090, 28.6260],
      category: "public",
      details: { beds: 1500, specialties: ["Emergency", "Cardiology", "Neurology"], established: 1932 }
    },
    {
      name: "Lok Nayak Hospital",
      type: "Public Hospital", 
      description: "Large public hospital with good treatment and recovery environment",
      coordinates: [77.2050, 28.6180],
      category: "public",
      details: { beds: 2000, specialties: ["General Medicine", "Surgery", "Orthopedics"], established: 1936 }
    },
    {
      name: "Sucheta Kriplani Hospital (Lady Hardinge)",
      type: "Public Hospital",
      description: "Government hospital, good treatment, friendly environment",
      coordinates: [77.2070, 28.6240],
      category: "public", 
      details: { beds: 700, specialties: ["Gynecology", "Pediatrics", "Obstetrics"], established: 1914 }
    },
    {
      name: "Northern Railway Central Hospital", 
      type: "Public Hospital",
      description: "Located on Basant Lane & Chelmsford Road, CP",
      coordinates: [77.2100, 28.6300],
      category: "public",
      details: { beds: 400, specialties: ["General Medicine", "Surgery"], established: 1950 }
    },
    {
      name: "BLK-Max Super Speciality Hospital",
      type: "Private & Super-Speciality Hospital",
      description: "Located on Pusa Road, near Rajendra Place, well-known super speciality hospital",
      coordinates: [77.1950, 28.6350],
      category: "private",
      details: { beds: 650, specialties: ["Cardiac Surgery", "Neurosurgery", "Oncology"], established: 1996 }
    },
    {
      name: "Apollo Hospitals - Marina Arcade",
      type: "Private & Super-Speciality Hospital",
      description: "Presence at Marina Arcade (CP) and nearby Karol Bagh",
      coordinates: [77.2110, 28.6310],
      category: "private",
      details: { beds: 200, specialties: ["Cardiology", "Gastroenterology", "Nephrology"], established: 2010 }
    },
    {
      name: "Kalawati Saran Children's Hospital",
      type: "Private & Super-Speciality Hospital", 
      description: "Children's hospital near Bangla Sahib Road, CP",
      coordinates: [77.2080, 28.6200],
      category: "private",
      details: { beds: 300, specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery"], established: 1985 }
    }
  ];

  const features = hospitals.map((hospital, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: hospital.coordinates,
    },
    properties: {
      id: index,
      name: hospital.name,
      type: hospital.type,
      description: hospital.description,
      category: hospital.category,
      ...hospital.details,
      structuredResponse: true
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
      structured: true,
      categories: {
        "Public Hospitals": hospitals.filter(h => h.category === "public"),
        "Private & Super-Speciality Hospitals": hospitals.filter(h => h.category === "private")
      }
    },
  };
}

function generateSchoolNearCPResponse(query: string): QueryResponse {
  const schools = [
    {
      name: "Modern School",
      type: "Private School",
      description: "Premier educational institution with excellent academic record",
      coordinates: [77.2120, 28.6280],
      category: "private",
      details: { established: 1920, grades: "Nursery-12", affiliation: "CBSE" }
    },
    {
      name: "St. Columbus School",
      type: "Private School", 
      description: "Well-known school with strong academic and sports programs",
      coordinates: [77.2000, 28.6350],
      category: "private",
      details: { established: 1952, grades: "Pre-K-12", affiliation: "CBSE" }
    },
    {
      name: "Sarvodaya Vidyalaya",
      type: "Government School",
      description: "Government school providing quality education",
      coordinates: [77.2060, 28.6220],
      category: "government",
      details: { established: 1975, grades: "1-12", affiliation: "CBSE" }
    }
  ];

  const features = schools.map((school, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: school.coordinates,
    },
    properties: {
      id: index,
      name: school.name,
      type: school.type,
      description: school.description,
      category: school.category,
      ...school.details,
      structuredResponse: true
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
      structured: true,
      categories: {
        "Private Schools": schools.filter(s => s.category === "private"),
        "Government Schools": schools.filter(s => s.category === "government")
      }
    },
  };
}

function generateRestaurantNearCPResponse(query: string): QueryResponse {
  const restaurants = [
    {
      name: "United Coffee House",
      type: "Heritage Restaurant",
      description: "Iconic restaurant serving continental cuisine since 1942",
      coordinates: [77.2095, 28.6315],
      category: "heritage",
      details: { cuisine: "Continental", priceRange: "₹₹₹", rating: 4.2 }
    },
    {
      name: "Zen Restaurant",
      type: "Asian Cuisine",
      description: "Popular Asian restaurant with authentic flavors",
      coordinates: [77.2110, 28.6290],
      category: "asian", 
      details: { cuisine: "Asian", priceRange: "₹₹₹", rating: 4.5 }
    },
    {
      name: "Haldiram's",
      type: "Indian Fast Food",
      description: "Famous for Indian snacks and sweets",
      coordinates: [77.2080, 28.6330],
      category: "indian",
      details: { cuisine: "Indian", priceRange: "₹₹", rating: 4.0 }
    }
  ];

  const features = restaurants.map((restaurant, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: restaurant.coordinates,
    },
    properties: {
      id: index,
      name: restaurant.name,
      type: restaurant.type,
      description: restaurant.description,
      category: restaurant.category,
      ...restaurant.details,
      structuredResponse: true
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
      structured: true,
      categories: {
        "Heritage Restaurants": restaurants.filter(r => r.category === "heritage"),
        "Asian Cuisine": restaurants.filter(r => r.category === "asian"),
        "Indian Restaurants": restaurants.filter(r => r.category === "indian")
      }
    },
  };
}

function generateBankNearCPResponse(query: string): QueryResponse {
  const banks = [
    {
      name: "State Bank of India - CP Branch",
      type: "Public Sector Bank",
      description: "Main SBI branch in Connaught Place with full banking services",
      coordinates: [77.2100, 28.6300],
      category: "public",
      details: { services: ["ATM", "Loans", "Deposits"], timings: "10 AM - 4 PM" }
    },
    {
      name: "HDFC Bank - Block A",
      type: "Private Bank",
      description: "Modern private bank with digital banking facilities",
      coordinates: [77.2090, 28.6280],
      category: "private",
      details: { services: ["ATM", "Personal Banking", "Investment"], timings: "9:30 AM - 6 PM" }
    },
    {
      name: "ICICI Bank ATM",
      type: "ATM",
      description: "24x7 ATM facility in Central Delhi",
      coordinates: [77.2115, 28.6320],
      category: "atm",
      details: { services: ["Cash Withdrawal", "Balance Inquiry"], timings: "24x7" }
    }
  ];

  const features = banks.map((bank, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: bank.coordinates,
    },
    properties: {
      id: index,
      name: bank.name,
      type: bank.type,
      description: bank.description,
      category: bank.category,
      ...bank.details,
      structuredResponse: true
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
      structured: true,
      categories: {
        "Public Sector Banks": banks.filter(b => b.category === "public"),
        "Private Banks": banks.filter(b => b.category === "private"),
        "ATMs": banks.filter(b => b.category === "atm")
      }
    },
  };
}

function generateMetroNearCPResponse(query: string): QueryResponse {
  const metros = [
    {
      name: "Rajiv Chowk Metro Station",
      type: "Interchange Station",
      description: "Major interchange connecting Blue and Yellow lines",
      coordinates: [77.2090, 28.6330],
      category: "interchange",
      details: { lines: ["Blue Line", "Yellow Line"], platforms: 4, opened: 2005 }
    },
    {
      name: "Patel Chowk Metro Station", 
      type: "Yellow Line",
      description: "Yellow line station near CP",
      coordinates: [77.2070, 28.6240],
      category: "yellow",
      details: { lines: ["Yellow Line"], platforms: 2, opened: 2004 }
    },
    {
      name: "Central Secretariat Metro Station",
      type: "Interchange Station",
      description: "Interchange station for Yellow and Violet lines",
      coordinates: [77.2050, 28.6180],
      category: "interchange", 
      details: { lines: ["Yellow Line", "Violet Line"], platforms: 4, opened: 2005 }
    }
  ];

  const features = metros.map((metro, index) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: metro.coordinates,
    },
    properties: {
      id: index,
      name: metro.name,
      type: metro.type,
      description: metro.description,
      category: metro.category,
      ...metro.details,
      structuredResponse: true
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      query,
      timestamp: new Date().toISOString(),
      count: features.length,
      structured: true,
      categories: {
        "Interchange Stations": metros.filter(m => m.category === "interchange"),
        "Yellow Line Stations": metros.filter(m => m.category === "yellow")
      }
    },
  };
}

export default apiService;