// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';

export default function DashboardApp() {
  return (
    <Page title="MeAnoto">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Bienvenido</Typography>
        </Box>
        <Grid container spacing={3}>
        </Grid>
      </Container>
    </Page>
  );
}
