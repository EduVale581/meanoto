import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material/';
import Api from '../../api/Api';
import { LoadingButton } from '@mui/lab';

export default function RoomAssignmentDialog({ open, handleClose, event }) {

  const [facultades, setFacultades] = useState(null);
  const [salas, setSalas] = useState(null);
  const [salasMostrar, setSalasMostrar] = useState(null);

  const [cargandoSala, setCargandoSala] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState(false);



  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedSala, setSelectedSala] = useState(null);

  const handleChangeFacultad = (eventEntrada) => {
    const { value } = eventEntrada.target;
    const newSelection = facultades.find(f => f._id === value._id);
    setSalasMostrar(salas && salas.filter((e) => e.facultad === value.nombre && e.estado === "DISPONIBLE" && e.aforo >= event.maximo_asistentes))
    setSelectedFacultad(newSelection);
  };

  const handleChangeSala = (eventEntrada) => {
    const { value } = eventEntrada.target;
    const newSelection = salasMostrar.find(f => f._id === value._id);
    setSelectedSala(newSelection);
  };

  const modificarDatos = () => {
    setCargandoSala(true);
    if (!selectedSala || !selectedFacultad) {
      setMensajeAlerta("Debe seleccionar sala y facultad.")
      setCargandoSala(false);

    }
    else {
      Api.modificarSalaEvento(event.id, selectedSala.id).then((data) => {
        if (data === 401) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.location.href = "/login"
        }
        else if (data === 403) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.location.href = "/login"

        }
        else if (data === 300) {
          setMensajeAlerta("Error en el servidor.")
          setCargandoSala(false);

        }
        else if (data === -1) {
          setMensajeAlerta("Error en el servidor.")
          setCargandoSala(false);

        }
        else {
          setCargandoSala(false);
          handleClose();
        }


      }).catch(() => {
        setMensajeAlerta("Error en el servidor.")
        setCargandoSala(false);

      })

    }


  };

  useEffect(() => {
    Api.getFacultades().then((data) => {
      if (data === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
      }
      else if (data === 403) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"

      }
      else if (data === 300) {

      }
      else if (data === -1) {

      }
      else {
        setFacultades(data)
      }

    }).catch(() => { })

  }, []);

  useEffect(() => {
    Api.obtenerSalas().then((data) => {
      if (data === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
      }
      else if (data === 403) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"

      }
      else if (data === 300) {

      }
      else if (data === -1) {

      }
      else {
        setSalas(data)
      }

    }).catch(() => { })

  }, []);



  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Asignar Sala a Evento</DialogTitle>
        <DialogContent>

          <DialogContentText>
            <b>Nombre evento:</b> {event.nombre}
          </DialogContentText>

          <DialogContentText>
            <b>Cantidad ideal de asistentes:</b> {event.maximo_asistentes}
          </DialogContentText>

          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Facultad</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={selectedFacultad ? selectedFacultad : ""}
                label={selectedFacultad ? selectedFacultad.nombre : ""}
                onChange={handleChangeFacultad}
              >
                {facultades && facultades.map((f, idx) => (
                  <MenuItem key={idx} value={f}>{f.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label2">Salas</InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                value={selectedSala ? selectedSala : ""}
                label={selectedSala ? selectedSala.nombre : ""}
                onChange={handleChangeSala}
              >
                {salasMostrar && salasMostrar.map((f, idx) => (
                  <MenuItem key={idx} value={f}>{f.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        </DialogContent>
        {mensajeAlerta && (<Alert severity="error">{mensajeAlerta}</Alert>)}
        <DialogActions>
          <Button color='secondary' onClick={handleClose}>Cancelar</Button>
          <LoadingButton
            loading={cargandoSala}
            color='primary'
            onClick={modificarDatos}
          >
            Aceptar
          </LoadingButton>
        </DialogActions>
      </Dialog>

    </div>
  );
}
