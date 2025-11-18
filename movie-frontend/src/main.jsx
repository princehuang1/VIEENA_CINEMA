import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 1. 引入 BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. 用 BrowserRouter 把 App 包裹起來 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)