import { useContext } from 'react'
import PortfolioContext from './PortfolioContext'

/*
1. Reads the portfolio context using `useContext`.
2. Checks if the context exists.
3. If the hook is used outside `PortfolioProvider`, it throws an error.
4. If everything is correct, it returns the portfolio data and functions.
*/
function usePortfolio() {
  const context = useContext(PortfolioContext)

  if (!context) {
    throw new Error('usePortfolio must be used inside PortfolioProvider')
  }

  return context
}

export default usePortfolio
