import React, { createContext, useReducer, useContext } from 'react';
import { API_BASE_URL } from '../config/api';

const AppStateContext = createContext();
const AppDispatchContext = createContext();

const initialState = {
  inputText: '',
  uploadedFile: null, // { name, base64, type }
  isAnalyzing: false,
  agentStatuses: ['waiting','waiting','waiting','waiting','waiting','waiting'],
  agentDurations: [null,null,null,null,null,null],
  activeTab: 0,
  results: null,
  error: null,
  analysisHistory: [],
  backendUrl: API_BASE_URL,
  backendStatus: 'disconnected',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.payload };
    case 'SET_UPLOADED_FILE':
      return { ...state, uploadedFile: action.payload };
    case 'REMOVE_FILE':
      return { ...state, uploadedFile: null };
    case 'START_ANALYSIS':
      return { 
        ...state, 
        isAnalyzing: true, 
        error: null, 
        agentStatuses: ['waiting','waiting','waiting','waiting','waiting','waiting'],
        agentDurations: [null,null,null,null,null,null],
      };
    case 'UPDATE_AGENT_STATUS':
      const newStatuses = [...state.agentStatuses];
      newStatuses[action.index] = action.status;
      const newDurations = [...state.agentDurations];
      if (action.duration) newDurations[action.index] = action.duration;
      return { ...state, agentStatuses: newStatuses, agentDurations: newDurations };
    case 'SET_RESULTS':
      return { 
        ...state, 
        isAnalyzing: false, 
        results: action.payload,
        analysisHistory: [
          { ...action.payload, timestamp: new Date().toISOString() },
          ...state.analysisHistory
        ].slice(0, 10)
      };
    case 'SET_ERROR':
      return { ...state, isAnalyzing: false, error: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_BACKEND_URL':
      return { ...state, backendUrl: action.payload };
    case 'SET_BACKEND_STATUS':
      return { ...state, backendStatus: action.payload };
    case 'RESET_ANALYSIS':
      return { ...state, results: null, error: null, isAnalyzing: false, inputText: '', uploadedFile: null };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
