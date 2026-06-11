import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import BottomToolBar from '../components/BottomToolBar'
import PanelArea from '../components/PanelArea'
import TopToolBar from '../components/TopToolBar'
import usePortfolio from '../context/usePortfolio'
import { API_BASE_URL } from '../config/api'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const CHART_WIDTH = 720
const CHART_HEIGHT = 320
const CHART_PADDING = {
  top: 24,
  right: 28,
  bottom: 42,
  left: 68,
}
const VISIBLE_SERIES_STORAGE_KEY = 'budgetVisibleSeries'
const DEFAULT_VISIBLE_SERIES = {
  cash: true,
  portfolio: true,
  total: true,
}

function Budget() {
  const { availableCash, budgetHistory, startingCash, transactions } = usePortfolio()
  const [stocks, setStocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleSeries, setVisibleSeries] = useState(loadSavedVisibleSeries)

  useEffect(() => {
    async function loadStocks() {
      try {
        const response = await axios.get(`${API_BASE_URL}/stocks`)
        setStocks(response.data)
      } finally {
        setIsLoading(false)
      }
    }

    loadStocks()
  }, [])

  const chartPoints = useMemo(() => {
    return buildDailyTimeline(budgetHistory, startingCash)
  }, [budgetHistory, startingCash])

  const portfolioValue = calculateCurrentPortfolioValue(transactions, stocks)
  const totalValue = availableCash + portfolioValue
  const totalGain = totalValue - startingCash
  const totalGainPercent = startingCash > 0 ? (totalGain / startingCash) * 100 : 0
  const isPositive = totalGain >= 0

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopToolBar pagename="Budget" />

      <PanelArea>
        <Box sx={{ maxWidth: 960, mx: 'auto' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <MetricBlock label="Cash" value={formatCurrency(availableCash)} color="primary.main" />
            <MetricBlock label="Portfolio" value={formatCurrency(portfolioValue)} color="secondary.main" />
            <MetricBlock
              label="Total"
              value={formatCurrency(totalValue)}
              detail={`${isPositive ? '+' : '-'}${formatCurrency(Math.abs(totalGain))} (${totalGainPercent.toFixed(1)}%)`}
              color={isPositive ? 'primary.main' : 'error.main'}
            />
          </Stack>

          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
              <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                Value development
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 1, mb: 1.5, flexWrap: 'wrap' }}
              >
                <SeriesToggle
                  checked={visibleSeries.cash}
                  color="#22c55e"
                  label="Cash"
                  onChange={() => setVisibleSeries((current) => toggleSeries(current, 'cash'))}
                />
                <SeriesToggle
                  checked={visibleSeries.portfolio}
                  color="#38bdf8"
                  label="Portfolio"
                  onChange={() => setVisibleSeries((current) => toggleSeries(current, 'portfolio'))}
                />
                <SeriesToggle
                  checked={visibleSeries.total}
                  color="#ef4444"
                  label="Total"
                  onChange={() => setVisibleSeries((current) => toggleSeries(current, 'total'))}
                />
              </Stack>
            </Box>

            {isLoading ? (
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <BudgetLineChart points={chartPoints} visibleSeries={visibleSeries} />
            )}
          </Box>

          <Box
            sx={{
              mt: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Typography sx={{ px: { xs: 2, sm: 3 }, py: 2, fontSize: 22, fontWeight: 900 }}>
              Timeline
            </Typography>

            {chartPoints.slice(-6).map((point) => (
              <TimelineRow key={point.key} point={point} />
            ))}
          </Box>
        </Box>
      </PanelArea>

      <BottomToolBar />
    </Box>
  )
}

function MetricBlock({ label, value, detail, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: { xs: 2, sm: 3 },
        py: 2,
      }}
    >
      <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 800, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 1, color, fontSize: { xs: 28, sm: 34 }, fontWeight: 900, lineHeight: 1 }}>
        {value}
      </Typography>
      {detail && (
        <Typography sx={{ mt: 0.75, color, fontSize: 16, fontWeight: 800 }}>
          {detail}
        </Typography>
      )}
    </Box>
  )
}

function SeriesToggle({ checked, color, label, onChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          size="small"
          sx={{
            color,
            p: 0.5,
            '&.Mui-checked': {
              color,
            },
          }}
        />
      }
      label={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 22, height: 4, borderRadius: 1, bgcolor: color }} />
          <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
            {label}
          </Typography>
        </Stack>
      }
      sx={{ mr: 1, userSelect: 'none' }}
    />
  )
}

