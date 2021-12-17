import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import md5 from 'js-md5';
import { crearProfesor, obtenerModulos } from '../../api/Api';
import Tags from '../Tags';
import { validateRut } from '@fdograph/rut-utilities';

export default function RegistrarProfesorDialog({ onClose, onSave, open }) {

  const isMounted = useRef(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const refNombre = useRef();
  const refApellido = useRef();
  const refRut = useRef();
  const refContrasena = useRef();
  const refConfContrasena = useRef();
  const refCorreo = useRef();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchModules = useCallback(
    async function () {
      const modulosAux = await obtenerModulos();
      if (isMounted.current) {
        setModulos(modulosAux);
      }
    }, []
  );

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async () => {
    if (refNombre.current.value.length === 0 ||
      refApellido.current.value.length === 0 ||
      refRut.current.value.length === 0 ||
      refContrasena.current.value.length === 0 ||
      refCorreo.current.value.length === 0
    )
      return setError("Todos los campos son obligatorios.");
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!refCorreo.current.value.match(regex)) {
      return setError("Correo electrónico inválido.");
    }

    if (refContrasena.current.value !== refConfContrasena.current.value) {
      return setError("Las contraseñas no coinciden.");
    }

    if (selectedCourses.length === 0) {
      return setError("Debe asignar al menos un módulo.")
    }

    const rut = refRut.current.value.replaceAll('.', '').replaceAll('-', '');

    if (!validateRut(rut)) {
      return setError("Rut inválido.");
    }

    const profesor = {
      id: '',
      nombre: refNombre.current.value,
      apellido: refApellido.current.value,
      correo: refCorreo.current.value,
      rut,
      contrasena: md5(refContrasena.current.value),
      modulos: selectedCourses.map(c => c.id),
      eventos: [],
    };

    const res = await crearProfesor(profesor);
    if (res === 403 || res === 401) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.location.href = "/login"
    }
    else if (res === 300 || res === -1) {

    }

    profesor.id = res.id;
    setLoading(false);
    delete profesor.contrasena;
    onSave(profesor);

  }

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleModules = (data) => {
    setError("");
    setSelectedCourses(data);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nuevo Profesor</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Nombre"
          margin="dense"
          onChange={() => setError("")}
          inputRef={refNombre}
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Apellido"
          margin="dense"
          onChange={() => setError("")}
          inputRef={refApellido}
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Rut"
          margin="dense"
          onChange={() => setError("")}
          inputRef={refRut}
          required
          type="text"
        />
        <TextField
          autoFocus
          fullWidth
          label="Correo"
          margin="dense"
          onChange={() => setError("")}
          inputRef={refCorreo}
          required
          type="email"
        />

        <TextField
          autoFocus
          fullWidth
          label="Contraseña"
          margin="dense"
          type={showPassword ? 'text' : 'password'}
          onChange={() => setError("")}
          inputRef={refContrasena}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          autoFocus
          fullWidth
          label="Confirmar Contraseña"
          margin="dense"
          onChange={() => setError("")}
          inputRef={refConfContrasena}
          required
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Tags
          options={modulos}
          label='Módulos'
          onSelect={handleModules}
          labeledProperty='nombre'
        />

      </DialogContent>
      {error && (
        <Box mb={2} width="100%">
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <DialogActions>

        <Button disabled={loading} onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          color="primary"
          disabled={loading}
          onClick={handleSave}
          variant="contained">
          Aceptar
        </Button>


      </DialogActions>
    </Dialog>
  );
}
