
import { useLocation, useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

/*
  `BottomToolBar` displays the app’s main bottom navigation menu. It uses React Router to 
  detect the current page and highlight the active navigation item.

  The toolbar contains links for Market, Portfolio, Budget, and Settings. When the user 
  clicks one of the navigation buttons, the component uses `navigate()` to move to the 
  selected route.
*/
function BottomToolBar() {
  const navigate = useNavigate()
  // get info about which page is active
  const location = useLocation()

  // Determines which navigation item is active.
  // It compares the current page URL with the main app routes.
  // If no specific route matches, it defaults to the Market page.
  const currentValue = location.pathname.startsWith("/portfolio")
    ? "/portfolio"
    : location.pathname.startsWith("/budget")
      ? "/budget"
      : location.pathname.startsWith("/settings")
        ? "/settings"
        : "/"

  const navActionStyles = {
    color: "text.secondary",
    "&.Mui-selected": {
      color: "primary.main",
    },
  }

  return (
    <Box sx={{ width: '100%' }}>
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        sx={{
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <BottomNavigationAction 
          label="Market" 
          value="/"
          icon={<TrendingUpIcon />} 
          sx={navActionStyles} 
        />
        <BottomNavigationAction 
          label="Portfolio" 
          value="/portfolio"
          icon={<BusinessCenterIcon />} 
          sx={navActionStyles} 
        />
        <BottomNavigationAction 
          label="Budget" 
          value="/budget"
          icon={<BarChartIcon />} 
          sx={navActionStyles} 
        />
        <BottomNavigationAction 
          label="Settings" 
          value="/settings"
          icon={<SettingsIcon />} 
          sx={navActionStyles} 
        />
      </BottomNavigation>
    </Box>
  )
}

export default BottomToolBar
