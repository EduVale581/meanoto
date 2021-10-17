import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Button, 
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
  DialogActions
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Page from '../components/Page';
import React, { useState } from 'react';
import AcordionSalas from 'src/components/salas/AcordionSalas';

const Input = styled('input')({
  display: 'none',
});

const InputAforo = styled(MuiInput)({
  width: '42px',
});

export default function Salas() {

  const user = "ADMIN";
  

  const [openCrearSala, setOpenCrearSala] = useState(false);
  const [facultadSeleccionadaModal, setFacultadSeleccionadaModal] = useState("");
  const [facultadSeleccionadaFiltro, setFacultadSeleccionadaFiltro] = useState("Sin filtro");


  const [salasArreglo, setSalasArreglo] = useState([
    { nombre: "Turing", aforo: 20, facultad: "Ingeniería", disponibilidad: "Libre", aforoActual: 0, nombreEvento: "", fechaEvento:0, nombreModulo:"", profesor:"" },
    { nombre: "11", aforo: 30, facultad: "Ingeniería", disponibilidad: "Ocupado", aforoActual: 10, nombreEvento: "Clase 5", fechaEvento:"9/11/2021", nombreModulo:"Calculo I", profesor:"Felipe Kast"  },
    { nombre: "21", aforo: 40, facultad: "Ingeniería", disponibilidad: "Ocupado", aforoActual: 15, nombreEvento: "Clase 1 - Introducción", fechaEvento:"10/12/2021", nombreModulo:"Pensamiento compútacional", profesor:"Daniel Moreno"  },
    { nombre: "22", aforo: 60, facultad: "Ingeniería", disponibilidad: "Libre", aforoActual: 0, nombreEvento: "", fechaEvento:0, nombreModulo:"", profesor:""  }
  ]);

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

  const [salasMostrar, setSalasMostrar] = useState(salasArreglo);


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

  const [valueMIN, setValueMIN] = React.useState(60);


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
  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Salas
          </Typography>
          {user === "ADMIN" && (
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
        {user === "ADMIN" && (
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
        {user === "ADMIN" && (
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12}>
              <Paper elevation={3}>
                <Grid container spacing={2}>

                  <Grid item xs={3} md={3} style={{ marginLeft: 10, marginBottom: 10 }}>
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
                  <Grid item xs={3} md={3} style={{ marginLeft: 10, marginBottom: 10 }}>
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
            </Grid>
          </Grid>
        )}
        <List sx={{ width: '100%'}}>
        {salasMostrar.map((e, index) => {
            return (<Grid item key={index}>
              <AcordionSalas sala={e} setSalas={setSalasArreglo} salass={salasArreglo} />
            </Grid>);

          })}
        </List>

      </Container>

       { /*nombre: "10", aforo: 60, facultad: "Ingeniería", disponibilidad: "Ocupado", aforoActual: 61, nombreEvento: "Reunión Corporativo" */ } 

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
                <TextField label="Nombre de la sala" variant="outlined" fullWidth required />
              </Grid>
              <Grid item xs={12} style={{ marginLeft: 10 }}>
                <TextField label="Aforo de estudiantes" variant="outlined" fullWidth required />
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
        <DialogActions>
          <Button onClick={handleCloseSala} color="secondary">Cerrar</Button>
          <Button onClick={handleCloseSala} variant="contained" autoFocus>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
