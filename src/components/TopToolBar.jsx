import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import usePortfolio from '../context/usePortfolio'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5002'
const DAY_STORAGE_KEY = 'simulationDay'

function TopToolBar(props) {
  const { availableCash, resetTransactions, startingCash } = usePortfolio()
  const [day, setDay] = useState(() => {
    return Number(localStorage.getItem(DAY_STORAGE_KEY)) || 1
  })
  const [isSimulating, setIsSimulating] = useState(false)
  const cashChangePercent = ((availableCash - startingCash) / startingCash) * 100
  const isPositive = cashChangePercent >= 0
  const formattedCash = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(availableCash)
  const formattedPercent = `${isPositive ? '+' : ''}${cashChangePercent.toFixed(1)}%`

  function handleResetSimulation() {
    resetTransactions()
    localStorage.setItem(DAY_STORAGE_KEY, '1')
    setDay(1)
  }

  async function handleNextDay() {
    setIsSimulating(true)

    try {
      const response = await axios.get(`${API_BASE_URL}/stocks`)
      const stocks = response.data

      await Promise.all(
        stocks.map((stock) => {
          const updatedStock = simulateStockPrice(stock)
          return axios.put(`${API_BASE_URL}/stocks/${stock.id}`, updatedStock)
        })
      )

      const nextDay = day + 1
      localStorage.setItem(DAY_STORAGE_KEY, String(nextDay))
      setDay(nextDay)
      window.location.reload()
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <Box
      component="header"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 2 },
        width: '100%',
        maxWidth: '100vw',
        px: { xs: 2, sm: 1 },
        py: { xs: 2, sm: 3 },
        overflow: 'hidden',
        backgroundColor: theme.custom.topToolBar.surface,
        borderBottom: '1px solid',
        borderColor: theme.custom.topToolBar.border,
      })}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 24, sm: 32 },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {props.pagename}
        </Typography>
        <Typography
          component="p"
          sx={(theme) => ({
            mt: 0.5,
            color: isPositive ? theme.custom.topToolBar.gain : theme.palette.error.main,
            fontSize: { xs: 26, sm: 36 },
            fontWeight: 900,
            lineHeight: 1,
            overflowWrap: 'anywhere',
          })}
        >
          {formattedCash} {formattedPercent}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Tooltip title="Reset simulation to Day 1 and restore cash">
          <IconButton
            aria-label="Restart simulation"
            onClick={handleResetSimulation}
            sx={(theme) => ({
              width: { xs: 48, sm: 66 },
              height: { xs: 48, sm: 66 },
              borderRadius: 2,
              backgroundColor: theme.custom.topToolBar.action,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: theme.custom.topToolBar.border,
              },
            })}
          >
            <RestartAltIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Advance to the next simulation day and update stock prices">
          <span>
            <Button
              variant="contained"
              endIcon={<ChevronRightIcon />}
              disabled={isSimulating}
              onClick={handleNextDay}
              sx={{
                minWidth: { xs: 108, sm: 166 },
                height: { xs: 48, sm: 56 },
                borderRadius: 2,
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: 22, sm: 24 },
                fontWeight: 900,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '& .MuiButton-endIcon': {
                  ml: { xs: 0.5, sm: 1 },
                },
              }}
            >
              Day {day}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}

function simulateStockPrice(stock) {
  const currentPrice = Number(stock.currentPrice)
  const shouldStayUnchanged = Math.random() < 0.15
  const changePercent = shouldStayUnchanged
    ? 0
    : Math.random() * 10 - 5
  const nextPrice = currentPrice * (1 + changePercent / 100)
  const roundedNextPrice = roundToCents(nextPrice)
  const priceChange = roundToCents(roundedNextPrice - currentPrice)
  const priceChangePercent = currentPrice > 0
    ? roundToPercent((priceChange / currentPrice) * 100)
    : 0

  return {
    ...stock,
    currentPrice: roundedNextPrice,
    priceChange,
    priceChangePercent,
  }
}

function roundToCents(value) {
  return Math.round(value * 100) / 100
}

function roundToPercent(value) {
  return Math.round(value * 100) / 100
}

export default TopToolBar
