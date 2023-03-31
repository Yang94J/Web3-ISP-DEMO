import { Container,Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function projCards(props){

    const proj = props.proj;

    return (
            <Card sx={{ marginTop: 1 }}>
                <CardMedia
                    sx={{ height : 180}}
                    image="proj.png"
                    title={proj.info.projName}
                />
                <CardContent>
                    <Typography> project name : {proj.info.projName}</Typography>
                    {/* <Typography> project address : {proj.info.projAddr}</Typography> */}
                    <Typography> project Desc : {proj.info.projDescription}</Typography>
                    <Typography> payment support : {proj.funding.requireEth?"ETH":"Token"}</Typography>
                    {/* <Typography display={proj.funding.requireETH?"none":"initial"}> Token Address : {proj.funding.erc20Address}</Typography> */}
                    <Typography >require amount : {proj.funding.requireAmount}</Typography>
                </CardContent>
            </Card>
    )

}