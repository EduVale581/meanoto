import React, { useCallback, useEffect, useRef, useState} from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import EventsTab from '../components/eventos/EventsTab';
import NewEventDialog from '../components/eventos/NewEventDialog';
import { useUsuario } from 'src/context/usuarioContext';
import { getProfesores } from 'src/api/Api';

export default function Eventos() {
  const isMounted = useRef(true);
  const [ showNewEventDialog, setShowNewEventDialog ] = useState(false);
  const { user } = useUsuario();
  const [ professor, setProfessor ] = useState();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchProfessor = useCallback(
    async function() {
      if(! user) return console.log("no user");
      const profesoresAux = await getProfesores(user.refId);
      const profesorAux = profesoresAux.find( p => p.id === user.refId );
      if(! profesorAux) return;
      if(isMounted.current) {
        setProfessor(profesorAux);
      }
    },[user]
  );

  useEffect(() => {
    if(user && user.tipo_usuario === 'PROFESOR') {
      fetchProfessor();
    }
  }, [fetchProfessor, user]);

  const updateUI = () => {
    console.log("Updating UI...")
  }


  return (
    <Page title="MeAnoto">
      <Container>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb={ 5 }
        >
          <Typography variant="h4" gutterBottom>
            Eventos
          </Typography>

          { professor && (
            <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={ () => setShowNewEventDialog(true)}
            >
              Nuevo Evento
            </Button>
          ) }
        </Stack>

        <EventsTab />

        { professor && (
          <NewEventDialog
            onClose={ () => setShowNewEventDialog( false ) }
            onSave={updateUI}
            open={ showNewEventDialog }
            professor={ professor }
          />
        ) }

      </Container>
    </Page>
  );
}