function BudgetLineChart({ points, visibleSeries }) {
  const values = points.flatMap((point) => {
    return [
      visibleSeries.cash ? point.cash : null,
      visibleSeries.portfolio ? point.portfolioValue : null,
      visibleSeries.total ? point.totalValue : null,
    ].filter((value) => value !== null)
  })
  const maxValue = Math.max(100, ...values)
  const minValue = 0
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((step) => minValue + (maxValue - minValue) * step)
  const xLabelInterval = getXLabelInterval(points.length)

  function getX(index) {
    if (points.length === 1) return CHART_PADDING.left + plotWidth / 2
    return CHART_PADDING.left + (plotWidth * index) / (points.length - 1)
  }

  function getY(value) {
    return CHART_PADDING.top + plotHeight - ((value - minValue) / (maxValue - minValue)) * plotHeight
  }

  const cashPath = buildLinePath(points, (point) => point.cash, getX, getY)
  const portfolioPath = buildLinePath(points, (point) => point.portfolioValue, getX, getY)
  const totalPath = buildLinePath(points, (point) => point.totalValue, getX, getY)

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', px: 1, pb: 1 }}>
      <Box component="svg" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} sx={{ display: 'block', minWidth: 620, width: '100%', height: 'auto' }}>
        <rect x="0" y="0" width={CHART_WIDTH} height={CHART_HEIGHT} fill="transparent" />

        {yTicks.map((tick) => {
          const y = getY(tick)

          return (
            <g key={tick}>
              <line x1={CHART_PADDING.left} x2={CHART_WIDTH - CHART_PADDING.right} y1={y} y2={y} stroke="#334155" strokeWidth="1" />
              <text x={CHART_PADDING.left - 12} y={y + 5} fill="#9ca3af" fontSize="13" textAnchor="end">
                {formatCompactCurrency(tick)}
              </text>
            </g>
          )
        })}

        {visibleSeries.cash && (
          <path d={cashPath} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {visibleSeries.portfolio && (
          <path d={portfolioPath} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {visibleSeries.total && (
          <path d={totalPath} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {points.map((point, index) => {
          const x = getX(index)
          const showLabel = shouldShowXLabel(index, points.length, xLabelInterval)

          return (
            <g key={point.key}>
              {visibleSeries.cash && (
                <circle cx={x} cy={getY(point.cash)} r="5" fill="#22c55e">
                  <title>{`${point.label} cash: ${formatCurrency(point.cash)}`}</title>
                </circle>
              )}
              {visibleSeries.portfolio && (
                <circle cx={x} cy={getY(point.portfolioValue)} r="5" fill="#38bdf8">
                  <title>{`${point.label} portfolio: ${formatCurrency(point.portfolioValue)}`}</title>
                </circle>
              )}
              {visibleSeries.total && (
                <circle cx={x} cy={getY(point.totalValue)} r="5" fill="#ef4444">
                  <title>{`${point.label} total: ${formatCurrency(point.totalValue)}`}</title>
                </circle>
              )}
              {showLabel && (
                <text x={x} y={CHART_HEIGHT - 14} fill="#9ca3af" fontSize="12" textAnchor="middle">
                  {point.shortLabel}
                </text>
              )}
            </g>
          )
        })}
      </Box>
    </Box>
  )
}

function toggleSeries(currentSeries, seriesName) {
  const selectedCount = Object.values(currentSeries).filter(Boolean).length

  if (currentSeries[seriesName] && selectedCount === 1) {
    return currentSeries
  }

  const nextSeries = {
    ...currentSeries,
    [seriesName]: !currentSeries[seriesName],
  }

  saveVisibleSeries(nextSeries)
  return nextSeries
}

function loadSavedVisibleSeries() {
  try {
    return {
      ...DEFAULT_VISIBLE_SERIES,
      ...JSON.parse(localStorage.getItem(VISIBLE_SERIES_STORAGE_KEY)),
    }
  } catch {
    return DEFAULT_VISIBLE_SERIES
  }
}

function saveVisibleSeries(visibleSeries) {
  localStorage.setItem(VISIBLE_SERIES_STORAGE_KEY, JSON.stringify(visibleSeries))
}

function getXLabelInterval(pointCount) {
  if (pointCount <= 8) return 1
  if (pointCount <= 16) return 2
  if (pointCount <= 32) return 4
  if (pointCount <= 64) return 8
  if (pointCount <= 120) return 15
  return 30
}

function shouldShowXLabel(index, pointCount, interval) {
  return index === 0 || index === pointCount - 1 || index % interval === 0
}

function TimelineRow({ point }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
        gap: 1,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography sx={{ fontWeight: 900 }}>{point.label}</Typography>
      <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>
        Cash {formatCurrency(point.cash)}
      </Typography>
      <Typography sx={{ color: 'secondary.main', fontWeight: 800 }}>
        Portfolio {formatCurrency(point.portfolioValue)}
      </Typography>
    </Box>
  )
}

function buildDailyTimeline(budgetHistory, startingCash) {
  return [
    {
      key: 'day-1',
      label: 'Day 1',
      shortLabel: 'Day 1',
      cash: startingCash,
      portfolioValue: 0,
      totalValue: startingCash,
    },
    ...budgetHistory.map((point) => ({
      key: `day-${point.day}`,
      label: `Day ${point.day}`,
      shortLabel: `Day ${point.day}`,
      cash: Number(point.cash) || 0,
      portfolioValue: Number(point.portfolioValue) || 0,
      totalValue: Number(point.totalValue) || (Number(point.cash) || 0) + (Number(point.portfolioValue) || 0),
    })),
  ]
}

function calculateCurrentPortfolioValue(transactions, stocks) {
  const pricesByStockId = new Map(
    stocks.map((stock) => [stock.id, Number(stock.currentPrice) || 0])
  )
  const holdings = new Map()

  transactions.forEach((transaction) => {
    const quantity = Number(transaction.quantity) || 0
    const currentQuantity = holdings.get(transaction.stockId) || 0

    if (transaction.type === 'buy') {
      holdings.set(transaction.stockId, currentQuantity + quantity)
    }

    if (transaction.type === 'sell') {
      holdings.set(transaction.stockId, currentQuantity - quantity)
    }
  })

  return [...holdings.entries()].reduce((sum, [stockId, quantity]) => {
    const currentPrice = pricesByStockId.get(stockId) || 0
    return sum + quantity * currentPrice
  }, 0)
}

function buildLinePath(points, getValue, getX, getY) {
  return points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${getX(index)} ${getY(getValue(point))}`
    })
    .join(' ')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export default Budget
