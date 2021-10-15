import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

import RangeSlider from './RangeSlider';
import FacultadesSelect from './FacultadesSelect';

export default function RoomAssignmentDialog({ open, handleClose, event}) {

  const [facultad, setFacultad] = useState();
  const [rooms, setRooms] = useState([
    {
      _id: 123333,
      nombre: "S1"
    },
    {
      _id: 5654,
      nombre: "S8"
    },

  ]);

  const [roomsForAutocomplete, setRoomsForAutocomplete] = useState(
    rooms.map( r => ({
      label: r.nombre
    }) )
  );

  useEffect( () => {
    setRoomsForAutocomplete(
      rooms.map( r => ({
        label: r.nombre,
        ...r
      }) )
    )
  }, [rooms] )

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Asignar Sala a Evento</DialogTitle>
        <DialogContent>

          <DialogContentText>
            <b>Nombre evento:</b> {event.nombre}
          </DialogContentText>

          <DialogContentText>
            <b>Cantidad ideal de asistentes:</b> {event.maximo_asistentes}
          </DialogContentText>

          <Box mt={3}>
            <FacultadesSelect />
          </Box>

          <Box mt={3}>
            <DialogContentText>
            Filtrar Salas por Aforo
          </DialogContentText>

          </Box>

          <RangeSlider />

          <Box mt={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={roomsForAutocomplete}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Sala" />}
            />
          </Box>

        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClose}>Cancelar</Button>
          <Button color='primary' onClick={handleClose}>Aceptar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
