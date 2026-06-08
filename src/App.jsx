import { Routes, Route } from "react-router-dom"

import Market from './pages/Market'
import BuyAndSell from './pages/BuyAndSell'
import Portfolio from './pages/Portfolio'
import Budget from './pages/Budget'

import './App.css'

function App() {

  // const [stocks, setStocks] = useState(stocksData)

  return (
    <>
      <div className="start">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/buy-and-sell/:stocksId" element={<BuyAndSell />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

      </div>
    </>
  )
}

export default App
