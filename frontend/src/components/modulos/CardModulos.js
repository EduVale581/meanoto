import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    CardActionArea,
    Grid,
    IconButton,
    CardContent,
    Button,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import Api from 'src/api/Api';
import { useUsuario } from 'src/context/usuarioContext';

export default function CardModulos({ modulo, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro, estudiantesEntrada }) {
    const { user, setUser, setCargandoUsuario, cargandoUsuario } = useUsuario();
    const { nombre, profesor, facultad, carrera, nro_alumnos, id, id_Profesor } = modulo;
    const [openCrearModulo, setOpenCrearModulo] = useState(false);
    const [openEditarCantidadAlumnos, setOpenEditarCantidadAlumnos] = useState(false);
    const [openAgregarEstudiante, setAgregarEstudiante] = useState(false);
    const [loadingEliminar, setLoadingEliminar] = useState(false);

    const [estudiantesTotal, setEstudiantesTotal] = useState([]);

    const [loadingEditar, setLoadingEditar] = useState(false);
    const [loadingAgregarEstudiante, setLoadingAgregarEstudiante] = useState(false);
    const [errorAgregarEstudiante, setErrorAgregarEstudiante] = useState(false);

    const [cantEstudiantes, setCantEstudiantes] = useState(nro_alumnos);

    const [profesores, setProfesores] = useState([]);
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(id_Profesor);

    const optionsArreglo = ['Option 1', 'Option 2'];

    const [valueAutoComplete, setValueAutoComplete] = useState(null);





    const [estudiantes, setEstudiantes] = useState(estudiantesEntrada);

    const handleOpenModulo = () => setOpenCrearModulo(true);
    const handleCloseModulo = () => setOpenCrearModulo(false);

    const handleOpenAgregarEstudiante = () => setAgregarEstudiante(true);
    const handleCloseAgregarEstudiante = () => {
        setValueAutoComplete(null)
        setAgregarEstudiante(false)
    };

    const handleOpenEditarEstudiantes = () => setOpenEditarCantidadAlumnos(true);
    const handleCloseEditarEstudiantes = () => {
        setCantEstudiantes(0)
        setOpenEditarCantidadAlumnos(false)
    };


    const agregarEstudiante = () => {
        setLoadingAgregarEstudiante(true)
        if (valueAutoComplete && valueAutoComplete.id) {
            let datos = {
                idEstudiante: valueAutoComplete.id,
                idModulo: id
            }

            Api.agregarModuloEstudiante(datos).then((data) => {
                if (data === 403 || data === 401) {
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem("user");
                    window.location.href = "/login"
                }
                else if (data === -1 || data === 300) {
                    setErrorAgregarEstudiante("Error en el servidor.")
                    setLoadingAgregarEstudiante(false)
                }
                else {
                    setLoadingAgregarEstudiante(false)
                    window.location.reload();


                }

            }).catch(() => {
                setLoadingAgregarEstudiante(false)

            })
        }
        else {
            setErrorAgregarEstudiante("Error en agregar estudiante.")
            setLoadingAgregarEstudiante(false)

        }
    };

    const guardarCantidadEstudiantes = async () => {
        const dato = Api.guardarCantidadEstudiantes(id, cantEstudiantes, profesorSeleccionado, setLoadingEditar, setOpenEditarCantidadAlumnos, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro)
        if (dato === 403 || dato === 401) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            window.location.href = "/login"
        }
        else if (dato === -1 || dato === 300) {

        }
        else {

        }
    };

    const handleChangeCantidadEstudiantes = (event) => {
        setCantEstudiantes(event.target.value);
    };

    const getProfesores = async () => {
        const data = await Api.getProfesores();
        if (data === 403 || data === 401) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            window.location.href = "/login"
        }
        else if (data === -1) {

        }
        else {
            setProfesores(data)

        }

    };
    const eliminarModulo = async () => {
        const data = Api.eliminarModulo(id, setLoadingEliminar, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro)
        if (data === 403 || data === 401) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            window.location.href = "/login"
        }
        else if (data === -1 || data === 300) {

        }
        else {

        }
    };

    const handleChangeProfesorSeleccionado = (event) => {
        setProfesorSeleccionado(event.target.value);
    };

    useEffect(() => {
        getProfesores();

    }, []);

    useEffect(() => {
        Api.getEstudiantesModulos().then((data) => {
            if (data === 403 || data === 401) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"
            }
            else if (data === -1 || data === 300) {

            }
            else {
                setEstudiantesTotal(data)

            }

        }).catch(() => {

        })

    }, []);

    return (
        <Card>

            <Box>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={10} md={10}>
                        {!cargandoUsuario && user && user.tipo_usuario !== "ADMIN" && user.tipo_usuario !== "PROFESOR" && user.tipo_usuario !== "OPERATIVO" ? (
                            <div>
                            </div>
                        ) : (
                            <div>
                                <IconButton
                                    onClick={handleOpenEditarEstudiantes}
                                    aria-label="delete"
                                    size="large"
                                >
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </div>
                        )
                        }

                    </Grid>
                    <Grid item xs={2} md={2} >
                        {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
                            <div>
                                <LoadingButton
                                    loading={loadingEliminar}
                                    onClick={eliminarModulo}
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
                    onClick={handleOpenModulo}
                >

                    <Stack sx={{ p: 2 }}>


                        <Typography variant="h5" noWrap>
                            {nombre}
                        </Typography>


                        <Typography component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',

                            }}>
                            Profesor (a): {profesor}
                        </Typography>

                        <Typography component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',

                            }}>
                            Carrera: {carrera}
                        </Typography>

                        <Typography component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled'
                            }}>
                            Facultad: {facultad}
                        </Typography>

                        <Typography component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled'
                            }}>
                            Alumnos: {nro_alumnos}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>


            <Dialog
                open={openAgregarEstudiante}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                        Agregar Estudiante
                    </Typography>


                </DialogTitle>
                <DialogContent>
                    <Autocomplete
                        style={{ marginTop: "10px" }}
                        value={valueAutoComplete}
                        onChange={(event, newValue) => {
                            console.log(newValue)
                            setValueAutoComplete(newValue);
                        }}
                        getOptionLabel={(option) => option.nombre + " " + option.apellido}
                        id="controllable-states-demo"
                        options={estudiantesTotal}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Estudiante" />}
                    />
                </DialogContent>
                {errorAgregarEstudiante && <Alert severity="error">{errorAgregarEstudiante}</Alert>}
                <DialogActions>
                    <Button onClick={handleCloseAgregarEstudiante} color="secondary">Cerrar</Button>
                    <LoadingButton
                        onClick={agregarEstudiante}
                        color="primary"
                        loading={loadingAgregarEstudiante}
                    >
                        Agregar

                    </LoadingButton>


                </DialogActions>
            </Dialog>
            <Dialog
                open={openCrearModulo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                scroll={"paper"}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    <Stack>
                        <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                            Estudiantes
                        </Typography>
                        {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
                            <ListItem autoFocus button onClick={handleOpenAgregarEstudiante}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Agregar Estudiante" />


                            </ListItem>
                        )}
                    </Stack>

                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                {estudiantes && estudiantes.map((estud, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={estud.nombre + " " + estud.apellidos} />
                                        {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
                                            <IconButton
                                                onClick={() => {
                                                    let datos = {
                                                        idModulo: id,
                                                        idEstudiante: estud.id
                                                    }
                                                    Api.eliminarModuloEstudiante(datos).then((data) => {
                                                        console.log(data)
                                                        if (data === 403 || data === 401) {
                                                            window.localStorage.removeItem("token");
                                                            window.localStorage.removeItem("user");
                                                            window.location.href = "/login"
                                                        }
                                                        else if (data === -1 || data === 300) {

                                                        }
                                                        else {
                                                            window.location.reload();

                                                        }

                                                    }).catch(() => {

                                                    })

                                                }}
                                                aria-label="delete"
                                                size="large"
                                                color="error"

                                            >
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        )}

                                    </ListItem>
                                ))}


                            </Grid>


                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModulo} color="secondary">Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditarCantidadAlumnos}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    <Stack>
                        <Typography variant="h5" noWrap style={{ paddingLeft: 10 }}>
                            Editar Cantidad Estudiantes
                        </Typography>
                    </Stack>

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Cantidad Estudiantes"
                                    variant="outlined"
                                    fullWidth
                                    value={cantEstudiantes}
                                    onChange={handleChangeCantidadEstudiantes}
                                />
                            </Grid>

                            {!cargandoUsuario && user && user.tipo_usuario === "ADMIN" && (
                                <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Profesor</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            value={profesorSeleccionado}
                                            label="Profesor"
                                            onChange={handleChangeProfesorSeleccionado}
                                        >
                                            {profesores.map((e, idx) => {
                                                return (<MenuItem key={"profesores_" + idx} value={e.id}>{e.nombreCompleto}</MenuItem>)

                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>)
                            }


                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        onClick={handleCloseEditarEstudiantes}
                        loading={loadingEditar}
                    >
                        Cerrar
                    </LoadingButton>
                    <LoadingButton
                        onClick={guardarCantidadEstudiantes}
                        loading={loadingEditar}
                        variant="contained"
                    >
                        Editar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
