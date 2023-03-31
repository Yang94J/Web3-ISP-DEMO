import * as React from 'react';

import { Typography, Container, Card, CardContent} from '@mui/material';
import DonationCards from '@/components/DonationCard';
import { Margin } from '@mui/icons-material';

export default function donations(props){

    const [openS, setOpenS] = React.useState(false);
    const [openE, setOpenE] = React.useState(false);

    const handleCloseS = () => {
        setOpenS(false);
    }

    const handleCloseE = () => {
        setOpenE(false);
    }

    const [donationDetails, setDonationDetails] = React.useState([]);
    const [nftAddrs, setNftAddrs] = React.useState([]);

    React.useEffect(() => {
        async function render() {
            console.log("donation list rerendering")
            const totalIndList = Array.from({length: props.totalDonations}, (_, i) => i );
            const tmpDetails = await Promise.all(totalIndList.map(async (item) => await props.cbs.getDonation(item)));
            setDonationDetails(tmpDetails);
            setNftAddrs(await Promise.all(tmpDetails.map(async (item) => await props.cbs.getNFTAddress(item.projAddr))));
        }
        render();
    }, [props.totalProj,openS]);


    return (
        <div >
            <Typography variant="h5"> Investments : {props.totalDonations}</Typography>
            <hr style={{ borderTop: '4px solid red' }} />
            <Container sx={{  display: "flex",  flexWrap: "wrap", paddingTop : 1}}>
                {
                    donationDetails.map((item,index) => (
                        <Card sx={{ maxWidth: 392 ,marginTop : 5, marginLeft : 5}}>
                            <CardContent>
                                <DonationCards donation={item} nft={nftAddrs[index]}/>
                            </CardContent>
                        </Card>
                    ))
                }
            </Container>
        </div>
    )
}
