import * as React from 'react';
import { Snackbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,DialogTitle} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function userRegisterDialog(props){

    const state = props.state;
    const cb = props.cb;

    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState('');
    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);

    const handleTextFieldChange = (event) => {
        setText(event.target.value);
      }

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
            await cb(text);
            setOpenS(true);
        }catch (error){
            console.log(error);
            setOpenE(true);
        }
        setOpen(false);
    }

    return (
        <div>
          {
            state!=undefined
            &&
            state.login
            &&
            !state.header.isUser
            &&
            (
            <div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Register to be an User
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>userRegister</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Input your Description.
                        </DialogContentText>
                        <TextField
                            required
                            id="user-register"
                            label="Required"
                            value={text} 
                            onChange={handleTextFieldChange} 
                        />
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