import { useMemo, useState } from 'react'
import PortfolioContext from './PortfolioContext'

const STARTING_CASH = 10000
const TRANSACTIONS_STORAGE_KEY = 'transactions'
const BUDGET_HISTORY_STORAGE_KEY = 'budgetHistory'

function loadSavedTransactions() {
  // Loads saved transactions from localStorage, or returns an empty list if none exist.
  try {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function loadSavedBudgetHistory() {
  // Loads saved budget history from localStorage, or returns an empty list if none exist.
  try {
    return JSON.parse(localStorage.getItem(BUDGET_HISTORY_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveTransactions(transactions) {
  // Saves the current transaction list to localStorage.
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
}

function saveBudgetHistory(budgetHistory) {
  // Saves the current budget history to localStorage.
  localStorage.setItem(BUDGET_HISTORY_STORAGE_KEY, JSON.stringify(budgetHistory))
}

function PortfolioProvider({ children }) {
  // Stores transactions and budget history, using saved localStorage data as the initial state.
  const [transactions, setTransactions] = useState(loadSavedTransactions)
  const [budgetHistory, setBudgetHistory] = useState(loadSavedBudgetHistory)

  // Calculates the user's available cash based on all buy and sell transactions.
  const availableCash = useMemo(() => {
    return transactions.reduce((cash, transaction) => {
      const totalAmount = Number(transaction.totalAmount) || 0

      if (transaction.type === 'buy') return cash - totalAmount
      if (transaction.type === 'sell') return cash + totalAmount

      return cash
    }, STARTING_CASH)
  }, [transactions])

  function addTransaction(transaction) {
    // Adds a new transaction and saves the updated list.
    setTransactions((currentTransactions) => {
      const updatedTransactions = [...currentTransactions, transaction]
      saveTransactions(updatedTransactions)
      return updatedTransactions
    })
  }

  function resetTransactions() {
    // Clears all transactions and budget history from state and localStorage.
    setTransactions([])
    setBudgetHistory([])
    saveTransactions([])
    saveBudgetHistory([])
  }

  function recordBudgetSnapshot(snapshot) {
    // Saves one budget snapshot per day and keeps the history sorted by day.
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
    // Calculates how many shares of a specific stock are currently owned.
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

  // Values and actions shared with the rest of the app through PortfolioContext.
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
