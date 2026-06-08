import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

function TopToolBar() {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 2 },
        width: '100%',
        maxWidth: '100vw',
        px: { xs: 2, sm: 1 },
        py: { xs: 2, sm: 3 },
        overflow: 'hidden',
        backgroundColor: theme.custom.topToolBar.surface,
        borderBottom: '1px solid',
        borderColor: theme.custom.topToolBar.border,
      })}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 24, sm: 32 },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          Market
        </Typography>
        <Typography
          component="p"
          sx={(theme) => ({
            mt: 0.5,
            color: theme.custom.topToolBar.gain,
            fontSize: { xs: 26, sm: 36 },
            fontWeight: 900,
            lineHeight: 1,
            overflowWrap: 'anywhere',
          })}
        >
          $10,000.00 +0.0%
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          gap: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          aria-label="Restart simulation"
          sx={(theme) => ({
            width: { xs: 48, sm: 66 },
            height: { xs: 48, sm: 66 },
            borderRadius: 2,
            backgroundColor: theme.custom.topToolBar.action,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: theme.custom.topToolBar.border,
            },
          })}
        >
          <RestartAltIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
        </IconButton>

        <Button
          variant="contained"
          endIcon={<ChevronRightIcon />}
          sx={{
            minWidth: { xs: 108, sm: 166 },
            height: { xs: 48, sm: 56 },
            borderRadius: 2,
            px: { xs: 1.5, sm: 2 },
            fontSize: { xs: 22, sm: 24 },
            fontWeight: 900,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '& .MuiButton-endIcon': {
              ml: { xs: 0.5, sm: 1 },
            },
          }}
        >
          Day 1
        </Button>
      </Box>
    </Box>
  )
}

export default TopToolBar
