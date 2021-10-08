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
    DialogActions


} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';

export default function CardModulos({ modulo, setModulos, modulos }) {
    const user = "ADMIN";
    const { nombre, profesor, facultad, carrera, alumnos, id } = modulo;
    const [openCrearModulo, setOpenCrearModulo] = useState(false);

    const [estudiantes, setEstudiantes] = useState(['Macarena De Las Mercedes Parrau Gallardo', 'Jacqueline Farías López', "Luis Alfredo Arce Contreras", "Aladino Segundo Espinoza Saavedra", "Luis Rodríguez Alcina", "Eduardo Javier Aracena Ávalos", "Ramón Velásquez Cayupe", "Ximena Loreto Sánchez Figueroa", "Isabel Margarita Pérez Moore"]);

    const handleOpenModulo = () => setOpenCrearModulo(true);
    const handleCloseModulo = () => setOpenCrearModulo(false);
    return (
        <Card>

            <Box>
                <Grid container xs={12} md={12} spacing={2}>
                    <Grid item xs={10} md={10}>
                        {user === "ADMIN" && (
                            <div>
                                <IconButton
                                    onClick={() => { console.log(id) }}
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
                        {user === "ADMIN" && (
                            <div>
                                <IconButton
                                    onClick={() => { console.log(id) }}
                                    aria-label="delete"
                                    size="large"
                                    color="error"

                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
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
                            Alumnos: {alumnos}
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
                        {user === "ADMIN" && (
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
                <DialogContent dividers={"paper"}>
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
                                        {user === "ADMIN" && (
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
        </Card>
    );
}