import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const minDistance = 5;

export default function RangeSlider() {

  const [value, setValue] = useState([20, 50]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <Box sx={{ width: 300 }}>

      <Grid container spacing={2} alignItems="center">

        <Grid item>
          <Typography>
            { value[0] }
          </Typography>
        </Grid>

        <Grid item xs>
          <Slider
            disableSwap
            getAriaLabel={() => 'Minimum distance'}
            max={250}
            onChange={handleChange}
            value={value}
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item>
          <Typography>
            { value[1] }
          </Typography>
        </Grid>

      </Grid >
    </Box>
  );
}






