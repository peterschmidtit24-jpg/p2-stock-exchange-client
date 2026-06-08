import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
    primary: {
      main: '#22c55e',
    },
    secondary: {
      main: '#38bdf8',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#9ca3af',
    },
  },
  custom: {
    topToolBar: {
      surface: '#020617',
      action: '#0f172a',
      border: '#334155',
      accent: '#38bdf8',
      gain: '#22c55e',
    },
  },
})

export default theme
