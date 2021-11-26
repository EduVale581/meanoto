import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material'
import Api from 'src/api/Api';

export default function ModalEditarEstudiante({ open, setOpen, estudiante, setEstudiantes }) {
    const [facultades, setFacultades] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [facultadSeleccionada, setFacultadSeleccionada] = useState("Sin Facultad");
    const [carreraSeleccionada, setCarreraSeleccionada] = useState("Sin Carrera");
    const [moduloSeleccionado, setModuloSeleccionado] = useState("Sin Modulo");
    const [modulos, setModulos] = useState([]);
    const [modulosDisponibles, setModulosDisponible] = useState([]);
    const [modulosAlumno, setModulosAlumno] = useState(estudiante && estudiante.modulos && estudiante.modulos);
    console.log(estudiante)
    const guardar = () => {
        let facultadMostrar = ""
        if (facultadSeleccionada !== "Sin Facultad") {
            facultadMostrar = facultadSeleccionada

        }

        let carreraMostrar = ""
        if (carreraSeleccionada !== "Sin Carrera") {
            carreraMostrar = carreraSeleccionada

        }
        let datos = {
            modulos: modulosAlumno,
            carrera: carreraMostrar,
            facultad: facultadMostrar,
            idEstudiante: estudiante.id
        }
        console.log(datos)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeFacultad = (event) => {
        let facultadObtenida = facultades.filter((e) => e.nombre === event.target.value)[0];

        setFacultadSeleccionada(event.target.value);
        setCarreras(facultadObtenida.carreras)
        let facultadBuscar = event.target.value
        if (facultadBuscar !== "Sin Facultad" && carreraSeleccionada !== "Sin Carrera") {


            let modulosDisponibles = modulos.filter((e) => e.facultad === facultadBuscar && e.carrera === carreraSeleccionada);
            setModulosDisponible(modulosDisponibles);

        }
        else {
            setModulosDisponible([])
        }
    };

    const handleChangeCarrera = (event) => {
        setCarreraSeleccionada(event.target.value);
        let carreraBuscar = event.target.value
        if (facultadSeleccionada !== "Sin Facultad" && carreraBuscar !== "Sin Carrera") {

            let modulosDisponibles = modulos.filter((e) => e.facultad === facultadSeleccionada && e.carrera === carreraBuscar);
            setModulosDisponible(modulosDisponibles);

        }
        else {
            setModulosDisponible([])
        }
    };
    const handleChangeModulos = (event) => {
        setModuloSeleccionado(event.target.value);
    };


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

                if (Array.isArray(data)) {
                    let datosObtenido = data.filter((e) => e.nombre === estudiante.facultad)[0];
                    setCarreras(datosObtenido.carreras)
                    setFacultadSeleccionada(estudiante.facultad)
                    setCarreraSeleccionada(estudiante.carrera)
                }

            }



        }
        obtenerFacultad();

    }, [estudiante])

    useEffect(() => {
        async function obtenerModulos() {
            const data = await Api.getModulos2()
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
                if (estudiante.facultad === "" || estudiante.facultad === " " || estudiante.carrera === "" || estudiante.carrera === " ") {
                    setModulos(data)
                    setModulosDisponible(data)
                }
                else {
                    setModulos(data)
                    if (Array.isArray(data)) {

                        let modulosDisponibles = data.filter((e) => e.facultad === estudiante.facultad && e.carrera === estudiante.carrera);
                        setModulosDisponible(modulosDisponibles);

                    }



                }


            }



        }
        obtenerModulos();

    }, [])

    return (
        <Dialog
            fullWidth
            maxWidth={"md"}
            open={open}
        >
            <DialogTitle id="alert-dialog-title">
                Editar Estudiante
            </DialogTitle>
            <DialogContent>
                <Grid container style={{ marginTop: "10px" }}>
                    <Grid item xs={6} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Facultades</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={facultadSeleccionada}
                                label="Facultades"
                                onChange={handleChangeFacultad}
                            >
                                <MenuItem value={"Sin Facultad"}>Sin Facultad</MenuItem>
                                {facultades && facultades.map((elemento, el) => {
                                    return <MenuItem key={"facultad_" + el} value={elemento.nombre}>{elemento.nombre}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label2">Carreras</InputLabel>
                            <Select
                                labelId="demo-simple-select-label2"
                                value={carreraSeleccionada}
                                label="Carreras"
                                onChange={handleChangeCarrera}
                            >
                                <MenuItem value={"Sin Carrera"}>Sin Carrera</MenuItem>
                                {carreras && carreras.map((elemento, el) => {
                                    return <MenuItem key={"carreras_" + el} value={elemento}>{elemento}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>

                <Grid container style={{ marginTop: "10px" }}>
                    <Grid item xs={10} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label3">Modulos</InputLabel>
                            <Select
                                labelId="demo-simple-select-label3"
                                value={moduloSeleccionado}
                                label="Modulos"
                                onChange={handleChangeModulos}
                            >
                                <MenuItem value={"Sin Modulo"}>Sin Modulo</MenuItem>
                                {modulosDisponibles && modulosDisponibles.map((elemento, el) => {
                                    return <MenuItem key={"modulos_" + el} value={elemento.nombre}>{elemento.nombre}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            onClick={() => {
                                let existe = modulosAlumno.filter((e) => e.nombre === moduloSeleccionado)[0]
                                if (existe) {

                                }
                                else {
                                    let nuevoModulos = modulosDisponibles.filter((e) => e.nombre === moduloSeleccionado)[0]



                                    modulosAlumno.push({
                                        nombre: nuevoModulos.nombre,
                                        id: nuevoModulos.id,
                                        id_profesor: nuevoModulos.id_Profesor,
                                        profesor: nuevoModulos.profesor
                                    })
                                    setModulosAlumno(modulosAlumno)

                                }

                            }}
                        >
                            Agregar
                        </Button>
                    </Grid>

                </Grid>

                <TableContainer component={Paper} style={{ marginTop: "10px" }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Modulo</TableCell>
                                <TableCell align="right">Profesor</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modulosAlumno && modulosAlumno.map((row, idx) => (
                                <TableRow
                                    key={"tablaAlumno_" + idx}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.nombre}
                                    </TableCell>
                                    <TableCell align="right">{row.profesor}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            fullWidth
                                            onClick={() => {
                                                let modulosAux = modulosAlumno.filter((e) => e.nombre !== row.nombre)
                                                setModulosAlumno(modulosAux)

                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={guardar}>Guardar</Button>
            </DialogActions>
        </Dialog >
    );
}