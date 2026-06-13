import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import { API_BASE_URL } from '../config/api'

/*
  `ItemRowPort` renders one stock holding inside the portfolio list.

  It receives a `holding` object that contains the stock id, company data, quantity 
  owned, average purchase price, current value, gain amount, and gain percentage.

  If no holding is provided, the component returns `null` and renders nothing.

  The row displays the company image or stock initials, the stock id, the number of units 
  owned, the average buy price, the current value of the holding, and the profit or loss. 
  The gain/loss text is colored green for positive values and red for negative values.
*/
function ItemRowPort({ holding, onClick }) {
  if (!holding) return null

  // short form for
  /*
    const stockId = holding.stockId
    const company = holding.company
    const quantity = holding.quantity
    ....
  */
  const {
    stockId,
    company,
    quantity,
    averagePrice,
    currentValue,
    gainAmount,
    gainPercent,
  } = holding

  const imageUrl = company?.image
    ? new URL(company.image, `${API_BASE_URL}/`).href
    : undefined
  const isPositive = gainAmount >= 0

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      disablePadding
    >
      <ListItemButton
        onClick={onClick}
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <Avatar
          src={imageUrl}
          variant="rounded"
          sx={{
            width: 58,
            height: 58,
            mr: 2,
            bgcolor: 'background.paper',
            color: 'text.secondary',
            fontWeight: 800,
          }}
        >
          {stockId.slice(0, 2)}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
              {stockId}
            </Typography>
            <Chip label="STOCK" size="small" color="secondary" />
          </Box>

          <Typography
            sx={{
              mt: 0.75,
              color: 'text.secondary',
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {quantity} units - avg ${averagePrice.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ ml: 2, textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
            ${currentValue.toFixed(2)}
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            {isPositive ? '+' : '-'}${Math.abs(gainAmount).toFixed(2)} ({gainPercent.toFixed(1)}%)
          </Typography>
        </Box>
      </ListItemButton>
    </ListItem>
  )
}

export default ItemRowPort
