
import * as React from 'react';
import Box from '@mui/material/Box';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

function BottomToolBar() {
  const [value, setValue] = React.useState(0);

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
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <BottomNavigationAction label="Market" icon={<TrendingUpIcon />} sx={navActionStyles} />
        <BottomNavigationAction label="Portfolio" icon={<BusinessCenterIcon />} sx={navActionStyles} />
        <BottomNavigationAction label="Budget" icon={<BarChartIcon />} sx={navActionStyles} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} sx={navActionStyles} />
      </BottomNavigation>
    </Box>
  )
}

export default BottomToolBar
