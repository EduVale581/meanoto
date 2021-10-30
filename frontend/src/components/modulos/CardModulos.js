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
    const [loadingEliminar, setLoadingEliminar] = useState(false);

    const [loadingEditar, setLoadingEditar] = useState(false);

    const [cantEstudiantes, setCantEstudiantes] = useState(nro_alumnos);

    const [profesores, setProfesores] = useState([]);
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(id_Profesor);



    const [estudiantes, setEstudiantes] = useState(estudiantesEntrada);

    const handleOpenModulo = () => setOpenCrearModulo(true);
    const handleCloseModulo = () => setOpenCrearModulo(false);

    const handleOpenEditarEstudiantes = () => setOpenEditarCantidadAlumnos(true);
    const handleCloseEditarEstudiantes = () => {
        setCantEstudiantes(0)
        setOpenEditarCantidadAlumnos(false)
    };

    const guardarCantidadEstudiantes = async () => {
        const dato = Api.guardarCantidadEstudiantes(id, cantEstudiantes, profesorSeleccionado, setLoadingEditar, setOpenEditarCantidadAlumnos, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro)
        if (dato === 403 || dato === 401) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            window.location.href = "/login"
        }
        else if (dato === -1) {

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
        else if (data === -1) {

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


    async function obtenerUsuarioNull() {
        if (!user) {
            const token = window.localStorage.getItem("token");
            const idUsuario = window.localStorage.getItem("user");
            const data = await Api.cargarUsuario(token, idUsuario);


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
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"

            }
            else {
                setUser(data);
                setCargandoUsuario(false);
            }

        }


    }

    obtenerUsuarioNull()
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
                            <ListItem autoFocus button>
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
                                                onClick={() => { console.log(estud.id) }}
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
