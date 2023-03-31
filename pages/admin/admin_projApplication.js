import * as React from 'react';
import {Card, CardContent,CardActions,Typography,Button, Snackbar, Alert, DialogContent, Container} from '@mui/material'
import BootstrapDialog from '@/components/BootstrapDialog';
import ProjCards from '@/components/projCard';


function ProjApplication(props){

    const projNum = props.num;

    const [openDialog, setOpenDialog] = React.useState(false);
    const [details,setDetails] = React.useState([]);
    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);

    const handleGetList =  async () => {
      const list = await props.cbs.getList("proj");
      console.log(list);
      setDetails(await Promise.all(list.map(async (item) => await props.cbs.getDetail("proj", item))));
      setOpenDialog(true);
    }

    const handleCloseDialog = async() => {
      setOpenDialog(false);
    }

    const handleAccept = async(id) =>{
      try{
        await props.cbs.approve("proj",id,details[id].info.projAddr,true);
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
        console.log(id,id,details[id].info.projAddr,false);
        await props.cbs.approve("proj",id,details[id].info.projAddr,false);
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
              Proj Application List
            </Typography>
            <Typography variant="h3" component="div">
              {projNum} 
            </Typography>
            <Typography variant="body2">
              maximum Length : 10
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" disabled={projNum==0} onClick={handleGetList}>View All</Button>
          </CardActions>
        </Card>
        {
          openDialog
          &&
          <BootstrapDialog
            onClose={handleCloseDialog}
            aria-labelledby="customized-dialog-title"
            open={openDialog}
          >
            <DialogContent dividers>
              <Container sx={{  display: "flex",  flexWrap: "wrap",}}>
                    {
                        details.map((item,index) => (
                            
                            <Card sx={{ maxWidth: 300 }}>
                                <CardContent>
                                    <ProjCards proj={item} />
                                </CardContent>
                                <CardActions>
                                    <Button onClick={()=>{handleAccept(index)}}>approve</Button>
                                    <Button onClick={()=>{handleDeny(index)}}>deny</Button>
                                </CardActions>
                            </Card>

                        ))
                    }
              </Container>
            </DialogContent>

          </BootstrapDialog>
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

  export default ProjApplication;