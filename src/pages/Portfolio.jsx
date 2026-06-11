
import { useEffect, useState } from "react";
import BottomToolBar from "../components/BottomToolBar";
import ItemRowPort from "../components/ItemRowPort";
import PanelArea from "../components/PanelArea";
import TopToolBar from "../components/TopToolBar";
import usePortfolio from "../context/usePortfolio";

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

function Portfolio() {
  const { transactions } = usePortfolio();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    async function loadPortfolioData() {
      const [companiesResponse, stocksResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/companies`),
        axios.get(`${API_BASE_URL}/stocks`),
      ]);

      setHoldings(
        buildHoldings(
          transactions,
          companiesResponse.data,
          stocksResponse.data
        )
      );
    }

    loadPortfolioData();
  }, [transactions]);

  const holdingsValue = holdings.reduce(
    (sum, holding) => sum + holding.currentValue,
    0
  );
  const investedValue = holdings.reduce(
    (sum, holding) => sum + holding.averagePrice * holding.quantity,
    0
  );
  const totalGain = holdingsValue - investedValue;
  const totalGainPercent = investedValue > 0
    ? (totalGain / investedValue) * 100
    : 0;
  const isPositive = totalGain >= 0;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopToolBar pagename="Portfolio"/>

      <PanelArea>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Box
            sx={{
              py: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                letterSpacing: 4,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              HOLDINGS VALUE
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: { xs: 40, sm: 52 }, fontWeight: 900, lineHeight: 1 }}>
                ${holdingsValue.toFixed(2)}
              </Typography>

              <Typography
                sx={{
                  color: isPositive ? 'success.main' : 'error.main',
                  fontSize: { xs: 20, sm: 24 },
                  fontWeight: 900,
                  textAlign: 'right',
                }}
              >
                {isPositive ? '+' : '-'}${Math.abs(totalGain).toFixed(2)} ({totalGainPercent.toFixed(1)}%)
              </Typography>
            </Box>
          </Box>

          <List sx={{ py: 1 }}>
            {holdings.map((holding) => (
              <ItemRowPort key={holding.stockId} holding={holding} />
            ))}
          </List>
        </Box>
      </PanelArea>

      <BottomToolBar />
    </Box>
  );
}

function buildHoldings(transactions, companies, stocks) {
  const holdingsByStock = {};

  transactions.forEach((transaction) => {
    const quantity = Number(transaction.quantity);
    const pricePerShare = Number(transaction.pricePerShare);

    if (!transaction.stockId || !quantity || !pricePerShare) return;

    if (!holdingsByStock[transaction.stockId]) {
      holdingsByStock[transaction.stockId] = {
        stockId: transaction.stockId,
        quantity: 0,
        investedAmount: 0,
      };
    }

    const holding = holdingsByStock[transaction.stockId];

    if (transaction.type === 'buy') {
      holding.quantity += quantity;
      holding.investedAmount += quantity * pricePerShare;
    }

    if (transaction.type === 'sell') {
      const averagePrice = holding.quantity > 0
        ? holding.investedAmount / holding.quantity
        : pricePerShare;

      holding.quantity -= quantity;
      holding.investedAmount -= quantity * averagePrice;
    }
  });

  return Object.values(holdingsByStock)
    .filter((holding) => holding.quantity > 0)
    .map((holding) => {
      const stock = stocks.find((currentStock) => currentStock.id === holding.stockId);
      const company = companies.find((currentCompany) => currentCompany.id === stock?.companyId);
      const averagePrice = holding.investedAmount / holding.quantity;
      const currentPrice = stock?.currentPrice || averagePrice;
      const currentValue = holding.quantity * currentPrice;
      const gainAmount = currentValue - holding.investedAmount;
      const gainPercent = holding.investedAmount > 0
        ? (gainAmount / holding.investedAmount) * 100
        : 0;

      return {
        ...holding,
        stock,
        company,
        averagePrice,
        currentValue,
        gainAmount,
        gainPercent,
      };
    });
}

export default Portfolio;
