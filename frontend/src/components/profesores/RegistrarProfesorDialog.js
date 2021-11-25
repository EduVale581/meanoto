import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import md5 from 'js-md5';
import { crearProfesor } from '../../api/Api';

export default function RegistrarProfesorDialog({ onClose, onSave, open }) {

  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const refNombre = useRef();
  const refApellido = useRef();
  const refRut = useRef();
  const refContrasena = useRef();
  const refConfContrasena = useRef();
  const refCorreo = useRef();

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async() => {
    if( refNombre.current.value.length === 0 ||
        refApellido.current.value.length === 0 ||
        refRut.current.value.length === 0 ||
        refContrasena.current.value.length === 0 ||
        refCorreo.current.value.length === 0
    )
      return setError("Todos los campos son obligatorios.");
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if( ! refCorreo.current.value.match(regex)  ) {
      return setError("Correo electrónico inválido.");
    }

    if( refContrasena.current.value !== refConfContrasena.current.value ) {
      return setError("Las contraseñas no coinciden.");
    }

    const profesor = {
      nombre: refNombre.current.value,
      apellido: refApellido.current.value,
      correo: refCorreo.current.value,
      rut: refRut.current.value,
      contrasena: md5(refContrasena.current.value),
      modulos: [],
      eventos: [],
    };

    const res = await crearProfesor(profesor);
    if (res === 403 || res === 401) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.location.href = "/login"
    }
    setLoading(false);
    delete profesor.contrasena;
    onSave(profesor);

  }

  return(
    <Dialog open={open} onClose={ onClose }>
      <DialogTitle>Nuevo Profesor</DialogTitle>
      <DialogContent>
        {/* <DialogContentText> */}
        {/* </DialogContentText> */}
        { error && (
          <Alert severity="error">{ error }</Alert>
        ) }

        <TextField
          autoFocus
          fullWidth
          label="Nombre"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refNombre }
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Apellido"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refApellido }
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Rut"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refRut }
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Correo"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refCorreo }
          required
          type="email"
        />
        <TextField
          autoFocus
          fullWidth
          label="Confirmar Contraseña"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refConfContrasena }
          required
          type="password"
        />
        <TextField
          autoFocus
          fullWidth
          label="Contraseña"
          margin="dense"
          onChange={ () => setError("") }
          inputRef={ refContrasena }
          required
          type="password"
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={ loading } onClick={ handleCancel }>
          Cancelar
        </Button>
        <Button
          color="primary"
          disabled={ loading }
          onClick={ handleSave }
          variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
