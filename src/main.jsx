import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import './index.css'
import App from './App.jsx'
import theme from './theme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          html: {
            width: '100%',
            minHeight: '100%',
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.default,
          },
          body: {
            width: '100%',
            minHeight: '100%',
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.default,
          },
          '#root': {
            width: '100%',
            minHeight: '100vh',
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.default,
          },
        })}
      />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
