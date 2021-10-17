import { Typography, 
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
    TextField
     } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';

export default function AcordionSalas({ sala, setSalas, salas }) {
    const user = "ADMIN";
    const { nombre,
        aforo,
        facultad,
        disponibilidad, 
        aforoActual,
        nombreEvento,
        fechaEvento, 
        nombreModulo, 
        profesor} = sala;

    const [openSala, setOpenSala] = useState(false);
    const [openEditarSala, setOpenEditarSala] = useState(false);
    const [openEliminarSala, setOpenEliminarSala] = useState( false);

    const handleOpenSala = () => setOpenSala(true);
    const handleCloseSala = () => setOpenSala(false);

    const handleOpenEditarSala = () => setOpenEditarSala(true);
    const handleCloseEditarSala = () => setOpenEditarSala(false);

    const handleOpenComfirmedEliminar = () => setOpenEliminarSala(true);
    const handleClosedComfirmedEliminar = () => setOpenEliminarSala(false);
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
                onClick={handleOpenSala}
                primary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h4"
                        color="text.primary"
                    >
                        {nombre}
                    </Typography>
                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h6"
                        color="text.primary"
                    >
                        {nombreEvento !== "" ? nombreEvento +" " : "Libre"+" "}
                    </Typography>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body1"
                        color={aforoActual > aforo ? "common.red" : "common.green"}
                    >
                        {aforoActual+"/"+aforo}
                    </Typography>
                   
                    </React.Fragment>
                }
                />
                <Grid
                    onClick={handleOpenSala}
                    container
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={4}
                    >
                    <Grid item>
                        
                    </Grid>
                    <Grid item>
                        <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    {facultad}
                                </Typography>
                        </React.Fragment>
                    </Grid>
                </Grid>    
                
                
            </ListItem>
            <Divider variant="inset" component="li" />
            <Dialog
                open={openSala}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                scroll={"paper"}
                fullWidth
            >
                
                <DialogContent dividers={true}>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="h4"
                                    color="text.primary"
                                >
                                    {"Nombre: "+nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    {"Facultad: "+facultad}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    {"Aforo: "+aforo}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    {"Estado: "+disponibilidad}
                                </Typography>
                            </Grid>
                        </Grid>
                        {disponibilidad === "Ocupado" &&(
                            <Grid container xs={12} spacing={2}>
                                <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="h4"
                                        color="text.primary"
                                    >
                                        {"Evento: "+nombreEvento}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        {"Fecha del evento: "+fechaEvento}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        {"Nombre del modulo: "+nombreModulo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        {"Profesor: "+profesor}
                                    </Typography>
                                </Grid>
                                
                            </Grid>
                        )}
                        
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSala} color="secondary">Cerrar</Button>
                </DialogActions>
            </Dialog>

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
                                    value={nombre}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Aforo"
                                    variant="outlined"
                                    fullWidth
                                    value={aforo}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ marginLeft: 10, marginTop: 10 }}>

                                <TextField
                                    label="Facultad"
                                    variant="outlined"
                                    fullWidth
                                    value={facultad}
                                />
                            </Grid>


                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOpenComfirmedEliminar} color="error">Eliminar</Button>
                    <Button onClick={handleCloseEditarSala} color="secondary">Cerrar</Button>
                    <Button onClick={handleCloseEditarSala} color="primary" variant="contained">Editar</Button>

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
                    <Button onClick={handleClosedComfirmedEliminar} color="error">Confirmar</Button>
                    <Button onClick={handleClosedComfirmedEliminar} color="primary" variant="contained"> Cancelar</Button>

                </DialogActions>
            </Dialog>
        </Grid>
    );    
}