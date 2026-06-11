import { useMemo, useState } from 'react'
import PortfolioContext from './PortfolioContext'

const STARTING_CASH = 10000
const TRANSACTIONS_STORAGE_KEY = 'transactions'
const BUDGET_HISTORY_STORAGE_KEY = 'budgetHistory'

function loadSavedTransactions() {
  try {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function loadSavedBudgetHistory() {
  try {
    return JSON.parse(localStorage.getItem(BUDGET_HISTORY_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveTransactions(transactions) {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
}

function saveBudgetHistory(budgetHistory) {
  localStorage.setItem(BUDGET_HISTORY_STORAGE_KEY, JSON.stringify(budgetHistory))
}

function PortfolioProvider({ children }) {
  const [transactions, setTransactions] = useState(loadSavedTransactions)
  const [budgetHistory, setBudgetHistory] = useState(loadSavedBudgetHistory)

  const availableCash = useMemo(() => {
    return transactions.reduce((cash, transaction) => {
      const totalAmount = Number(transaction.totalAmount) || 0

      if (transaction.type === 'buy') return cash - totalAmount
      if (transaction.type === 'sell') return cash + totalAmount

      return cash
    }, STARTING_CASH)
  }, [transactions])

  function addTransaction(transaction) {
    setTransactions((currentTransactions) => {
      const updatedTransactions = [...currentTransactions, transaction]
      saveTransactions(updatedTransactions)
      return updatedTransactions
    })
  }

  function resetTransactions() {
    setTransactions([])
    setBudgetHistory([])
    saveTransactions([])
    saveBudgetHistory([])
  }

  function recordBudgetSnapshot(snapshot) {
    setBudgetHistory((currentBudgetHistory) => {
      const updatedBudgetHistory = [
        ...currentBudgetHistory.filter((point) => point.day !== snapshot.day),
        snapshot,
      ].sort((a, b) => a.day - b.day)

      saveBudgetHistory(updatedBudgetHistory)
      return updatedBudgetHistory
    })
  }

  function getOwnedQuantity(stockId) {
    return transactions.reduce((quantity, transaction) => {
      if (transaction.stockId !== stockId) return quantity

      if (transaction.type === 'buy') {
        return quantity + Number(transaction.quantity)
      }

      if (transaction.type === 'sell') {
        return quantity - Number(transaction.quantity)
      }

      return quantity
    }, 0)
  }

  const value = {
    startingCash: STARTING_CASH,
    availableCash,
    budgetHistory,
    transactions,
    addTransaction,
    recordBudgetSnapshot,
    resetTransactions,
    getOwnedQuantity,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioProvider
