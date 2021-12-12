import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material/';
import Api from '../../api/Api';
import { LoadingButton } from '@mui/lab';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function EstudiantesAsistencia({ open, handleClose, event }) {

  const [asistentesEvento, setAsistentesEvento] = useState([])
  const [cargandoEliminar, setCargandoEliminar] = useState(false)

  useEffect(() => {
    Api.obtenerAsistentesEvento(event.id).then((data) => {
      console.log(data)
      if (data === 403 || data === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
      }
      else if (data === -1 || data === 300) {

      }
      else {
        setAsistentesEvento(data)

      }

    }).catch(() => {

    })

  }, [])

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Estudiantes Inscritos</DialogTitle>
        <DialogContent>

          <DialogContentText>
            <b>Nombre evento:</b> {event.nombre}
          </DialogContentText>

          <DialogContentText>
            <b>Cantidad ideal de asistentes:</b> {event.maximo_asistentes}
          </DialogContentText>

          <DialogContentText color={(Array.isArray(asistentesEvento) && asistentesEvento.length > event.maximo_asistentes) ? "error" : "primary"}>
            <b>Cantidad actual de asistentes:</b> {Array.isArray(asistentesEvento) ? asistentesEvento.length : 0}
          </DialogContentText>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Estudiante</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asistentesEvento && asistentesEvento.map((row, idx) => (
                  <TableRow
                    key={"tablaAsistentes_" + idx}
                  >
                    <TableCell component="th" scope="row">
                      {row.nombre}
                    </TableCell>
                    <TableCell align="center">
                      <LoadingButton
                        loading={cargandoEliminar}
                        color="error"
                        onClick={() => {
                          setCargandoEliminar(true)
                          let auxAsistentes = asistentesEvento.filter((e) => e.id !== row.id)
                          let modificacion = {
                            idEvento: event.id,
                            asistentes: JSON.stringify(auxAsistentes)
                          }
                          Api.modificarAsistentesEvento(modificacion).then((data) => {
                            console.log(data)
                            if (data === 403 || data === 401) {
                              window.localStorage.removeItem("token");
                              window.localStorage.removeItem("user");
                              window.location.href = "/login"
                            }
                            else if (data === -1 || data === 300) {
                              setCargandoEliminar(false)

                            }
                            else {
                              setAsistentesEvento(auxAsistentes)
                              setCargandoEliminar(false)

                            }


                          }).catch(() => {
                            setCargandoEliminar(false)

                          })
                        }}
                      >
                        <DeleteForeverIcon />

                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>





        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
