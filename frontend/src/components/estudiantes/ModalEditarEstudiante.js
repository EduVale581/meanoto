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
import Alerta from "../Alerta"
import { LoadingButton } from '@mui/lab';

export default function ModalEditarEstudiante({ open, setOpen, estudiante, setEstudiante, setEstudiantes }) {
    const [facultades, setFacultades] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [facultadSeleccionada, setFacultadSeleccionada] = useState("Sin Facultad");
    const [carreraSeleccionada, setCarreraSeleccionada] = useState("Sin Carrera");
    const [moduloSeleccionado, setModuloSeleccionado] = useState("Sin Módulo");
    const [modulos, setModulos] = useState([]);
    const [modulosDisponibles, setModulosDisponible] = useState([]);
    const [modulosAlumno, setModulosAlumno] = useState([]);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState("");
    const [varianteAlerta, setVarianteAlerta] = useState("");
    const [botonCerrar, setBotonCerrar] = useState(false);

    const handleClose = () => {
        setBotonCerrar(true);
        Api.getEstudiantes().then((respuesta) => {
            if (respuesta === 403 || respuesta === 401) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"

            }
            else if (respuesta === 300 || respuesta === -1) {

            }
            else {
                setEstudiantes(respuesta)

            }


        })
        setBotonCerrar(false)
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

    }, [estudiante])

    useEffect(() => {
        setModulosAlumno(estudiante.modulos)

    }, [estudiante])

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
                    <Grid item xs={5} >
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
                    <Grid item xs={5}>
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
                                    return <MenuItem key={"carreras_" + el} value={elemento.nombre}>{elemento.nombre}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            onClick={async () => {
                                console.log("hola")

                                let facultadObtenida = facultades.filter((e) => e.nombre === facultadSeleccionada)[0];
                                let carreraObtenida = carreras.filter((e) => e.nombre === carreraSeleccionada)[0];

                                let idFacutad = "";
                                let idCarrera = "";

                                if (facultadObtenida) {
                                    idFacutad = facultadObtenida.id;

                                }

                                if (carreraObtenida) {
                                    idCarrera = carreraObtenida.id;

                                }

                                const data = await Api.actualizarCarreraFacultad(estudiante.id, idFacutad, idCarrera)
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
                                    setMensajeAlerta("Error en el servidor");
                                    setVarianteAlerta("error");
                                    setMostrarAlerta(true)

                                }
                                else if (data === -1) {
                                    setMensajeAlerta("Error en el servidor");
                                    setVarianteAlerta("error");
                                    setMostrarAlerta(true)

                                }
                                else {
                                    setMensajeAlerta("Datos actualizados con éxito");
                                    setVarianteAlerta("success");
                                    setMostrarAlerta(true)

                                }


                            }}
                        >
                            Modificar
                        </Button>
                    </Grid>

                </Grid>

                <Grid container style={{ marginTop: "10px" }}>
                    <Grid item xs={10} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label3">Módulos</InputLabel>
                            <Select
                                labelId="demo-simple-select-label3"
                                value={moduloSeleccionado}
                                label="Módulos"
                                onChange={handleChangeModulos}
                            >
                                <MenuItem value={"Sin Módulo"}>Sin Módulo</MenuItem>
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
                                    setMensajeAlerta("El módulos ya existe");
                                    setVarianteAlerta("info");
                                    setMostrarAlerta(true)

                                }
                                else {
                                    if (moduloSeleccionado === "Sin Módulo") {
                                        setMensajeAlerta("Se debe seleccionar un módulo");
                                        setVarianteAlerta("info");
                                        setMostrarAlerta(true)

                                    }
                                    else {
                                        let nuevoModulos = modulosDisponibles.filter((e) => e.nombre === moduloSeleccionado)[0]



                                        modulosAlumno.push({
                                            nombre: nuevoModulos.nombre,
                                            id: nuevoModulos.id,
                                            id_profesor: nuevoModulos.id_Profesor,
                                            profesor: nuevoModulos.profesor
                                        })

                                        let modulosID = []

                                        if (Array.isArray(modulosAlumno)) {
                                            modulosAlumno.forEach(element => {
                                                modulosID.push(element.id)
                                            });
                                        }



                                        Api.actualizarModuloEstudiante(estudiante.id, modulosID).then((data) => {
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
                                                setMensajeAlerta("Error en el servidor");
                                                setVarianteAlerta("error");
                                                setMostrarAlerta(true)

                                            }
                                            else if (data === -1) {
                                                setMensajeAlerta("Error en el servidor");
                                                setVarianteAlerta("error");
                                                setMostrarAlerta(true)

                                            }
                                            else {
                                                Api.obtenerEstudiante(estudiante.id).then((data2) => {
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
                                                    else if (data2 === 300) {
                                                        setMensajeAlerta("Error en el servidor");
                                                        setVarianteAlerta("error");
                                                        setMostrarAlerta(true)

                                                    }
                                                    else if (data2 === -1) {
                                                        setMensajeAlerta("Error en el servidor");
                                                        setVarianteAlerta("error");
                                                        setMostrarAlerta(true)

                                                    }
                                                    else {
                                                        setMensajeAlerta("Datos actualizados");
                                                        setVarianteAlerta("success");
                                                        setMostrarAlerta(true)
                                                        setEstudiante(data2)

                                                    }

                                                }).catch(() => {
                                                    setMensajeAlerta("Error en el servidor");
                                                    setVarianteAlerta("error");
                                                    setMostrarAlerta(true)
                                                });

                                            }


                                        }).catch(() => {
                                            setMensajeAlerta("Error en el servidor");
                                            setVarianteAlerta("error");
                                            setMostrarAlerta(true)

                                        })

                                    }


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
                                <TableCell>Módulo</TableCell>
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
                                                let existe = modulosAlumno.filter((e) => e.nombre !== row.nombre)
                                                let modulosID = []

                                                if (Array.isArray(existe)) {
                                                    existe.forEach(element => {
                                                        modulosID.push(element.id)

                                                    });
                                                }

                                                Api.actualizarModuloEstudiante(estudiante.id, modulosID).then((data) => {
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
                                                        setMensajeAlerta("Error en el servidor");
                                                        setVarianteAlerta("error");
                                                        setMostrarAlerta(true)

                                                    }
                                                    else if (data === -1) {
                                                        setMensajeAlerta("Error en el servidor");
                                                        setVarianteAlerta("error");
                                                        setMostrarAlerta(true)

                                                    }
                                                    else {
                                                        Api.obtenerEstudiante(estudiante.id).then((data2) => {
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
                                                            else if (data2 === 300) {
                                                                setMensajeAlerta("Error en el servidor");
                                                                setVarianteAlerta("error");
                                                                setMostrarAlerta(true)

                                                            }
                                                            else if (data2 === -1) {
                                                                setMensajeAlerta("Error en el servidor");
                                                                setVarianteAlerta("error");
                                                                setMostrarAlerta(true)

                                                            }
                                                            else {
                                                                setMensajeAlerta("Datos actualizados con éxito");
                                                                setVarianteAlerta("success");
                                                                setMostrarAlerta(true)
                                                                setEstudiante(data2)

                                                            }

                                                        }).catch(() => {
                                                            setMensajeAlerta("Error en el servidor");
                                                            setVarianteAlerta("error");
                                                            setMostrarAlerta(true)
                                                        });

                                                    }


                                                }).catch(() => {
                                                    setMensajeAlerta("Error en el servidor");
                                                    setVarianteAlerta("error");
                                                    setMostrarAlerta(true)

                                                })



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
                <LoadingButton
                    onClick={handleClose}
                    loading={botonCerrar}
                >
                    Cerrar
                </LoadingButton>
            </DialogActions>
            {mostrarAlerta && <Alerta variante={varianteAlerta} mensaje={mensajeAlerta} setOpen={setMostrarAlerta} />}
        </Dialog >
    );
}