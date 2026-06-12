import { createTheme } from '@mui/material/styles'

/*
  `theme` defines the global visual style for the app using Material UI’s `createTheme`.

  It sets the app to dark mode and defines shared colors for backgrounds, primary actions, 
  secondary actions, and text. These colors are then used automatically by Material UI 
  components like buttons, typography, boxes, toolbars, and navigation elements.

  The theme also includes a custom `topToolBar` section with extra colors used 
  specifically by the `TopToolBar` component.

  `palette.mode: 'dark'`
  Sets Material UI to dark mode.

  `background`
  Defines the main page background and card/paper background colors.

  `primary`
  Defines the main green accent color.

  `secondary`
  Defines the blue secondary color.

  `text`
  Defines primary and secondary text colors.

  `custom.topToolBar`
  Adds custom colors for the top toolbar, such as surface, action, border, accent, and gain colors.
*/
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
      light: '#7dd3fc',
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
