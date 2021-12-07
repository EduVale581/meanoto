import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  Paper,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Switch,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Alert,
  Box
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Page from '../components/Page';
import React, { useEffect, useState } from 'react';
import AcordionSalas from 'src/components/salas/AcordionSalas';
import Api from "../api/Api"
import { useUsuario } from 'src/context/usuarioContext';

const Input = styled('input')({
  display: 'none',
});

const InputAforo = styled(MuiInput)({
  width: '42px',
});

export default function Salas() {

  const { user, setUser, setCargandoUsuario } = useUsuario();

  const [openCrearSala, setOpenCrearSala] = useState(false);
  const [facultadSeleccionadaModal, setFacultadSeleccionadaModal] = useState("");
  const [facultadSeleccionadaFiltro, setFacultadSeleccionadaFiltro] = useState("Sin filtro");
  const [error, setError] = useState(false);


  const [facultadesArreglo, setFacultades] = useState([]);

  const [salasMostrar, setSalasMostrar] = useState([]);
  const [salasArreglo, setSalasArreglo] = useState([]);

  const [nombreSala, setNombreSala] = useState("");
  const [aforoSala, setAforoSala] = useState(0);
  const [metrosCuadradoSala, setMetrosCuadradosSala] = useState(0);

  async function obtenerUsuarioNull() {
    if (!user) {
      const token = window.localStorage.getItem("token");
      const idUsuario = window.localStorage.getItem("user");
      const data = await Api.cargarUsuario(token, idUsuario);


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
      else if (data === -1) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"

      }
      else {
        setUser(data);
        setCargandoUsuario(false);
      }

    }


  }

  obtenerUsuarioNull()

  const handleChangeNombreSala = (event) => {
    setNombreSala(event.target.value);
  };

  const handleChangeAforoSala = (event) => {
    setAforoSala(event.target.value);
  };

  const handleChangeMetrosCuadradosSala = (event) => {
    setMetrosCuadradosSala(event.target.value);
  };



  const handleChangeFacultadSeleccionadaModal = (event) => {
    setFacultadSeleccionadaModal(event.target.value);
  };

  const handleChangeFacultadSeleccionadaFiltro = (event) => {
    setFacultadSeleccionadaFiltro(event.target.value);

    if (event.target.value === "Sin filtro") {
      setSalasMostrar(salasArreglo)
    }
    else {
      setSalasMostrar(salasMostrar.filter((e) => e.facultad === event.target.value))
    }

  };

  const [valueMIN, setValueMIN] = useState(60);


  const handleInputChangeMIN = (event) => {
    setValueMIN(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlurMIN = () => {
    if (valueMIN < 0) {
      setValueMIN(0);
    } else if (valueMIN > 100) {
      setValueMIN(100);
    }
  };

  const handleChangeSlider = (event, newValue) => {
    setValueMIN(newValue);
  };

  const [disponible, setDisponible] = React.useState(true);

  const handleChangeDiponible = (event) => {
    setDisponible(event.target.checked);
  };

  const handleOpenSala = () => setOpenCrearSala(true);
  const handleCloseSala = () => setOpenCrearSala(false);
  const crearSala = async () => {
    let correcto = true;
    try {
      let num = Number.parseInt(aforoSala);
      let num2 = Number.parseInt(metrosCuadradoSala);
    }
    catch {
      correcto = false;
    }
    if (!correcto) {
      setError("El aforo y metros cuadrados deben ser un número entero.")
    }
    else if (nombreSala.length === 0) {
      setError("Debe ingresar el nombre de la sala")

    }
    else if (aforoSala.length === 0) {
      setError("Debe ingresar el aforo de la sala")

    }
    else if (metrosCuadradoSala.length === 0) {
      setError("Debe ingresar los metros cuadrados de la sala")

    }
    else if (!facultadSeleccionadaModal || facultadSeleccionadaModal === "" || facultadSeleccionadaModal === " ") {
      setError("Se debe seleccionar una facultad")

    }
    else {
      setError(false)
      let facultadObtenida = facultadesArreglo.filter((e) => e.nombre === facultadSeleccionadaModal)[0]
      let salaCrear = {
        nombre: nombreSala,
        aforo: Number.parseInt(aforoSala),
        facultad: facultadObtenida.id,
        estado: "DISPONIBLE",
        aforoActual: 0,
        metrosCuadrados: Number.parseInt(metrosCuadradoSala)
      }
      const data = await Api.crearSala(salaCrear);
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
      else if (data === -1 || data === 300) {
        setError("Error en el servidor")

      }
      else {
        const data2 = await Api.obtenerSalas();
        if (data2 === 401) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.location.href = "/login"
        }
        else if (data2 === 403) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.location.href = "/login"

        }
        else if (data2 === -1 || data2 === 300) {
          setError("Error en el servidor");

        }
        else {
          setSalasMostrar(data2)
          setSalasArreglo(data2)
          setOpenCrearSala(false);

        }

      }

    }


  };

  useEffect(() => {
    async function cargaSalas() {
      const data = await Api.obtenerSalas();
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
      else if (data === -1 || data === 300) {

      }
      else {
        setSalasMostrar(data)
        setSalasArreglo(data)

      }


    }
    cargaSalas();

  }, [])



  useEffect(() => {
    async function obtenerFacultad() {
      const data = await Api.getFacultades()
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



    }
    obtenerFacultad();

  }, [])
  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Salas
          </Typography>
          {user && user.tipo_usuario === "ADMIN" && (
            <Button
              variant="contained"
              component={RouterLink}
              onClick={handleOpenSala}
              to="#"
              startIcon={<Icon icon={plusFill} />}
            >
              Nueva Sala
            </Button>)
          }
        </Stack>
        {user && user.tipo_usuario === "ADMIN" && (
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12} style={{ marginBottom: 10 }}>
              <Paper elevation={3} >
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} style={{ marginBottom: 10 }}>
                    <label htmlFor="contained-button-file">
                      <Input accept="image/*" id="contained-button-file" multiple type="file" />
                      <Button variant="contained" component="span" fullWidth>
                        Subir salas desde archivo
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={6} md={6} style={{ marginBottom: 10 }}>
                    <Button variant="contained" color="inherit" fullWidth>
                      Descargar plantilla
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}


        <Paper elevation={3}>
          <Grid container>

            <Grid item xs={4} md={4} style={{ marginLeft: 10, marginBottom: 10 }}>
              <FormControl fullWidth>
                <InputLabel id="selectFacultadesFiltro">Facultades</InputLabel>
                <Select
                  labelId="selectFacultadesFiltro"
                  id="demo-simple-select"
                  value={facultadSeleccionadaFiltro}
                  label="Facultades"
                  onChange={handleChangeFacultadSeleccionadaFiltro}
                >
                  <MenuItem value={"Sin filtro"}>Sin filtro</MenuItem>
                  {facultadesArreglo.map((e, index) => {
                    return (<MenuItem key={index} value={e.nombre}>{e.nombre}</MenuItem>);

                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} md={4} style={{ marginLeft: 10, marginBottom: 10 }}>
              <Grid item>
                <Typography id="input-slider" gutterBottom>
                  Aforo
                </Typography>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs >
                  <Slider
                    getAriaLabel={() => 'Aforo range'}
                    value={typeof valueMIN === 'number' ? valueMIN : 0}
                    onChange={handleChangeSlider}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <InputAforo
                    value={valueMIN}
                    size="small"
                    onChange={handleInputChangeMIN}
                    onBlur={handleBlurMIN}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} md={3} style={{ marginLeft: 10, marginBottom: 10 }}>
              <Grid item>
                <Typography id="input-Switch" gutterBottom>
                  Disponible
                </Typography>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Switch
                    defaultChecked
                    size="medium"
                    checked={disponible}
                    onChange={handleChangeDiponible} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Paper>
        <List sx={{ width: '100%' }}>
          {salasMostrar.map((e, index) => {
            return (<Grid item key={index}>
              <AcordionSalas sala={e} setSalasMostrar={setSalasMostrar} setSalasArreglo={setSalasArreglo} salas={salasArreglo} />
            </Grid>);

          })}
        </List>

      </Container>


      <Dialog
        open={openCrearSala}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          Nueva Sala
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container xs={12} spacing={2}>
              <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                <TextField
                  label="Nombre de la sala"
                  variant="outlined"
                  fullWidth
                  required
                  value={nombreSala}
                  onChange={handleChangeNombreSala}
                />
              </Grid>
              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <TextField
                  label="Aforo de estudiantes"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={aforoSala}
                  onChange={handleChangeAforoSala}
                />
              </Grid>
              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <TextField
                  label="Metros cuadrados sala"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={metrosCuadradoSala}
                  onChange={handleChangeMetrosCuadradosSala}
                />
              </Grid>
              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <FormControl fullWidth>
                  <InputLabel id="selectFacultades">Facultades</InputLabel>
                  <Select
                    labelId="selectFacultades"
                    id="demo-simple-select"
                    value={facultadSeleccionadaModal}
                    label="Facultades"
                    onChange={handleChangeFacultadSeleccionadaModal}
                  >
                    {facultadesArreglo.map((e, index) => {
                      return (<MenuItem key={index} value={e.nombre}>{e.nombre}</MenuItem>);

                    })}
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
          </DialogContentText>
        </DialogContent>
        {error && (
          <Box mb={2} width="100%">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <DialogActions>
          <Button onClick={handleCloseSala} color="secondary">Cerrar</Button>
          <Button
            onClick={crearSala}
            variant="contained"
            autoFocus
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
