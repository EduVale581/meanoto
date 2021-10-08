import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import EventsTab from '../components/eventos/EventsTab';

export default function Eventos() {
  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Eventos
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Nuevo Evento
          </Button>
        </Stack>

        {/* <Schedule /> */}
        {/* <EventSearchTable /> */}
        <EventsTab />

      </Container>
    </Page>
  );
}
