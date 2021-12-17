import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { alpha } from '@mui/material/styles';
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
  Stack,
  Alert
} from '@mui/material';
import MenuPopover from '../../components/MenuPopover';
import account from '../../_mocks_/account';
import { useUsuario } from "../../context/usuarioContext";
import md5 from 'js-md5';
import Api from 'src/api/Api';
import { LoadingButton } from '@mui/lab';

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openAjustes, setOpenAjustes] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState("");
  const [error, setError] = useState(false);
  const { user } = useUsuario();

  const [loadingGuardar, setLoadingGuardar] = useState(false);

  const handleChangeNuevaContrasena = (event) => {
    if (md5(event.target.value) === user.contrasena) {

      setError("La contraseña no puede ser igual a la de antes")
    }
    else {
      setError(false)

    }
    setNuevaContrasena(event.target.value);
  };

  const handleChangeConfirmarNuevaContrasena = (event) => {
    if (event.target.value === nuevaContrasena) {
      setError(false)
    }
    else {
      setError("La contraseñas deben coincidir.")
    }
    setConfirmarNuevaContrasena(event.target.value);
  };


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };



  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const cambiarContrasena = () => {
    setLoadingGuardar(true)
    let datosEntrada = {
      id: user._id,
      contrasena: md5(nuevaContrasena)
    }
    Api.actulizarContrasena(datosEntrada).then((datos) => {
      if (datos === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
        setLoadingGuardar(false)
      }
      else if (datos === 403) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
        setLoadingGuardar(false)

      }
      else if (datos === -1 || datos == 300) {
        setLoadingGuardar(false)

      }
      else {
        setLoadingGuardar(false)
        setOpenAjustes(false)
        setOpen(false)

      }

    }).catch(() => {
      setLoadingGuardar(false)

    })
  };

  const handleOpenAjustes = () => {
    setOpenAjustes(true);
  };

  const handleCloseAjustes = () => {
    setOpenAjustes(false);
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.location.href = "/login"
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user && user.correo}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleOpenAjustes}
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box


            component={Icon}
            icon={settings2Fill}
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          />

          {"Ajustes"}
        </MenuItem>

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={cerrarSesion}>
            Salir
          </Button>
        </Box>
      </MenuPopover>
      <Dialog
        open={openAjustes}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Ajustes</DialogTitle>
        <DialogContent>
          <Stack>

            <TextField
              style={{ marginTop: "10px" }}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Nueva Contraseña"
              name="password"
              onChange={handleChangeNuevaContrasena}
              value={nuevaContrasena}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              style={{ marginTop: "10px" }}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Confirmar Contraseña"
              name="password"
              onChange={handleChangeConfirmarNuevaContrasena}
              value={confirmarNuevaContrasena}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

          </Stack>

        </DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <DialogActions>
          <LoadingButton
            loading={loadingGuardar}
            onClick={handleCloseAjustes}
          >
            Cancelar
          </LoadingButton>
          <LoadingButton
            loading={loadingGuardar}
            onClick={cambiarContrasena}
            disabled={!error ? false : true}
          >
            Guardar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
