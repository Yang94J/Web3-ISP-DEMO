
import * as React from 'react';

import ProjCards from '@/components/projCard';
import ProgressLabelBar from '@/components/progressLabelBar';
import SliderInputBar from '@/components/slideInputBar';
import { Typography,Container,Card, CardContent, CardActions, Snackbar, Alert, Button} from '@mui/material';

export default function investProjs(props){

    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);

    const handleCloseS = () => {
        setOpenS(false);
    }

    const handleCloseE = () => {
        setOpenE(false);
    }

    const [projDetails, setProjDetails] = React.useState([]);

    let donationProj = {};

    let counter = 0;

    React.useEffect(() => {
        async function render() {
            console.log("invest list rerendering")
            const totalIndList = Array.from({length: props.totalProj}, (_, i) => i );
            console.log(totalIndList);
            const tmpDetails = await Promise.all(totalIndList.map(async (item) => await props.cbs.getProj(item)));
            setProjDetails(tmpDetails.filter((item) => item.info.projState == '3'));
        }
        render();
    }, [props.totalProj,openS]);

    const setDonationValue = (id,value) => {
        donationProj[id] = value;
    }

    const invest= async (id) => {
        if (donationProj[id] === undefined){
            setOpenE(true);
        }else{
            await props.cbs.invest(
                projDetails[id],
                donationProj[id]
            );
            counter += 1;
            console.log(counter);
            setOpenS(true);
        }
    }

    return (
        <div>
            <Typography variant='h5'> Total available project : {projDetails.length}</Typography>
            
            <hr style={{ borderTop: '4px solid red' }} />
            
            {
                <div style={{marginTop : 50,}}>
                    <Container sx={{  display: "flex",  flexWrap: "wrap",}}>
                    {
                        projDetails.map((item,index) => (
                            
                            <Card sx={{ maxWidth: 300, marginLeft : 5, marginTop : 5}}>
                                <CardContent>
                                    <ProjCards proj={item} />
                                    <ProgressLabelBar value={item.funding.donationAmount*100/item.funding.requireAmount} text={"funding : "+ item.funding.donationAmount + "/" + item.funding.requireAmount}/>
                                    <Typography> Expire Date :  {item.funding.duration}</Typography>
                                    <Typography> Expected Reward Rate : {Math.round((item.funding.reflectionAmount *100 / item.funding.donationAmount))}%</Typography>
                                </CardContent>
                                <CardActions>
                                    <SliderInputBar  max={item.funding.requireAmount-item.funding.donationAmount} cb={(val) => {setDonationValue(index,val)}}/>
                                    <Button onClick={()=>{invest(index)}}> Invest</Button>
                                </CardActions>
                            </Card>
                        )
                        )
                    }
                    </Container>
                </div>
            }
            <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                <Alert onClose={handleCloseS} severity="success" sx={{ width: '100%' }}>
                    Operation Success
                </Alert>
            </Snackbar>
            <Snackbar open={openE} autoHideDuration={6000} onClose={handleCloseE}>
                <Alert onClose={handleCloseE} severity="error" sx={{ width: '100%' }}>
                    Operation Failure 
                </Alert>
            </Snackbar>   
        </div>
    )

}
