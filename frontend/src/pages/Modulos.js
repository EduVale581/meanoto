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
  LinearProgress,
  Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import CardModulos from '../components/modulos/CardModulos';
import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/usuarioContext';
import Api from '../api/Api';
import * as XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel'

const Input = styled('input')({
  display: 'none',
});

export default function Modulos() {
  const { user } = useUsuario();
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

  const [error, setError] = useState(false);



  const [modulosArreglo, setModulosArreglo] = useState(null);

  const [facultadesArreglo, setFacultadesArreglo] = useState([])

  const exportToCSV = () => {
    let option = {};
    let fecha = new Date();
    let nombreFecha = (fecha.getMonth() + 1) + "_" + fecha.getFullYear()

    option.fileName = 'modulos_' + nombreFecha; // nombre de archivo
    option.datas = [
      {
        sheetData: [], // datos
        sheetName: 'Módulos', // nombre de la hoja
        sheetHeader: ['Nombre', 'Número Alumnos'], // encabezado de la primera fila
        //columnWidths: [20, 20] // el ancho de la columna debe corresponder al orden de la columna
      },
    ];
    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); // Guardar
  }

  const leerArchivo = (file) => {
    if (facultadSeleccionadaFiltro === "Sin filtro" || carreraSeleccionadaFiltro === "Sin filtro") {
      setError("Se debe seleccionar una facultad y carrera en el filtro.");

    }
    else {

      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        /* Update state */
        let obtencion = data.split('\n');
        let elementosNoGuardados = 0;
        obtencion.forEach((element, idx) => {
          if (element === "" || element === " " || idx === 0) {


          }
          else {
            if (element.includes(",") && element.split(',').length === 2) {
              let datos = element.split(',');
              let numAlumnos = 0;
              try {
                numAlumnos = Number.parseInt(datos[1])
              }
              catch {
                numAlumnos = 0;

              }

              Api.crearNuevoModulo2(datos[0], facultadSeleccionadaFiltro, numAlumnos, carreraSeleccionadaFiltro).then((data) => {
                if (data === 403 || data === 401) {
                  elementosNoGuardados = elementosNoGuardados + 1;
                }
                else if (data === -1 || data === 300) {
                  elementosNoGuardados = elementosNoGuardados + 1;

                }
                else {
                  Api.getModulos2().then((data2) => {
                    if (data2 === 403 || data2 === 401) {
                    }
                    else if (data2 === -1 || data2 === 300) {

                    }
                    else {
                      setModulosArreglo(data2)
                      setModulosMostrar(data2)
                      setModulosServidor(false)

                    }


                  }).catch(() => {

                  })

                }
              }).catch(() => {
                elementosNoGuardados = elementosNoGuardados + 1;
              })
            }
            else {
              elementosNoGuardados = elementosNoGuardados + 1;
            }


          }

        });
        if (elementosNoGuardados > 0) {
          setError("No se guardaron " + elementosNoGuardados + " elementos")
        }
      };
      reader.readAsBinaryString(file);


    }

  }

  const handleChangeNombreArchivo = (event) => {
    if (event.target.files[0] && event.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      leerArchivo(event.target.files[0])
    }
    else {
      setError("Error en el archivo")
    }

  };

  const exportarExcel = () => {
    exportToCSV()
  };



  const handleChangeFacultadSeleccionadaModal = (event) => {
    setFacultadSeleccionadaModal(event.target.value);
    let filtroCarreras = facultadesArreglo.filter((e) => e.nombre === event.target.value)[0];
    if (filtroCarreras && filtroCarreras.carreras) {
      setCarrerasFiltradas(filtroCarreras.carreras)

    }
    else {
      setCarrerasFiltradas([])

    }
  };

  const handleChangeCarreraSeleccionadaModal = (event) => {
    setCarreraSeleccionadaModal(event.target.value);
  };

  const handleChangeFacultadSeleccionadaFiltro = (event) => {
    setFacultadSeleccionadaFiltro(event.target.value);
    let filtroCarreras = facultadesArreglo.filter((e) => e.nombre === event.target.value)[0];
    if (filtroCarreras && filtroCarreras.carreras) {
      setCarrerasFiltradas(filtroCarreras.carreras)

    }
    else {
      setCarrerasFiltradas([])

    }


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

  const crearNuevoModulo = async () => {
    const data = await Api.crearNuevoModulo(nombre, facultadSeleccionadaModal, nro_alumnos, carreraSeleccionadaModal, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro, setLoadingCrearModulo, setOpenCrearModulo)
    if (data === 403 || data === 401) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.location.href = "/login"
    }
    else if (data === -1 || data === 300) {

    }
    else {

    }


  }







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
      else if (data === -1 || data === 300) {

      }
      else {
      }


    }
    cargarModulos();

  }, []);

  useEffect(() => {
    async function obtenerFacultades() {
      const data = await Api.getFacultades();
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
        setFacultadesArreglo(data)
      }


    }
    obtenerFacultades();

  }, []);



  const [modulosMostrar, setModulosMostrar] = useState(modulosArreglo);


  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Módulos
          </Typography>
          {user && user.tipo_usuario === "ADMIN" && (
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

        {error && <Alert severity="error">{error}</Alert>}

        {user && user.tipo_usuario === "ADMIN" && (
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12} style={{ marginBottom: 10 }}>
              <Paper elevation={3} >
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} style={{ marginBottom: 10 }}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="*"
                        id="contained-button-file"
                        type="file"
                        onChange={handleChangeNombreArchivo}
                        disabled={(facultadSeleccionadaFiltro === "Sin filtro" || carreraSeleccionadaFiltro === "Sin filtro") ? true : false}

                      />
                      <Button
                        variant="contained"
                        component="span" fullWidth
                        disabled={(facultadSeleccionadaFiltro === "Sin filtro" || carreraSeleccionadaFiltro === "Sin filtro") ? true : false}
                      >
                        Subir módulos desde archivo
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={6} md={6} style={{ marginBottom: 10 }}>
                    <Button
                      variant="contained"
                      color="inherit"
                      fullWidth
                      onClick={exportarExcel}
                    >
                      Descargar plantilla
                    </Button>
                  </Grid>
                </Grid>





              </Paper>
            </Grid>
          </Grid>
        )}

        {user && user.tipo_usuario === "ADMIN" && (
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
