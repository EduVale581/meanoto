import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    CardActionArea,
    Grid,
    CardContent,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Api from 'src/api/Api';
import { useUsuario } from 'src/context/usuarioContext';

export default function CardFacultad({ facultades, setFacultades, facultad }) {
    const { user } = useUsuario();
    const [openEditarFacutad, setOpenEditarFacultad] = useState(false);
    const [carreras, setCarreras] = useState((facultad && facultad.carreras) ? facultad.carreras : []);
    const [loadingEliminar, setLoadingEliminar] = useState(false);
    const [mensajeAlertaEditar, setMensajeAlertaEditar] = useState(false);

    const [nombreCarrera, setNombreCarrera] = useState("");

    const [loadingEditar, setLoadingEditar] = useState(false);


    const handleOpenEditarFacultad = () => setOpenEditarFacultad(true);
    const handleCloseEditarFacultad = () => {
        setOpenEditarFacultad(false)
    };

    const handleChangeNombreCarrera = (event) => {
        setNombreCarrera(event.target.value)
    };

    const editarFacultad = async () => {
        setMensajeAlertaEditar(false)
        setLoadingEditar(true)
        if (nombreCarrera === "" || nombreCarrera === " ") {
            setMensajeAlertaEditar("Falta Completar el nombre de la carrera.")
            setLoadingEditar(false)

        }
        else {
            Api.crearCarrera(nombreCarrera, facultad.id).then((data) => {
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
                    setMensajeAlertaEditar("Error en el servidor.")
                    setLoadingEditar(false)

                }
                else if (data === 300) {
                    setMensajeAlertaEditar("Carrera ya existe en nuestros registros")
                    setLoadingEditar(false)

                }
                else {
                    console.log(data)
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
                            setLoadingEditar(false)

                        }
                        else if (data2 === 300) {
                            setLoadingEditar(false)

                        }
                        else {
                            setFacultades(data2)
                            setOpenEditarFacultad(false)
                            setLoadingEditar(false)
                        }

                    }).catch(() => {
                        setLoadingEditar(false)
                    });

                }



            }).catch(() => {
                setMensajeAlertaEditar("Error en el servidor.")
                setLoadingEditar(false)

            })

        }


    };


    const eliminarFacultad = async () => {
        setLoadingEliminar(true)
        Api.eliminarFacultad(facultad.id).then((data) => {
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
                setLoadingEliminar(false)

            }
            else if (data === 300) {
                setLoadingEliminar(false)

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
                        setLoadingEliminar(false)

                    }
                    else if (data2 === 300) {
                        setLoadingEliminar(false)

                    }
                    else {
                        setFacultades(data2)
                        setLoadingEliminar(false)
                    }

                }).catch(() => {
                    setLoadingEliminar(false)
                });

            }



        }).catch(() => {
            setLoadingEliminar(false)

        })

    };


    return (
        <Card>

            <Box>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={2} md={2} >
                        {user && user.tipo_usuario === "ADMIN" && (
                            <div>
                                <LoadingButton
                                    loading={loadingEliminar}
                                    onClick={eliminarFacultad}
                                    color="error"
                                    startIcon={<DeleteIcon fontSize="inherit" />}
                                />
                            </div>
                        )
                        }
                    </Grid>
                </Grid>
            </Box>
            <CardActionArea>
                <CardContent
                    onClick={handleOpenEditarFacultad}
                >

                    <Stack sx={{ p: 2 }}>


                        <Typography variant="h5" noWrap>
                            {facultad.nombre}
                        </Typography>


                        <Typography component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',

                            }}>
                            Carreras: {(facultad.carreras && Array.isArray(facultad.carreras)) ? facultad.carreras.length : 0}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>

            <Dialog
                open={openEditarFacutad}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    <Stack>
                        <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                            Editar Facultad
                        </Typography>
                    </Stack>

                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={12}>
                            <Grid container>
                                <Grid item xs={10} md={10}>
                                    <TextField
                                        style={{ marginTop: "10px" }}
                                        fullWidth
                                        label="Nombre Carrera"
                                        value={nombreCarrera}
                                        onChange={handleChangeNombreCarrera}

                                    />


                                </Grid>
                                <Grid item xs={2} md={2}>
                                    <LoadingButton
                                        style={{ marginTop: "10px" }}
                                        loading={loadingEditar}
                                        onClick={editarFacultad}
                                        variant="contained"
                                        fullWidth
                                    >
                                        Agregar
                                    </LoadingButton>


                                </Grid>


                            </Grid>


                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre Carrera</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {carreras && carreras.map((e, index) => {
                                            return (
                                                <TableRow
                                                    key={"tablaCarrera_" + index}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {e.nombre}
                                                    </TableCell>

                                                </TableRow>

                                            )
                                        })}


                                    </TableBody>
                                </Table>
                            </TableContainer>


                        </Grid>


                    </Grid>
                </DialogContent>
                {mensajeAlertaEditar && (<Alert severity="error">{mensajeAlertaEditar}</Alert>)}
                <DialogActions>
                    <LoadingButton
                        onClick={handleCloseEditarFacultad}
                        loading={loadingEditar}
                    >
                        Cerrar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
