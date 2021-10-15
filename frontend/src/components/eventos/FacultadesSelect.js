import React, {useState, useEffect, useCallback} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function FacultadesSelect() {
  const [facultades, setFacultades] = useState(
    [
      {
        _id: 123,
        nombre: "Ingeniería",
        carreras: [
          {
            _id: 546,
            nombre: "Ingeniería Civil en Computación",
            módulos: [
              {
                _id: 12332132,
                nombre: "COE"
              }
            ]
          }
        ]

      },
      {
        _id: 124,
        nombre: "Medicina",
        carreras: [
          {
            _id: 246,
            nombre: "Enfermería",
            módulos: [
              {
                _id: 2332135,
                nombre: "Anatomía"
              }
            ]
          }
        ]

      }
    ]
  );

  useEffect( () => {

  }, []);

  const [selected, setSelected] = useState(facultades[0]);

  const handleChange = (event) => {
    const { value } = event.target;
    console.log("value", value);
    const newSelection = facultades.find( f => f._id === value._id );
    console.log("newSelection", newSelection);
    setSelected(newSelection);
  };

  return(
    <Box mt={2} sx={{ minWidth: 120 }}>
      <FormControl fullWidth>

        <InputLabel id="demo-simple-select-label">Facultad</InputLabel>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selected}
          label={selected.nombre}
          onChange={handleChange}
        >
          { facultades.map( (f, idx) => (
            <MenuItem key={idx} value={f}>{f.nombre}</MenuItem>
          )) }
        </Select>
      </FormControl>
    </Box>
  );
}
