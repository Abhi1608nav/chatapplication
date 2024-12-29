import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from './context/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster closeButton position="top-right"  />
  </SocketProvider>
)
