import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

const API_BASE_URL = 'http://localhost:5002'

function ItemRowPort({ holding }) {
  if (!holding) return null

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
        px: { xs: 2, sm: 3 },
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
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
    </ListItem>
  )
}

export default ItemRowPort
