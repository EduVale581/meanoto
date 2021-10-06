import { Box, Card, Typography, Stack, CardActionArea, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function CardModulos({ modulo, setModulos, modulos }) {
    const user = "ADMIN";
    const { nombre,
        profesor,
        facultad,
        carrera, alumnos, id } = modulo;
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
            </CardActionArea>
        </Card>
    );
}