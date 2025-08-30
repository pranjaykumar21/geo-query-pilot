# GeoQuery-NLP: Geospatial Command Center

A sophisticated geospatial analytics platform that combines natural language processing with interactive 3D mapping for location intelligence and spatial data visualization.

![GeoQuery-NLP Demo](https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=600&fit=crop&auto=format)

## 🌟 Features

- **Natural Language Queries**: Ask questions about geospatial data in plain English
- **Interactive 3D Mapping**: Powered by Deck.gl and Mapbox GL JS
- **Multiple Visualization Modes**: Markers, heatmaps, and 3D visualizations
- **Privacy Controls**: Toggle between detailed and aggregated data views
- **Real-time Analytics**: Live data processing and visualization updates
- **Responsive Command Interface**: Glassmorphic UI with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Mapping**: Deck.gl + Mapbox GL JS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: Axios + FastAPI backend

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd geoquery-nlp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Mapbox Token**
   - Get a free token from [Mapbox](https://mapbox.com)
   - Update `src/components/MapView.tsx` with your token
   - Replace `'your-mapbox-token-here'` with your actual token

4. **Configure Backend**
   - Update `src/services/apiService.ts`
   - Replace `'https://your-backend-name.hf.space'` with your FastAPI backend URL

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### Basic Queries
- "Show me population density in Delhi"
- "Find commercial areas with high foot traffic"
- "Where are the main transportation hubs?"

### Visualization Controls
- **Markers Mode**: Individual data points with interactive tooltips
- **Heatmap Mode**: Aggregated intensity visualization
- **3D Mode**: Elevated data visualization with depth
- **Privacy Toggle**: Switch between detailed and anonymized views

### Interactive Features
- Click on any data point to see detailed information
- Use mouse/touch to pan, zoom, and rotate the map
- Toggle between different visualization modes
- Enable privacy mode for aggregated data views

## 🏗️ Architecture

### Core Components
- **MapView**: Main mapping interface with Deck.gl layers
- **CommandBar**: Natural language input and controls
- **FocusView**: Detailed information panel for selected objects
- **Store**: Zustand state management for global app state

### State Management
```typescript
interface AppState {
  viewState: MapViewState;
  queryResults: GeoJSON;
  uiState: UIControls;
  conversationHistory: Message[];
}
```

### API Integration
The app connects to a FastAPI backend that processes natural language queries and returns GeoJSON data. Mock data is provided for demo purposes when the backend is unavailable.

## 🎨 Design System

- **Dark Theme**: Optimized for data visualization
- **Glassmorphism**: Semi-transparent panels with blur effects
- **Typography**: Inter + JetBrains Mono for code/data
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Optimized for desktop and tablet views

## 🔧 Configuration

### Environment Variables
```bash
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_API_BASE_URL=https://your-backend.hf.space
```

### Backend Requirements
Your FastAPI backend should implement:
- `POST /query` - Process natural language queries
- `GET /health` - Health check endpoint
- Return GeoJSON FeatureCollection format

## 📊 Sample Data Format

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [77.2090, 28.6139]
      },
      "properties": {
        "name": "Location Name",
        "population": 50000,
        "category": "residential",
        "value": 1000
      }
    }
  ]
}
```

## 🚀 Deployment

### Frontend Deployment
- The app is optimized for deployment on Vercel, Netlify, or any static hosting
- Run `npm run build` to create production build
- Deploy the `dist` folder

### Backend Integration
- Deploy your FastAPI backend on Hugging Face Spaces, Railway, or similar
- Update the API base URL in the configuration
- Ensure CORS is properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) for rapid prototyping
- Mapbox for excellent mapping APIs
- Deck.gl team for powerful WebGL visualizations
- shadcn/ui for beautiful component library

---

**Note**: This is a demo application. For production use, ensure you have proper API keys, backend infrastructure, and data security measures in place.