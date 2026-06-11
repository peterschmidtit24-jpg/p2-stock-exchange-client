import { Routes, Route } from "react-router-dom"

import Market from './pages/Market'
import BuyAndSell from './pages/BuyAndSell'
import Portfolio from './pages/Portfolio'
import Budget from './pages/Budget'
import CreateData from './pages/CreateData'
import UpdateData from './pages/UpdateData'
import Settings from './pages/Settings'
import PortfolioProvider from './context/PortfolioContext.jsx'

import './App.css'

function App() {

  // const [stocks, setStocks] = useState(stocksData)

  return (
    <PortfolioProvider>
      <div className="start">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-data" element={<CreateData />} />
          <Route path="/update-data/:stockId" element={<UpdateData />} />
          <Route path="/buy-and-sell/:stockId" element={<BuyAndSell />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

      </div>
    </PortfolioProvider>
  )
}

export default App
