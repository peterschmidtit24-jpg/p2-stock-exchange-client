import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'

import axios from 'axios'
import ItemsList from '../components/ItemsList'

const API_BASE_URL = 'http://localhost:5002'

function Market() {

  const [companies, setCompanies] = useState([]);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    async function loadMarketData() {
      const [companiesResponse, stocksResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/companies`),
        axios.get(`${API_BASE_URL}/stocks`),
      ]);

      setCompanies(companiesResponse.data);
      setStocks(stocksResponse.data);
    }

    loadMarketData();
  }, []);

  async function handleDeleteStock(company, stock) {
    if (!company || !stock) return;

    await Promise.all([
      axios.delete(`${API_BASE_URL}/stocks/${stock.id}`),
      axios.delete(`${API_BASE_URL}/companies/${company.id}`),
    ]);

    setStocks((currentStocks) =>
      currentStocks.filter((currentStock) => currentStock.id !== stock.id)
    );
    setCompanies((currentCompanies) =>
      currentCompanies.filter((currentCompany) => currentCompany.id !== company.id)
    );
  }
  
  if (!companies.length || !stocks.length) return null;

  console.log("companies = ", companies);
  console.log("stocks = ", stocks);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopToolBar />

      <PanelArea>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Available stocks</Typography>

          <IconButton
            sx={(theme) => ({
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.default,
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            })}
            aria-label="Add stock"
            onClick={() => {
              console.log("Open create stock form")
              navigate('/create-data')
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <ItemsList
          collection1={companies}
          collection2={stocks}
          onDelete={handleDeleteStock}
        />
      </PanelArea>

      <BottomToolBar />
    </Box>
  );
}

export default Market
