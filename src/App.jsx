import { Routes, Route } from "react-router-dom"

import Market from './pages/Market'
import StockDetails from './pages/StockDetails'
import Portfolio from './pages/Portfolio'
import Budget from './pages/Budget'

import './App.css'

function App() {
  return (
    <>
      <div className="start">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/stock-details" element={<StockDetails />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

      </div>
    </>
  )
}

export default App
