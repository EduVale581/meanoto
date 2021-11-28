import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  LinearProgress
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import CardModulos from '../components/modulos/CardModulos';
import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/usuarioContext';
import Api from '../api/Api';

const Input = styled('input')({
  display: 'none',
});

export default function Modulos() {
  const { user, setUser, setCargandoUsuario, cargandoUsuario } = useUsuario();




  const [openCrearModulo, setOpenCrearModulo] = useState(false);
  const [carreraSeleccionadaFiltro, setCarreraSeleccionadaFiltro] = useState("Sin filtro");
  const [facultadSeleccionadaFiltro, setFacultadSeleccionadaFiltro] = useState("Sin filtro");
  const [carrerasFiltradas, setCarrerasFiltradas] = useState([]);

  const [loadingCrearModulo, setLoadingCrearModulo] = useState(false);
  const [modulosServidor, setModulosServidor] = useState(false);


  const [carreraSeleccionadaModal, setCarreraSeleccionadaModal] = useState("");
  const [facultadSeleccionadaModal, setFacultadSeleccionadaModal] = useState("");

  const [nombre, setNombre] = useState("");
  const [nro_alumnos, setNroAlumnos] = useState("");



  const [modulosArreglo, setModulosArreglo] = useState(null);

  const facultadesArreglo = [
    { nombre: "Economía y Negocios" },
    { nombre: "Ciencias Jurídicas y Sociales" },
    { nombre: "Ingeniería" },
    { nombre: "Ciencias de la Salud" },
    { nombre: "Ciencias Agrarias" },
    { nombre: "Psicología" },
    { nombre: "Arquitectura, Música y Diseño" },
    { nombre: "Ciencias de la Educación" },
    { nombre: "Rectoría" }
  ]
  const carrerasArreglo = [
    { nombre: "Auditoría e Ingeniería en Control de Gestión de Talca", facultad: "Economía y Negocios" },
    { nombre: "Auditoría e Ingeniería en Control de Gestión de Santiago", facultad: "Economía y Negocios" },
    { nombre: "Ingeniería Comercial de Talca", facultad: "Economía y Negocios" },
    { nombre: "Ingeniería Informática Empresarial", facultad: "Economía y Negocios" },
    { nombre: "Contador Público y Auditor Linares", facultad: "Economía y Negocios" },
    { nombre: "Derecho de Talca", facultad: "Ciencias Jurídicas y Sociales" },
    { nombre: "Derecho de Santiago", facultad: "Ciencias Jurídicas y Sociales" },
    { nombre: "Ciencia Política y Administración Pública de Santiago", facultad: "Ciencias Jurídicas y Sociales" },
    { nombre: "Ciencia Política y Administración Pública de Talca", facultad: "Ciencias Jurídicas y Sociales" },
    { nombre: "Ingeniería Civil en Mecatrónica", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil en Computación", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil Industrial", facultad: "Ingeniería" },
    { nombre: "Ingeniería en Obras Civiles", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil en Bioinformática", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil Mecánica", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil de Minas", facultad: "Ingeniería" },
    { nombre: "Ingeniería Civil Eléctrica", facultad: "Ingeniería" },
    { nombre: "Ingeniería en Desarrollo de Videojuegos y Realidad Virtual", facultad: "Ingeniería" },
    { nombre: "Odontología", facultad: "Ciencias de la Salud" },
    { nombre: "Tecnología Médica", facultad: "Ciencias de la Salud" },
    { nombre: "Kinesiología", facultad: "Ciencias de la Salud" },
    { nombre: "Fonoaudiología", facultad: "Ciencias de la Salud" },
    { nombre: "Enfermería", facultad: "Ciencias de la Salud" },
    { nombre: "Nutrición y Dietética", facultad: "Ciencias de la Salud" },
    { nombre: "Obstetricia y Puericultura", facultad: "Ciencias de la Salud" },
    { nombre: "Agronomía", facultad: "Ciencias Agrarias" },
    { nombre: "Psicología", facultad: "Psicología" },
    { nombre: "Arquitectura", facultad: "Arquitectura, Música y Diseño" },
    { nombre: "Música", facultad: "Arquitectura, Música y Diseño" },
    { nombre: "Diseño", facultad: "Arquitectura, Música y Diseño" },
    { nombre: "Pedagogías en Ciencias Naturales y Exactas", facultad: "Ciencias de la Educación" },
    { nombre: "Pedagogías en Inglés", facultad: "Ciencias de la Educación" },
    { nombre: "Pedagogías en Alemán", facultad: "Ciencias de la Educación" },
    { nombre: "Medicina", facultad: "Rectoría" },
    { nombre: "Ciencias Forestales", facultad: "Rectoría" },
    { nombre: "Bioquímica", facultad: "Rectoría" }
  ]



  const handleChangeFacultadSeleccionadaModal = (event) => {
    setFacultadSeleccionadaModal(event.target.value);
    setCarrerasFiltradas(carrerasArreglo.filter((e) => e.facultad === event.target.value))
  };

  const handleChangeCarreraSeleccionadaModal = (event) => {
    setCarreraSeleccionadaModal(event.target.value);
  };

  const handleChangeFacultadSeleccionadaFiltro = (event) => {
    setFacultadSeleccionadaFiltro(event.target.value);
    setCarrerasFiltradas(carrerasArreglo.filter((e) => e.facultad === event.target.value))

    if (event.target.value === "Sin filtro") {
      setModulosMostrar(modulosArreglo)
    }
    else {
      setModulosMostrar(modulosArreglo.filter((e) => e.facultad === event.target.value))
    }

  };

  const handleChangeCarreraSeleccionadaFiltro = (event) => {
    setCarreraSeleccionadaFiltro(event.target.value);
    if (event.target.value === "Sin filtro" && facultadSeleccionadaFiltro === "Sin filtro") {
      setModulosMostrar(modulosArreglo)

    }
    else if (event.target.value === "Sin filtro") {
      setModulosMostrar(modulosArreglo.filter((e) => e.facultad === facultadSeleccionadaFiltro))

    }
    else {
      setModulosMostrar(modulosArreglo.filter((e) => e.facultad === facultadSeleccionadaFiltro && e.carrera === event.target.value))
    }
  };

  const handleChangeNombreModulo = (event) => {
    setNombre(event.target.value);

  };

  const handleChangeNumAlumnos = (event) => {
    if (!isNaN(event.target.value) && event.target.value > 0) {
      setNroAlumnos(event.target.value);
    }
    else {
      setNroAlumnos(0);
    }


  };

  const handleOpenModulo = () => setOpenCrearModulo(true);
  const handleCloseModulo = () => setOpenCrearModulo(false);

  const crearNuevoModulo = () => {
    const data = Api.crearNuevoModulo(nombre, facultadSeleccionadaModal, nro_alumnos, carreraSeleccionadaModal, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro, setLoadingCrearModulo, setOpenCrearModulo)
    if (data === 403 || data === 401) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.location.href = "/login"
    }
    else if (data === -1) {

    }
    else {

    }
  }



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







  useEffect(() => {
    async function cargarModulos() {
      const data = await Api.getModulos(setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro)
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

      }
      else {
      }


    }
    cargarModulos();

  }, []);



  const [modulosMostrar, setModulosMostrar] = useState(modulosArreglo);


  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Módulos
          </Typography>
          {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
            <Button
              variant="contained"
              onClick={handleOpenModulo}
              startIcon={<Icon icon={plusFill} />}
            >
              Crear Módulo
            </Button>
          )
          }

        </Stack>

        {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12} style={{ marginBottom: 10 }}>
              <Paper elevation={3} >
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} style={{ marginBottom: 10 }}>
                    <label htmlFor="contained-button-file">
                      <Input accept="image/*" id="contained-button-file" multiple type="file" />
                      <Button variant="contained" component="span" fullWidth>
                        Subir módulos desde archivo
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

        {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12}>
              <Paper elevation={3}>
                <Grid container spacing={2}>

                  <Grid item xs={5} md={5} style={{ marginLeft: 10, marginBottom: 10 }}>
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

                  <Grid item xs={5} md={5} style={{ marginBottom: 10 }}>
                    <FormControl fullWidth>
                      <InputLabel id="selectCarrerasFiltro">Carreras</InputLabel>
                      <Select
                        labelId="selectCarrerasFiltro"
                        id="demo-simple-select"
                        value={carreraSeleccionadaFiltro}
                        label="Carreras"
                        onChange={handleChangeCarreraSeleccionadaFiltro}
                      >
                        <MenuItem value={"Sin filtro"}>Sin filtro</MenuItem>
                        {carrerasFiltradas.map((e, index) => {
                          return (<MenuItem key={index} value={e.nombre}>{e.nombre}</MenuItem>);

                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>

              </Paper>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>


          {modulosServidor ? (
            <Grid item xs={12} md={12}>
              <Typography>Error en el servidor</Typography>

            </Grid>
          ) :
            (
              modulosMostrar && modulosMostrar.length >= 1 ? (
                modulosMostrar.map((e, index) => {
                  let estudiantesEntrada = [];
                  if (e.estudiantes) {
                    estudiantesEntrada = e.estudiantes
                  }
                  return (
                    <Grid item key={index} xs={6} md={4}>
                      <CardModulos modulo={e} setModulosArreglo={setModulosArreglo} setModulosMostrar={setModulosMostrar} setModulosServidor={setModulosServidor} facultadSeleccionadaFiltro={facultadSeleccionadaFiltro} carreraSeleccionadaFiltro={carreraSeleccionadaFiltro} estudiantesEntrada={estudiantesEntrada} />
                    </Grid>
                  );

                })) : (
                modulosMostrar && modulosMostrar.length <= 0 ? (
                  <Grid item xs={12} md={12}>
                    <Typography>Sin datos que mostrar</Typography>

                  </Grid>
                ) : (
                  <Grid item xs={12} md={12}>
                    <LinearProgress />

                  </Grid>
                )

              )
            )
          }

        </Grid>




      </Container>

      <Dialog
        open={openCrearModulo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          Nuevo Módulo
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container xs={12} spacing={2}>
              <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                <TextField
                  value={nombre}
                  onChange={handleChangeNombreModulo}
                  label="Nombre módulo"
                  variant="outlined"
                  fullWidth
                  required />
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

              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <FormControl fullWidth>
                  <InputLabel id="selectCarreras">Carreras</InputLabel>
                  <Select
                    labelId="selectCarreras"
                    id="demo-simple-select"
                    value={carreraSeleccionadaModal}
                    label="Carreras"
                    onChange={handleChangeCarreraSeleccionadaModal}
                  >
                    {carrerasFiltradas.map((e, index) => {
                      return (<MenuItem key={index} value={e.nombre}>{e.nombre}</MenuItem>);

                    })}
                  </Select>
                </FormControl>
              </Grid>



              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <TextField
                  value={nro_alumnos}
                  onChange={handleChangeNumAlumnos}
                  label="Cantidad máxima estudiantes"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>

            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={handleCloseModulo}
            loading={loadingCrearModulo}
          >
            Cerrar
          </LoadingButton>
          <LoadingButton
            onClick={crearNuevoModulo}
            loading={loadingCrearModulo}
            variant="contained"
          >
            Crear
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
