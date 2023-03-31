import * as React from 'react';
import { Snackbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,DialogTitle} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function DevRegisterDialog(props){

    const state = props.state;
    const cb = props.cb;

    const [open, setOpen] = React.useState(false);
    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
    setOpen(false);
    };

    const handleCloseS = () => {
        setOpenS(false);
    }

    const handleCloseE = () => {
        setOpenE(false);
    }

    const handleSubmit =  async () => {
        try {
            await cb();
            handleClose();
            setOpenS(true);
        }catch (error){
            handleClose();
            console.log(error);
            setOpenE(true);
        }
    }

    return (
    <div>
        {
        state.login
        &&
        !state.header.isDev
        &&
        (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                You are not a dev.... Register Here...
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>DevRegister</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you prepared for being a dev?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Register</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                <Alert onClose={handleCloseS} severity="success" sx={{ width: '100%' }}>
                    Register Success. Please wait...
                </Alert>
            </Snackbar>
            <Snackbar open={openE} autoHideDuration={6000} onClose={handleCloseE}>
                <Alert onClose={handleCloseE} severity="error" sx={{ width: '100%' }}>
                    Register Failed... 
                </Alert>
            </Snackbar>            
        </div >
        )
        }
    </div>
    )

}
