import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

import axios from 'axios'
import ItemsList from '../components/ItemsList'
import { API_BASE_URL } from '../config/api'

/*
`Market` renders the market page where users can view, search, add, and delete available stocks.

When the component loads, it fetches company data and stock data from the API using `axios`. The two requests 
are made in parallel with `Promise.all`, then stored in local state as `companies` and `stocks`.

The component also stores the current search input in `searchQuery`. Before rendering the list, it filters 
companies by matching the search text against the company name, location, branch, or related stock id.

Users can click the add button to navigate to `/create-data`, where new stock/company data can be created.

The `handleDeleteStock` function deletes both the selected stock and its related company from the backend, 
then removes them from the local React state so the UI updates immediately.

The page layout is wrapped with `TopToolBar`, `PanelArea`, and `BottomToolBar`, and the filtered market data 
is displayed through the `ItemsList` component.
*/
function Market() {

  const [companies, setCompanies] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  // get the data about companies and stocks from the server
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

  // for handling deleteing of stocks from the DB
  async function handleDeleteStock(company, stock) {
    if (!company || !stock) return;

    // because we need here both data collections: stocks and companies
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
  
  // Prevents the page from rendering until both companies and stocks have data.
  if (!companies.length || !stocks.length) return null;

  // console.log("companies = ", companies);
  // console.log("stocks = ", stocks);

  // do data filtering for the search query
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCompanies = normalizedSearchQuery
    ? companies.filter((company) => {
        const stock = stocks.find((currentStock) => currentStock.companyId === company.id);
        const searchableText = [
          company.name,
          company.location,
          company.branch,
          stock?.id,
        ].join(' ').toLowerCase();

        return searchableText.includes(normalizedSearchQuery);
      })
    : companies;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopToolBar pagename="Market"/>

      <PanelArea>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
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
                navigate('/create-data')
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by stock, company, country, or branch"
            size="small"
            sx={{ mb: 6 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="secondary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <ItemsList
            collection1={filteredCompanies}
            collection2={stocks}
            onDelete={handleDeleteStock}
          />
        </Box>
      </PanelArea>

      <BottomToolBar />
    </Box>
  );
}

export default Market
