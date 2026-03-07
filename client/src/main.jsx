import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Set default base URL for API calls - removed to allow Vite proxy
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5123';
axios.defaults.withCredentials = false; // Adjust if using cookies

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
