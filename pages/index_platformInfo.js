import { Typography } from "@mui/material";

export default function renderPlatformInfo(props){

    const state = props.state;


    return (
        <div>

          {
            state!=undefined
            &&
            !state.login
            &&
            <Typography variant="h5">Interest Sharing Platform provider entrance of financial Invest for web3 users</Typography>
          }

          {
            state!=undefined
            &&
            state.login
            &&
            (
              <div>
                <Typography variant="h6">Welcome, {state.account}!</Typography>
                <Typography variant="h6">Platform Owner, {state.platformInfo.owner}</Typography>
                <Typography variant="h6">Platform User Num, {state.platformInfo.userNum}</Typography>
                <Typography variant="h6">Platform Dev Num, {state.platformInfo.devNum}</Typography>
                <Typography variant="h6">Platform Proj Num, {state.platformInfo.projNum}</Typography>
              </div>
            )
                  
          }

        </div>
    )
}