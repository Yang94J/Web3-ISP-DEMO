import * as React from 'react';

import ProjCards from '@/components/projCard';
import {Card, CardActions, CardContent , Container, Typography, Button, Alert, Snackbar} from '@mui/material';
import ProgressLabelBar from '@/components/progressLabelBar';

export default function devProjs(props){

    const projList = props.proj;
    console.log(projList);

    const [projDetails, setProjDetails] = React.useState([]);
    const [registeredProj,setRegisteredProj] =  React.useState([]);
    const [submitProj,setSubmitProj] =  React.useState([]);
    const [approvedProj,setApprovedProj] = React.useState([]);

    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);
    
    const handleCloseS = () => {
        setOpenS(false);
    }
  
    const handleCloseE = () => {
          setOpenE(false);
    }

    React.useEffect(() => {
        async function render() {
            setProjDetails(await Promise.all(projList.map(async (item) => await props.cbs.getProj(item)))); 
        }
        render();
    }, [projList]);

    React.useEffect(()=>{
        async function filter() {
            setRegisteredProj(projDetails.filter((item) => item.info.projState == '1'));
            setSubmitProj(projDetails.filter((item) => item.info.projState == '2'));
            setApprovedProj(projDetails.filter((item) => item.info.projState == '3'));
        }
        filter();
    },[projDetails]);




    const submit = async (projAddr) => {
        try {
            console.log(projAddr);
            await props.cbs.submit(projAddr);
            setOpenS(true);
        } catch (error) {
            console.log(error);
            setOpenE(true);
        }
        await props.cbs.refresh();
    }

    return (
        <div>
            {
                <div style={{marginTop : 5}}>
                    <Typography variant="h5"> Registered Project : {registeredProj.length}</Typography>
                    <Container sx={{  display: "flex",  flexWrap: "wrap",}}>
                    {
                        registeredProj.map((item,index) => (
                            
                            <Card key={index} sx={{ maxWidth: 300 , marginTop: 3, marginLeft : 3}}>
                                <CardContent>
                                    <ProjCards proj={item} />
                                </CardContent>
                                <CardActions>
                                    <Button onClick={()=>{submit(item.info.projAddr)}}>Submit</Button>
                                </CardActions>
                            </Card>

                        ))
                    }
                    </Container>
                    <hr style={{ borderTop: '4px solid red' }} />
                </div>
            }

            {
                <div style={{marginTop:5}}>
                    <Typography variant="h5"> Submitted Project : {submitProj.length}</Typography>
                    <Container sx={{  display: "flex",  flexWrap: "wrap",}}>
                    {
                        submitProj.map((item,index) => (
                            
                            <Card key={index} sx={{ maxWidth: 300 , marginTop: 3, marginLeft : 3}}>
                                <CardContent>
                                    <ProjCards proj={item} />
                                    <Typography variant="h6"> Wait Approval</Typography>
                                </CardContent>
                            </Card>

                        ))
                    }
                    </Container>
                    <hr style={{ borderTop: '4px solid red' }} />
                </div>
            }

            {
                <div style={{marginTop:5}}>
                    <Typography variant="h5"> Approved Project : {approvedProj.length}</Typography>
                    <Container sx={{  display: "flex",  flexWrap: "wrap",}}>
                    {
                        approvedProj.map((item,index) => (
                            
                            <Card key={index} sx={{ maxWidth: 300 , marginTop: 3, marginLeft : 3}}>
                                    <CardContent>
                                    <ProjCards proj={item} />
                                    <ProgressLabelBar value={item.funding.donationAmount*100/item.funding.requireAmount} text={"funding : "+item.funding.donationAmount + "/" + item.funding.requireAmount}/>
                                    <Typography> Expire Date :  {item.funding.duration}</Typography>
                                    <Typography> Expected Reward Rate : {Math.round((item.funding.reflectionAmount *100 / item.funding.donationAmount))}%</Typography>
                                </CardContent>
                            </Card>
                        )
                        )
                    }
                    </Container>
                    <hr style={{ borderTop: '4px solid red' }} />
                </div>
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