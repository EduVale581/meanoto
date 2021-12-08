import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// material
import {
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  Paper,
  Alert

} from '@mui/material';
// components
import Page from '../components/Page';
import ProfesoresTable from '../components/profesores/ProfesoresTable';
import RegistrarProfesorDialog from
  '../components/profesores/RegistrarProfesorDialog';
import { getProfesores, eliminarProfesor, crearProfesor } from '../api/Api';
import { useUsuario } from '../context/usuarioContext';
import Api from '../api/Api';
import * as XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel'
import md5 from 'js-md5';

const Input = styled('input')({
  display: 'none',
});
export default function Profesores() {
  const { user } = useUsuario();

  const isMounted = useRef(true);
  const [showNewProfessorDialog, setShowNewProfessorDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(false);

  const fetchTeachers = useCallback(
    async function () {
      const teachersAux = await getProfesores();
      if (isMounted.current) {
        setTeachers(teachersAux);
      }
    }, []
  );

  const exportToCSV = () => {
    let option = {};
    let fecha = new Date();
    let nombreFecha = (fecha.getMonth() + 1) + "_" + fecha.getFullYear()

    option.fileName = 'profesores_' + nombreFecha; // nombre de archivo
    option.datas = [
      {
        sheetData: [], // datos
        sheetName: 'Profesores', // nombre de la hoja
        sheetHeader: ['Nombre', 'Apellido', 'Correo', 'Rut'], // encabezado de la primera fila
        //columnWidths: [20, 20] // el ancho de la columna debe corresponder al orden de la columna
      },
    ];
    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); // Guardar
  }

  const leerArchivo = (file) => {
    const reader = new FileReader();
    reader.onload = async (evt) => {
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
          if (element.includes(",") && element.split(',').length === 4) {
            let datos = element.split(',');
            let profesor = {
              id: '',
              nombre: datos[0],
              apellido: datos[1],
              correo: datos[2],
              rut: datos[3],
              contrasena: md5(datos[3]),
              modulos: [],
              eventos: []
            }

            crearProfesor(profesor).then(async () => {
              const teachersAux = await getProfesores();

              setTeachers(teachersAux);

            }).catch(() => {
              elementosNoGuardados = elementosNoGuardados + 1
            })

          }
          else {
            elementosNoGuardados = elementosNoGuardados + 1
          }

        }

      });
      if (elementosNoGuardados > 0) {
        setError("No se guardaron " + elementosNoGuardados + " elementos")
      }


    };
    reader.readAsBinaryString(file);
  }

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const updateUI = (newTeacher) => {
    setTeachers(prev => [...prev, newTeacher])
    setShowNewProfessorDialog(false);
  }

  const handleDelete = async (el) => {
    setTeachers(prev => [...prev].filter(t => t.rut !== el.rut));
    await eliminarProfesor(el.id);
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

  return (
    <Page title="MeAnoto">
      <Container>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Profesores
          </Typography>

          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={() => setShowNewProfessorDialog(true)}
          >
            Nuevo Profesor
          </Button>
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
                        Subir profesores desde archivo
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

        <ProfesoresTable teachers={teachers} onDelete={handleDelete} />

        <RegistrarProfesorDialog
          onClose={() => setShowNewProfessorDialog(false)}
          open={showNewProfessorDialog}
          onSave={updateUI}
        />

      </Container>
    </Page>
  );
}
