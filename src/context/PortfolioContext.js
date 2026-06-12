import { createContext } from 'react'


/*
    `PortfolioContext.js` defines the shared portfolio context. It allows the app to 
    provide portfolio state and actions in one place and access them from any component 
    using the `usePortfolio` hook.
*/
const PortfolioContext = createContext(null)

export default PortfolioContext
