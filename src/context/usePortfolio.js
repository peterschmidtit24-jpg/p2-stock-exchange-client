import { useContext } from 'react'
import PortfolioContext from './PortfolioContext'

function usePortfolio() {
  const context = useContext(PortfolioContext)

  if (!context) {
    throw new Error('usePortfolio must be used inside PortfolioProvider')
  }

  return context
}

export default usePortfolio
