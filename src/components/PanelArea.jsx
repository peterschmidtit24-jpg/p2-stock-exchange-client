
import { Box } from '@mui/material'

function PanelArea({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >    
      {children}
    </Box>
  )
}

export default PanelArea