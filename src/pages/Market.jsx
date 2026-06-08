import BottomToolBar from '../components/BottomToolBar'
import TopToolBar from '../components/TopToolBar'
import Box from '@mui/material/Box'
import PanelArea from '../components/PanelArea'

function Market() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopToolBar />

      <PanelArea>
        <h2>Market content here</h2>
      </PanelArea>

      <BottomToolBar />
    </Box>
  )
}

export default Market
