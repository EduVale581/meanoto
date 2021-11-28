import React from "react";
import {
    Alert,
    IconButton
} from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
export default function Alerta({ variante, mensaje, setOpen }) {

    return <Alert
        action={
            <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setOpen(false);
                }}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>
        }
        severity={variante}>
        {mensaje}
    </Alert>
}