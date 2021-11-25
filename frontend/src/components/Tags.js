import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Tags(props) {
  const { label, onSelect, options, placeholder, labeledProperty } = props;

  const handleChange = (e, data) => {
    onSelect(data);
  };

  return (
      <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        getOptionLabel={(option) => option[labeledProperty]}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label}
            placeholder={placeholder}
          />
        )}
      />
  );
}
