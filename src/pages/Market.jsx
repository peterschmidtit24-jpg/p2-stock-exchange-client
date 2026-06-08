import { useEffect, useState } from 'react'

import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'
import Typography from '@mui/material/Typography'

import axios from 'axios'
import ItemsList from '../components/ItemsList'

function Market() {

  const [companies, setCompanies] = useState([]);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getCompanies();
  }, []);

  // get the main collection of companies and stocks from the backend and set them in the state to be used in the components
  async function getCompanies() {
    
    const response = await axios.get('http://localhost:5002/companies');

    const data = await response.data;
    setCompanies(data);
  }

  useEffect(() => {
    getStocks();
  }, []);


  // get the secondary collection of stocks from the backend and set them in the state to be used in the components
  async function getStocks() {
    
    const response = await axios.get('http://localhost:5002/stocks');

    const data = await response.data;
    setStocks(data);
  }

  if (!companies.length || !stocks.length) return null;

  console.log("companies = ", companies);
  console.log("stocks = ", stocks);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopToolBar />

      <PanelArea>
        <Typography sx={{mb: 2}} variant="h6" align="center">
          Available stocks
        </Typography>
        <ItemsList collection1={companies} collection2={stocks} />
      </PanelArea>

      <BottomToolBar />
    </Box>
  )
}

export default Market
