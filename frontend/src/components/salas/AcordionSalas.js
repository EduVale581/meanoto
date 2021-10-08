import { Typography, Grid, ListItem, ListItemText, Divider,IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';

export default function AcordionSalas({ sala, setSalas, salas }) {
    const user = "ADMIN";
    const { nombre,
        aforo,
        facultad,
        disponibilidad, 
        aforoActual,
        nombreEvento} = sala;
    return (
        <Grid>
            <ListItem alignItems="flex-start"
                secondaryAction={
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>   
                
              }>
                
                <ListItemText
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
                        {nombreEvento+" "}
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
                
            </ListItem>
            <Divider variant="inset" component="li" />
        </Grid>
    );    
}