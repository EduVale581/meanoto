import React, { useCallback, useEffect, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import IconButton from '@mui/material/IconButton';

import { obtenerModulos } from '../../api/Api';

const tiposRecurrencia = [
  {
    value: 'NO_RECURRENTE',
    label: 'No recurrente',
  },
  {
    value: 'DIARIA',
    label: 'Diaria',
  },
  {
    value: 'SEMANAL',
    label: 'Semanal',
  },
  {
    value: 'MENSUAL',
    label: 'Mensual'
  },
];

const diasSemana = [
  {
    value: 'LUNES',
    label: 'Lunes',
  },
  {
    value: 'MARTES',
    label: 'Martes',
  },
  {
    value: 'MIERCOLES',
    label: 'Miércoles',
  },
  {
    value: 'JUEVES',
    label: 'Jueves'
  },
  {
    value: 'VIERNES',
    label: 'Viernes'
  },
  {
    value: 'SABADO',
    label: 'Sábado'
  },
];

const bloques = [
  {
    label: '8:30 - 9:30',
    value: '1'
  },
  {
    label: '9:40 - 10:40',
    value: '2'
  },
  {
    label: '10:50 - 11:50',
    value: '3'
  },
  {
    label: '12:00 - 13:00',
    value: '4'
  },
  {
    label: '13:10 - 14:10',
    value: '5'
  },
  {
    label: '14:20 - 15:20',
    value: '6'
  },
  {
    label: '15:30 - 16:30',
    value: '7'
  },
  {
    label: '16:40 - 17:40',
    value: '8'
  },
  {
    label: '17:50 - 18:50',
    value: '9'
  },
  {
    label: '19:00 - 20:00',
    value: '10'
  },
  {
    label: '20:10 - 21:10',
    value: '11'
  }
];


const estadosEvento = [
  {
    label: "Activo",
    value: 'activo'
  },
  {
    label: "Inactivo",
    value: 'inactivo'
  },
  {
    label: "Suspendido",
    value: 'suspendido'
  },
]

export default function NewEventDialog({onClose, onSave, open, professor}) {
  const isMounted = useRef(true);
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ courses, setCourses ] = useState([]);
  const [ selectedCourse, setSelectedCourse ] = useState();
  const [ recurrencia, setRecurrencia ] = useState(diasSemana[2])
  const [ tipoRecurrencia, setTipoRecurrencia ] = useState(tiposRecurrencia[0]);
  const [ startDate, setStartDate ] = useState(null);
  const [ endDate, setEndDate ] = useState(null);
  const [ estadoEvento, setEstadoEvento ] = useState(estadosEvento[0]);
  const [ eventCode, setEventCode ] = useState('');
  const [ bloqueHorario, setBloqueHorario ] = useState(bloques[0]);

  const refNombre = useRef();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchModules = useCallback(
    async function() {
      if(! professor) return
      // obtener todos los módulos
      const modulosAux = await obtenerModulos();
      // filtrar los módulos del profesor actual
      const filtered = modulosAux.filter( m => m.id_Profesor === professor.id)

      if(isMounted.current) {
        setCourses(filtered);
        setSelectedCourse(filtered[0]);
      }
    },[professor]
  );

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async() => {
    if( refNombre.current.value.length === 0 )
      return setError("Todos los campos son obligatorios.");
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    const evento = {
      id: '',
      nombre: refNombre.current.value,
      // modulo: ,
      // eventos: [],
    };

    // const res = await crearProfesor(profesor);
    // if (res === 403 || res === 401) {
    //   window.localStorage.removeItem("token");
    //   window.localStorage.removeItem("user");
    //   window.location.href = "/login"
    // }

    // profesor.id = res.id;
    // setLoading(false);
    // delete profesor.contrasena;
    // onSave(profesor);

  }

  const handleModules = (data) => {
    setError("");
    setCourses(data);
  }

  const handleRecurrencia = ({target}) => {
    const option = diasSemana.find( r => r.value === target.value );
    setRecurrencia(option);
  }

  const handleTipoRecurrencia = ({target}) => {
    const option = tiposRecurrencia.find( r => r.value === target.value );
    setTipoRecurrencia(option);
  }

  const handleEstado = ({target}) => {
    const newState = estadosEvento.find( e => e.value === target.value );
    setEstadoEvento(newState);
  }

  const handleCourse = ({target}) => {
    const newCourse = courses.filter( c => c.id === target.value.id )
    setSelectedCourse(newCourse);
  }

  const handleCode = ({ target }) => {
    setEventCode(target.value);
  }

  const handleBloqueHorario = ({target}) => {
    const option = bloques.find( b => b.value === target.value );
    setBloqueHorario(option);
  }

  function generateEventCode() {
    // console.log("selectedCourse", selectedCourse)
    // let code;
    // const now = new Date().toISOString().slice(0, -5);
    // code = selectedCourse.nombre
    //   .trim()
    //   .replaceAll(' ', '_')
    //   .replaceAll('T', '_') + ('_') + now;
    // console.log("now", now)
    // console.log("cod", code)

  }

  return(
    <Dialog open={open} onClose={ onClose }>
      <DialogTitle>Nuevo Evento</DialogTitle>
      <DialogContent>


        <Grid container spacing={2}>

          <Grid mt={1} item xs={6}>
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
          </Grid>

          <Grid mt={2} item xs={6}>

            <TextField
              type='text'
              value={eventCode}
              onChange={handleCode}
              label='Código'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={generateEventCode} edge="end">
                      <AutoAwesomeIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />


          </Grid>

          { courses.length > 0 && selectedCourse && (
            <Grid mt={1} item xs={6}>
              <TextField
                fullWidth
                select
                label="Curso"
                InputLabelProps={{ shrink: true }}
                value={selectedCourse.value}
                onChange={handleCourse}
                SelectProps={{
                  native: true,
                }}
              >
                {courses.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.nombre}
                  </option>
                ))}
              </TextField>
            </Grid>
          ) }

          <Grid item xs={6}>
            <TextField
              autoFocus
              label="Máximo de asistentes"
              margin="dense"
              onChange={ () => setError("") }
              required
              type="number"
            />
          </Grid>

          <Grid mt={1} item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo recurrencia</InputLabel>
              <Select
                value={tipoRecurrencia.value}
                label="Tipo recurrencia"
                onChange={handleTipoRecurrencia}
              >
                {tiposRecurrencia.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid mt={1} item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Recurrencia</InputLabel>
              <Select
                value={recurrencia.value}
                disabled={tipoRecurrencia.value === "NO_RECURRENTE"}
                label="Recurrencia"
                onChange={handleRecurrencia}
              >
                {diasSemana.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid mt={1} item xs={4}>
            <TextField
              id="outlined-select-currency-native"
              fullWidth
              select
              label="Bloque horario"
              InputLabelProps={{ shrink: true }}
              value={bloqueHorario.value}
              onChange={handleBloqueHorario}
              SelectProps={{
                native: true,
              }}
            >
              {bloques.map((option) => (
                <option key={option.value} value={option.value}>
                  {`(${option.value}) ${option.label}`}
                </option>
              ))}
            </TextField>
          </Grid>


          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha inicio"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha término"
                value={endDate}
                disabled={tipoRecurrencia.value === "NO_RECURRENTE"}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

          </Grid>

        </Grid>

      </DialogContent>
      { error && (
        <Box mb={2} width="100%">
          <Alert severity="error">{ error }</Alert>
        </Box>
      ) }
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
