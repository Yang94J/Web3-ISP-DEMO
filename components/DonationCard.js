import { Container,Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function donationCards(props){

    const donation = props.donation;
    const nftAddr = props.nft;

    return (
            <Card sx={{ marginTop: 1 }}>
                <CardMedia
                    sx={{ height : 180}}
                    image="donation.jpg"
                    title={donation.donationId}
                />
                <CardContent>
                    <Typography> Donation Id  : {donation.donationId}</Typography>
                    <Typography variant="body2"> Donation Project : {donation.projAddr}</Typography>
                    <Typography> Donation Amount : {donation.donationAmount}</Typography>
                    <Typography variant="body2"> NFT Addr : {nftAddr}</Typography>
                    <Typography> NFT TokenId : {donation.tokenId}</Typography>
                    <Typography >Donation Reflection : {donation.reflection}</Typography>
                    <Typography >Donation Reward Rate : {Math.round((donation.reflection *100 / donation.donationAmount))}%</Typography>
                </CardContent>
            </Card>
    )

}