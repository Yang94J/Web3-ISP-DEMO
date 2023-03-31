import * as React from 'react';
import { useEffect } from 'react';
import { Card, CardContent, Typography } from "@mui/material";

export default function UserInfo(props){

    const [userInfo, setUserInfo] = React.useState({});

    useEffect(() => {
        async function fetchUserInfo() {
          setUserInfo(await props.cb());
        }
        fetchUserInfo();
      }, [props.cb]);
    
    console.log(userInfo);

    return (
        <Card   >
        <CardContent>
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            User Address : <b>{userInfo.investorAddress}</b>
          </Typography>
          <Typography sx={{ fontSize: 18  }} color="text.secondary" gutterBottom>
            User Id : <b>{userInfo.userInd}</b>
          </Typography>
          <Typography sx={{ fontSize: 18  }} color="text.secondary" gutterBottom>
            User Description : <b>{userInfo.description}</b>
          </Typography>
          <Typography sx={{ fontSize: 18  }} color="text.secondary" gutterBottom>
            Register Time : <b>{userInfo.registerTimestamp}</b>
          </Typography>
        </CardContent>
      </Card>
    )
}
