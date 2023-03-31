import * as React from 'react';
import { Box, Typography, Grid, Slider, TextField} from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

export default function SliderInputBar(props) {
  
  const [value, setValue] = React.useState(0);

  const handleSliderChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
    props.cb(newValue);
  };

  const handleInputChange = (event) => {
    console.log(event.target.value);
    let newValue = event.target.value === '' ? '' : Number(event.target.value>props.max?props.max:event.target.value);
    setValue(newValue);
    props.cb(newValue);
  };


  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Donation
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <CurrencyBitcoinIcon />
        </Grid>
        <Grid item xs>
          <Slider
            sx={{ width: '50%', mr: 1 }}
            min={0}
            max={props.max}
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid>
          <TextField type="number" value={value} inputProps={{ min: 0 , max:props.max}} label="Donation" onChange={handleInputChange}/>
        </Grid>
      </Grid>
    </Box>
  );
}