import { create } from 'zustand';
import { FlyToInterpolator } from '@deck.gl/core';

// Types for our store
export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
}

export interface UIState {
  isLoading: boolean;
  viewMode: 'markers' | 'heatmap' | '3D';
  isPrivacyMode: boolean;
  focusedObject: any | null;
  showMapPanel: boolean;
  showSystemInfo: boolean;
  awaitingMapDecision: boolean;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export interface StoreState {
  // Map state
  viewState: ViewState;
  
  // Data from backend
  queryResults: any | null;
  
  // UI state
  uiState: UIState;
  
  // Conversation
  conversationHistory: Message[];
  
  // Actions
  setViewState: (newViewState: Partial<ViewState>) => void;
  startQuery: () => void;
  endQuery: (results: any) => void;
  setViewMode: (mode: 'markers' | 'heatmap' | '3D') => void;
  togglePrivacyMode: () => void;
  setFocusedObject: (object: any) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearFocus: () => void;
  resetToDelhi: () => void;
  setShowMapPanel: (show: boolean) => void;
  setShowSystemInfo: (show: boolean) => void;
  setAwaitingMapDecision: (awaiting: boolean) => void;
}

// Default Delhi coordinates for initial view
const DELHI_COORDS = {
  longitude: 77.2090,
  latitude: 28.6139,
  zoom: 10,
  pitch: 45,
  bearing: 0,
  transitionDuration: 2000,
  transitionInterpolator: new FlyToInterpolator()
};

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  viewState: DELHI_COORDS,
  
  queryResults: null,
  
  uiState: {
    isLoading: false,
    viewMode: 'markers',
    isPrivacyMode: false,
    focusedObject: null,
    showMapPanel: false,
    showSystemInfo: false,
    awaitingMapDecision: false,
  },
  
  conversationHistory: [
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to GeoQuery-NLP Command Center. I can help you analyze geospatial data with natural language queries. Try asking me about locations, demographics, or spatial patterns.',
      timestamp: new Date(),
    }
  ],

  // Actions
  setViewState: (newViewState) => set((state) => ({
    viewState: { ...state.viewState, ...newViewState }
  })),

  startQuery: () => set((state) => ({
    uiState: { ...state.uiState, isLoading: true }
  })),

  endQuery: (results) => set((state) => ({
    queryResults: results,
    uiState: { ...state.uiState, isLoading: false }
  })),

  setViewMode: (mode) => set((state) => ({
    uiState: { ...state.uiState, viewMode: mode }
  })),

  togglePrivacyMode: () => set((state) => ({
    uiState: { ...state.uiState, isPrivacyMode: !state.uiState.isPrivacyMode }
  })),

  setFocusedObject: (object) => set((state) => ({
    uiState: { ...state.uiState, focusedObject: object }
  })),

  clearFocus: () => set((state) => ({
    uiState: { ...state.uiState, focusedObject: null }
  })),

  addMessage: (message) => set((state) => ({
    conversationHistory: [
      ...state.conversationHistory,
      {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      }
    ]
  })),

  resetToDelhi: () => set(() => ({
    viewState: DELHI_COORDS,
    uiState: {
      isLoading: false,
      viewMode: 'markers',
      isPrivacyMode: false,
      focusedObject: null,
      showMapPanel: false,
      showSystemInfo: false,
      awaitingMapDecision: false,
    }
  })),

  setShowMapPanel: (show) => set((state) => ({
    uiState: { ...state.uiState, showMapPanel: show, awaitingMapDecision: false }
  })),

  setShowSystemInfo: (show) => set((state) => ({
    uiState: { ...state.uiState, showSystemInfo: show }
  })),

  setAwaitingMapDecision: (awaiting) => set((state) => ({
    uiState: { ...state.uiState, awaitingMapDecision: awaiting }
  })),
}));