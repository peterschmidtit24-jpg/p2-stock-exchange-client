// Renders a simple stock symbol form.
// On submit, it sends the entered symbol to the parent through onSubmit
// and clears the input field.
function StockForm({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const stockSymbol = event.target.elements.stockSymbol.value.trim()

    if (stockSymbol) {
      onSubmit(stockSymbol)
      event.target.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="stockSymbol" placeholder="Enter stock symbol (e.g., AAPL)" required />
      <button type="submit">Get Stock Price</button>
    </form>
  )
}

export default StockForm
