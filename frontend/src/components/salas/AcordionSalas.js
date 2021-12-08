import {
    Typography,
    Grid,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    Stack,
    DialogContentText,
    DialogActions,
    DialogContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState, useEffect } from 'react';
import { useUsuario } from '../../context/usuarioContext';
import Api from "../../api/Api";

export default function AcordionSalas({ sala, setSalasMostrar, setSalasArreglo, salas }) {
    const { user } = useUsuario();
    const { nombre,
        aforo,
        facultad,
        estado,
        aforoActual,
        metrosCuadrados
    } = sala;
    const [openEditarSala, setOpenEditarSala] = useState(false);
    const [openEliminarSala, setOpenEliminarSala] = useState(false);

    const [error, setError] = useState(false);

    const [facultades, setFacultades] = useState([]);

    const [nombreSala, setNombreSala] = useState(nombre);
    const [aforoSala, setAforoSala] = useState(aforo);
    const [metrosCuadradoSala, setMetrosCuadradoSala] = useState(metrosCuadrados);
    const [facultadSala, setFacultadSala] = useState(facultad);
    const [estadoSala, setEstadoSala] = useState(estado);

    const handleChangeNombreSala = (event) => {
        setNombreSala(event.target.value)

    };

    const handleChangeAforoSala = (event) => {
        setAforoSala(event.target.value)

    };

    const handleChangeMetrosSala = (event) => {
        setMetrosCuadradoSala(event.target.value)

    };

    const handleChangeFacultadSala = (event) => {
        setFacultadSala(event.target.value)

    };

    const handleChangeEstadoSala = (event) => {
        setEstadoSala(event.target.value)

    };


    const handleOpenEditarSala = () => setOpenEditarSala(true);
    const handleCloseEditarSala = () => setOpenEditarSala(false);

    const modificarSala = async () => {
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
        else if (!facultadSala || facultadSala === "" || facultadSala === " ") {
            setError("Se debe seleccionar una facultad")

        }
        else {
            setError(false)
            let facultadObtenida = facultades.filter((e) => e.nombre === facultadSala)[0]
            let salaCrear = {
                id: sala.id,
                nombre: nombreSala,
                aforo: Number.parseInt(aforoSala),
                facultad: facultadObtenida.id,
                metrosCuadrados: Number.parseInt(metrosCuadradoSala),
                estado: estadoSala
            }
            const data = await Api.actualizarSala(salaCrear);
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
                    setOpenEditarSala(false)

                }

            }

        }

    };

    const eliminarSala = async () => {
        const data = await Api.eliminarSala(sala.id);
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

            }
            else {
                setSalasMostrar(data2)
                setSalasArreglo(data2)
                setOpenEliminarSala(false)
                setOpenEditarSala(false)


            }


        }

    };

    const handleOpenComfirmedEliminar = () => setOpenEliminarSala(true);
    const handleClosedComfirmedEliminar = () => setOpenEliminarSala(false);

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
        <Grid>
            <ListItem alignItems="flex-start"

                secondaryAction={
                    <IconButton edge="end"
                        aria-label="edit"
                        onClick={handleOpenEditarSala}>
                        <EditIcon />
                    </IconButton>

                }>

                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                variant="h4"
                                color="text.primary"
                            >
                                {nombre}
                            </Typography>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <Stack>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    variant="body1"
                                    color={aforoActual > aforo ? "common.red" : "common.green"}
                                >
                                    {aforoActual + "/" + aforo}
                                </Typography>
                                <Typography
                                    sx={{ display: 'inline' }}

                                    variant="body1"
                                    color="primary"
                                >
                                    {estado}
                                </Typography>
                                <Typography
                                    sx={{ display: 'inline' }}

                                    variant="body1"
                                    color="text.primary"
                                >
                                    {facultad}
                                </Typography>

                                <Typography
                                    sx={{ display: 'inline' }}

                                    variant="body1"
                                    color="text.primary"
                                >
                                    {metrosCuadrados + " m2"}
                                </Typography>

                            </Stack>


                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <Dialog
                open={openEditarSala}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle id="alert-dialog-title">
                    <Stack>
                        <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                            Modificar sala
                        </Typography>
                    </Stack>

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    value={nombreSala}
                                    onChange={handleChangeNombreSala}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Aforo"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={aforoSala}
                                    onChange={handleChangeAforoSala}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Metros Cuadrados"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={metrosCuadradoSala}
                                    onChange={handleChangeMetrosSala}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Facultades</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        value={facultadSala}
                                        onChange={handleChangeFacultadSala}
                                        label="Facultades"
                                    >
                                        <MenuItem value={"Sin Facultad"}>Sin Facultad</MenuItem>
                                        {facultades && facultades.map((elemento, el) => {
                                            return <MenuItem key={"facultad_" + el} value={elemento.nombre}>{elemento.nombre}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>

                            </Grid>

                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label2">Estado</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label2"
                                        value={estadoSala}
                                        onChange={handleChangeEstadoSala}
                                        label="Estado"
                                    >
                                        <MenuItem value={"DISPONIBLE"}>DISPONIBLE</MenuItem>
                                        <MenuItem value={"OCUPADA"}>OCUPADA</MenuItem>
                                        <MenuItem value={"EN MANTENCIÓN"}>EN MANTENCIÓN</MenuItem>
                                        <MenuItem value={"EN LIMPIEZA"}>EN LIMPIEZA</MenuItem>
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
                    <Button onClick={handleOpenComfirmedEliminar} color="error">Eliminar</Button>
                    <Button onClick={handleCloseEditarSala} color="secondary">Cerrar</Button>
                    <Button onClick={modificarSala} color="primary" variant="contained">Editar</Button>

                </DialogActions>
            </Dialog>
            <Dialog
                open={openEliminarSala}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    <Stack>
                        <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                            Confirmar eliminación
                        </Typography>
                    </Stack>

                </DialogTitle>
                <DialogActions>
                    <Button onClick={eliminarSala} color="error">Confirmar</Button>
                    <Button onClick={handleClosedComfirmedEliminar} color="primary" variant="contained"> Cancelar</Button>

                </DialogActions>
            </Dialog>
        </Grid >
    );
}