import { Box, LinearProgress,Typography } from "@mui/material";

export default function progressLabelBar(props){
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '25%', mr: 1 }}>
            <LinearProgress variant="determinate" value={props.value} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
            {props.text}</Typography>
          </Box>
        </Box>
      );
}
