import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Button,
  Container,
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
import Page from '../components/Page';
import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/usuarioContext';
import Api from '../api/Api';
import CardFacultad from 'src/components/facultades/CardFacultad';
import * as XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel'

const Input = styled('input')({
  display: 'none',
});

export default function Facultades() {
  const { user } = useUsuario();


  const [facultades, setFacultades] = useState(null);

  const [cargandoFacultades, setCargandoFacultades] = useState(true);

  const [openCrearModulo, setOpenCrearModulo] = useState(false);

  const [loadingCrearFacultad, setLoadingCrearFacultad] = useState(false);
  const [error, setError] = useState(false);


  const exportToCSV = () => {
    let option = {};
    let fecha = new Date();
    let nombreFecha = (fecha.getMonth() + 1) + "_" + fecha.getFullYear()

    option.fileName = 'facultad_' + nombreFecha; // nombre de archivo
    option.datas = [
      {
        sheetData: [], // datos
        sheetName: 'Facultades', // nombre de la hoja
        sheetHeader: ['Nombre Facultad'], // encabezado de la primera fila
        //columnWidths: [20, 20] // el ancho de la columna debe corresponder al orden de la columna
      },
    ];
    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); // Guardar
  }

  const leerArchivo = (file) => {
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
        if (element.includes(",") || element === "" || element === " " || idx === 0) {


        }
        else {
          Api.crearFacultad({ nombre: element }).then(() => {

          }).catch(() => {
            elementosNoGuardados = elementosNoGuardados + 1
          })
        }

      });
      if (elementosNoGuardados > 0) {
        setError("No se guardaron " + elementosNoGuardados + " elementos")
      }

      Api.getFacultades().then((data2) => {
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
        else if (data2 === -1) {
          setError("Error en el servidor")

        }
        else if (data2 === 300) {
          setError("Error en el servidor")

        }
        else {
          setFacultades(data2)
        }

      }).catch(() => {
        setError("Error en el servidor")
      });
    };
    reader.readAsBinaryString(file);
  }


  const [nombre, setNombre] = useState("");

  const handleChangeNombreModulo = (event) => {
    setNombre(event.target.value);

  };

  const handleChangeNombreArchivo = (event) => {
    if (event.target.files[0] && event.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      leerArchivo(event.target.files[0])
    }
    else {
      setError("Error en el archivo")
    }

  };

  const handleOpenModulo = () => setOpenCrearModulo(true);
  const handleCloseModulo = () => setOpenCrearModulo(false);
  const exportarExcel = () => {
    exportToCSV()
  };

  const crearNuevoFacultad = () => {
    setLoadingCrearFacultad(true)
    Api.crearFacultad({ nombre: nombre }).then((data) => {
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
        setLoadingCrearFacultad(false)

      }
      else if (data === 300) {
        setLoadingCrearFacultad(false)

      }
      else {
        Api.getFacultades().then((data2) => {
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
          else if (data2 === -1) {
            setLoadingCrearFacultad(false)

          }
          else if (data2 === 300) {
            setLoadingCrearFacultad(false)

          }
          else {
            setFacultades(data2)
            setNombre("")
            setLoadingCrearFacultad(false)
            setOpenCrearModulo(false)
          }

        }).catch(() => {
          setLoadingCrearFacultad(false)
        });

      }



    }).catch(() => {
      setLoadingCrearFacultad(false)

    })


  }


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
      else if (data === -1) {
        setCargandoFacultades(true)

      }
      else if (data === 300) {
        setCargandoFacultades(true)

      }
      else {
        setFacultades(data)
        setCargandoFacultades(false)
      }

    }).catch(() => { });

  }, []);


  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Facultades
          </Typography>
          {user && user.tipo_usuario === "ADMIN" && (
            <Button
              variant="contained"
              onClick={handleOpenModulo}
              startIcon={<Icon icon={plusFill} />}
            >
              Crear Facultad
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

                        id="contained-button-file"
                        type="file"
                        onChange={handleChangeNombreArchivo}
                      />
                      <Button variant="contained" component="span" fullWidth>
                        Subir facultades desde archivo
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

        <Grid container spacing={2}>


          {cargandoFacultades && facultades ? (
            <Grid item xs={12} md={12}>
              <Typography>Error en el servidor</Typography>

            </Grid>
          ) :
            (
              facultades && facultades.length >= 1 ? (
                facultades.map((e, index) => {
                  return (
                    <Grid item key={index} xs={6} md={4}>
                      <CardFacultad facultades={facultades} setFacultades={setFacultades} facultad={e} />
                    </Grid>
                  );

                })) : (
                facultades && facultades.length <= 0 ? (
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
          Nueva Facultad
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container xs={12} spacing={2}>
              <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                <TextField
                  value={nombre}
                  onChange={handleChangeNombreModulo}
                  label="Nombre Facultad"
                  variant="outlined"
                  fullWidth
                  required />
              </Grid>


            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={handleCloseModulo}
            loading={loadingCrearFacultad}
          >
            Cerrar
          </LoadingButton>
          <LoadingButton
            onClick={crearNuevoFacultad}
            loading={loadingCrearFacultad}
            variant="contained"
          >
            Crear
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
