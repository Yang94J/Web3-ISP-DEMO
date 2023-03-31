import * as React from 'react';
import { Switch, Box, Snackbar, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText,DialogTitle, Card, CardContent, CardActions} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import ContactsIcon from '@mui/icons-material/Contacts';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { margin } from '@mui/system';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function ProjectCreateFlow(props){

    const [open, setOpen] = React.useState(false);
    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);
    const [openERC20, setopenERC20] = React.useState(false);

    const [projAddr, setprojAddr] = React.useState('');
    const [projName, setprojName] = React.useState('');
    const [projDesc, setprojDesc] = React.useState('');
    const [isETH,setETH] = React.useState(true);
    const [ERC20,setERC20] = React.useState('');
    const [amount,setAmount] = React.useState(0);
    const [duration,setDuration] =  React.useState(0);



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

    const handleSubmit = async() => {
        console.log("submit");
        console.log(isETH);
        if (isETH){
            console.log(projAddr)
            setERC20(projAddr);
            console.log("change");
        }
        console.log(ERC20);
        try{       
            await props.cb(projAddr,projName,projDesc,isETH,ERC20,amount,duration);
            setOpenS(true);
        }catch (error){
            console.log(error);
            setOpenE(true);
        }
        setOpen(false);
    }


    return (
        <div>
            <Card style={{ minWidth :1200, display: "flex", justifyContent: "space-between", alignItems: "center" , backgroundColor: 'transparent'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                        You have <b>{props.proj.length}</b> project(s) in total
                    </Typography>                
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                        Create New Project
                    </Button>
                </CardActions>
            </Card>
            <Dialog  open={open} onClose={handleClose} PaperProps={{ sx: { maxWidth: "100000" } }}>
                <DialogContent>
                    <DialogContentText>
                        Please fill in necessary information
                    </DialogContentText>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop : 3}}>
                        <ContactsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="proj-addr" label="Project Address" variant="standard" onChange={(e) => setprojAddr(e.target.value)} />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end' , marginTop : 3}}>
                        <ArticleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="proj-name" label="Project Name" variant="standard" onChange={(e) => setprojName(e.target.value)}/>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end'  , marginTop : 3}}>
                        <InfoIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="proj-description" label="Project Description" variant="standard" onChange={(e) => setprojDesc(e.target.value)}/>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end'  , marginTop : 3}}>
                        <Typography style={{marginTop : 3}}>ERC20</Typography>
                        <Switch
                            inputProps={{ 'aria-label': 'ETH/ERC20' }}
                            onChange={(e) => {
                                setETH(!e.target.checked);
                                setopenERC20(e.target.checked);
                                console.log(isETH);
                                console.log(openERC20);
                            }}
                        />
                    </Box>

                    <Box sx={{ display: openERC20 ? 'flex' : 'none', alignItems: 'flex-end' , marginTop : 3 }}>
                        <ContactsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="erc20-addr" label="ERC20 Address" variant="standard" onChange={(e) => setERC20(e.target.value)}/>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end' , marginTop : 3}}>
                        <AttachMoneyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField type="number" inputProps={{ min: 0 }} label="Integer" onChange={(e) => setAmount(e.target.value)}/>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end' , marginTop : 3}}>
                        <AccessTimeIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField type="number" inputProps={{ min: 0 }} label="Duration" onChange={(e) => setDuration(e.target.value)}/>
                    </Box>        
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Register</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                    <Alert onClose={handleCloseS} severity="success" sx={{ width: '100%' }}>
                        Register Success. You can find it in the list for submit.
                    </Alert>
                </Snackbar>
                <Snackbar open={openE} autoHideDuration={6000} onClose={handleCloseE}>
                    <Alert onClose={handleCloseE} severity="error" sx={{ width: '100%' }}>
                        Register Failed... 
                    </Alert>
            </Snackbar>  
        </div>


    )


}
