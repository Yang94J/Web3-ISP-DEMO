import * as React from 'react';
import {Card, CardContent,CardActions,Typography,Button,DialogContent,DialogActions} from '@mui/material'
import {Table,TableContainer,TableBody,TableCell,TableHead,TableRow,Paper,Snackbar,Alert} from '@mui/material';
import BootstrapDialog from '@/components/BootstrapDialog';



function UserApplication(props){

    const userNum = props.num;

    const [openDialog, setOpenDialog] = React.useState(false);
    const [details,setDetails] = React.useState([]);
    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);
    
    const handleGetList =  async () => {
      const list = await props.cbs.getList("user");
      setDetails(await Promise.all(list.map(async (item) => await props.cbs.getDetail("user", item))));
      console.log(details[0]);
      setOpenDialog(true);
    }

    const handleCloseDialog = async() => {
      setOpenDialog(false);
    }

    const handleAccept = async(id) =>{
      try{
        await props.cbs.approve("user",id,details[id].investorAddress,true);
        setOpenS(true);
      }catch (error){
        console.log(error);
        setOpenE(true);
      }
      await handleCloseDialog();
      await props.cbs.reRender(props.acc);
    }

    const handleDeny = async(id) =>{
      try{
        console.log(id,details[id].investorAddress,false);
        await props.cbs.approve("user",id,details[id].investorAddress,false);
        setOpenS(true);
      }catch (error){
        console.log(error);
        setOpenE(true);
      }
      await handleCloseDialog();
      await props.cbs.reRender(props.acc);
    }

    const handleCloseS = () => {
      setOpenS(false);
  }

    const handleCloseE = () => {
        setOpenE(false);
    }

    return (
      <div style={{marginTop : 20, marginBottom : 20}}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              User Application List
            </Typography>
            <Typography variant="h3" component="div">
              {userNum} 
            </Typography>
            <Typography variant="body2">
              maximum Length : 10
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" disabled={userNum==0} onClick={handleGetList}>View all</Button>
          </CardActions>
        </Card>
        {
          openDialog
          &&
          (
            <BootstrapDialog
              onClose={handleCloseDialog}
              aria-labelledby="customized-dialog-title"
              open={openDialog}
            >
              <DialogContent dividers>
                <TableContainer component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>User user</TableCell>
                    <TableCell align="right">description</TableCell>
                    <TableCell align="right">RegisterTime</TableCell>
                    <TableCell align="right">Operation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((item,index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{item.investorAddress}</TableCell>
                      <TableCell align="right">{item.description}</TableCell>
                      <TableCell align="right">{item.registerTimestamp}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleAccept(index)}> Accept </Button>
                        <Button onClick={() => handleDeny(index)}> Deny </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleCloseDialog}>
                  close
                </Button>
            </DialogActions>
          </BootstrapDialog>
          )
        }
          <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
              <Alert onClose={handleCloseS} severity="success" sx={{ width: '100%' }}>
                  Operation Success
              </Alert>
          </Snackbar>
          <Snackbar open={openE} autoHideDuration={6000} onClose={handleCloseE}>
              <Alert onClose={handleCloseE} severity="error" sx={{ width: '100%' }}>
                  Operation Failed
              </Alert>
          </Snackbar>   
      </div>

    )
  }

  export default UserApplication;