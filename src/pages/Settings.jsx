
import BottomToolBar from "../components/BottomToolBar";
import TopToolBar from "../components/TopToolBar";

import Box from '@mui/material/Box'

function Settings() {

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TopToolBar pagename="Settings"/>

        <Box sx={{ flex: 1 }}>
            <h1>Settings Page 🚧</h1>
        </Box>

        <BottomToolBar />
        </Box>
    );    
}


export default Settings