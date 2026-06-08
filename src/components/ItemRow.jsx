import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ImageIcon from '@mui/icons-material/Image'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'


const API_BASE_URL = 'http://localhost:5002'

function ItemRow({ company, stock, onClick }) {

  if (!company || !stock) return null;

  const imageUrl = new URL(company.image, `${API_BASE_URL}/`).href;
  const isPositive = stock.priceChangePercent >= 0;

  return (
    <>
      <ListItem sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {/* The ListItemButton makes the entire row clickable */}
        <ListItemButton onClick={onClick}>
          <ListItemAvatar>
            <Avatar src={imageUrl}>{stock.id.slice(0, 2)}</Avatar>
          </ListItemAvatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{stock.id}</Typography>
              <Chip label="STOCK" size="small" />
            </Box>
            <Typography>{company.name}</Typography>
          </Box>

          <Box sx={{ marginLeft: "auto", textAlign: "right" }}>
            <Typography>{`$${stock.currentPrice.toFixed(2)}`}</Typography>

            <Typography sx={{ color: isPositive ? "success.main" : "error.main" }}>
              {`${isPositive ? "+" : ""}${stock.priceChangePercent.toFixed(2)}%`}
            </Typography>
          </Box>

        </ListItemButton>
      </ListItem>    
    </>
  )
}

export default ItemRow
