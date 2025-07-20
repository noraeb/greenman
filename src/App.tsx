import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import ArtistList from './components/ArtistList';
import './App.css';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography variant="h4" component="h1" noWrap>
            Green Man 2025
          </Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <ArtistList />
      </Box>
    </ThemeProvider>
  );
}

export default App;
