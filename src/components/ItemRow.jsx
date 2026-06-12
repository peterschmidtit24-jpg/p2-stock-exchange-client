import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { API_BASE_URL } from '../config/api'

/*
  `ItemRow` renders one stock row in the market list.

  It receives a `company`, its related `stock`, and three action functions: `onClick`, 
  `onEdit`, and `onDelete`.

  If either the company or stock data is missing, the component returns `null` and renders 
  nothing.

  The row shows the company image, stock symbol, company name, current stock price, and 
  daily price change percentage. The price change is shown in a positive or negative color depending on whether the percentage is above or below zero.

  Clicking the main row calls `onClick`, which opens the buy/sell page. Clicking the edit 
  or delete icons calls `onEdit` or `onDelete`. The icon clicks use 
  `event.stopPropagation()` so they do not also trigger the row click.
*/
function ItemRow({ company, stock, onClick, onEdit, onDelete }) {

  if (!company || !stock) return null;

  const imageUrl = new URL(company.image, `${API_BASE_URL}/`).href;
  const isPositive = stock.priceChangePercent >= 0;

  return (
    <>
      <ListItem
        secondaryAction={
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              edge="end"
              aria-label={`Edit ${stock.id}`}
              onClick={(event) => {
                //  `event.stopPropagation()` so they do not also trigger the row click.
                event.stopPropagation();
                onEdit();
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              edge="end"
              aria-label={`Delete ${stock.id}`}
              onClick={(event) => {
                //  `event.stopPropagation()` so they do not also trigger the row click.
                event.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
        sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
      >
        {/* The ListItemButton makes the entire row clickable */}
        <ListItemButton onClick={onClick} sx={{ pr: 12 }}>
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
