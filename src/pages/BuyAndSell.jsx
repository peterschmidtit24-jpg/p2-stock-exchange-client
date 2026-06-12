
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// import the Material UI stuff
import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import usePortfolio from '../context/usePortfolio'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

import axios from 'axios'
import { API_BASE_URL } from '../config/api'


/*
  `BuyAndSell` displays the details of one selected stock and lets the user create a buy 
  or sell transaction.

  It gets the `stockId` from the URL, fetches that stock’s data from the API, and shows 
  the company name, stock symbol, current price, and daily price change. The user can 
  switch between buy and sell mode, adjust the quantity, and see the total cost, 
  remaining cash, available cash, and maximum quantity.

  When the user confirms the action, the component validates that they have enough cash 
  to buy or enough owned shares to sell. If the transaction is valid, it creates a 
  transaction object and saves it through the portfolio context using `addTransaction`.
*/
function BuyAndSell() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { addTransaction, availableCash, getOwnedQuantity } = usePortfolio();
  const [stocksData, setStocksData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('buy');
  const [cashWarningOpen, setCashWarningOpen] = useState(false);

  useEffect(() => {
    async function getStockDetails() {
      // get the stocks detial for the stock to be bouth or sold.
      const response = await axios.get(`${API_BASE_URL}/stocks/${stockId}?_expand=company`);
      const data = response.data;
      setStocksData(data);
    }

    getStockDetails();
  }, [stockId]);

  const ownedQuantity = stocksData ? getOwnedQuantity(stocksData.id) : 0;

  /*
    `changeQuantity` increases or decreases the selected number of shares while making 
    sure the user cannot buy more than they can afford or sell more than they own.
  */
  function changeQuantity(amount) {
    setQuantity((currentQuantity) => {
      const minQuantity = tradeType === 'sell' ? 0 : 1;
      const maxQuantity = tradeType === 'buy'
        ? Math.floor(availableCash / stocksData.currentPrice)
        : ownedQuantity;
      const nextQuantity = Math.min(
        maxQuantity,
        Math.max(minQuantity, currentQuantity + amount)
      );
      const nextTotalCost = stocksData.currentPrice * nextQuantity;

      if (tradeType === 'buy' && nextTotalCost > availableCash) {
        setCashWarningOpen(true);
        return currentQuantity;
      }

      return nextQuantity;
    });
  }

  const handleBuyOrSell = () => {
    const totalAmount = Number(quantity) * stocksData.currentPrice;

    if (tradeType === 'buy' && totalAmount > availableCash) {
      setCashWarningOpen(true);
      return;
    }

    if (Number(quantity) <= 0 || tradeType === 'sell' && Number(quantity) > ownedQuantity) {
      setCashWarningOpen(true);
      return;
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      type: tradeType,
      stockId: stocksData.id,
      quantity: Number(quantity),
      pricePerShare: stocksData.currentPrice,
      totalAmount,
      date: new Date().toISOString(),
    };

    addTransaction(transaction);
  };

  if (!stocksData) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopToolBar />
        <PanelArea>
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
            <CircularProgress />
          </Box>
        </PanelArea>
        <BottomToolBar />
      </Box>
    )
  }

  const { company } = stocksData;
  const imageUrl = new URL(company.image, `${API_BASE_URL}/`).href;
  const isPositive = stocksData.priceChangePercent >= 0;
  const totalCost = stocksData.currentPrice * quantity;

  const maxQuantity = tradeType === 'buy'
    ? Math.floor(availableCash / stocksData.currentPrice)
    : ownedQuantity;
  const cashAfterTrade = tradeType === 'buy'
    ? availableCash - totalCost
    : availableCash + totalCost;

  const formattedPrice = `$${stocksData.currentPrice.toFixed(2)}`;
  const formattedPercent = `${isPositive ? '+' : ''}${stocksData.priceChangePercent.toFixed(2)}%`;
  const formattedChange = `${isPositive ? '+' : ''}$${stocksData.priceChange.toFixed(2)}`;
  
  const actionLabel = tradeType === 'buy' ? 'Buy' : 'Sell';

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopToolBar />

      <PanelArea>
        <Box sx={{ maxWidth: 900, mx: 'auto', pb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', pb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              <ArrowBackIcon />
            </IconButton>

            <Avatar src={imageUrl} variant="rounded" sx={{ width: 64, height: 64 }}>
              {stocksData.id.slice(0, 2)}
            </Avatar>

            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stocksData.id}
                </Typography>
                <Chip label="STOCK" size="small" color="secondary" />
              </Stack>
              <Typography color="text.secondary">
                {company.name} - {company.branch}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ py: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {formattedPrice}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <TrendingUpIcon color={isPositive ? 'primary' : 'error'} />
              <Typography sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 700 }}>
                {formattedPercent} today
              </Typography>
              <Typography color="text.secondary">
                change {formattedChange}
              </Typography>
            </Stack>
          </Box>

          {/* for later additions of functionality like charts for the stocks
            <Paper sx={{ p: 4, mb: 3, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Typography color="text.secondary">
                Price history appears after Day 2
              </Typography>
            </Paper>
           */}

          {/*
            <Paper sx={{ mb: 3, overflow: 'hidden', borderRadius: 2 }}>
              <Typography sx={{ px: 3, py: 2, letterSpacing: 3, color: 'text.secondary' }}>
                INSTRUMENT INFO
              </Typography>
              <Divider />

              <InfoRow
                leftLabel="Company"
                leftValue={company.name}
                rightLabel="Sector"
                rightValue={company.branch}
              />
              <InfoRow
                leftLabel="Type"
                leftValue="Stock"
                rightLabel="Symbol"
                rightValue={stocksData.id}
              />
              <InfoRow
                leftLabel="Market cap"
                leftValue={formatLargeNumber(stocksData.marketCap)}
                rightLabel="Volume"
                rightValue={formatLargeNumber(stocksData.volume)}
              />
              <InfoRow
                leftLabel="Revenue"
                leftValue={formatLargeNumber(company.lastRevenue)}
                rightLabel="Earnings"
                rightValue={formatLargeNumber(company.lastEarnings)}
              />
              <InfoRow
                leftLabel="Location"
                leftValue={company.location}
                rightLabel="Ratings"
                rightValue={`${company.analystRatings.buy} buy / ${company.analystRatings.hold} hold / ${company.analystRatings.sell} sell`}
              />
            </Paper>

          */}  


          <ToggleButtonGroup
            exclusive
            fullWidth
            value={tradeType}
            onChange={(event, nextTradeType) => {
              if (!nextTradeType) return;

              setTradeType(nextTradeType);
              setQuantity((currentQuantity) => {
                if (nextTradeType === 'sell') {
                  return Math.min(currentQuantity, ownedQuantity);
                }

                return Math.max(1, currentQuantity);
              });
            }}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="buy" color="primary" sx={{ py: 1.5, fontSize: 18, fontWeight: 700 }}>
              Buy
            </ToggleButton>
            <ToggleButton value="sell" color="secondary" sx={{ py: 1.5, fontSize: 18, fontWeight: 700 }}>
              Sell
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3 }}>
            <Typography variant="h6">
              Quantity
            </Typography>
            <Stack direction="row" spacing={1}>
              {[-10, -1, 1, 10].map((amount) => (
                <Button key={amount} variant="contained" onClick={() => changeQuantity(amount)}>
                  {amount > 0 ? `+${amount}` : amount}
                </Button>
              ))}
              <Button variant="outlined" sx={{ minWidth: 72 }}>
                {quantity}
              </Button>
            </Stack>
          </Stack>

          <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
            <InfoRow leftLabel="Total cost" leftValue="" rightLabel="" rightValue={`$${totalCost.toFixed(2)}`} />
            <InfoRow 
              leftLabel="Remaining cash" 
              leftValue="" rightLabel="" 
              rightValue={`$${cashAfterTrade.toFixed(2)}`} 
            />
            <InfoRow leftLabel="Available cash" leftValue="" rightLabel="" rightValue={`$${availableCash.toFixed(2)} (max ${maxQuantity})`} />
          </Paper>

          <Button
            fullWidth
            variant="contained"
            color={tradeType === 'buy' ? 'primary' : 'secondary'}
            size="large"
            onClick={handleBuyOrSell}
            disabled={quantity <= 0 || (tradeType === 'buy' && totalCost > availableCash) || (tradeType === 'sell' && quantity > ownedQuantity)}
            sx={{ py: 2, borderRadius: 2, fontSize: 22, fontWeight: 700 }}
          >
            {actionLabel} {quantity} x {stocksData.id} for ${totalCost.toFixed(2)}
          </Button>
        </Box>
      </PanelArea>

      <Snackbar
        open={cashWarningOpen}
        autoHideDuration={3000}
        onClose={() => setCashWarningOpen(false)}
        message="Not enough available cash for this quantity"
      />

      <BottomToolBar />
    </Box>
  )
}

function InfoRow({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          px: 3,
          py: 2,
        }}
      >
        <InfoCell label={leftLabel} value={leftValue} />
        <InfoCell label={rightLabel} value={rightValue} align="right" />
      </Box>
      <Divider />
    </>
  )
}

function InfoCell({ label, value, align = 'left' }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 700, textAlign: align }}>{value}</Typography>
    </Stack>
  )
}

export default BuyAndSell
