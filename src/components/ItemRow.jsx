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

// Displays one market stock row and handles open, edit, and delete actions.
function ItemRow({ company, stock, onClick, onEdit, onDelete }) {
  if (!company || !stock) return null

  const imageUrl = new URL(company.image, `${API_BASE_URL}/`).href
  const isPositive = stock.priceChangePercent >= 0

  return (
    <ListItem
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            edge="end"
            aria-label={`Edit ${stock.id}`}
            onClick={(event) => {
              event.stopPropagation()
              onEdit()
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            edge="end"
            aria-label={`Delete ${stock.id}`}
            onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      }
      sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
    >
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

        <Box sx={{ marginLeft: 'auto', textAlign: 'right' }}>
          <Typography>{`$${stock.currentPrice.toFixed(2)}`}</Typography>

          <Typography sx={{ color: isPositive ? 'success.main' : 'error.main' }}>
            {`${isPositive ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%`}
          </Typography>
        </Box>
      </ListItemButton>
    </ListItem>
  )
}

export default ItemRow
