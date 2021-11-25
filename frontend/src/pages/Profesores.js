import React, { useState, useCallback, useEffect, useRef} from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import ProfesoresTable from '../components/profesores/ProfesoresTable';
import RegistrarProfesorDialog from
'../components/profesores/RegistrarProfesorDialog';
import { getProfesores, eliminarProfesor} from '../api/Api';


export default function Profesores() {

  const isMounted = useRef(true);
  const [showNewProfessorDialog, setShowNewProfessorDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = useCallback(
    async function() {
      const teachersAux = await getProfesores();
      if(isMounted.current) {
        setTeachers(teachersAux);
      }
    },[]
  );

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);


  useEffect( () => {
    setTeachers([
      {
        _id: 22654,
        nombre: "Alejandro",
        apellido: "Soto",
        correo: "ale@utalca.cl"
      },
      {
        _id: 82614,
        nombre: "Pablo",
        apellido: "Covarrubias",
        correo: "cova@utalca.cl"
      },
      {
        _id: 72650,
        nombre: "Ivan",
        apellido: "Ivanicevic",
        correo: "ivan@utalca.cl"
      },

    ])
  }, []);

  const updateUI = (newTeacher) => {
    setTeachers( prev => [...prev, newTeacher] )
    setShowNewProfessorDialog(false);
  }

  const handleDelete = async(el) => {
    setTeachers( prev => [...prev].filter(t => t.rut !== el.rut) );
    await eliminarProfesor(el.id);
  }

  return(
    <Page title="MeAnoto">
      <Container>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb={ 5 }
        >
          <Typography variant="h4" gutterBottom>
            Profesores
          </Typography>

          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={ () => setShowNewProfessorDialog(true)}
          >
            Nuevo Profesor
          </Button>
        </Stack>

        <ProfesoresTable teachers={teachers} onDelete={handleDelete}/>

        <RegistrarProfesorDialog
          onClose={ () => setShowNewProfessorDialog(false) }
          open={showNewProfessorDialog}
          onSave={updateUI}
        />

      </Container>
    </Page>
  );
}
