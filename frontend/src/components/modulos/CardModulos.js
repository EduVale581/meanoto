import React, { useState } from 'react';
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
    TextField
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';

const API = "http://127.0.0.1:8000";

export default function CardModulos({ modulo, getModulos }) {
    const user = "Admin";
    const { nombre, profesor, facultad, carrera, nro_alumnos, id } = modulo;
    const [openCrearModulo, setOpenCrearModulo] = useState(false);
    const [openEditarCantidadAlumnos, setOpenEditarCantidadAlumnos] = useState(false);
    const [loadingEliminar, setLoadingEliminar] = useState(false);

    const [cantEstudiantes, setCantEstudiantes] = useState(nro_alumnos);



    const [estudiantes, setEstudiantes] = useState(['Macarena De Las Mercedes Parrau Gallardo', 'Jacqueline Farías López', "Luis Alfredo Arce Contreras", "Aladino Segundo Espinoza Saavedra", "Luis Rodríguez Alcina", "Eduardo Javier Aracena Ávalos", "Ramón Velásquez Cayupe", "Ximena Loreto Sánchez Figueroa", "Isabel Margarita Pérez Moore"]);

    const handleOpenModulo = () => setOpenCrearModulo(true);
    const handleCloseModulo = () => setOpenCrearModulo(false);

    const handleOpenEditarEstudiantes = () => setOpenEditarCantidadAlumnos(true);
    const handleCloseEditarEstudiantes = () => {
        setCantEstudiantes(0)
        setOpenEditarCantidadAlumnos(false)
    };

    const guardarCantidadEstudiantes = async () => {
        let nro_alumnos = cantEstudiantes;

        const res = await fetch(`${API}/modulos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nro_alumnos,
            }),
        });
        const data = await res.json();
        getModulos();
        setOpenEditarCantidadAlumnos(false)
    };

    const handleChangeCantidadEstudiantes = (event) => {
        setCantEstudiantes(event.target.value);
    };
    return (
        <Card>

            <Box>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={10} md={10}>
                        {user !== "Admin" && user !== "Profesor" ? (
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
                        {user === "Admin" && (
                            <div>
                                <LoadingButton
                                    loading={loadingEliminar}
                                    onClick={async () => {
                                        setLoadingEliminar(true);
                                        const res = await fetch(`${API}/modulos/${id}`, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        });
                                        const data = await res.json();
                                        getModulos();
                                        setLoadingEliminar(false);
                                    }}
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
                        {user === "Admin" && (
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

                                {estudiantes.map((email, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={email} />
                                        {user === "Admin" && (
                                            <IconButton
                                                onClick={() => { console.log(id) }}
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


                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditarEstudiantes} color="secondary">Cerrar</Button>
                    <Button onClick={guardarCantidadEstudiantes} color="primary" variant="contained">Editar</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
