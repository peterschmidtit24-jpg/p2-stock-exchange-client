import BottomToolBar from "../components/BottomToolBar";
import PanelArea from "../components/PanelArea";
import TopToolBar from "../components/TopToolBar";

import Box from '@mui/material/Box'

function Settings() {

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopToolBar pagename="Settings"/>

        <PanelArea>
            <h1>Settings Page 🚧</h1>
        </PanelArea>

        <BottomToolBar />
        </Box>
    );    
}


export default Settings
