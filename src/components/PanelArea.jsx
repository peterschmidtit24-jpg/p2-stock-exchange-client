
import { Box } from '@mui/material'

/*
  `PanelArea` wraps whatever content is passed as `children` inside a Material UI `Box`.

  It creates the main scrollable page area between the top toolbar and bottom toolbar. 
  It uses `flex: 1` so it fills the remaining vertical space, `overflowY: auto` so the 
  content can scroll, and padding/background styling for consistent page layout.

  `PanelArea` is used in several pages to wrap their main content:

  - `Settings.jsx`
  - `BuyAndSell.jsx`
  - `Market.jsx`
  - `Budget.jsx`
  - `Portfolio.jsx`
*/
function PanelArea({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        minHeight: 0,
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
