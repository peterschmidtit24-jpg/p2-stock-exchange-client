
import { useParams } from 'react-router-dom'

import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'
import Typography from '@mui/material/Typography'

function BuyAndSell() {
  const { stocksId } = useParams();

  /*
    here: from the stocks id get the stocks and company data from the server (s. Postman)

    http://localhost:5002/stocks/:stockId?_expand=company

    present the data in the page with MAterial UI components
  */

  console.log("stocksId = ", stocksId);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopToolBar />

      <PanelArea>
        <Typography sx={{mb: 2}} variant="h6" align="center">
          Buy and sell stock
        </Typography>
        <h1>Buy and Sell Page for stock ID: {stocksId}</h1>
      </PanelArea>

      <BottomToolBar />
    </Box>
  )
}

export default BuyAndSell
